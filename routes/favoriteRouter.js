//EXPRESS ROUTER for partners and partners/partnerID
const express = require('express');
//set up a new router
const favoriteRouter = express.Router();
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');

const cors = require('./cors');

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    
    Favorite.find({user: req.user._id })
    .populate('user')
    .populate('campsites')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    // .then(favorite => {
    //     if(favorite) {
    //         req.body.forEach((campsite) => {
    //             if(!favorite.campsite.includes(campsite._id)) {
    //                 favorite.campsite.push()
    //             }
    //         })
    //     }
        // res.statusCode = 200;
        // res.setHeader('Content-Type', 'application/json');
        // res.json(favorites);
        //the above will automatically close the stream afterwards, so don't need res.end
    
    
    .catch(err => next(err));
})
//post req for the campsites path, once it hits next at all, it will go to the next relevant method
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
        .then(favorite => {
            if (favorite) {
                req.body.forEach(campsite => {
                    if (!favorite.campsites.includes(campsite._id)) {
                    favorite.campsites.push(campsite._id);
                    }
            });
            } else {
                favorite = new Favorite({
                    user: req.user._id,
                    campsites: req.body.map(campsite => campsite._id)
            });
            }
        favorite.save()
            .then(favorite => res.json(favorite))
            .catch(err => next(err))
        // console.log('Favorite Created ', favorite);
        // res.statusCode = 200;
        // res.setHeader('Content-Type', 'application/json');
        // res.json(favorite);
    })
    // Favorite.create(req.body)
    // .then(favorite => {
    //     console.log('Favorite Created ', favorite);
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'application/json');
    //     res.json(partner);
    // })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   
    Favorite.findOneAndDelete({user: req.user._id })
    .then(favorite => {
        if(favorite) {
            res.json(favorite);
        } else {
            res.send('You do not have a favorite to delete');
            res.setHeader('Content-Type', 'application/json');
        }
        // res.statusCode = 200;
        // res.setHeader('Content-Type', 'application/json');
        // res.json(favorite);
    })
    .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')

//cors- routes week IV add below
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    //res and headers are set by app.all so only out...
    // res.end(`Will send details of the partner: ${req.params.partnerId} to you`);
    // Favorite.findById(req.params.campsiteId)
    // .then(partner => {
        res.statusCode = 403;
        res.end(`GET  operation not supported`);
        // res.setHeader('Content-Type', 'application/json');
        // res.json(campsite);
    })
//     .catch(err => next(err));
// })
//post req for the campsites path, once it hits next at all, it will go to the next relevant method
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // res.statusCode = 403;
    // res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
    Favorite.findOne({ user: req.user._id })
        .then(favorite => {
            if (!favorite) {
                favorite = new Favorite({
                    user: req.user._id,
                    campsites: [req.params.campsiteId]
                })
            }
                else if (favorite.campsites.includes(req.params.campsiteId)) {
                    res.send('That campsite is already in the list of favorites!');
                    return
                }
            favorite.campsites.push(req.params.campsiteId)
            favorite.save()
                .then(favorite => res.json(favorite))
                .catch(err => next(err));
            
        })
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
        res.end(`PUT  operation not supported`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //later when we study authentication, we willl explore how to restrict this to only priviledged users
    // res.end(`Deleting partner: ${req.params.partnerId}`)
    Favorite.findOne({ user: req.user._id })
    .then(favorite => {
        if(!favorite) {
            res.send('No favorites to delete.');
            return;
        } 
        let campsites = favorite.campsites.filter(campsite => campsite.toString() !== req.params.campsiteId);

        favorite.campsites= campsites;
        
        favorite.campsite = campsites;
        favorite.save()
        .then(favorite => res.json(favorite))
        .catch(err => next(err)); 
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;