// roomRecords.js
// Backend route definitions for handling room data, including fetching room details with room type and reservation information,
// updating room status, adding new rooms, and deleting rooms. Room type management has been moved to roomTypeRecords.js.

import dotenv from 'dotenv';
import express from 'express';
const router = express.Router();
dotenv.config();

// Connect to the database
import pool from "../db/connection.js";

/**
 * Route: GET /routes/rooms
 * Purpose: Fetch all rooms without reservation or room type details.
 * Returns a basic list of room data.
 */
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM Room';
    const [results] = await pool.query(query);
    res.status(200).json(results); // Return all rooms as JSON
  } catch (err) {
    console.error('Error fetching data from room table:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

/**
 * Route: GET /routes/rooms/with-reservations
 * Purpose: Fetch rooms with additional details, including room type and reservation data.
 */
router.get('/with-reservations', async (req, res) => {
  try {
    const query = `
      SELECT 
        Room.roomNumber, 
        Room.roomTypeCode, 
        Room.status AS initialStatus,
        RoomType.numberOfBeds, 
        RoomType.nightlyRate,
        RoomType.isSuite,
        RoomType.description,
        Reservation.reservedCheckInDate, 
        Reservation.reservedCheckOutDate,
        CASE 
          WHEN CURRENT_DATE() BETWEEN Reservation.reservedCheckInDate AND Reservation.reservedCheckOutDate 
          THEN 'occupied' 
          ELSE Room.status 
        END AS roomStatus
      FROM Room
      LEFT JOIN RoomType 
        ON Room.roomTypeCode = RoomType.roomTypeCode
      LEFT JOIN Reservation 
        ON Room.roomNumber = Reservation.roomNumber
        AND (Reservation.reservedCheckInDate >= CURRENT_DATE() 
             OR (Reservation.reservedCheckInDate <= CURRENT_DATE() 
                 AND Reservation.reservedCheckOutDate >= CURRENT_DATE()))
      WHERE Reservation.reservedCheckInDate IS NULL 
         OR Reservation.reservedCheckInDate = (
           SELECT MIN(reservedCheckInDate)
           FROM Reservation
           WHERE Room.roomNumber = Reservation.roomNumber
           AND reservedCheckInDate >= CURRENT_DATE()
         )
    `;
    
    const [rooms] = await pool.query(query);

    const roomsWithDetails = rooms.map(room => ({
      roomNumber: room.roomNumber,
      roomTypeCode: room.roomTypeCode,
      numberOfBeds: room.numberOfBeds,
      nightlyRate: room.nightlyRate,
      isSuite: room.isSuite,
      description: room.description,
      status: room.roomStatus,
      reservation: room.reservedCheckInDate ? { reservedCheckInDate: room.reservedCheckInDate, reservedCheckOutDate: room.reservedCheckOutDate } : null
    }));

    res.status(200).json(roomsWithDetails);
  } catch (err) {
    console.error('Error fetching rooms with details:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

/**
 * Route: PUT /routes/rooms/update-status
 * Purpose: Update the status of a specific room.
 */
router.put('/update-status', async (req, res) => {
  const { roomNumber, status } = req.body;

  try {
    const query = 'UPDATE Room SET status = ? WHERE roomNumber = ?';
    const [result] = await pool.query(query, [status, roomNumber]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Room status updated successfully' });
  } catch (err) {
    console.error('Error updating room status:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

/**
 * Route: POST /routes/rooms/add
 * Purpose: Add a new room to the database.
 */
router.post('/add', async (req, res) => {
  const { roomNumber, roomTypeCode, status } = req.body;

  try {
    const query = 'INSERT INTO Room (roomNumber, roomTypeCode, status) VALUES (?, ?, ?)';
    await pool.query(query, [roomNumber, roomTypeCode, status]);
    res.status(201).json({ message: 'Room added successfully' });
  } catch (err) {
    console.error('Error adding room:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

/**
 * Route: DELETE /routes/rooms/:roomNumber
 * Purpose: Delete a room from the database.
 */
router.delete('/:roomNumber', async (req, res) => {
  const { roomNumber } = req.params;

  try {
    const query = 'DELETE FROM Room WHERE roomNumber = ?';
    const [result] = await pool.query(query, [roomNumber]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (err) {
    console.error('Error deleting room:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

/**
 * Route: PUT /routes/rooms/update
 * Purpose: Update room details.
 */
router.put('/update', async (req, res) => {
  const { roomNumber, roomTypeCode, status } = req.body;

  try {
    const query = `
      UPDATE Room
      SET roomTypeCode = ?, status = ?
      WHERE roomNumber = ?
    `;
    const [result] = await pool.query(query, [roomTypeCode, status, roomNumber]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Room details updated successfully' });
  } catch (err) {
    console.error('Error updating room details:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

export default router;