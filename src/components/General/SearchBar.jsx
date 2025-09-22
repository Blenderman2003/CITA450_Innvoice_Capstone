// SearchBar.jsx
// A reusable search bar component for filtering lists based on user input.

import React from 'react';

// SearchBar Component
// Props:
// - searchQuery: Current search term controlled by the parent component.
// - setSearchQuery: Function to update the search term in the parent state.
// - placeholder: Customizable placeholder text for the input field.
// - theme: Current theme ('dark' or 'light') for dynamic styling.
const SearchBar = ({ searchQuery, setSearchQuery, placeholder = 'Search...', theme }) => (
  <div className="mb-4">
    {/* Input Field for Searching */}
    <input
      type="text"
      placeholder={placeholder}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)} // Updates the parent state
      className={`border p-2 rounded w-full ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
      }`}
    />
  </div>
);

export default SearchBar;