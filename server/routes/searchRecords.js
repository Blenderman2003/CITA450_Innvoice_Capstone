import express from "express";
import db from "../db/connection.js";

const router = express.Router();

// Endpoint to search checked-out guests (not checked in yet)
router.get("/checkout/checkedout", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const [results] = await db.query(
      `
      SELECT g.guestId, CONCAT(g.firstName, ' ', g.lastName) AS name, g.email, g.phone,
             r.reservationId, r.roomNumber, r.reservedCheckInDate, r.reservedCheckOutDate, r.checkinDateTime, r.isCheckin
      FROM Guest g
      LEFT JOIN Reservation r ON g.guestId = r.guestId
      WHERE (g.firstName LIKE ? OR g.lastName LIKE ? OR g.email LIKE ? OR g.phone LIKE ?
             OR r.reservationId LIKE ? OR r.roomNumber LIKE ?)
        AND (r.isCheckin = 0 OR r.isCheckin IS NULL)
    `,
      [
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
      ]
    );

    console.log("Checked-out Guests Results:", results);

    res.json(results);
  } catch (error) {
    console.error("Error fetching checked-out guests:", error);
    res.status(500).json({ error: "An error occurred while fetching checked-out guests" });
  }
});

// Endpoint to search checked-in guests
router.get('/checkout/checkedin', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const [results] = await db.query(
      `
      SELECT g.guestId, CONCAT(g.firstName, ' ', g.lastName) AS name, g.email, g.phone,
             r.reservationId, r.roomNumber, r.reservedCheckInDate, r.checkinDateTime, r.checkoutDateTime
      FROM Guest g
      LEFT JOIN Reservation r ON g.guestId = r.guestId
      WHERE (g.firstName LIKE ? OR g.lastName LIKE ? OR g.email LIKE ? OR g.phone LIKE ?
             OR r.reservationId LIKE ? OR r.roomNumber LIKE ?)
        AND r.isCheckin = 1
        AND r.checkoutDateTime IS NULL
      `,
      [
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
      ]
    );

    res.json(results);
  } catch (error) {
    console.error('Error fetching checked-in guests:', error);
    res.status(500).json({ error: 'An error occurred during the search' });
  }
});


export default router;
