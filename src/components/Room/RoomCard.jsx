// RoomCard.jsx
// Now only responsible for displaying room details and rendering the new button components.

import React from 'react';
import roomIcon from '../../assets/images/roomicon.png';
import { getStatusLight } from '../../utils/roomUtils.js';
import UpdateRoomButton from './UpdateRoomButton.jsx';
import RoomStatusButton from './RoomStatusButton.jsx';
import { Link } from 'react-router-dom';


    const RoomCard = ({ room, theme, handleStatusChange }) => {
        const getGlowColor = (status) => {
            switch (status) {
                case 'available':
                    return 'shadow-green-600';
                case 'occupied':
                    return 'shadow-yellow-600';
                case 'maintenance':
                    return 'shadow-red-600';
                default:
                    return 'shadow-gray-600';
            }
        };

        return (
            <div className="flex items-center border p-4 rounded-lg shadow-lg">
                <img src={roomIcon} alt="Room Icon" className="w-16 h-16 mr-4" />

                <div className="flex-grow">
                    <div className="flex items-center">
                        <p className="text-xl font-bold">Room: {room.roomNumber}</p>
                        <img
                            src={getStatusLight(room.status.toLowerCase())}
                            alt="Status Light"
                            className={`w-3 h-3 ml-1 mb-3 ${getGlowColor(room.status.toLowerCase())} shadow-md rounded-full`}
                        />
                    </div>
                    <p>Status: {room.status.charAt(0).toUpperCase() + room.status.slice(1)}</p>
                    <p>Type: {room.description || (room.isSuite === 0 ? 'Normal' : 'Suite')}</p>
                    <p>Beds: {room.numberOfBeds || 'N/A'}</p>
                    <p>Nightly Rate: ${room.nightlyRate ? parseFloat(room.nightlyRate).toFixed(2) : 'N/A'}</p>
                    <p>Upcoming Reservation: {room.reservation ?
                        `${new Date(room.reservation.checkInDate).toLocaleDateString()} - ${new Date(room.reservation.checkOutDate).toLocaleDateString()}`
                        : 'None'}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2">
                    <UpdateRoomButton theme={theme} room={room} handleStatusChange={handleStatusChange} />
                    <RoomStatusButton theme={theme} room={room} handleStatusChange={handleStatusChange} />
                    <Link
                        to="/reservations"
                        state={{ room }}
                        className={`${theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-500 text-white hover:bg-blue-600'} p-1.5 rounded-lg text-center`}
                    >
                        Reservation
                    </Link>
                </div>
            </div>
        );
    };

    export default RoomCard;