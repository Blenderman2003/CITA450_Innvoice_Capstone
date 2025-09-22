// roomTypeRecords.js
// This routes file handles all CRUD operations for room types in the database
// Endpoints include fetching, adding, updating, and deleting room types

import express from 'express';
import pool from '../db/connection.js'; // Database connection

const router = express.Router();

// GET /roomtypes - Fetch all room types
router.get('/', async (req, res) => {
  try {
    const [roomTypes] = await pool.query('SELECT * FROM RoomType');
    res.status(200).json(roomTypes);
  } catch (error) {
    console.error('Error fetching room types:', error);
    res.status(500).json({ message: 'Failed to retrieve room types' });
  }
});

// POST /roomtypes/add - Add a new room type
router.post('/add', async (req, res) => {
  const { roomTypeCode, description, nightlyRate, numberOfBeds, isSuite } = req.body;

  try {
    await pool.query(
      'INSERT INTO RoomType (roomTypeCode, description, nightlyRate, numberOfBeds, isSuite) VALUES (?, ?, ?, ?, ?)',
      [roomTypeCode, description, nightlyRate, numberOfBeds, isSuite]
    );
    res.status(201).json({ message: 'Room type added successfully' });
  } catch (error) {
    console.error('Error adding room type:', error);
    res.status(500).json({ message: 'Failed to add room type' });
  }
});

// PUT /roomtypes/update - Update an existing room type
router.put('/update', async (req, res) => {
  const { roomTypeCode, description, nightlyRate, numberOfBeds, isSuite } = req.body;

  try {
    await pool.query(
      'UPDATE RoomType SET description = ?, nightlyRate = ?, numberOfBeds = ?, isSuite = ? WHERE roomTypeCode = ?',
      [description, nightlyRate, numberOfBeds, isSuite, roomTypeCode]
    );
    res.status(200).json({ message: 'Room type updated successfully' });
  } catch (error) {
    console.error('Error updating room type:', error);
    res.status(500).json({ message: 'Failed to update room type' });
  }
});

// DELETE /roomtypes/delete/:roomTypeCode - Delete a specific room type
router.delete('/delete/:roomTypeCode', async (req, res) => {
  const { roomTypeCode } = req.params;

  try {
    await pool.query('DELETE FROM RoomType WHERE roomTypeCode = ?', [roomTypeCode]);
    res.status(200).json({ message: 'Room type deleted successfully' });
  } catch (error) {
    console.error('Error deleting room type:', error);
    res.status(500).json({ message: 'Failed to delete room type' });
  }
});

export default router;