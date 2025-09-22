import express from 'express';
import db from '../db/connection.js';

const router = express.Router();

router.post('/checkin', async (req, res) => {
  const { reservationId } = req.body;

  if (!reservationId) {
    return res.status(400).json({ error: 'Reservation ID is required' });
  }

  try {
    // Check if the reservation exists and has not already been checked in
    const [reservationRows] = await db.query(
      `SELECT isCheckin, roomNumber, checkinDateTime FROM Reservation WHERE reservationId = ?`,
      [reservationId]
    );

    if (reservationRows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const { isCheckin, roomNumber, checkinDateTime } = reservationRows[0];
    if (isCheckin === 1) {
      return res.status(400).json({ error: 'This reservation has already been checked in', checkinDateTime });
    }

    // Proceed with the check-in
    const nowUTC = new Date().toISOString().slice(0, 19).replace('T', ' '); // MySQL timestamp format (UTC)

    // Update the reservation's check-in status
    const [updateReservationResult] = await db.query(
      `UPDATE Reservation
       SET isCheckin = 1, checkinDateTime = ?
       WHERE reservationId = ?`,
      [nowUTC, reservationId]
    );

    if (updateReservationResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Update the room status to "occupied"
    const [updateRoomResult] = await db.query(
      `UPDATE Room
       SET status = 'occupied'
       WHERE roomNumber = ?`,
      [roomNumber]
    );

    if (updateRoomResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Convert UTC to EST
    const nowEST = new Date(nowUTC).toLocaleString("en-US", {
      timeZone: "America/New_York",
    });

    res.json({
      success: true,
      message: 'Check-in successful',
      checkinDateTime: nowEST, // Send the check-in time in EST to the frontend
    });
  } catch (error) {
    console.error('Error during check-in:', error);
    res.status(500).json({ error: 'An error occurred during check-in' });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        r.reservationId,
        r.roomNumber,
        r.checkinDateTime,
        r.reservedCheckInDate,
        r.reservedCheckOutDate,
        r.numberOfGuests,
        g.firstName AS guestFirstName,
        g.lastName AS guestLastName,
        g.email AS guestEmail,
        g.phone AS guestPhone
      FROM Reservation r
      INNER JOIN Guest g ON r.guestId = g.guestId
      WHERE r.isCheckin = 1
      ORDER BY r.checkinDateTime DESC
      LIMIT 10
    `);

    const recentCheckins = rows.map((row) => ({
      reservationId: row.reservationId,
      roomNumber: row.roomNumber,
      checkInTime: row.checkinDateTime,
      reservedCheckInTime: row.reservedCheckInDate,
      reservedCheckOutTime: row.reservedCheckOutDate,
      numberOfGuests: row.numberOfGuests,
      name: `${row.guestFirstName} ${row.guestLastName}`,
      email: row.guestEmail,
      phoneNumber: row.guestPhone,
    }));

    res.json(recentCheckins);
  } catch (error) {
    console.error('Error fetching recent check-ins:', error);
    res.status(500).json({ error: 'Failed to fetch recent check-ins' });
  }
});

export default router;