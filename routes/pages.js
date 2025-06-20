const express = require("express")
const router = express.Router()

router.get("/index", (req,res) => {
    res.render("index")
})

router.get("/login", (req,res) => {
    res.render("login")
})

router.get("/dashboard", (req,res) => {
    res.render("dashboard")
})

router.get("/complaints", (req,res) => {
    res.render("admin")
})

module.exports = router