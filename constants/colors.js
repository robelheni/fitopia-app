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
    };


    export const darkColors = {
        // Brand blue stays the same — it pops on both light and dark backgrounds
        blue: '#2563EB',
    
        // Darker blue stays the same
        blueDark: '#1D4ED8',
    
        // Dark blue tint — replaces the light blue highlight on dark backgrounds
        blueLight: '#1E3A5F',
    
        // Main text — slightly warm off-white, easier on the eyes than pure white
        black: '#F1F1F1',
    
        // App background — deep off-black, not pure black
        white: '#0F0F0F',
    
        // Secondary text — muted but still readable
        grey: '#AAAAAA',
    
        // Placeholder and inactive — subtle
        greyLight: '#666666',
    
        // Borders — subtle so they don't dominate
        greyBorder: '#2A2A2A',
    
        // Card backgrounds — slightly lighter than app background so cards lift
        greyCard: '#1A1A1A',
    
        // Gold stays the same — achievement color should not change
        gold: '#D4A843',
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

