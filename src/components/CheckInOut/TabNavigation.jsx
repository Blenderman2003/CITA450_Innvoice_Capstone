import React from "react";

const TabNavigation = ({ activeTab, setActiveTab, theme }) => {
  return (
    <div className="flex justify-center border-b mb-6">
      <button
        onClick={() => setActiveTab("checkin")}
        className={`py-2 px-6 ${
          activeTab === "checkin"
            ? theme === "dark"
              ? "border-red-600 text-red-500"
              : "border-blue-600 text-blue-500"
            : "text-gray-500 hover:text-gray-700"
        } border-b-4 font-bold`}
      >
        Check-In
      </button>
      <button
        onClick={() => setActiveTab("checkout")}
        className={`py-2 px-6 ${
          activeTab === "checkout"
            ? theme === "dark"
              ? "border-red-600 text-red-500"
              : "border-blue-600 text-blue-500"
            : "text-gray-500 hover:text-gray-700"
        } border-b-4 font-bold`}
      >
        Check-Out
      </button>
    </div>
  );
};

export default TabNavigation;