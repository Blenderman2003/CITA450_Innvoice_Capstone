import React, { useState, useEffect } from "react";
import Timeline from "react-calendar-timeline";
//import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import axios from "axios";

const RoomBookingTimeline = () => {
  const [groups, setGroups] = useState([]); // Room data
  const [items, setItems] = useState([]); // Booking records
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch room and booking data from the database
  const fetchData = async () => {
    try {
      const response = await axios.get("/routes/protected/reservations/allReservations"); // Replace with your API endpoint
      const data = response.data; // Assume data is an array of bookings

      // Extract unique rooms for the timeline groups
      const roomGroups = [
        ...new Map(data.map((booking) => [booking.roomNumber, { id: booking.roomNumber, title: `Room ${booking.roomNumber}` }])).values(),
      ];
      setGroups(roomGroups);

      // Transform bookings into timeline items
      const bookingItems = data.map((booking, index) => ({
        id: index + 1, // Unique ID for the item
        group: booking.roomNumber, // Room ID
        title: `Booking ${index + 1}`,
        start_time: moment(booking.reservedCheckInDate),
        end_time: moment(booking.reservedCheckOutDate),
      }));
      setItems(bookingItems);

      setLoading(false); // Set loading to false
    } catch (error) {
      console.error("Error fetching room bookings:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Room Booking Timeline</h1>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment().startOf("day").add(-12, "hour")} // Start of the day, 12 hours ago
        defaultTimeEnd={moment().startOf("day").add(12, "hour")}   // Start of the day, 12 hours ahead
        itemRenderer={({ item, getItemProps }) => (
          <div
            {...getItemProps({
              style: {
                backgroundColor: "rgba(0, 128, 255, 0.8)",
                color: "white",
                borderRadius: "4px",
                padding: "4px",
              },
            })}
          >
            {item.title}
          </div>
        )}
      />
    </div>
  );
};

export default RoomBookingTimeline;
