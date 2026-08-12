import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../constants/colors';

const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
  colors: lightColors,
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      const saved = await AsyncStorage.getItem('theme');
      if (saved === 'dark') setIsDark(true);
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
