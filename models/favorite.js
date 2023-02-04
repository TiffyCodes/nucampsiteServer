//campsite schema models for all docs in db's partner collection

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//with the above we an use the shorthand

const favoriteSchema = new Schema({
    //an obj that contains info
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    campsites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campsite'
    }]
}, {
    timestamps: true
});

//next we will create a model using this schema
const Favorite = mongoose.model('Favorite', favoriteSchema);
//remember Capitalized and Single version- mongoose will loook for lowercase plural version; second argument is the Schema you want to use for this collection

module.exports = Favorite;