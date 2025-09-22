import React, { useContext } from "react"; // Import useContext for accessing ThemeContext
import PropTypes from "prop-types";
import { ThemeContext } from '../../ThemeContext';
import reservationIcon from "../../assets/images/reservationicon.png";


/**
 * ReservationCard Component
 * Displays reservation information, including room number, guest name, and check-in/out dates.
 * Handles "Edit" and "Delete" actions with disabled states for checked-in reservations.
 */

const ReservationCard = ({
  roomNumber,
  guestName,
  reservedCheckInDate,
  reservedCheckOutDate,
  checkoutDateTime,
  onEdit,
  onDelete,
  isCheckin,
}) => {
  const { theme } = useContext(ThemeContext); // Access the current theme (dark or light)

  const formatDateTime = (utcDate) => {
    if (!utcDate) return "Date not available";

    try {
      const date = new Date(utcDate);
      if (isNaN(date.getTime())) return "Invalid Date";

      const estDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);

      const options = {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };

      const estFormatted = estDate.toLocaleString("en-US", options);
      const utcFormatted = date.toLocaleString("en-US", options);

      return `${estFormatted} (UTC: ${utcFormatted})`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const isCheckoutComplete = checkoutDateTime !== null;

  return (
    <li
      // Old List Element //
      // className={`flex flex-col items-start border p-4 rounded-lg shadow-lg ${
      //   isCheckin ? "bg-red-100 dark:bg-gray-700" : "bg-white dark:bg-gray-800"}`}

      // New List Element //
      className={`flex flex-col items-start border p-4 rounded-lg shadow-lg ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
    >
      <div className="flex items-center w-full mb-4">
        <img
          src={reservationIcon}
          alt="Reservation Icon"
          className="w-16 h-16 mr-4"
        />
        <div className="flex-grow">
          <p className="font-bold text-lg mb-1">
            <strong>Room:</strong> {roomNumber || "N/A"}
          </p>
          <p className={`text-sm ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            } mb-2`}
            >
            <strong>Guest:</strong> {guestName || "Unknown Guest"}
          </p>
          <p className="text-sm mb-1">
            <strong>Check-in:</strong> {formatDateTime(reservedCheckInDate)}
          </p>
          <p className="text-sm mb-3">
            <strong>Check-out:</strong> {formatDateTime(reservedCheckOutDate)}
          </p>
        </div>
      </div>

      {/* Yellow note for checked-in guests */}
      {isCheckin && !isCheckoutComplete && (
        <div className={`mb-4 w-full p-3 border-l-4 rounded ${
          theme === "dark"
            ? "bg-yellow-700 border-yellow-500 text-gray-200"
            : "bg-yellow-100 border-yellow-500 text-black"
        }`}
        >
          <p>
            <strong>Note:</strong> This reservation has been checked in
            and cannot be edited or deleted.
          </p>
        </div>
      )}

      {/* Green note for checked-out guests */}
      {isCheckoutComplete && (
        <div className="mb-4 w-full p-3 bg-green-100 border-l-4 border-green-500 text-black rounded">
          <p>
            <strong>Note:</strong> This guest has checked out and it is safe to delete the reservation.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {/* Edit Button */}
        <button
          onClick={onEdit}
          disabled={isCheckin || isCheckoutComplete}
          className={`py-1 px-3 rounded-lg ${
            isCheckin || isCheckoutComplete
              ? "bg-gray-300 dark:bg-gray-500 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 dark:bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-600"
          }`}
        >
          Edit
        </button>

        {/* Old Delete Button */}
        {/* <button
          onClick={onDelete}
          disabled={!isCheckoutComplete}
          className={`py-1 px-3 rounded-lg ${
            !isCheckoutComplete
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          Delete
        </button> */}

        {/* New Delete Button */}
        <button
          onClick={onDelete}
          disabled={isCheckin || isCheckoutComplete}
          className={`py-1 px-3 rounded-lg ${
            isCheckin || isCheckoutComplete
              ? "bg-gray-300 dark:bg-gray-500 text-gray-400 cursor-not-allowed"
              : "bg-red-500 dark:bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600"
          }`}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

ReservationCard.propTypes = {
  roomNumber: PropTypes.string.isRequired,
  guestName: PropTypes.string,
  reservedCheckInDate: PropTypes.string,
  reservedCheckOutDate: PropTypes.string,
  checkoutDateTime: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isCheckin: PropTypes.bool.isRequired,
};

export default ReservationCard;
