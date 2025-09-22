// RoomFilterControls.jsx
// Provides filtering controls for room status (Available, Occupied, Maintenance) and type (Normal, Suite).
// Designed to be responsive, with compact button layouts for small screens, and a Clear All button to reset filters.

import React from 'react';

const RoomFilterControls = ({
  checkedAvailable,
  checkedReserved,
  checkedMaintanance,
  checkedNormal,
  checkedSuite,
  setCheckedAvailable,
  setCheckedReserved,
  setCheckedMaintanance,
  setCheckedNormal,
  setCheckedSuite,
  clearAllFilters,
  theme
}) => (
  <div className={`flex flex-col p-4 rounded w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} md:mx-2`}>
    <h3 className="text-lg md:text-2xl font-bold mb-4 text-center md:text-left">Filter Options</h3>

    {/* Room Status Filter Section */}
    <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
      <p className="text-base font-semibold mb-2 w-full text-center md:text-left">Status</p>
      
      {/* Available Status Button */}
      <button
        onClick={() => setCheckedAvailable(!checkedAvailable)}
        className={`py-2 px-4 rounded w-fit md:w-auto ${checkedAvailable ? (theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-500 text-white hover:bg-blue-600') : 'bg-gray-300 text-black hover:bg-gray-400'}`}
      >
        Available
      </button>

      {/* Occupied Status Button */}
      <button
        onClick={() => setCheckedReserved(!checkedReserved)}
        className={`py-2 px-4 rounded w-fit md:w-auto ${checkedReserved ? (theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-500 text-white hover:bg-blue-600') : 'bg-gray-300 text-black hover:bg-gray-400'}`}
      >
        Occupied
      </button>

      {/* Maintenance Status Button */}
      <button
        onClick={() => setCheckedMaintanance(!checkedMaintanance)}
        className={`py-2 px-4 rounded w-fit md:w-auto ${checkedMaintanance ? (theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-500 text-white hover:bg-blue-600') : 'bg-gray-300 text-black hover:bg-gray-400'}`}
      >
        Maintenance
      </button>
    </div>

    {/* Room Type Filter Section */}
    <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
      <p className="text-base font-semibold mb-2 w-full text-center md:text-left">Type</p>
      
      {/* Normal Room Type Button */}
      <button
        onClick={() => setCheckedNormal(!checkedNormal)}
        className={`py-2 px-4 rounded md:w-auto ${checkedNormal ? (theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-500 text-white hover:bg-blue-600') : 'bg-gray-300 text-black hover:bg-gray-400'}`}
      >
        Normal
      </button>

      {/* Suite Room Type Button */}
      <button
        onClick={() => setCheckedSuite(!checkedSuite)}
        className={`py-2 px-4 rounded md:w-auto ${checkedSuite ? (theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-500 text-white hover:bg-blue-600') : 'bg-gray-300 text-black hover:bg-gray-400'}`}
      >
        Suite
      </button>
    </div>

    {/* View All Filters Button */}
    <div className="flex justify-center md:justify-start mt-4 border-t pt-4">
      <button
        onClick={clearAllFilters}
        className={`py-2 px-4 rounded md:w-auto ${checkedSuite ? (theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-500 text-white hover:bg-blue-600') : 'bg-gray-300 text-black hover:bg-gray-400'}`}
      >
        View All
      </button>
    </div>
  </div>
);

export default RoomFilterControls;