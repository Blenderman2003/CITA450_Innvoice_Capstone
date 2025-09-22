import React from 'react';

const HouseKeepingFilterControls = ({
  checkedNormal,
  checkedSuite,
  setCheckedNormal,
  setCheckedSuite,
  clearAllFilters,
  theme
}) => (
  <div className={`flex flex-col p-4 rounded w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} md:mx-2`}>
    <h3 className="text-lg md:text-2xl font-bold mb-4 text-center md:text-left">Filter Options</h3>

    {/* Room Type Filter Section */}
    <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
      <p className="text-base font-semibold mb-2 w-full text-center md:text-left">Type</p>
      
      {/* Normal Room Type Button */}
      <button
        onClick={() => setCheckedNormal(!checkedNormal)}
        className={`py-2 px-4 rounded md:w-auto ${checkedNormal ? (theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700') : 'bg-gray-300 text-black hover:bg-gray-400'}`}
      >
        Normal
      </button>

      {/* Suite Room Type Button */}
      <button
        onClick={() => setCheckedSuite(!checkedSuite)}
        className={`py-2 px-4 rounded md:w-auto ${checkedSuite ? (theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700') : 'bg-gray-300 text-black hover:bg-gray-400'}`}
      >
        Suite
      </button>
    </div>

    {/* View All Filters Button */}
    <div className="flex justify-center md:justify-start mt-4 border-t pt-4">
      <button
        onClick={clearAllFilters}
        className={`py-2 px-4 rounded md:w-auto ${checkedSuite ? (theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700') : 'bg-gray-300 text-black hover:bg-gray-400'}`}
      >
        View All
      </button>
    </div>
  </div>
);

export default HouseKeepingFilterControls;