import React, { useState, useEffect } from "react";
import GuestCard from "./GuestCard";
import Modal from "react-modal";
import { FaUserCircle } from "react-icons/fa";
import { fetchRecentCheckIns, fetchRecentCheckOuts } from "../../utils/fetchOptions";

Modal.setAppElement("#root");

// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return "Not Scheduled";

  try {
    const date = new Date(dateString);

    // Validate the date
    if (isNaN(date.getTime())) return "Invalid Date";

    // Format: Month Day, Year at HH:mm AM/PM
    return date.toLocaleString("en-US", {
      timeZone: "America/New_York",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

const DisplaySection = ({ theme, activeTab }) => {
  const [guests, setGuests] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Page starts at 0 (Page 1)
  const [selectedGuest, setSelectedGuest] = useState(null);
  const guestsPerPage = 3;

  const fetchData = async () => {
    try {
      const data =
        activeTab === "checkin"
          ? await fetchRecentCheckIns()
          : await fetchRecentCheckOuts();
      setGuests(data);
    } catch (error) {
      console.error(
        `Error fetching recent ${activeTab === "checkin" ? "check-ins" : "check-outs"}:`,
        error
      );
    }
  };

  useEffect(() => {
    fetchData();
    setCurrentPage(0); // Reset to Page 1 whenever the activeTab changes

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab]); // Dependency array includes activeTab to trigger on tab switch

  const totalPages = Math.ceil(guests.length / guestsPerPage);
  const paginatedGuests = guests.slice(
    currentPage * guestsPerPage,
    Math.min((currentPage + 1) * guestsPerPage, guests.length)
  );

  const handleMoreClick = (guest) => {
    setSelectedGuest(guest);
  };

  const closeModal = () => {
    setSelectedGuest(null);
  };

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      } p-6 rounded-lg shadow-lg`}
    >
      <h2 className="text-xl font-semibold mb-4">
        Recent {activeTab === "checkin" ? "Check-Ins" : "Check-Outs"}
      </h2>

      <div className="space-y-4">
        {paginatedGuests.map((guest) => (
          <GuestCard
            key={guest.id}
            guest={guest}
            onMoreClick={() => handleMoreClick(guest)}
            theme={theme}
          />
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded transition-opacity duration-200 ${
            currentPage === 0
              ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
              : theme === "dark"
              ? "bg-red-600 text-white hover:opacity-80"
              : "bg-blue-600 text-white hover:opacity-80"
          }`}
        >
          &lt; Prev
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          disabled={currentPage === totalPages - 1}
          className={`px-4 py-2 rounded transition-opacity duration-200 ${
            currentPage === totalPages - 1
              ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
              : theme === "dark"
              ? "bg-red-600 text-white hover:opacity-80"
              : "bg-blue-600 text-white hover:opacity-80"
          }`}
        >
          Next &gt;
        </button>
      </div>

      <Modal
        isOpen={!!selectedGuest}
        onRequestClose={closeModal}
        contentLabel="Guest Details"
        className={`fixed inset-0 flex items-center justify-center p-4 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center"
      >
        {selectedGuest && (
          <div
            className={`p-8 rounded-lg max-w-md w-full flex flex-col items-center ${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } shadow-xl`}
          >
            <FaUserCircle
              className={`text-8xl mb-6 ${
                theme === "dark" ? "text-gray-400" : "text-gray-700"
              }`}
            />
            <h3 className="font-bold text-2xl mb-4">{selectedGuest.name}</h3>
            <div className="w-full space-y-2 text-sm">
              <p>
                <span className="font-semibold">
                  {activeTab === "checkin" ? "Checked-In" : "Checked-Out"} Time:
                </span>{" "}
                {formatDate(
                  activeTab === "checkin"
                    ? selectedGuest.checkInTime
                    : selectedGuest.checkOutTime
                )}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {selectedGuest.email}
              </p>
              <p>
                <span className="font-semibold">Phone Number:</span>{" "}
                {selectedGuest.phoneNumber}
              </p>
              <p>
                <span className="font-semibold">Reservation ID:</span>{" "}
                {selectedGuest.reservationId}
              </p>
              <p>
                <span className="font-semibold">Room Number:</span>{" "}
                {selectedGuest.roomNumber}
              </p>
              <p>
                <span className="font-semibold">
                  Reserved Check-In Time:
                </span>{" "}
                {selectedGuest.reservedCheckInTime}
              </p>
              <p>
                <span className="font-semibold">
                  Reserved Check-Out Time:
                </span>{" "}
                {selectedGuest.reservedCheckOutTime}
              </p>
              <p>
                <span className="font-semibold">Number of Guests:</span>{" "}
                {selectedGuest.numberOfGuests}
              </p>
            </div>
            <button
              onClick={closeModal}
              className={`mt-6 px-6 py-2 rounded-lg ${
                theme === "dark"
                  ? "bg-red-600 text-white hover:opacity-90"
                  : "bg-blue-600 text-white hover:opacity-90"
              } transition-opacity duration-200`}
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DisplaySection;