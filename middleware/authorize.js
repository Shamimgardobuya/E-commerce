const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken (req, res, next) {
    const token = req.cookies.token;
    try {
        if (!token) {
            return res.status(403).json({message: 'No token provided'});
        }
    
        jwt.verify(token, process.env.JWT_SECRET, ( err, decoded) => {
            if (err) {
                return res.redirect('/login')    
            }
            req.user = decoded;
            next()
        })
    } catch (error) {
        res.clearCookie('token');
    }

}

module.exports = verifyToken;