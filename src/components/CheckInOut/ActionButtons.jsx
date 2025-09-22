import React from "react";

const ActionButtons = ({ onAction, theme, buttonLabel, isDisabled }) => {
  return (
    <button
      type="button"
      onClick={onAction}
      className={`mt-4 w-full py-2 rounded-lg ${
        isDisabled
          ? "bg-green-600 text-white cursor-not-allowed"
          : theme === "dark"
          ? "bg-red-600 text-white hover:opacity-90"
          : "bg-blue-600 text-white hover:opacity-90"
      }`}
      disabled={isDisabled}
    >
      {buttonLabel}
    </button>
  );
};

export default ActionButtons;