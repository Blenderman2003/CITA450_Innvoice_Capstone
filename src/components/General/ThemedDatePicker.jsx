// ThemedDatePicker.jsx
// A modular date picker component that supports theme-based styling for consistency across light and dark modes.
// Uses Flatpickr for the calendar functionality and reinitializes based on theme changes.

import React, { useContext } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Import Flatpickr CSS for styling
import 'flatpickr/dist/themes/dark.css'; // Import Flatpickr for Theme Switch
import { ThemeContext } from '../../ThemeContext';

const ThemedDatePicker = ({ label, value, onChange, minDate = 'today', maxDate }) => {
  const { theme } = useContext(ThemeContext); // Access theme context to apply light or dark styles

  return (
    <div className="mb-4">
      {/* Label for the date picker */}
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      
      {/* Date picker field */}
      <Flatpickr
        value={value}
        onChange={(date) => onChange(date[0])} // Trigger onChange when the date changes
        options=
        {{
          enableTime: true, // Allow time selection
          minDate, // Set minimum selectable date
          maxDate, // Set maximum selectable date (optional)
          time_24hr: false, // Don't use 24-hour format for time
          altInput: true,
          altFormat: "F j, Y || h:i K",
          dateFormat: "Y-m-d h:i K",
        }}
        className={`w-full p-2 rounded ${
          theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
      />
    </div>
  );
};

export default ThemedDatePicker;