import express from "express";
import dotenv from 'dotenv';
// Authentication with tokens
import { CreateAccessToken, CreateRefreshToken, SendAccessToken, SendRefreshToken, verifyToken } from '../../src/tokens.js';
import IsAuth from '../../src/isAuth.js';
import guestRoutes from './guestRecords.js';
import reservationRoutes from './reservationRecords.js'

dotenv.config();

//const [user, setUser] = useState(UserContext);

// This will help us connect to the database


// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// Apply IsAuth middleware to all routes under this router
router.all('*', IsAuth, (req, res, next) => {
    // This will run after IsAuth middleware
    // You can add any additional logic here if needed
    next(); // Call next() to proceed to the next middleware/route handler
});

// VERY IMPORTANT!!!
// This needs to be added to the axios header to access these records
//headers: {
//    'Authorization': `Bearer ${user.accessToken}`
//}
// You need this structure: route, {}, header
// Example
// await axios.post('/routes/protected/test', {}, {
//    headers: {
//        'Authorization': `Bearer ${user.accessToken}`
//    }
//});

// NVM made a function to handle it

router.use("/guests", guestRoutes);
router.use("/reservations", reservationRoutes)

export default router;
