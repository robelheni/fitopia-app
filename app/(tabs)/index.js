import { useFocusEffect } from 'expo-router';

import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import {Feather} from '@expo/vector-icons';
import BackgroundCircles from '../../components/BackgroundCircles';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    } from 'react-native-reanimated';
    import { colors } from '../../constants/colors';
    import { FadeUpItem } from '../../components/ScreenWrapper';
    import { useTabBar } from '../../context/TabBarContext';
    import { useCallback, useState, useRef } from 'react';
    import { router} from 'expo-router';
    import { weeklyPlan } from '../meals/weekly';


    export default function HomeScreen() {
        const [contentKey, setContentKey] = useState(0);
        const opacity = useSharedValue(0);
        const translateY = useSharedValue(8);
        const { setCollapsed } = useTabBar();
        const lastScrollY = useRef(0);

        // Hardcoded nutrition data — calculated by AI from onboarding answers later
        const nutritionTargets = {
            calories: 2100,
            protein: 158,
            carbs: 210,
            fats: 70,
            goal: 'Build muscle',
            explanation: 'Based on your weight, height and goal, you need 2,100 calories daily with high protein to build muscle effectively.',
        };
        
        const todaysMeals = weeklyPlan[0].meals;

        

        

        useFocusEffect(
            useCallback(() => {
              setContentKey(prev => prev + 1);
              opacity.value = 0;
              translateY.value = 8;
              requestAnimationFrame(() => {
                opacity.value = withTiming(1, { duration: 300 });
                translateY.value = withTiming(0, { duration: 300 });
              });
            }, [])
          );

      const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
      }));
    function getGreeting(){
        const hour = new Date().getHours()
        if(hour<12) return 'Good morning';
        if(hour<17) return 'Good afternoon';
        return 'Good evening';
        

        
    }

        const headerOpacity = useSharedValue(1);
        const headerTranslateY = useSharedValue(0);

        const headerAnimStyle = useAnimatedStyle(() => ({
        opacity: headerOpacity.value,
        transform: [{ translateY: headerTranslateY.value }],
        }));

    

