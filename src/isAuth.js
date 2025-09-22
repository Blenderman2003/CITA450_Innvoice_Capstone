import jwt from 'jsonwebtoken';

export const IsAuth = (req, res, next) => {
    try {
        const authorization = req.headers["authorization"];
        //console.log(req.headers);
        if (!authorization) {
            return res.status(401).json({ message: "User is not authenticated." });
        }

        // Extract the token from the 'Bearer <token>' format
        const token = authorization.split(' ')[1];
        const { userID } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Attach userID to req object for access in other routes
        req.userID = userID;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token." });
    }
};

// Middleware function to verify if the user is authenticated
/*export const IsAuth = req => {
    console.log(req.headers); // Log request headers for debugging purposes
    const authorization = req.headers["authorization"]; // Retrieve the authorization header
    if (!authorization) throw new Error("User is not authenticated. " + authorization); // If no authorization header, throw an error
    // Header format: 'Bearer <token>'
    const [bearer, token] = authorization.split(' ')[1];
    const { userID } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify the JWT token with the secret
    return userID; // Return the user ID if verified
}*/

export default IsAuth;
