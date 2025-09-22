import express from 'express';
import db from '../db/connection.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { reservationId } = req.body;

  if (!reservationId) {
    return res.status(400).json({ error: 'Reservation ID is required' });
  }

  try {
    // Check if the reservation exists and has been checked in
    const [reservationRows] = await db.query(
      `SELECT isCheckin, roomNumber FROM Reservation WHERE reservationId = ?`,
      [reservationId]
    );

    if (reservationRows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const { isCheckin, roomNumber } = reservationRows[0];
    if (isCheckin !== 1) {
      return res.status(400).json({ error: 'This reservation has not been checked in' });
    }

    const nowUTC = new Date().toISOString().slice(0, 19).replace('T', ' '); // MySQL timestamp format

    // Update the reservation with the checkout time
    const [updateResult] = await db.query(
      `UPDATE Reservation
       SET checkoutDateTime = ?
       WHERE reservationId = ?`,
      [nowUTC, reservationId]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Failed to update the reservation' });
    }

    // Update the room status
    await db.query(
      `UPDATE Room
       SET status = 'maintenance'
       WHERE roomNumber = ?`,
      [roomNumber]
    );

    const nowEST = new Date(nowUTC).toLocaleString("en-US", {
      timeZone: "America/New_York",
    });

    res.json({
      success: true,
      message: 'Check-out successful',
      checkoutDateTime: nowEST, // Send the checkout time in EST
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'An error occurred during check-out' });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        r.reservationId,
        r.roomNumber,
        r.checkinDateTime,
        r.checkoutDateTime,
        r.reservedCheckInDate,
        r.reservedCheckOutDate,
        r.numberOfGuests,
        g.firstName AS guestFirstName,
        g.lastName AS guestLastName,
        g.email AS guestEmail,
        g.phone AS guestPhone
      FROM Reservation r
      INNER JOIN Guest g ON r.guestId = g.guestId
      WHERE r.checkoutDateTime IS NOT NULL
      ORDER BY r.checkoutDateTime DESC
      LIMIT 10
    `);

    const recentCheckouts = rows.map((row) => ({
      reservationId: row.reservationId,
      roomNumber: row.roomNumber,
      checkInTime: row.checkinDateTime,
      checkOutTime: row.checkoutDateTime,
      reservedCheckInTime: row.reservedCheckInDate,
      reservedCheckOutTime: row.reservedCheckOutDate,
      numberOfGuests: row.numberOfGuests,
      name: `${row.guestFirstName} ${row.guestLastName}`,
      email: row.guestEmail,
      phoneNumber: row.guestPhone,
    }));

    res.json(recentCheckouts);
  } catch (error) {
    console.error('Error fetching recent check-outs:', error);
    res.status(500).json({ error: 'Failed to fetch recent check-outs' });
  }
});


export default router;
