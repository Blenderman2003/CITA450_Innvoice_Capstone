// Import necessary modules for React
import React, { createContext, useState, useEffect } from 'react';

// Create a ThemeContext to manage theme settings across the app
export const ThemeContext = createContext();

// ThemeProvider component to handle theme logic
const ThemeProvider = ({ children }) => {
  // State to manage the current theme
  const [theme, setTheme] = useState(() => {
    // Check if a theme preference is saved in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    // If no saved preference, default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Effect to apply the theme dynamically and respond to "System Default" setting
  useEffect(() => {
    // When theme is set to "system," dynamically check system preferences
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const applySystemTheme = () => {
        // Apply either 'dark' or 'light' based on system settings
        document.body.className = mediaQuery.matches ? 'dark' : 'light';
      };

      // Initial application of the theme
      applySystemTheme();

      // Listen for system theme changes
      mediaQuery.addListener(applySystemTheme);

      // Cleanup listener on component unmount
      return () => mediaQuery.removeListener(applySystemTheme);
    } else {
      // If not "system," directly apply the selected theme
      document.body.className = theme;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {/* Dynamically set theme class on a wrapper div */}
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

/* 
   Key Notes for Understanding:
   1. `createContext` is used to create a shared state for the theme, making it accessible across the app.
   2. `useState` manages the current theme and allows toggling between "dark," "light," and "system."
   3. `useEffect` ensures the theme is applied to the `<body>` dynamically and listens for changes in system settings if "system" is selected.
   4. `localStorage` saves the user's theme choice so it persists across sessions.
   5. The `ThemeContext.Provider` makes the theme state and updater function (`setTheme`) available to child components.
   6. The `className` on `<div>` ensures consistent theming for nested elements.
*/