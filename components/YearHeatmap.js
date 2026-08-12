import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { lightColors } from '../constants/colors';
import { getYearStats } from '../services/api';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Builds the full year grid — array of weeks, each week is 7 day objects
function buildYearGrid(year) {
  const weeks = [];
  const jan1 = new Date(year, 0, 1);
  const jan1Weekday = (jan1.getDay() + 6) % 7;
  const gridStart = new Date(jan1);
  gridStart.setDate(jan1.getDate() - jan1Weekday);

  const dec31 = new Date(year, 11, 31);
  let currentDate = new Date(gridStart);

  while (currentDate <= dec31) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const inYear = currentDate.getFullYear() === year;
      week.push({ date: new Date(currentDate), inYear });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Maps a JS Date to our day-key format ('mon', 'tue', etc.)
// getDay() returns 0 for Sunday — we need to convert to our mon-first format
const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
function getDayKey(date) {
  return WEEKDAY_KEYS[date.getDay()];
}

export default function YearHeatmap({ accountCreatedAt, colors: colorsProp }) {
  const colors = colorsProp || lightColors;
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [completedMap, setCompletedMap] = useState({}); // dateString -> workout name
  const [trainingDays, setTrainingDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null); // currently tapped square

  useEffect(() => {
    async function fetchYearData() {
      try {
        setLoading(true);
        const data = await getYearStats(year);

        // Build a lookup map: "2026-06-19" -> "Upper Body"
        // This gives us O(1) lookup when rendering each square,
        // instead of searching an array every time
        const map = {};
        data.completed.forEach(item => {
          map[item.date] = item.workout_name;
        });
        setCompletedMap(map);
        setTrainingDays(data.training_days);
      } catch (err) {
        console.log('Year stats error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchYearData();
    setSelectedDay(null); // clear selection when year changes
  }, [year]);

  const weeks = buildYearGrid(year);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Determines the state of a single day: 'completed', 'missed', 'rest', or 'future'
  function getDayState(day) {
    if (!day.inYear) return 'hidden';

    const dateStr = toDateString(day.date);
    const isFuture = day.date > today;
    const isCompleted = !!completedMap[dateStr];
    const isTrainingDay = trainingDays.includes(getDayKey(day.date));

    if (accountCreatedAt) {
        const createdDate = new Date(accountCreatedAt);
        createdDate.setHours(0, 0, 0, 0);
        if (day.date < createdDate) return 'before_account';
      }

    if (isCompleted) return 'completed';
    if (isFuture) return 'future';
    if (isTrainingDay) return 'missed'; // past, scheduled, not done
    return 'rest';
  }

  function getSquareColor(state) {
    switch (state) {
      case 'completed': return '#22C55E';
      case 'missed': return '#EF4444';
      case 'future': return colors.greyCard;
      case 'rest': return colors.greyBorder;
      case 'before_account': return colors.greyCard; // same as future — neutral grey
      default: return 'transparent';
    }
  }

  function handleDayPress(day) {
    if (!day.inYear) return;
    const dateStr = toDateString(day.date);
    const state = getDayState(day);
    setSelectedDay({
      date: day.date,
      dateStr,
      state,
      workoutName: completedMap[dateStr] || null,
    });
  }

  // Formats the detail text shown when a square is tapped
  function getDetailText() {
    if (!selectedDay) return null;
    const formattedDate = selectedDay.date.toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
  
    if (selectedDay.state === 'completed') {
      return `${formattedDate} — ${selectedDay.workoutName}`;
    }
    if (selectedDay.state === 'missed') {
      return `${formattedDate} — Missed workout`;
    }
    if (selectedDay.state === 'future') {
      return `${formattedDate} — Upcoming`;
    }
    if (selectedDay.state === 'before_account') {
      return `${formattedDate} — Before you joined`;
    }
    return `${formattedDate} — Rest day`;
  }

  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>

      {/* Year selector */}
      <View style={styles.yearSelector}>
        <TouchableOpacity onPress={() => setYear(year - 1)}>
          <Feather name="chevron-left" size={18} color={colors.grey} />
        </TouchableOpacity>
        <Text style={styles.yearText}>{year}</Text>
        <TouchableOpacity
          onPress={() => year < currentYear && setYear(year + 1)}
          disabled={year >= currentYear}
        >
          <Feather
            name="chevron-right"
            size={18}
            color={year >= currentYear ? colors.greyLight : colors.grey}
          />
        </TouchableOpacity>
      </View>

      {/* Grid row — fixed day labels on the left, scrollable squares on the right */}
      <View style={styles.gridRow}>

        {/* Fixed day labels — never scrolls */}
        <View style={styles.dayLabelsColumn}>
          {DAY_LABELS.map(label => (
            <Text key={label} style={styles.dayLabelText}>{label}</Text>
          ))}
        </View>

        {/* Scrollable weeks with month labels above them */}
            <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weeksScrollContent}
            >
            <View>
                {/* Month labels row — sits above the squares, scrolls together with them */}
                <View style={styles.monthLabelsRow}>
                {weeks.map((week, weekIndex) => {
                    const firstDayOfWeek = week[0].date;
                    const prevWeekFirstDay = weeks[weekIndex - 1]?.[0]?.date;
                    const isFirstWeekOfMonth =
                    firstDayOfWeek.getDate() <= 7 &&
                    (!prevWeekFirstDay || firstDayOfWeek.getMonth() !== prevWeekFirstDay.getMonth());
                    const monthName = firstDayOfWeek.toLocaleDateString('en-GB', { month: 'short' });

                    return (
                    <View key={weekIndex} style={styles.monthLabelColumn}>
                        {isFirstWeekOfMonth && (
                        <Text style={styles.monthLabelText} numberOfLines={1}>{monthName}</Text>
                        )}
                    </View>
                    );
                })}
                </View>

                {/* The actual day squares grid */}
                <View style={styles.weeksRow}>
                {weeks.map((week, weekIndex) => (
                    <View key={weekIndex} style={styles.weekColumn}>
                    {week.map((day, dayIndex) => {
                        const state = getDayState(day);
                        const isSelected = selectedDay && day.inYear && toDateString(day.date) === selectedDay.dateStr;
                        const isToday = day.inYear && toDateString(day.date) === toDateString(today);

                        return (
                        <TouchableOpacity
                            key={dayIndex}
                            onPress={() => handleDayPress(day)}
                            disabled={!day.inYear}
                        >
                            <View
                            style={[
                                styles.daySquare,
                                { backgroundColor: getSquareColor(state) },
                                isToday && styles.daySquareToday,
                                isSelected && styles.daySquareSelected,
                            ]}
                            />
                        </TouchableOpacity>
                        );
                    })}
                    </View>
                ))}
                </View>
            </View>
            </ScrollView>
      </View>

      {/* Tapped day detail */}
      {selectedDay && (
        <View style={styles.detailCard}>
          <Text style={styles.detailText}>{getDetailText()}</Text>
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        <View style={[styles.legendSquare, { backgroundColor: colors.greyBorder }]} />
        <Text style={styles.legendText}>Rest</Text>
        <View style={[styles.legendSquare, { backgroundColor: '#EF4444' }]} />
        <Text style={styles.legendText}>Missed</Text>
        <View style={[styles.legendSquare, { backgroundColor: '#22C55E' }]} />
        <Text style={styles.legendText}>Done</Text>
      </View>

    </View>
  );
}

function makeStyles(c) { const colors = c || lightColors; return StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    marginBottom: 24,
  },

  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },

  yearText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.black,
  },

  gridRow: {
    flexDirection: 'row',
  },

  dayLabelsColumn: {
    gap: 3,
    marginRight: 6,
    justifyContent: 'flex-start',
  },

  dayLabelText: {
    fontSize: 9,
    color: colors.greyLight,
    fontWeight: '500',
    height: 11,
    lineHeight: 11,
  },

  weeksScrollContent: {
    gap: 3,
  },

  weekColumn: {
    gap: 3,
  },

  daySquare: {
    width: 11,
    height: 11,
    borderRadius: 2,
  },

  daySquareSelected: {
    borderWidth: 1.5,
    borderColor: colors.black,
  },

  detailCard: {
    marginTop: 12,
    backgroundColor: colors.greyCard,
    borderRadius: 10,
    padding: 10,
  },

  detailText: {
    fontSize: 13,
    color: colors.black,
    fontWeight: '500',
  },

  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    justifyContent: 'flex-end',
  },

  legendSquare: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },

  legendText: {
    fontSize: 11,
    color: colors.greyLight,
    fontWeight: '300',
    marginRight: 8,
  },
  daySquareToday: {
    borderWidth: 1.5,
    borderColor: colors.blue,
  },
  monthLabelsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  
  monthLabelColumn: {
    width: 14,
  },
  
  monthLabelText: {
    fontSize: 10,
    color: colors.greyLight,
    fontWeight: '500',
    width: 32,
  },
  
  weeksRow: {
    flexDirection: 'row',
    gap: 3,
  },
}); }