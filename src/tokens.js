import jwt from 'jsonwebtoken';

export const CreateAccessToken = (userID, roleId) => {
    const payload = {
        "ID": userID,
        "Role": roleId
        //role: 'admin'
    };

    console.log('Access Token Payload:', payload);
    // Create token using the payload, token secret, set it to expire in 15 min (2 hours for now because i really cant be bothered making it work how i want rn)
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '2h'});
};


export const CreateRefreshToken = (userID, roleId) => {
    const payload = {
        "ID": userID,
        "Role": roleId
        //role: 'admin'
        // version: i     // Value that increments with every new refresh token given so you cannot use a previous token.
    };

    console.log('Refresh Token Payload:', payload);
    // Create token using the payload, token secret, set it to expire in 7 days
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
};

export const SendAccessToken = (res, accessToken) => {
    res.send({
        accessToken: accessToken//,
        //email: req.body.email
    });
};

export const SendRefreshToken = (res, refreshToken) => {
    // Named something secret so its harder to spoof. for testing make it easilly findable.
    // Revoke cookie then give again.
    //if (req.cookies.refreshToken) {
    //    res.clearCookie('refreshToken');
    //}
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        //path: 'routes/tokens/refresh_token',
        sameSite: 'None',  // Allow cross-site cookies
        secure: true       // Ensures cookies are sent over HTTPS
    })
};

export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userID = decoded.userID;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
