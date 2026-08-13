import { useColorScheme } from 'react-native';

// All Fitopia brand colours in one place
// Import this file in any screen instead of hardcoding colour values
// If we ever change a colour we only change it here and it updates everywhere

export const lightColors = {
        // Primary brand colour - used for buttons, accents, active states
        blue: '#2563EB',
    
        // Darker blue - used for button hover/pressed states
        blueDark: '#1D4ED8',
    
        // Light blue background - used for selected states and badges
        blueLight: '#EFF6FF',
    
        // Main text colour
        black: '#0a0a0a',
    
        // App background
        white: '#ffffff',
    
        // Secondary text - subtitles, descriptions
        grey: '#555555',
    
        // Placeholder text and inactive elements
        greyLight: '#999999',
    
        // Card backgrounds and borders
        greyBorder: '#e8e8e8',
    
        // Light card background
        greyCard: '#f5f5f5',
    
        // Gold - used for streaks and achievements only
        gold: '#D4A843',

        // Blue text/links — same as blue in light mode, white in dark mode
        blueText: '#2563EB',
    };


    export const darkColors = {
        // Brighter blue — the standard blue is too heavy on dark backgrounds,
        // this reads as clearly interactive without feeling washed out
        blue: '#3B82F6',

        // Original blue becomes the pressed/darker variant
        blueDark: '#2563EB',

        // Deep navy tint — used for badge and selected state backgrounds
        blueLight: '#1E3A5F',

        // Main text — warm off-white, easier on the eyes than pure white
        black: '#F1F1F1',

        // App background — slightly warm near-black
        white: '#111111',

        // Secondary text — balanced midtone, readable without competing with primary
        grey: '#9CA3AF',

        // Placeholder and inactive — was #666666 which is nearly invisible on dark,
        // this is light enough to actually show up as a hint
        greyLight: '#6B7280',

        // Borders — just enough definition to separate sections without dominating
        greyBorder: '#2E2E2E',

        // Card backgrounds — lifted above the app background (iOS dark card style)
        greyCard: '#1C1C1E',

        // Gold stays the same — achievement colour should not change
        gold: '#D4A843',

        // Blue text becomes white in dark mode for readability
        blueText: '#FFFFFF',
    };

// This replaces the old:
//   import { colors } from '../constants/colors';
export function useTheme() {
    // useColorScheme returns 'light', 'dark', or null
    // We default to light if null — most devices default to light
    const scheme = useColorScheme();
    return scheme === 'dark' ? darkColors : lightColors;
}

export const colors = lightColors;

