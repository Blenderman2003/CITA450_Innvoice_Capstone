import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Page/Navbar";
import Footer from "../components/Page/Footer";
import SearchBar from "../components/General/SearchBar";
import ThemedDatePicker from "../components/General/ThemedDatePicker";
import NumberPicker from "../components/General/NumberPicker";
import RoomDropDown from "../components/Room/RoomDropDown";
import GuestDropdown from "../components/Guest/GuestDropdown";
import ReservationCard from "../components/Reservation/ReservationCard";
import Popup from "../components/General/Popup";
import { ThemeContext } from "../ThemeContext";
import CalanderTimeLine from "../components/Reservation/CalanderTimeline";
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../components/UserContext.jsx';

const Reservations = () => {
    const { theme } = useContext(ThemeContext);

    const [reservationInfo, setReservationInfo] = useState({
        roomNumber: "",
        guestId: "",
        reservedCheckInDate: new Date(),
        reservedCheckOutDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        numberOfGuests: 1,
    });
    const [reservationsList, setReservationsList] = useState([]);
    const [guests, setGuests] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [editingReservation, setEditingReservation] = useState(null);
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState(null);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        fetchGuests();
        fetchReservations();
    }, []);

    const fetchGuests = async () => {
        try {
            const response = await axios.get("/routes/reservations/allGuests");
            const guestsData = response.data.reduce((acc, guest) => {
                acc[guest.guestId] = `${guest.firstName} ${guest.lastName}`;
                return acc;
            }, {});
            setGuests(guestsData);
        } catch (error) {
            console.error("Error fetching guests:", error);
        }
    };

    const fetchReservations = async () => {
        try {
            const response = await axios.get("/routes/reservations/allReservations");
            const formattedReservations = response.data.map((reservation) => ({
                ...reservation,
                reservedCheckInDate: reservation.reservedCheckInDate
                    ? new Date(reservation.reservedCheckInDate).toISOString()
                    : null,
                reservedCheckOutDate: reservation.reservedCheckOutDate
                    ? new Date(reservation.reservedCheckOutDate).toISOString()
                    : null,
                checkoutDateTime: reservation.checkoutDateTime || null,
            }));
            setReservationsList(formattedReservations);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    const handleInputChange = (field, value) => {
        setReservationInfo((prevInfo) => ({ ...prevInfo, [field]: value }));
    };

    const handleSaveReservation = async () => {
        try {
            if (editingReservation) {
                await axios.put(
                    `/routes/reservations/updateReservation/${editingReservation.reservationId}`,
                    reservationInfo
                );
                toast.success("Reservation updated successfully!", {
                    position: "top-left",
                    autoClose: 5000,
                });
            } else {
                await axios.post("/routes/reservations/setReservation", reservationInfo);
                toast.success("Reservation added successfully!", {
                    position: "top-left",
                    autoClose: 5000,
                });
            }
            resetForm();
            fetchReservations(); // Refresh reservation list without reloading the page
        } catch (error) {
            console.error("Error saving reservation:", error);
            toast.error("Failed to save the reservation. Please try again.", {
                position: "top-left",
                autoClose: 5000,
            });
        }
    };

    const handleEditReservation = (reservation) => {
        setEditingReservation(reservation);
        setReservationInfo({
            roomNumber: reservation.roomNumber,
            guestId: reservation.guestId,
            reservedCheckInDate: new Date(reservation.reservedCheckInDate),
            reservedCheckOutDate: new Date(reservation.reservedCheckOutDate),
            numberOfGuests: reservation.numberOfGuests,
        });
    };

    const confirmDeleteReservation = (reservation) => {
        setReservationToDelete(reservation);
        setDeletePopupOpen(true);
    };

    const handleDeleteReservation = async () => {
        if (!reservationToDelete) return;

        try {
            await axios.delete(
                `/routes/reservations/deleteReservation/${reservationToDelete.reservationId}`
            );
            setReservationsList(
                reservationsList.filter(
                    (r) => r.reservationId !== reservationToDelete.reservationId
                )
            );
            toast.success("Reservation deleted successfully!", {
                position: "top-left",
                autoClose: 5000,
            });
        } catch (error) {
            console.error("Error deleting reservation:", error);
            toast.error("Failed to delete the reservation. Please try again.", {
                position: "top-left",
                autoClose: 5000,
            });
        } finally {
            setDeletePopupOpen(false);
            setReservationToDelete(null);
        }
    };

    const resetForm = () => {
        setEditingReservation(null);
        setReservationInfo({
            roomNumber: "",
            guestId: "",
            reservedCheckInDate: new Date(),
            reservedCheckOutDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            numberOfGuests: 1,
        });

        const roomDropdown = document.querySelector("#room-dropdown");
        if (roomDropdown) roomDropdown.value = "";

        const guestDropdown = document.querySelector("#guest-dropdown");
        if (guestDropdown) guestDropdown.value = "";
    };

    const filteredReservations = reservationsList.filter((reservation) => {
        const guestName = guests[reservation.guestId]?.toLowerCase() || "";
        const matchesSearch = guestName.includes(searchQuery.toLowerCase()) ||
            reservation.roomNumber.toString().includes(searchQuery);

        if (showHistory) {
            return matchesSearch && reservation.checkoutDateTime;
        }
        return matchesSearch && !reservation.checkoutDateTime;
    });

    const { user, setUser } = useContext(UserContext);
    let decoded
    try {
        console.log(user);
        decoded = jwtDecode(user.accessToken).Role;
        console.log('Decoded Token:', decoded);
    }
    catch (error) {
        console.error('Failed to decode token:', error);
    }
    if (decoded === 1) {
        return (
            <div
                className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
                    } min-h-screen flex flex-col`}
            >
                <Navbar />

                <div className="flex-grow flex flex-col lg:flex-row p-4 lg:p-8 space-y-8 lg:space-y-0 lg:space-x-8 justify-center">
                    <div
                        className={`${theme === "dark"
                                ? "bg-gray-800"
                                : "bg-gray-100 border border-gray-300 shadow-sm"
                            } p-6 rounded-lg w-full lg:w-1/3 max-w-md`}
                    >
                        {/* Form Section - Protected */}
                        <h2 className="text-2xl font-bold mb-4">
                            {editingReservation ? "Edit Reservation" : "Add Reservation"}
                        </h2>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <RoomDropDown
                                selectedRoom={reservationInfo.roomNumber}
                                onSelectRoom={(value) => handleInputChange("roomNumber", value)}
                            />
                            <GuestDropdown
                                selectedGuest={reservationInfo.guestId}
                                onSelectGuest={(guestId) => handleInputChange("guestId", guestId)}
                            />
                            <ThemedDatePicker
                                label="Check-in Date"
                                value={reservationInfo.reservedCheckInDate}
                                onChange={(date) =>
                                    handleInputChange("reservedCheckInDate", date)
                                }
                                minDate="today"
                            />
                            <ThemedDatePicker
                                label="Check-out Date"
                                value={reservationInfo.reservedCheckOutDate}
                                onChange={(date) =>
                                    handleInputChange("reservedCheckOutDate", date)
                                }
                                minDate={reservationInfo.reservedCheckInDate}
                            />
                            <NumberPicker
                                label="Number of Guests"
                                min={1}
                                max={6}
                                value={reservationInfo.numberOfGuests}
                                onChange={(value) =>
                                    handleInputChange("numberOfGuests", value)
                                }
                            />
                            <button
                                onClick={handleSaveReservation}
                                className={`${theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' :
                                    'bg-blue-500 text-white hover:bg-blue-600'} p-2 rounded w-full mb-2`}
                            >
                                {editingReservation ? "Save Changes" : "Add Reservation"}
                            </button>
                            {editingReservation && (
                                <button
                                    onClick={resetForm}
                                    className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                                        } w-full py-2 rounded-lg text-black mt-2`}
                                >
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>

                    <div
                        className={`${theme === "dark" ? "bg-gray-900" : "bg-white shadow-sm"
                            } p-6 rounded-lg w-full lg:w-2/3 overflow-y-auto`}
                        style={{
                            maxHeight: "calc(100vh - 140px)",
                        }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Reservations List</h2>
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                                    } py-2 px-4 rounded-lg`}
                            >
                                {showHistory ? "Show Active" : "Show History"}
                            </button>
                        </div>
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            theme={theme}
                        />
                        <ul className="space-y-4">
                            {filteredReservations.map((reservation) => (
                                <ReservationCard
                                    key={reservation.reservationId}
                                    roomNumber={reservation.roomNumber}
                                    guestName={guests[reservation.guestId]}
                                    reservedCheckInDate={reservation.reservedCheckInDate}
                                    reservedCheckOutDate={reservation.reservedCheckOutDate}
                                    checkoutDateTime={reservation.checkoutDateTime}
                                    onEdit={() => handleEditReservation(reservation)}
                                    onDelete={() => confirmDeleteReservation(reservation)}
                                    isCheckin={reservation.isCheckin === 1}
                                />
                            ))}
                        </ul>

                        {/*TODO: Integrate this into the page better*/}
                        <CalanderTimeLine></CalanderTimeLine>

                    </div>
                </div>

                <Popup
                    isOpen={deletePopupOpen}
                    onClose={() => setDeletePopupOpen(false)}
                    title="Confirm Delete"
                    theme={theme}
                >
                    <p>Are you sure you want to delete this reservation?</p>
                    <div className="flex justify-start mt-4">
                        <button
                            onClick={handleDeleteReservation}
                            className={`${theme === "dark" ? "bg-red-600" : "bg-blue-600"
                                } text-white py-2 px-4 rounded-lg mr-4`}
                        >
                            Yes, Delete
                        </button>
                        <button
                            onClick={() => setDeletePopupOpen(false)}
                            className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                                } text-black py-2 px-4 rounded-lg`}
                        >
                            Cancel
                        </button>
                    </div>
                </Popup>

                <Footer />
                <ToastContainer />
            </div>
        );
    };
    if (decoded === 2) {
        return (
            <div
                className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
                    } min-h-screen flex flex-col`}
            >
                <Navbar />

                <div className="flex-grow flex flex-col lg:flex-row p-4 lg:p-8 space-y-8 lg:space-y-0 lg:space-x-8 justify-center">
                    <div
                        className={`${theme === "dark"
                            ? "bg-gray-800"
                            : "bg-gray-100 border border-gray-300 shadow-sm"
                            } p-6 rounded-lg w-full lg:w-1/3 max-w-md`}
                    >
                        {/* Form Section - Protected */}
                        <h2 className="text-2xl font-bold mb-4">
                            {editingReservation ? "Edit Reservation" : "Add Reservation"}
                        </h2>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <RoomDropDown
                                selectedRoom={reservationInfo.roomNumber}
                                onSelectRoom={(value) => handleInputChange("roomNumber", value)}
                            />
                            <GuestDropdown
                                selectedGuest={reservationInfo.guestId}
                                onSelectGuest={(guestId) => handleInputChange("guestId", guestId)}
                            />
                            <ThemedDatePicker
                                label="Check-in Date"
                                value={reservationInfo.reservedCheckInDate}
                                onChange={(date) =>
                                    handleInputChange("reservedCheckInDate", date)
                                }
                                minDate="today"
                            />
                            <ThemedDatePicker
                                label="Check-out Date"
                                value={reservationInfo.reservedCheckOutDate}
                                onChange={(date) =>
                                    handleInputChange("reservedCheckOutDate", date)
                                }
                                minDate={reservationInfo.reservedCheckInDate}
                            />
                            <NumberPicker
                                label="Number of Guests"
                                min={1}
                                max={6}
                                value={reservationInfo.numberOfGuests}
                                onChange={(value) =>
                                    handleInputChange("numberOfGuests", value)
                                }
                            />
                            <button
                                onClick={handleSaveReservation}
                                className={`${theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' :
                                    'bg-blue-500 text-white hover:bg-blue-600'} p-2 rounded w-full mb-2`}
                            >
                                {editingReservation ? "Save Changes" : "Add Reservation"}
                            </button>
                            {editingReservation && (
                                <button
                                    onClick={resetForm}
                                    className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                                        } w-full py-2 rounded-lg text-black mt-2`}
                                >
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>

                    <div
                        className={`${theme === "dark" ? "bg-gray-900" : "bg-white shadow-sm"
                            } p-6 rounded-lg w-full lg:w-2/3 overflow-y-auto`}
                        style={{
                            maxHeight: "calc(100vh - 140px)",
                        }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Reservations List</h2>
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                                    } py-2 px-4 rounded-lg`}
                            >
                                {showHistory ? "Show Active" : "Show History"}
                            </button>
                        </div>
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            theme={theme}
                        />
                        <ul className="space-y-4">
                            {filteredReservations.map((reservation) => (
                                <ReservationCard
                                    key={reservation.reservationId}
                                    roomNumber={reservation.roomNumber}
                                    guestName={guests[reservation.guestId]}
                                    reservedCheckInDate={reservation.reservedCheckInDate}
                                    reservedCheckOutDate={reservation.reservedCheckOutDate}
                                    checkoutDateTime={reservation.checkoutDateTime}
                                    onEdit={() => handleEditReservation(reservation)}
                                    onDelete={() => confirmDeleteReservation(reservation)}
                                    isCheckin={reservation.isCheckin === 1}
                                />
                            ))}
                        </ul>

                        {/*TODO: Integrate this into the page better*/}
                        <CalanderTimeLine></CalanderTimeLine>

                    </div>
                </div>

                <Popup
                    isOpen={deletePopupOpen}
                    onClose={() => setDeletePopupOpen(false)}
                    title="Confirm Delete"
                    theme={theme}
                >
                    <p>Are you sure you want to delete this reservation?</p>
                    <div className="flex justify-start mt-4">
                        <button
                            onClick={handleDeleteReservation}
                            className={`${theme === "dark" ? "bg-red-600" : "bg-blue-600"
                                } text-white py-2 px-4 rounded-lg mr-4`}
                        >
                            Yes, Delete
                        </button>
                        <button
                            onClick={() => setDeletePopupOpen(false)}
                            className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                                } text-black py-2 px-4 rounded-lg`}
                        >
                            Cancel
                        </button>
                    </div>
                </Popup>

                <Footer />
                <ToastContainer />
            </div>
        );
    };
    if (decoded === 3) {
        return (
            <div
                className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
                    } min-h-screen flex flex-col`}
            >
                <Navbar />

                <div className="flex-grow flex flex-col lg:flex-row p-4 lg:p-8 space-y-8 lg:space-y-0 lg:space-x-8 justify-center">
                    <div
                        className={`${theme === "dark"
                            ? "bg-gray-800"
                            : "bg-gray-100 border border-gray-300 shadow-sm"
                            } p-6 rounded-lg w-full lg:w-1/3 max-w-md`}
                    >
                        {/* Form Section - Protected */}
                        <h2 className="text-2xl font-bold mb-4">
                            {editingReservation ? "Edit Reservation" : "Add Reservation"}
                        </h2>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <RoomDropDown
                                selectedRoom={reservationInfo.roomNumber}
                                onSelectRoom={(value) => handleInputChange("roomNumber", value)}
                            />
                            <GuestDropdown
                                selectedGuest={reservationInfo.guestId}
                                onSelectGuest={(guestId) => handleInputChange("guestId", guestId)}
                            />
                            <ThemedDatePicker
                                label="Check-in Date"
                                value={reservationInfo.reservedCheckInDate}
                                onChange={(date) =>
                                    handleInputChange("reservedCheckInDate", date)
                                }
                                minDate="today"
                            />
                            <ThemedDatePicker
                                label="Check-out Date"
                                value={reservationInfo.reservedCheckOutDate}
                                onChange={(date) =>
                                    handleInputChange("reservedCheckOutDate", date)
                                }
                                minDate={reservationInfo.reservedCheckInDate}
                            />
                            <NumberPicker
                                label="Number of Guests"
                                min={1}
                                max={6}
                                value={reservationInfo.numberOfGuests}
                                onChange={(value) =>
                                    handleInputChange("numberOfGuests", value)
                                }
                            />
                            <button
                                onClick={handleSaveReservation}
                                className={`${theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' :
                                    'bg-blue-500 text-white hover:bg-blue-600'} p-2 rounded w-full mb-2`}
                            >
                                {editingReservation ? "Save Changes" : "Add Reservation"}
                            </button>
                            {editingReservation && (
                                <button
                                    onClick={resetForm}
                                    className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                                        } w-full py-2 rounded-lg text-black mt-2`}
                                >
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>

                    <div
                        className={`${theme === "dark" ? "bg-gray-900" : "bg-white shadow-sm"
                            } p-6 rounded-lg w-full lg:w-2/3 overflow-y-auto`}
                        style={{
                            maxHeight: "calc(100vh - 140px)",
                        }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Reservations List</h2>
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                                    } py-2 px-4 rounded-lg`}
                            >
                                {showHistory ? "Show Active" : "Show History"}
                            </button>
                        </div>
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            theme={theme}
                        />
                        <ul className="space-y-4">
                            {filteredReservations.map((reservation) => (
                                <ReservationCard
                                    key={reservation.reservationId}
                                    roomNumber={reservation.roomNumber}
                                    guestName={guests[reservation.guestId]}
                                    reservedCheckInDate={reservation.reservedCheckInDate}
                                    reservedCheckOutDate={reservation.reservedCheckOutDate}
                                    checkoutDateTime={reservation.checkoutDateTime}
                                    onEdit={() => handleEditReservation(reservation)}
                                    onDelete={() => confirmDeleteReservation(reservation)}
                                    isCheckin={reservation.isCheckin === 1}
                                />
                            ))}
                        </ul>

                        {/*TODO: Integrate this into the page better*/}
                        <CalanderTimeLine></CalanderTimeLine>

                    </div>
                </div>

                <Popup
                    isOpen={deletePopupOpen}
                    onClose={() => setDeletePopupOpen(false)}
                    title="Confirm Delete"
                    theme={theme}
                >
                    <p>Are you sure you want to delete this reservation?</p>
                    <div className="flex justify-start mt-4">
                        <button
                            onClick={handleDeleteReservation}
                            className={`${theme === "dark" ? "bg-red-600" : "bg-blue-600"
                                } text-white py-2 px-4 rounded-lg mr-4`}
                        >
                            Yes, Delete
                        </button>
                        <button
                            onClick={() => setDeletePopupOpen(false)}
                            className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                                } text-black py-2 px-4 rounded-lg`}
                        >
                            Cancel
                        </button>
                    </div>
                </Popup>

                <Footer />
                <ToastContainer />
            </div>
        );
    };
}

export default Reservations;
