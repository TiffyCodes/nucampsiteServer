//campsite schema models for all docs in db's campsites collection

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//with the above we an use the shorthand

require('mongoose-currency').loadType(mongoose);
//shorthand for currency
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    // author: {
    //     type: String,
    //     required: true
    // }
    //updating below to store ref to user doc thru userdoc's object ID
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        //above is the name of the model for that doc "User"
    }
}, {
    timestamps: true
});

const campsiteSchema = new Schema({
    //an obj that contains info
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

//next we will create a model using this schema

const Campsite = mongoose.model('Campsite', campsiteSchema);
//remember Capitalized and Single version- mongoose will loook for lowercase plural version; second argument is the Schema you want to use for this collection

module.exports = Campsite;