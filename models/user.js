//setting up a user schema for user documents stored in a collection called users
const mongoose = require('mongoose');
//** Week 3 add below for authentication */
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    //doc fields
    //** Week 3 REMOVE below bc passport will handle authentication */
    // username: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },
    admin: {
        type: Boolean,
        default: false
    },
    //add below to use Mongoose Popuation to have docs ref other docs with NOSQL
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    facebookId: String
});

//** Week 3 add below (plugin) for authentication */
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
//doing it in one line this time, will be called users plural automatically