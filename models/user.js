//setting up a user schema for user documents stored in a collection called users
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    //doc fields
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);
//doing it in one line this time, will be called users plural automatically