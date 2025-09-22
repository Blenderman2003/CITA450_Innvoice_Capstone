import React from "react";

// Utility function to format date in the desired format
const formatDateTime = (utcDate) => {
  if (!utcDate) return "Not Scheduled";

  try {
    const date = new Date(utcDate);

    // Validate the date
    if (isNaN(date.getTime())) return "Invalid Date";

    // Format date to text like "November 27, 2024 at 02:08 AM"
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/New_York", // EST timezone
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
    return formattedDate;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

const GuestCard = ({ guest, onMoreClick, theme }) => {
  return (
    <div
      className={`relative w-full py-4 px-6 rounded-lg shadow-md ${
        theme === "dark"
          ? "bg-gray-700 text-white"
          : "bg-white text-black border border-gray-300"
      }`}
    >
      {/* Guest Name */}
      <p className="font-bold text-lg mb-2">{guest.name}</p>

      {/* Reservation Details */}
      <p className="mb-1">Reservation ID: {guest.reservationId}</p>
      <p className="mb-1">Room: {guest.roomNumber}</p>
      <p className="mb-1">
        Check-In Time: {formatDateTime(guest.checkInTime)}
      </p>

      {/* Click Hint */}
      <p
        className={`mt-2 text-sm font-medium italic ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Click for more details
      </p>

      {/* Invisible Button */}
      <button
        onClick={onMoreClick}
        className="absolute inset-0 bg-transparent"
        aria-label="View More Details"
      ></button>
    </div>
  );
};

export default GuestCard;
