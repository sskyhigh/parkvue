const UserInformation = require('../models/userModels')
const test = (req, res) => {
    res.json('(From authControllers) test is working')
}

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
        // creates an object
        const createUser = await UserInformation.create({
            name,
            email,
            password,
        })
        // returns back 
        return res.json(createUser)
    } catch (error) {
        console.log("authController error: " + error)
    }
}

module.exports = {
    test,
    registerUser,
}