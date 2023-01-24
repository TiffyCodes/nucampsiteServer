//campsite schema models for all docs in db's partner collection

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//with the above we an use the shorthand

const partnerSchema = new Schema ({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

//next we will create a model using this schema
const Partner = mongoose.model('Partner', partnerSchema);
//remember Capitalized and Single version- mongoose will loook for lowercase plural version; second argument is the Schema you want to use for this collection

module.exports = Partner;