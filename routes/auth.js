const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth")

router.post("/login", authController.login)
router.post("/dashboard", authController.complaints)
router.get("/dashboard", authController.admin)
router.delete("/dashboard/:id",authController.deleteComplaint)

module.exports = router