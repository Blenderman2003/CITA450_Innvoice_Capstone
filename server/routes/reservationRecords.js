// reservationRecords.js
// Manages reservation-related routes, including CRUD operations for reservations and guest data specific to reservations

import dotenv from "dotenv";
import express from "express";
const router = express.Router();
dotenv.config();
import pool from "../db/connection.js";

// Get all reservations
router.get("/allReservations", async (req, res) => {
  try {
    const query = "SELECT * FROM Reservation ORDER BY reservationId DESC";
    const [results] = await pool.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// Add a new reservation
router.post("/setReservation", async (req, res) => {
  try {
    const {
      roomNumber,
      guestId,
      reservedCheckInDate,
      reservedCheckOutDate,
      numberOfGuests,
    } = req.body;
    const query =
      "INSERT INTO Reservation (roomNumber, guestId, reservedCheckInDate, reservedCheckOutDate, numberOfGuests) VALUES (?, ?, ?, ?, ?)";
    const [results] = await pool.query(query, [
      roomNumber,
      guestId,
      reservedCheckInDate,
      reservedCheckOutDate,
      numberOfGuests,
    ]);
    res
      .status(200)
      .json({ message: "Reservation added successfully", id: results.insertId });
  } catch (err) {
    console.error("Error adding reservation:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// GET: Fetch all guests (for dropdown or other selection needs)
router.get("/allGuests", async (req, res) => {
  try {
    const query =
      "SELECT guestId, firstName, lastName FROM Guest ORDER BY lastName";
    const [results] = await pool.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching guests:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// POST: Add a new guest to the database
router.post("/addGuest", async (req, res) => {
  const { firstName, lastName, phone, email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const query =
      "INSERT INTO Guest (firstName, lastName, phone, email) VALUES (?, ?, ?, ?)";
    const [results] = await pool.query(query, [
      firstName,
      lastName,
      phone,
      email,
    ]);
    res
      .status(200)
      .json({ message: "Guest added successfully", guestId: results.insertId });
  } catch (err) {
    console.error("Error adding guest:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// PUT: Update an existing guest's information
router.put("/updateGuest", async (req, res) => {
  const { guestId, firstName, lastName, phone, email } = req.body;
  if (!guestId)
    return res.status(400).json({ message: "Guest ID is required" });

  try {
    const query =
      "UPDATE Guest SET firstName = ?, lastName = ?, phone = ?, email = ? WHERE guestId = ?";
    const [results] = await pool.query(query, [
      firstName,
      lastName,
      phone,
      email,
      guestId,
    ]);
    if (results.affectedRows > 0) {
      res.status(200).json({ message: "Guest updated successfully" });
    } else {
      res.status(404).json({ message: "Guest not found" });
    }
  } catch (err) {
    console.error("Error updating guest:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// DELETE: Remove a guest from the database
router.delete("/deleteGuest", async (req, res) => {
  const { guestId } = req.body;
  if (!guestId)
    return res.status(400).json({ message: "Guest ID is required" });

  try {
    const query = "DELETE FROM Guest WHERE guestId = ?";
    const [results] = await pool.query(query, [guestId]);
    if (results.affectedRows > 0) {
      res.status(200).json({ message: "Guest deleted successfully" });
    } else {
      res.status(404).json({ message: "Guest not found" });
    }
  } catch (err) {
    console.error("Error deleting guest:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// DELETE: Remove a reservation
router.delete("/deleteReservation/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: "Reservation ID is required" });

  try {
    const query = "DELETE FROM Reservation WHERE reservationId = ?";
    const [results] = await pool.query(query, [id]);
    if (results.affectedRows > 0) {
      res.status(200).json({ message: "Reservation deleted successfully" });
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// PUT: Update an existing reservation
router.put("/updateReservation/:id", async (req, res) => {
  const { id } = req.params;
  const {
    roomNumber,
    guestId,
    reservedCheckInDate,
    reservedCheckOutDate,
    numberOfGuests,
  } = req.body;
  if (!id)
    return res.status(400).json({ message: "Reservation ID is required" });

  try {
    const query = `
      UPDATE Reservation
      SET roomNumber = ?, guestId = ?, reservedCheckInDate = ?, reservedCheckOutDate = ?, numberOfGuests = ?
      WHERE reservationId = ?
    `;
    const [results] = await pool.query(query, [
      roomNumber,
      guestId,
      reservedCheckInDate,
      reservedCheckOutDate,
      numberOfGuests,
      id,
    ]);
    if (results.affectedRows > 0) {
      res.status(200).json({ message: "Reservation updated successfully" });
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (err) {
    console.error("Error updating reservation:", err);
    res.status(500).json({ message: "Database error" });
  }
});

export default router;
