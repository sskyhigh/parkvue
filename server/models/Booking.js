const mongoose = require('mongoose');
const {Schema} = mongoose;
const User = require('/userModels')

const Booking = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: User,
    },
    startDate: Date,
    endDate: Date,
    address: String,
})

const BookingModel = mongoose.model('BookingDatabase', Booking);
module.exports = BookingModel;
