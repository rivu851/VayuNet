const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
dotenv.config();
const signToken = (
    (user)=>{
        return jwt.sign(
            {id: user.id, role: user.role}, //payload is expected to be json
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        )
    }
)

const verifyToken = (
    
    (token)=>{
        return jwt.verify(token, process.env.JWT_SECRET)   //returns id, role, iat, expiry
    }
)

module.exports = {signToken, verifyToken}