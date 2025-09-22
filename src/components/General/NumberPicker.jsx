// NumberPicker.jsx
// Component for selecting a number within a specified range (min to max) with increment and decrement buttons.
// Updated to align with the project's theme colors, including red accents for warnings.

import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../ThemeContext';

const NumberPicker = ({ label, min = 1, max = 10, initialValue = 1, onChange }) => {
  const { theme } = useContext(ThemeContext); // Access theme context for styling
  const [value, setValue] = useState(initialValue); // Initialize value state with initialValue prop
  const [showWarning, setShowWarning] = useState(false); // Show a warning when max limit is reached

  // Increment button handler
  const handleIncrement = () => {
    if (value < max) {
      const newValue = value + 1;
      setValue(newValue);
      setShowWarning(false); // Hide warning if under max
      if (onChange) onChange(newValue); // Notify parent component of the change
    } else {
      setShowWarning(true); // Show warning if max is reached
    }
  };

  // Decrement button handler
  const handleDecrement = () => {
    if (value > min) {
      const newValue = value - 1;
      setValue(newValue);
      setShowWarning(false); // Hide warning when decreasing
      if (onChange) onChange(newValue); // Notify parent component of the change
    }
  };

  // Inline styles adapted for theme consistency
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      flexDirection: 'column',
    },
    button: {
      backgroundColor: theme === 'dark' ? '#4A4A4A' : '#F0F0F0', // Darker gray for dark mode, light gray for light mode
      border: `1px solid ${theme === 'dark' ? '#828FA3' : '#D1D5DB'}`, // Use light gray borders
      color: theme === 'dark' ? '#FFFFFF' : '#333333', // White text in dark mode, dark text in light mode
      cursor: 'pointer',
      height: '30px',
      width: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '4px',
    },
    numberInput: {
      width: '60px',
      textAlign: 'center',
      backgroundColor: theme === 'dark' ? '#333333' : '#FFFFFF', // Darker gray in dark mode, white in light mode
      color: theme === 'dark' ? '#FFFFFF' : '#333333', // White text for dark mode, dark text for light mode
      border: `1px solid ${theme === 'dark' ? '#828FA3' : '#D1D5DB'}`, // Consistent border with buttons
      borderRadius: '4px',
    },
    warningText: {
      color: theme === 'dark' ? '#F87171' : '#DC2626', // Red for warnings in both themes, lighter shade for light mode
      fontSize: '0.85rem',
      marginTop: '4px',
    },
  };

  return (
    <div style={styles.container}>
      {label && <label className="mr-2 text-sm font-medium">{label}</label>} {/* Display label if provided */}
      
      {/* Increment/Decrement buttons and value display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <button type="button" style={styles.button} onClick={handleDecrement}>
          -
        </button>
        <input
          type="text"
          value={value}
          readOnly
          style={styles.numberInput}
        />
        <button type="button" style={styles.button} onClick={handleIncrement}>
          +
        </button>
      </div>

      {/* Warning message when the max limit is reached */}
      {showWarning && (
        <div style={styles.warningText}>
          Maximum number of guests is {max}.
        </div>
      )}
    </div>
  );
};

export default NumberPicker;