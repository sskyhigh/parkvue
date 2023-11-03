const UserInformation = require('../models/userModels')
const {hashPassword, comparePassword} = require('../helpers/auth')
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

//login
const loginUser = async (res, req) => {
    try {
        const {email, password} = req.body;
        /*This tries to find the user inside the mongoDB database*/
        const user = await UserInformation.findOne({email})
        if (!user) {
            return res.json({
                error: 'Email does not exist'
            })
        }
        // checks if the passwords match
        const matchPassword = await comparePassword(password, user.password)
        if (matchPassword) {
            res.json('passwords match')
        }
    } catch (error) {
        console.log('login error in backend: ' + error)
    }
}

module.exports = {
    test,
    registerUser,
    loginUser,
}