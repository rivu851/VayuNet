const {signToken, verifyToken} = require("../utils/jwt")
const { supabase } = require("../config/db");

const isprotected = (
    (req,res,next)=>{
        try{
            let token;
            if(req.cookies && req.cookies.token){
                token=req.cookies.token
            }
            else if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
                token = req.headers.authorization.split(" ")[1];
            }
            if(!token){
               return res.status(400).json({
                    message: "no token found, access denied"
                })
            }
            const VerifiedToken = verifyToken(token)
            
            req.user = {userId: VerifiedToken.id, role: VerifiedToken.role}    // the user._id
            next()
        }
        catch(err){
            return res.status(401).json({
                message: "not authorised"
            })
        }
    }
)


const authoriseRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {     //req.user.role from isprotected middleware
      return res.status(403).json({
        message: "Forbidden: insufficient permissions",
      });
    }
    next();
  };
};

module.exports = {isprotected, authoriseRoles}