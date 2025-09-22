import axios from "axios";

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
    };

    // EST formatter
    const estFormatter = new Intl.DateTimeFormat("en-US", {
      ...options,
      timeZone: "America/New_York",
    });

    // UTC formatter
    const utcFormatter = new Intl.DateTimeFormat("en-US", {
      ...options,
      timeZone: "UTC",
    });

    const estFormatted = estFormatter.format(date);
    const utcFormatted = utcFormatter.format(date);

    return `${estFormatted} (UTC: ${utcFormatted})`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

export const fetchAllOptions = async () => {
  try {
    const response = await axios.get(`/routes/search?query=`);

    return response.data.filter((item) => item.isCheckin !== 1).map((item) => ({
      ...item,
      reservedCheckInDate: formatDateTime(item.reservedCheckInDate), // Use updated formatting
    }));
  } catch (error) {
    console.error("Error fetching all options:", error);
    return [];
  }
};

export const loadSearchOptions = async (inputValue) => {
  try {
    const response = await axios.get(`/routes/search?query=${inputValue}`);
    const results = response.data;

    return results.map((item) => ({
      value: item.reservationId,
      label: `${item.name} | ${item.email} | ${item.phone} | Room ${item.roomNumber} | Reservation ${item.reservationId}`,
      guestName: item.name,
      email: item.email,
      phoneNumber: item.phone,
      reservationId: item.reservationId,
      roomNumber: item.roomNumber,
      reservedCheckInDate: formatDateTime(item.reservedCheckInDate), // Use updated formatting
      isCheckin: item.isCheckin,
    }));
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};

export const fetchRecentCheckIns = async () => {
  try {
    const response = await axios.get(`/routes/checkin/recent`);
    return response.data.map((item) => ({
      ...item,
      reservedCheckInTime: formatDateTime(item.reservedCheckInTime), // Use updated formatting
      reservedCheckOutTime: formatDateTime(item.reservedCheckOutTime), // Use updated formatting
    }));
  } catch (error) {
    console.error("Error fetching recent check-ins:", error);
    return [];
  }
};

export const fetchRecentCheckOuts = async () => {
  try {
    const response = await axios.get(`/routes/checkout/recent`);
    return response.data.map((item) => ({
      ...item,
      reservedCheckInTime: formatDateTime(item.reservedCheckInTime), // Use updated formatting
      reservedCheckOutTime: formatDateTime(item.reservedCheckOutTime), // Use updated formatting
    }));
  } catch (error) {
    console.error("Error fetching recent check-ins:", error);
    return [];
  }
};

// Fetch guests who have not been checked in
export const fetchCheckedOutGuests = async (inputValue) => {
  try {
    const response = await axios.get(`/routes/checkout/checkedout?query=${inputValue}`);
    const results = response.data;

    return results
      .filter((item) => item.isCheckin !== 1) // Only guests who are not checked in
      .map((item) => ({
        value: item.reservationId,
        label: `${item.name} | ${item.email} | ${item.phone} | Room ${item.roomNumber} | Reservation ${item.reservationId}`,
        guestName: item.name,
        email: item.email,
        phoneNumber: item.phone,
        reservationId: item.reservationId,
        roomNumber: item.roomNumber,
        reservedCheckInDate: formatDateTime(item.reservedCheckInDate), // Format reserved check-in time
      }));
  } catch (error) {
    console.error("Error fetching checked-out guests:", error);
    return [];
  }
};

// Fetch guests who are already checked in
export const fetchCheckedInGuests = async (inputValue) => {
  try {
    const response = await axios.get(
      `/routes/checkout/checkedin${inputValue ? `?query=${inputValue}` : ""}`
    );
    const results = response.data;

    return results.map((item) => ({
      value: item.reservationId,
      label: `${item.name} | Room ${item.roomNumber}`,
      guestName: item.name,
      roomNumber: item.roomNumber,
      reservationId: item.reservationId,
      checkInTime: formatDateTime(item.checkinDateTime), // Format check-in time
    }));
  } catch (error) {
    console.error("Error fetching checked-in guests:", error);
    return [];
  }
};