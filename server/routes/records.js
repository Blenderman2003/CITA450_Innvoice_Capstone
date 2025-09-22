// records.js
// Main router file that combines all sub-routes for the application

import express from "express";
// Import the records files
import userRecords from './userRecords.js';
import protectedRecords from './protectedRecords.js';
import tokenRecords from './tokenRecords.js';
import roomRoutes from './roomRecords.js';
import reservationRoutes from './reservationRecords.js';
import roomTypeRoutes from './roomTypeRecords.js'; // Import roomTypeRecords for room types management

const router = express.Router();

// Use the imports with ('/subdomain', import);
router.use('/users', userRecords);
router.use('/tokens', tokenRecords);

// Public routes that can be accessed without authentication
router.use("/rooms", roomRoutes);
router.use("/reservations", reservationRoutes);
router.use("/roomtypes", roomTypeRoutes); // Add room types route here

// Routes that require authentication are handled in ./protectedRecords.js
router.use('/protected', protectedRecords);

export default router;
