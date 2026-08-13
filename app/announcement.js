import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../constants/colors';

export default function AnnouncementScreen() {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;
  const { title, body, date } = useLocalSearchParams();
  const styles = makeStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Announcement</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <Feather name="megaphone" size={28} color="#F59E0B" />
          </View>
        </View>
        <Text style={styles.title}>{title}</Text>
        {!!date && <Text style={styles.date}>{date}</Text>}
        {!!body && <Text style={styles.body}>{body}</Text>}
      </ScrollView>
    </View>
  );
}

function makeStyles(colors, isDark) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 60,
      paddingBottom: 16,
      paddingHorizontal: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      backgroundColor: colors.white,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: { fontSize: 17, fontWeight: '600', color: colors.black },
    content: { padding: 24, paddingBottom: 60 },
    iconRow: { alignItems: 'center', marginBottom: 20 },
    iconCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.black,
      textAlign: 'center',
      letterSpacing: -0.5,
      marginBottom: 8,
    },
    date: {
      fontSize: 13,
      color: colors.grey,
      textAlign: 'center',
      marginBottom: 24,
    },
    body: {
      fontSize: 16,
      color: colors.black,
      lineHeight: 26,
    },
  });
}