function handleScrollBegin(event) {
    const currentY = event.nativeEvent.contentOffset.y;
    if (currentY > lastScrollY.current) {
      setCollapsed(true);
      headerOpacity.value = withTiming(0, { duration: 200 });
      headerTranslateY.value = withTiming(-20, { duration: 200 });
    } else {
      setCollapsed(false);
      headerOpacity.value = withTiming(1, { duration: 200 });
      headerTranslateY.value = withTiming(0, { duration: 200 });
    }
    lastScrollY.current = currentY;
  }

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <BackgroundCircles variant="default" />

            {/* Fixed header */}
        <Animated.View style={[styles.fixedHeader, headerAnimStyle]}>
        <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.name}>Welcome back</Text>
        </View>
        
        </Animated.View>
        <ScrollView
            onScrollBeginDrag={handleScrollBegin}
            onMomentumScrollBegin={handleScrollBegin}
            scrollEventThrottle={16}
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View key = {contentKey}>
           
            
            <FadeUpItem delay={200}>
                {/* Streak card */}
                <View style={styles.streakCard}>
                <View style={styles.streakLeft}>
                    <Text style={styles.streakNumber}>0</Text>
                    <Text style={styles.streakLabel}>day streak</Text>
                </View>
                <View style={styles.streakDivider} />
                <View style={styles.streakRight}>
                    <Text style={styles.streakWeekLabel}>This week</Text>
                    <View style={styles.streakDots}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                        <View key={index} style={styles.streakDayContainer}>
                        <View style={[
                            styles.streakDot,
                            index < 2 && styles.streakDotActive
                        ]} />
                        <Text style={styles.streakDayLabel}>{day}</Text>
                        </View>
                    ))}
                    </View>
                </View>
                </View>
            </FadeUpItem>
            {/* Today's workout */}
            <FadeUpItem delay={300}>
                <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's workout</Text>
                <TouchableOpacity onPress = {() => router.navigate('/(tabs)/workouts')}>
                    <Text style={styles.sectionLink}>See all</Text>
                </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.workoutCard}>
                <View style={styles.workoutCardTop}>
                    <View style={styles.workoutIconContainer}>
                    <Feather name="zap" size={20} color={colors.white} />
                    </View>
                    <View style={styles.workoutBadge}>
                    <Text style={styles.workoutBadgeText}>Crafted for you</Text>
                    </View>
                </View>

                <Text style={styles.workoutName}>Upper Body Strength</Text>
                <Text style={styles.workoutSub}>6 exercises · 45 min · Intermediate</Text>

                <View style={styles.workoutFooter}>
                    <View style={styles.workoutStat}>
                    <Feather name="clock" size={12} color={colors.grey} />
                    <Text style={styles.workoutStatText}>45 min</Text>
                    </View>
                    <View style={styles.workoutStat}>
                    <Feather name="activity" size={12} color={colors.grey} />
                    <Text style={styles.workoutStatText}>6 exercises</Text>
                    </View>
                    <TouchableOpacity
                    style={styles.startButton}
                    onPress = {() => router.push('/workout/upper-body')}
                    >
                        <Text style={styles.startButtonText}>Start</Text>
                        <Feather name="arrow-right" size={14} color={colors.white} />

                    </TouchableOpacity>
                </View>
                </TouchableOpacity>
            </FadeUpItem>

            {/* Nutrition targets */}
            <FadeUpItem delay={400}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your nutrition</Text>
                <TouchableOpacity onPress ={()=> router.push('/nutrition/details')}>
                <Text style={styles.sectionLink}>Details</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.nutritionCard}>
                {/* Explanation */}
                <View style={styles.nutritionExplanation}>
                <Feather name="info" size={14} color={colors.blue} />
                <Text style={styles.nutritionExplanationText}>
                    {nutritionTargets.explanation}
                </Text>
                </View>

                {/* Targets grid */}
                <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{nutritionTargets.calories}</Text>
                    <Text style={styles.nutritionLabel}>Calories</Text>
                    <View style={[styles.nutritionBar, { backgroundColor: '#FEF3C7' }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: '#D97706', width: '60%' }]} />
                    </View>
                </View>
                <View style={styles.nutritionDivider} />
                <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{nutritionTargets.protein}g</Text>
                    <Text style={styles.nutritionLabel}>Protein</Text>
                    <View style={[styles.nutritionBar, { backgroundColor: colors.blueLight }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: colors.blue, width: '40%' }]} />
                    </View>
                </View>
                <View style={styles.nutritionDivider} />
                <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{nutritionTargets.carbs}g</Text>
                    <Text style={styles.nutritionLabel}>Carbs</Text>
                    <View style={[styles.nutritionBar, { backgroundColor: '#D1FAE5' }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: '#059669', width: '70%' }]} />
                    </View>
                </View>
                <View style={styles.nutritionDivider} />
                <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{nutritionTargets.fats}g</Text>
                    <Text style={styles.nutritionLabel}>Fats</Text>
                    <View style={[styles.nutritionBar, { backgroundColor: '#FEE2E2' }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: '#DC2626', width: '30%' }]} />
                    </View>
                </View>
                </View>
            </View>
            </FadeUpItem>

            {/* Today's meals */}
            <FadeUpItem delay={450}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's meals</Text>
                <TouchableOpacity onPress={() => router.push('/meals/weekly')}>
  <Text style={styles.sectionLink}>See all</Text>
