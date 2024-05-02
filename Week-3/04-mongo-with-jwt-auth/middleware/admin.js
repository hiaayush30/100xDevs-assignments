// Middleware for handling auth
const { Admin } = require("../db");
const jwt = require("jsonwebtoken");
const jwtPassword = require("../jwtPass");
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            if (jwt.verify(token, jwtPassword)) {
                console.log(jwt.verify(token,jwtPassword));
                next();
                return;
            }
        } catch (e) {
            res.status(403).json({
                msg: "Invalid Credentials!"
            })
        }
    }
}

module.exports = adminMiddleware;