//EXPRESS ROUTER for promotions and promotions/promotionID

const express = require('express');
//set up a new router
const promotionRouter = express.Router();
const Promotion = require('../models/promotion');
const authenticate = require('../authenticate');
//cors- routes week IV add below
const cors = require('./cors');

promotionRouter.route('/')
// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
//     //the next fx will pass control of the app routing to the next relelvant routing method (GET, POST.. etc.)
// })
//will catch all, we will use to set properties on the res obj
//any http with this path will trigger this method
//set up a path to a get req
//cors- routes week IV add below
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    //res and headers are set by app.all so only out...
    // res.end(`Will send details of all the promotions to you`);
    Promotion.find()
    .then(promotions => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
        //the above will automatically close the stream afterwards, so don't need res.end
    })
    // res.end('Will send all the campsites to you');
    .catch(err => next(err));
})
//post req for the campsites path, once it hits next at all, it will go to the next relevant method
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // res.end(`Will add the promotion: ${req.body.name} with description: ${req.body.description}`);
    Promotion.create(req.body)
    .then(promotion => {
        console.log('Promotion Created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    //later when we study authentication, we willl explore how to restrict this to only priviledged users
    // res.end('Deleting all promotions')
    Promotion.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});



promotionRouter.route('/:promotionId')
// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
//     //the next fx will pass control of the app routing to the next relelvant routing method (GET, POST.. etc.)
// })
//will catch all, we will use to set properties on the res obj
//any http with this path will trigger this method
//set up a path to a get req
//cors- routes week IV add below
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    //res and headers are set by app.all so only out...
    // res.end(`Will send details of the promotion: ${req.params.promotionId} to you`);
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
//post req for the campsites path, once it hits next at all, it will go to the next relevant method
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    // res.write(`Updating the promotion: ${req.params.promotionId} \n`);
    // res.end(`Will update the promotion: ${req.body.name}
    // with description: ${req.body.description}`);
    Promotion.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, { new: true})
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    //later when we study authentication, we willl explore how to restrict this to only priviledged users
    // res.end(`Deleting promotion: ${req.params.promotionId}`)
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = promotionRouter;