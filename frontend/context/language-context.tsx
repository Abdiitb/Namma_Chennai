import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'app_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [initialized, setInitialized] = useState(false);

  const loadLanguage = useCallback(async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (storedLanguage === 'en' || storedLanguage === 'ta') {
        setLanguageState(storedLanguage as Language);
      } else {
        // Default to English if no language is stored
        setLanguageState('en');
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
      }
    } catch (e) {
      // If there's an error, default to English
      setLanguageState('en');
    } finally {
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    loadLanguage();
  }, [loadLanguage]);

  const setLanguage = useCallback(async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
    } catch (e) {
      console.error('Failed to save language preference:', e);
    }
  }, []);

  const toggleLanguage = useCallback(async () => {
    const newLanguage = language === 'en' ? 'ta' : 'en';
    await setLanguage(newLanguage);
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
