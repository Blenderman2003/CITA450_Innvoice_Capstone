import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../ThemeContext'; 
import lightbulbIcon from '../../assets/images/themeicon.png'; // Ensure this path is correct

const ThemeToggle = () => {
    // Access the theme context
    const { theme, setTheme, appliedTheme } = useContext(ThemeContext); 
    const [hoverMessage, setHoverMessage] = useState(''); // Tooltip hover message state

    // Cycle through themes: system -> light -> dark -> system
    const cycleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light'; // Cycle only between light and dark
        setTheme(nextTheme); // Update theme preference
        localStorage.setItem('theme', nextTheme); // Save preference to localStorage
        setHoverMessage(getThemeDisplay(nextTheme)); // Update tooltip message
    };
    
    // Helper function to get the theme display message
    const getThemeDisplay = (currentTheme) => {
        switch (currentTheme) {
            case 'light':
                return 'Light Mode Active';
            case 'dark':
                return 'Dark Mode Active';
            default:
                return 'Unknown Theme';
        }
    };
    

    // Set initial hover message based on the current theme
    React.useEffect(() => {
        setHoverMessage(getThemeDisplay(theme));
    }, [theme]);

    return (
        <div
            onClick={cycleTheme} // Handle theme cycling on click
            onMouseEnter={() => setHoverMessage(getThemeDisplay(theme))} // Display hover message
            onMouseLeave={() => setHoverMessage('')} // Clear hover message
            className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg cursor-pointer"
            style={{ width: '40px', height: '40px' }}
        >
            {/* Tooltip */}
            {hoverMessage && (
                <div
                    className="fixed bottom-6 right-1 transform -translate-x-1/2 bg-gray-700 text-white text-sm px-2 py-1 rounded shadow-md"
                    style={{ whiteSpace: 'nowrap' }}
                >
                    {hoverMessage}
                </div>
            )}
            {/* Icon */}
            <img
                src={lightbulbIcon}
                alt="Toggle Theme"
                className="w-full h-full"
                style={{
                    filter: appliedTheme === 'dark' ? 'invert(1)' : 'invert(0)',
                }} // Reflect applied theme in icon
            />
        </div>
    );
};

export default ThemeToggle;

/* 
   Key Notes for Classmates:
   1. **Dynamic Tooltip**:
      - Shows "System Default Active," "Dark Mode Active," or "Light Mode Active" based on the current theme.
   2. **Theme Cycling**:
      - Rotates between 'system', 'light', and 'dark' modes.
   3. **Icon Styling**:
      - Reflects the actual applied theme (`appliedTheme`) by inverting colors for better visibility.
   4. **Hover Behavior**:
      - Displays tooltip on hover, providing immediate feedback on the current theme setting.
   5. **State Management**:
      - Integrates seamlessly with `ThemeContext` for shared state across the app.
*/