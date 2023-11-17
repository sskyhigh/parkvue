const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    address: String,
    startDate: Date,
    endDate: Date,
})
// putting userSchema into user collection
const userModel = mongoose.model('User', userSchema)

module.exports = userModel;