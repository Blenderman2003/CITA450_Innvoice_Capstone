import React from "react";

const InputDisplay = ({ label, value, theme }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className={`w-full p-2 rounded border ${
          theme === "dark"
            ? "bg-gray-800 text-white border-gray-600"
            : "bg-gray-100 text-black border-gray-300"
        }`}
        placeholder={label}
      />
    </div>
  );
};

export default InputDisplay;
