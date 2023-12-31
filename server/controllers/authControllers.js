const UserInformation = require('../models/userModels')
const {hashPassword, comparePassword} = require('../helpers/auth')
const jwt = require('jsonwebtoken')
const BookingInfo = require('../models/Booking')
const test = (req, res) => {
    res.json('(From authControllers) test is working')
}

// registering endpoint
const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        //Checks if name is entered
        if (!name) {
            return res.json({
                error: 'name is required'
            })
        }
        // password strength
        if (!password || password.length < 6) {
            return res.json({
                error: 'Password is required, should be at least 6 characters long'
            })
        }
        //check if email exists in database
        const exist = await UserInformation.findOne({email});
        if (exist) {
            res.json({
                error: "email has been taken. Please use another one"
            })
        }
        const hashedPassword = await hashPassword(password)

        // creates an object
        const createUser = await UserInformation.create({
            name,
            email,
            password: hashedPassword,
        })
        // returns back 
        return res.json(createUser)
    } catch (error) {
        console.log("authController error: " + error)
    }
}

/*
req, res. not the other way around
*/
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        /*This tries to find the user inside the mongoDB database*/
        const user = await UserInformation.findOne({email});
        if (!user) {
            return res.json({
                error: 'Email does not exist'
            })
        }
        // checks if the passwords match
        const matchPassword = await comparePassword(password, user.password)
        if (matchPassword) {
            // res.json('passwords match')
            jwt.sign({
                email: user.email,
                id: user._id,
                name: user.name
            }, process.env.JWT_SECRET, {}, (err, token) => {
                res.cookie('token', token).json(user)
            })
        }
        if (!matchPassword) {
            res.json({
                error: "Incorrect password"
            });
        }
    } catch (error) {
        console.log('login error in backend: ' + error)
    }
}

const Profile = (req, res) => {
    const {token} = req.cookies
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) {
                throw err;
            }
            res.json(user)
        })
    } else {
        res.json(null)
    }
}

const BookingDates = async (req, res) => {
    try {
        const booking = new BookingInfo({
            user: req.body.user,
            startDate: req.body.startDate,
            endDate: new Date(req.body.startDate),
            address: new Date(req.body.endDate),
        })
        await booking.save();
        res.status(201).send(booking);
        res.json({
            message: "saved success"
        })
    } catch (e) {
        res.status(500).send(e);
        res.json({
            error: "authControllers booking dates have an error"
        })
    }
}

module.exports = {
    test,
    registerUser,
    loginUser,
    Profile,
    BookingDates,
}