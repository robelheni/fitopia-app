import { useEffect } from 'react';
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

    export default function HomeScreen() {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(8);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 250 });
        translateY.value = withTiming(0, { duration: 250 });
    }, []);

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

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <BackgroundCircles variant="default" />
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <FadeUpItem delay={100}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>{getGreeting()}</Text>
                        <Text style={styles.name}>Welcome back</Text>
                    </View>
                    <TouchableOpacity style={styles.settingsButton}>
                        <Feather name="settings" size={20} color={colors.black} />
                    </TouchableOpacity>
                </View>
            </FadeUpItem>
            
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
                <TouchableOpacity>
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
                    <View style={styles.startButton}>
                    <Text style={styles.startButtonText}>Start</Text>
                    <Feather name="arrow-right" size={14} color={colors.white} />
                    </View>
                </View>
                </TouchableOpacity>
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
                <TouchableOpacity>
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
});