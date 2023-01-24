//campsite schema models for all docs in db's promotion collection

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//with the above we an use the shorthand

require('mongoose-currency').loadType(mongoose);
//shorthand for currency
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema ({
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
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

//next we will create a model using this schema
const Promotion = mongoose.model('Promotion', promotionSchema);
//remember Capitalized and Single version- mongoose will loook for lowercase plural version; second argument is the Schema you want to use for this collection

module.exports = Promotion;