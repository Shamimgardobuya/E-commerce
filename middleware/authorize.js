const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken (req, res, next) {
    let bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        return res.status(403).json({message: 'No token provided'});
    }

    const bearer = bearerHeader.split(" ")[1];
    jwt.verify(bearer, process.env.JWT_SECRET, ( err, decoded) => {
        if (err) {
            return res.status(403).json( { message : 'Invalid token'});

        }
        req.body.userId = decoded.id;
        // console.log('Decoded token:', decoded);
        next()
    })
}

module.exports = verifyToken;