</TouchableOpacity>
            </View>

            <View style={styles.mealsList}>
            {todaysMeals.map(meal => (
                <TouchableOpacity
                    key={meal.id}
                    style={styles.mealCard}
                    onPress={() => router.push(`/meals/${meal.id}`)}
                >

                    {/* Meal type and time */}
                    <View style={styles.mealHeader}>
                    <View style={styles.mealTypeContainer}>
                        <Text style={styles.mealType}>{meal.type}</Text>
                        {meal.isEthiopian && (
                        <View style={styles.ethiopianBadge}>
                            <Text style={styles.ethiopianBadgeText}>🇪🇹</Text>
                        </View>
                        )}
                    </View>
                    <Text style={styles.mealTime}>{meal.time}</Text>
                    </View>

                    {/* Meal name and description */}
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealDescription}>{meal.description}</Text>

                    {/* Meal stats */}
                    <View style={styles.mealStats}>
                    <View style={styles.mealStat}>
                        <Feather name="zap" size={12} color={colors.grey} />
                        <Text style={styles.mealStatText}>{meal.calories} kcal</Text>
                    </View>
                    <View style={styles.mealStat}>
                        <Feather name="activity" size={12} color={colors.grey} />
                        <Text style={styles.mealStatText}>{meal.protein}g protein</Text>
                    </View>
                    </View>

                </TouchableOpacity>
                ))}
            </View>
            </FadeUpItem>
            {/* Weekly progress */}
            <FadeUpItem delay={400}>
                <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>This week</Text>
                </View>

                <View style={styles.weeklyCard}>
                <View style={styles.weeklyItem}>
                    <Text style={styles.weeklyNumber}>0</Text>
                    <Text style={styles.weeklyLabel}>Workouts</Text>
                </View>
                <View style={styles.weeklyDivider} />
                <View style={styles.weeklyItem}>
                    <Text style={styles.weeklyNumber}>3</Text>
                    <Text style={styles.weeklyLabel}>Goal</Text>
                </View>
                <View style={styles.weeklyDivider} />
                <View style={styles.weeklyItem}>
                    <Text style={styles.weeklyNumber}>0</Text>
                    <Text style={styles.weeklyLabel}>Minutes</Text>
                </View>
                </View>
            </FadeUpItem>

            {/* Community preview */}
            <FadeUpItem delay={500}>
                <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Community</Text>
                <TouchableOpacity onPress = {() => router.navigate('/(tabs)/community')}>
                    <Text style={styles.sectionLink}>See all</Text>
                </TouchableOpacity>
                </View>

                <View style={styles.communityCard}>
                <View style={styles.communityPost}>
                    <View style={styles.communityAvatar}>
                    <Text style={styles.communityAvatarText}>AT</Text>
                    </View>
                    <View style={styles.communityPostContent}>
                    <Text style={styles.communityPostName}>Abebu T.</Text>
                    <Text style={styles.communityPostText}>Completed week 3 of my plan. Feeling stronger every day.</Text>
                    </View>
                    <Feather name="heart" size={16} color={colors.greyLight} />
                </View>

                <View style={styles.communityDivider} />

                <View style={styles.communityPost}>
                    <View style={[styles.communityAvatar, { backgroundColor: colors.gold }]}>
                    <Text style={styles.communityAvatarText}>MH</Text>
                    </View>
                    <View style={styles.communityPostContent}>
                    <Text style={styles.communityPostName}>Meron H.</Text>
                    <Text style={styles.communityPostText}>First fasting day workout done. The adapted plan really works.</Text>
                    </View>
                    <Feather name="heart" size={16} color={colors.greyLight} />
                </View>
                </View>
            </FadeUpItem>
            </View>
        </ScrollView>
        </Animated.View>

    );
}



    const styles = StyleSheet.create({
        container: {
        flex: 1,
        backgroundColor: colors.white,
        },
        scroll: {
        flex: 1,
        },
        content: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 120,
        },
        // Add new styles here below
        header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        },
        greeting: {
        fontSize: 14,
        color: colors.grey,
        fontWeight: '300',
        marginBottom: 4,
        },
        name: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.black,
        letterSpacing: -0.5,
        },
        settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.greyCard,
        alignItems: 'center',
        justifyContent: 'center',
        },
        streakCard: {
            backgroundColor: colors.blue,
            borderRadius: 20,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            // Blue glow shadow
            shadowColor: colors.blue,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
        },
        
        streakLeft: {
            alignItems: 'center',
            paddingRight: 20,
        },
        
        streakNumber: {
            fontSize: 48,
            fontWeight: '700',
            color: colors.white,
            letterSpacing: -2,
            lineHeight: 52,
        },
        
        streakLabel: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.7)',
            fontWeight: '400',
        },
        
        streakDivider: {
            width: 0.5,
            height: 60,
            backgroundColor: 'rgba(255,255,255,0.3)',
            marginRight: 20,
        },
        
        streakRight: {
            flex: 1,
        },
        
        streakWeekLabel: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 10,
            fontWeight: '400',
        },
        
        streakDots: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        
        streakDayContainer: {
            alignItems: 'center',
            gap: 4,
        },
        
        streakDot: {
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: 'rgba(255,255,255,0.2)',
        },
        
        streakDotActive: {
            backgroundColor: colors.white,
        },
        
        streakDayLabel: {
            fontSize: 10,
            color: 'rgba(255,255,255,0.6)',
            fontWeight: '500',
        },

        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        
        sectionTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.black,
            letterSpacing: -0.5,
        },
        
        sectionLink: {
            fontSize: 14,
            color: colors.blue,
            fontWeight: '500',
        },
        
        workoutCard: {
            backgroundColor: colors.white,
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.greyBorder,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
        },
        
        workoutCardTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        
        workoutIconContainer: {
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: colors.blue,
            alignItems: 'center',
            justifyContent: 'center',
        },
        
        workoutBadge: {
            backgroundColor: colors.blueLight,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 100,
        },
        
        workoutBadgeText: {
            fontSize: 11,
            color: colors.blue,
            fontWeight: '500',
        },
        
        workoutName: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.black,
            letterSpacing: -0.5,
            marginBottom: 4,
        },
        
        workoutSub: {
            fontSize: 13,
            color: colors.grey,
            fontWeight: '300',
            marginBottom: 16,
        },
        
        workoutFooter: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        
        workoutStat: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        
        workoutStatText: {
            fontSize: 12,
            color: colors.grey,
        },
        
        startButton: {
            marginLeft: 'auto',
            backgroundColor: colors.blue,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 100,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            shadowColor: colors.blue,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
        
        startButtonText: {
            fontSize: 13,
            color: colors.white,
            fontWeight: '600',
        },
        weeklyCard: {
            backgroundColor: colors.white,
            borderRadius: 20,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
            borderWidth: 1,
            borderColor: colors.greyBorder,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
        },
        
        weeklyItem: {
            flex: 1,
            alignItems: 'center',
        },
        
        weeklyNumber: {
            fontSize: 32,
            fontWeight: '700',
            color: colors.black,
            letterSpacing: -1,
            marginBottom: 4,
        },
        
        weeklyLabel: {
            fontSize: 12,
            color: colors.grey,
            fontWeight: '300',
        },
        
        weeklyDivider: {
            width: 0.5,
            height: 40,
            backgroundColor: colors.greyBorder,
        },
        
        communityCard: {
            backgroundColor: colors.white,
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.greyBorder,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
        },
        
        communityPost: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        
        communityAvatar: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.blue,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        },
        
        communityAvatarText: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.white,
        },
        
        communityPostContent: {
            flex: 1,
        },
        
        communityPostName: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.black,
            marginBottom: 2,
        },
        
        communityPostText: {
            fontSize: 12,
            color: colors.grey,
            fontWeight: '300',
            lineHeight: 18,
        },
        
        communityDivider: {
            height: 0.5,
            backgroundColor: colors.greyBorder,
            marginVertical: 14,
        },

        fixedHeader: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingTop: 52,
            paddingBottom: 16,
            zIndex: 10,
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderBottomWidth: 0.5,
            borderBottomColor: colors.greyBorder,
          },
          content: {
            paddingHorizontal: 24,
            paddingTop: 120,
            paddingBottom: 120,
          },

          // Nutrition
    nutritionCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.greyBorder,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        gap: 16,
    },
    
    nutritionExplanation: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'flex-start',
        backgroundColor: colors.blueLight,
        padding: 12,
        borderRadius: 12,
    },
    
    nutritionExplanationText: {
        fontSize: 13,
        color: colors.blue,
        lineHeight: 18,
        flex: 1,
        fontWeight: '300',
    },
    
    nutritionGrid: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    nutritionItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    
    nutritionValue: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.black,
        letterSpacing: -0.5,
    },
    
    nutritionLabel: {
        fontSize: 11,
        color: colors.grey,
        fontWeight: '300',
        marginBottom: 4,
    },
    
    nutritionBar: {
        width: '80%',
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    
    nutritionBarFill: {
        height: 4,
        borderRadius: 2,
    },
    
    nutritionDivider: {
        width: 0.5,
        height: 50,
        backgroundColor: colors.greyBorder,
    },
    
    // Meals
    mealsList: {
        gap: 12,
        marginBottom: 20,
    },
    
    mealCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.greyBorder,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        gap: 6,
    },
    
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    
    mealTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    
    mealType: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.blue,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    
    ethiopianBadge: {
        backgroundColor: colors.greyCard,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 100,
    },
    
    ethiopianBadgeText: {
        fontSize: 10,
    },
    
    mealTime: {
        fontSize: 11,
        color: colors.greyLight,
        fontWeight: '300',
    },
    
    mealName: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.black,
        letterSpacing: -0.3,
    },
    
    mealDescription: {
        fontSize: 13,
        color: colors.grey,
        lineHeight: 18,
        fontWeight: '300',
    },
    
    mealStats: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 4,
    },
    
    mealStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    
    mealStatText: {
        fontSize: 12,
        color: colors.grey,
    },
});