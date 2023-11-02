const test = (req, res) => {
    res.json('(From authControllers) test is working')
}

const registerUser = (req, res) => {
    try {
        const {name, email, password} = req.body;
        //Checks if name is entered
        if (!name) {
            return res.json({
                error: 'name is required'
            })
        }
        if (!password || password.length < 6) {
            return res.json({
                error: 'Password is required, should be at least 6 characters long'
            })
        }
    } catch (error) {

    }
}

module.exports = {
    test,
    registerUser
}