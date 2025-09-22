import React from "react";
import AsyncSelect from "react-select/async";

const SearchArea = ({
  loadSearchOptions,
  handleSearchSelect,
  searchInput,
  setSearchInput,
  handleClearSearch,
  customStyles,
  theme,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex-grow">
        <label className="block text-sm font-medium mb-1">Search</label>
        <AsyncSelect
          cacheOptions
          loadOptions={loadSearchOptions}
          defaultOptions
          placeholder="Search by Guest Name, Email, Phone, Room Number, or Reservation ID..."
          onChange={handleSearchSelect}
          value={searchInput ? { label: searchInput, value: searchInput } : null}
          onInputChange={(input) => setSearchInput(input)}
          styles={customStyles}
        />
      </div>
      <button
        onClick={handleClearSearch}
        className={`py-2 px-4 rounded-lg transition ${
          theme === "dark"
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Clear
      </button>
    </div>
  );
};

export default SearchArea;
