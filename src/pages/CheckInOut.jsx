import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import Navbar from "../components/Page/Navbar";
import Footer from "../components/Page/Footer";
import { ThemeContext } from "../ThemeContext";
import ActionButtons from "../components/CheckInOut/ActionButtons";
import DisplaySection from "../components/CheckInOut/DisplaySection";
import InputDisplay from "../components/CheckInOut/InputDisplay";
import SearchArea from "../components/CheckInOut/SearchArea";
import TabNavigation from "../components/CheckInOut/TabNavigation";
import { customStyles } from "../utils/selectStyles";
import {
  fetchCheckedInGuests,
  fetchCheckedOutGuests,
} from "../utils/fetchOptions";
import { clearFields } from "../utils/clearFields";
import { jwtDecode } from 'jwt-decode';

Modal.setAppElement("#root");

const CheckInOut = () => {
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("checkin");
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reservationId, setReservationId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [reservedCheckInDate, setReservedCheckInDate] = useState("");
  const [reservedCheckOutDate, setReservedCheckOutDate] = useState("");
  const [isAlreadyCheckedIn, setIsAlreadyCheckedIn] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [recentData, setRecentData] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // Fetch recent data based on active tab
  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        const endpoint =
          activeTab === "checkin"
            ? "/routes/checkin/recent"
            : "/routes/checkout/recent";
        const response = await axios.get(endpoint);
        setRecentData(response.data);
      } catch (error) {
        console.error("Error fetching recent data:", error);
      }
    };

    fetchRecentData();
  }, [activeTab]);

  // Handle search selection for Check-In
  const handleSearchSelect = (selectedOption) => {
    setGuestName(selectedOption.guestName || "");
    setEmail(selectedOption.email || "");
    setPhoneNumber(selectedOption.phoneNumber || "");
    setReservationId(selectedOption.reservationId || "");
    setRoomNumber(selectedOption.roomNumber || "");
    setReservedCheckInDate(selectedOption.reservedCheckInDate || "Not Scheduled");
    setIsAlreadyCheckedIn(selectedOption.isCheckin === 1);
    setSearchInput("");
  };

  // Handle search selection for Check-Out
  const handleSearchSelectCheckout = (selectedOption) => {
    setGuestName(selectedOption.guestName || "");
    setReservationId(selectedOption.reservationId || "");
    setRoomNumber(selectedOption.roomNumber || "");
    setReservedCheckOutDate(selectedOption.reservedCheckOutTime || "Not Scheduled");
    setSearchInput("");
  };

  // Clear Check-In search
  const handleClearSearch = () => {
    clearFields([
      setGuestName,
      setEmail,
      setPhoneNumber,
      setReservationId,
      setRoomNumber,
      setReservedCheckInDate,
      setSearchInput,
    ]);
    setIsAlreadyCheckedIn(false);
  };

  // Clear Check-Out search
  const handleClearCheckout = () => {
    clearFields([
      setGuestName,
      setReservationId,
      setRoomNumber,
      setReservedCheckOutDate,
      setSearchInput,
    ]);
  };

  // Handle Check-In action
  const handleCheckIn = async () => {
    if (!guestName || !email || !phoneNumber || !reservationId || !roomNumber) {
      toast.error("Missing required fields: Please fill all fields before checking in.", {
        position: "top-left",
      });
      return;
    }

    if (isAlreadyCheckedIn) {
      toast.error("This reservation is already checked in.", { position: "top-left" });
      return;
    }

    try {
      const response = await axios.post("/routes/checkin", { reservationId });

      if (response.data.success) {
        toast.success("Guest checked in successfully!", { position: "top-left" });
        handleClearSearch();
      } else {
        toast.error(response.data.error || "Failed to check in. Please try again.", {
          position: "top-left",
        });
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      toast.error("An error occurred during check-in. Please try again.", { position: "top-left" });
    }
  };

  // Handle Check-Out action with confirmation
  const handleCheckout = async () => {
    if (!reservationId) {
      toast.error("Reservation ID is required for check-out.", { position: "top-left" });
      return;
    }

    setIsConfirmationOpen(true); // Open confirmation popup
  };

  const confirmCheckout = async () => {
    try {
      const response = await axios.post("/routes/checkout", { reservationId });
      if (response.data.success) {
        toast.success("Guest checked out successfully!", { position: "top-left" });
        handleClearCheckout();
      } else {
        toast.error(response.data.error || "Failed to check out. Please try again.", {
          position: "top-left",
        });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("An error occurred during check-out. Please try again.", { position: "top-left" });
    } finally {
      setIsConfirmationOpen(false); // Close confirmation popup
    }
    };

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      } min-h-screen flex flex-col`}
    >
      <Navbar />
      <div className="container mx-auto p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center">Guest Check-In and Check-Out</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TabNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              theme={theme}
            />

            {/* Check-In Tab */}
            {activeTab === "checkin" && (
              <>
                <SearchArea
                  loadSearchOptions={fetchCheckedOutGuests}
                  handleSearchSelect={handleSearchSelect}
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  handleClearSearch={handleClearSearch}
                  customStyles={customStyles(theme)}
                  theme={theme}
                />

                <div className="space-y-4 mt-4">
                  <InputDisplay label="Guest Name" value={guestName || " "} theme={theme} />
                  <InputDisplay label="Email" value={email || " "} theme={theme} />
                  <InputDisplay label="Phone Number" value={phoneNumber || " "} theme={theme} />
                  <InputDisplay label="Reservation ID" value={reservationId || " "} theme={theme} />
                  <InputDisplay label="Room Number" value={roomNumber || " "} theme={theme} />
                  <InputDisplay
                    label="Reserved Check-In Time (EST)"
                    value={reservedCheckInDate || "Not Scheduled"}
                    theme={theme}
                  />
                </div>

                <ActionButtons
                  onAction={handleCheckIn}
                  isDisabled={isAlreadyCheckedIn}
                  theme={theme}
                  buttonLabel={isAlreadyCheckedIn ? "Already Checked In" : "Check In Guest"}
                />
              </>
            )}

            {/* Check-Out Tab */}
            {activeTab === "checkout" && (
              <>
                <SearchArea
                  loadSearchOptions={fetchCheckedInGuests}
                  handleSearchSelect={handleSearchSelectCheckout}
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  handleClearSearch={handleClearCheckout}
                  customStyles={customStyles(theme)}
                  theme={theme}
                />

                <div className="space-y-4 mt-4">
                  <InputDisplay label="Guest Name" value={guestName || " "} theme={theme} />
                  <InputDisplay label="Reservation ID" value={reservationId || " "} theme={theme} />
                  <InputDisplay label="Room Number" value={roomNumber || " "} theme={theme} />
                  <InputDisplay
                    label="Reserved Check-Out Time (EST)"
                    value={reservedCheckOutDate || "Not Scheduled"}
                    theme={theme}
                  />
                </div>

                <ActionButtons
                  onAction={handleCheckout}
                  isDisabled={false}
                  theme={theme}
                  buttonLabel="Check Out Guest"
                />
              </>
            )}
          </div>

          {/* Display Section for Recent Data */}
          <DisplaySection
            theme={theme}
            recentData={recentData}
            activeTab={activeTab}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmationOpen}
        onRequestClose={() => setIsConfirmationOpen(false)}
        contentLabel="Confirm Check-Out"
        className={`p-6 rounded-lg max-w-md mx-auto ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Confirm Check-Out</h2>
        <p>Are you sure you want to check out this guest?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={confirmCheckout}
            className={`px-4 py-2 rounded-lg mr-2 ${
              theme === "dark" ? "bg-red-600 text-white" : "bg-blue-600 text-white"
            }`}
          >
            Confirm
          </button>
          <button
            onClick={() => setIsConfirmationOpen(false)}
            className={`px-4 py-2 rounded-lg ${
              theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-300 text-black"
            }`}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default CheckInOut;