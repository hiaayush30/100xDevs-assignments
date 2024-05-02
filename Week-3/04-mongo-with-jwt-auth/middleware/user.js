const { User } = require("../db");
const jwt=require("jsonwebtoken");
const jwtPassword=require("../jwtPass");
async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    if(req.headers.authorization){
    const token=req.headers.authorization.split(" ")[1];
     if(jwt.decode(token).username && jwt.verify(token,jwtPassword)){
        req.headers.username=jwt.decode(token).username;
        next();
        return;
     }}
     res.status(403).json({
        msg:"Invalid Credentials!"
     })
}

module.exports = userMiddleware;