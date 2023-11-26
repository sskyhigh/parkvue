const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const {mongoose} = require('mongoose')
const app = express();
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const bodyparser = require('body-parser')
//connecting to database3
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Database has been connected"))
    .catch((error) => console.log("Database is not connected: ", error))

try {
    //Middleware, recognizes as JSON object.
    //app.use(bodyparser.json());
    //app.use(cors());
    app.use(express.json());
    app.use(cookieParser())
    app.use(express.urlencoded({extended: false}))
    app.use("/", require("./routes/authRoutes"));
} catch (e) {
    console.log('index js has error: ' + e)
}

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`))