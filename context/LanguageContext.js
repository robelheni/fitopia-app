import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_STORAGE_KEY = 'language';

const LanguageContext = createContext({
  language: 'English',
  setLanguage: async () => {},
  isLoadingLanguage: true,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('English');
  const [isLoadingLanguage, setIsLoadingLanguage] = useState(true);

  useEffect(() => {
    async function loadLanguage() {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage) setLanguageState(savedLanguage);
      } finally {
        setIsLoadingLanguage(false);
      }
    }

    loadLanguage();
  }, []);

  async function setLanguage(nextLanguage) {
    setLanguageState(nextLanguage);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isLoadingLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
