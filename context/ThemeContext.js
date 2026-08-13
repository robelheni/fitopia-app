import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../constants/colors';

const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
  colors: lightColors,
});

export function ThemeProvider({ children }) {
  // Start immediately with the system preference so the loading screen
  // is never white for a moment before AsyncStorage loads
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  useEffect(() => {
    // Override with the user's saved preference if they've explicitly set one
    async function loadTheme() {
      const saved = await AsyncStorage.getItem('theme');
      if (saved === 'dark') setIsDark(true);
      else if (saved === 'light') setIsDark(false);
      // If no saved preference, keep the system default already set above
    }
    loadTheme();
  }, []);

  async function toggleTheme() {
    const newValue = !isDark;
    setIsDark(newValue);
    await AsyncStorage.setItem('theme', newValue ? 'dark' : 'light');
  }

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
