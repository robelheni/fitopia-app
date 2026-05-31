import { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  const [answers, setAnswers] = useState({
    fitnessLevel: null,
    goal: null,
    daysPerWeek: null,
    trainingDays: null,
    duration: null,
    equipment: null,
    foodChoices: null,
    personalInfo: null,
    location: null,
    injuries: null,
  });

  function updateAnswer(key, value) {
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [key]: value,
      };
      AsyncStorage.setItem('onboarding_answers', JSON.stringify(newAnswers));
      return newAnswers;
    });
  }

  return (
    <OnboardingContext.Provider value={{ answers, updateAnswer }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}