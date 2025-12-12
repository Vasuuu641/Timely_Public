import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextProps = {
 isDarkMode: boolean;
 toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const [isDarkMode, setDarkMode] = useState(false);

 const toggleDarkMode = () => {
 setDarkMode(prevMode => !prevMode);
 };

 // The key change: We use a useEffect hook to manage the body class
 useEffect(() => {
 if (isDarkMode) {
 // Add the 'dark' class to the body when dark mode is enabled
 document.body.classList.add('dark');
 } else {
 // Remove the 'dark' class when dark mode is disabled
 document.body.classList.remove('dark');
 }
 }, [isDarkMode]); // This effect runs whenever isDarkMode changes

 return (
 <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode  }}>
 {/* The wrapper div is no longer needed here, as the body class handles the theme */}
 {children}
 </ThemeContext.Provider>
 );
}

export const useTheme = (): ThemeContextProps => {
 const context = useContext(ThemeContext);
 if (!context) {
 throw new Error('useTheme must be used within a ThemeProvider');
 }
 return context;
};