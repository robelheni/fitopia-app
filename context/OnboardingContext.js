import { createContext, useContext, useState} from 'react';

//createcontext makes a new context object
//like a bagpack

const OnboardingContext = createContext();

export function OnboardingProvider({ children}){
    const [answers, setAnswers] = useState({
        fitnessLevel: null,    // step 1
        goal: null,            // step 2
        daysPerWeek: null,     // step 3
        duration: null,        // step 4
        equipment: null,       // step 5
        foodChoices: null,     // step 6
        personalInfo: null,       // step 7
        location: null,        // step 8
        injuries: null,        // step 9

    });

    //this function updates one answers ata time
    //without wiping out other answers

    function updateAnswer(key, value) {
        setAnswers(prev => ({
            ...prev,        //keep all existing answers
            [key]: value,   //update only the one that changed
        }))
    }

    return (
        <OnboardingContext.Provider value = {{ answers, updateAnswer}}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    return useContext(OnboardingContext);
    }