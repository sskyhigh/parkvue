const express = require('express')
const router = express.Router()
const cors = require('cors')
const {test, registerUser, loginUser, Profile, BookingDates} = require('../controllers/authControllers')
const UserInformation = require('../models/userModels')

// middleware
router.use(
    cors({
        /*to pause temp error
        * Network Error at XMLHttpRequest.handleError
        * */
        credentials: true,
        origin: 'http://localhost:3000',
    })
)

//
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", Profile);
router.get("/home", BookingDates);

module.exports = router