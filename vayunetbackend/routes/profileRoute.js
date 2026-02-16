const express = require("express")
const router = express.Router()

const viewProfile = require("../controllers/profileController")
const {isprotected, authoriseRoles} = require("../middleware/authMiddleware")

router.get("/me", isprotected, authoriseRoles("user"),  viewProfile)

module.exports = router