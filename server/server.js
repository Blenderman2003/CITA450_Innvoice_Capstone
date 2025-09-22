import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Import route files
import records from './routes/records.js';
import searchRecords from './routes/searchRecords.js';
import checkin from './routes/checkin.js'; // Import the checkin route
import checkoutRoutes from './routes/checkout.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Mount routes
app.use("/routes", records);
app.use("/routes", searchRecords);
app.use("/routes", checkin); // Mount the checkin route
app.use('/routes/checkin', checkin);
app.use('/routes/checkout', checkoutRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});