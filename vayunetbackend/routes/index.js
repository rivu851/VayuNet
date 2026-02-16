const authRoutes = require("./authRoutes")
const profileRoutes = require("./profileRoute")

const registerRoutes = (app)=>{
    app.use("/api/auth", authRoutes)
    app.use("/api", profileRoutes)
    
}

module.exports = registerRoutes