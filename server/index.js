const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const {mongoose} = require('mongoose')

//connecting to database3
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Database has been connected"))
    .catch((error) => console.log("Database is not connected", error))

const app = express();
app.use('/', require('./routes/authRoutes'))

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`))