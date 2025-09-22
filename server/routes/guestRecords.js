
import express from 'express';
const router = express.Router();

// This will connect to the database (REQUIRED!!!!!)
import pool from "../db/connection.js";

// Get all guests
router.post('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM Guest'
    const [results] = await pool.query(query);
    res.status(200).json(results); // Return all reservations as JSON
  } catch (err) {
    console.error('Error fetching data from Guest table:', err);
    res.status(500).json({ message: 'Database error' });
}
});

// Add a guest
router.post('/newguest', async (req, res) => {
  const { firstName, lastName, phone, email } = req.body; // Access guestId from request body

  if (!email) {
      return res.status(400).json({ message: 'email is required' });
  }

  const query = 'INSERT INTO Guest (firstName, lastName, phone, email) VALUES (?, ?, ?, ?)';
  
  try {
      const [results] = await pool.query(query, [firstName, lastName, phone, email]);
      if (results.affectedRows > 0) {
          res.status(200).json({  firstName, lastName, phone, email }); // Return the new guest data
      } else {
          res.status(404).json({ message: 'Guest not found' });
      }
  } catch (error) {
      console.error('Error adding guest in database:', error);
      res.status(500).json({ message: 'Database error' });
  }
});

// Delete a guest
router.delete('/delete', async (req, res) => {
  console.log(req)
    const { guestId } = req.body; // Access guestId from request body

    if (!guestId) {
        return res.status(400).json({ message: 'Guest ID is required' });
    }

    try {
        const query = 'DELETE FROM Guest WHERE guestID = ?';
        const [result] = await pool.query(query, [guestId]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Guest deleted successfully' });
        } else {
            res.status(404).json({ message: 'Guest not found' });
        }
    } catch (err) {
        console.error('Error deleting guest from Guest table:', err);
        res.status(500).json({ message: 'Database error' });
    }
});

// Delete a guest
router.put('/edit', async (req, res) => {
    const { guestId, firstName, lastName, phone, email } = req.body; // Access guestId from request body

    if (!guestId) {
        return res.status(400).json({ message: 'Guest ID is required' });
    }

    const query = 'UPDATE Guest SET firstName = ?, lastName = ?, phone = ?, email = ? WHERE guestID = ?';
    
    try {
        const [results] = await pool.query(query, [firstName, lastName, phone, email, guestId]);
        if (results.affectedRows > 0) {
            res.status(200).json({ guestId, firstName, lastName, phone, email }); // Return the updated guest data
        } else {
            res.status(404).json({ message: 'Guest not found' });
        }
    } catch (error) {
        console.error('Error updating guest in database:', error);
        res.status(500).json({ message: 'Database error' });
    }
});

export default router;
