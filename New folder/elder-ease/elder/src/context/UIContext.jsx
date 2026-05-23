import React, { createContext, useState, useEffect, useContext } from 'react';
import translations from '../utils/translations';
import { useAuth } from './AuthContext';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const { user } = useAuth();
    const [language, setLanguage] = useState('English');
    const [accessibility, setAccessibility] = useState({
        highContrast: false,
        fontSize: 'Normal',
        screenReader: false
    });

    useEffect(() => {
        if (user && user.preferences) {
            setLanguage(user.preferences.language || 'English');
            setAccessibility(user.preferences.accessibility || {
                highContrast: false,
                fontSize: 'Normal',
                screenReader: false
            });
        }
    }, [user]);

    const t = (key) => {
        return translations[language][key] || key;
    };

    const updatePreferences = async (newPrefs) => {
        // Optimistic update
        if (newPrefs.language) setLanguage(newPrefs.language);
        if (newPrefs.accessibility) setAccessibility(newPrefs.accessibility);

        // In a real app, you'd call an API here to persist
    };

    // Apply accessibility styles to document level properties
    useEffect(() => {
        const root = document.documentElement;

        // Font size
        if (accessibility.fontSize === 'Large') {
            root.style.setProperty('--elder-text-font', '32px');
            root.style.setProperty('--elder-btn-font', '28px');
        } else if (accessibility.fontSize === 'Extra Large') {
            root.style.setProperty('--elder-text-font', '38px');
            root.style.setProperty('--elder-btn-font', '32px');
        } else {
            root.style.setProperty('--elder-text-font', '28px');
            root.style.setProperty('--elder-btn-font', '24px');
        }

        // High contrast
        if (accessibility.highContrast) {
            root.style.setProperty('--primary-color', '#000000');
            root.style.setProperty('--secondary-color', '#FFFFFF');
            root.style.setProperty('--bg-color', '#FFFFFF');
            root.style.setProperty('--text-dark', '#000000');
            root.style.setProperty('--text-light', '#000000');
        } else {
            root.style.setProperty('--primary-color', '#2D5A27');
            root.style.setProperty('--secondary-color', '#F4F9F4');
            root.style.setProperty('--bg-color', '#FFFFFF');
            root.style.setProperty('--text-dark', '#2C3E50');
            root.style.setProperty('--text-light', '#7F8C8D');
        }
    }, [accessibility]);

    return (
        <UIContext.Provider value={{ language, setLanguage, accessibility, setAccessibility, t, updatePreferences }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
