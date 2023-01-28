//EXPRESS ROUTER for partners and partners/partnerID

const express = require('express');
//set up a new router
const partnerRouter = express.Router();
const Partner = require('../models/partner');
const authenticate = require('../authenticate');

partnerRouter.route('/')
// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
//     //the next fx will pass control of the app routing to the next relelvant routing method (GET, POST.. etc.)
// })
//will catch all, we will use to set properties on the res obj
//any http with this path will trigger this method
//set up a path to a get req
.get((req, res, next) => {
    //res and headers are set by app.all so only out...
    // res.end('Will send all the partners to you');
    //res and headers are set by app.all so only out...
    Partner.find()
    .then(partners => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
        //the above will automatically close the stream afterwards, so don't need res.end
    })
    // res.end('Will send all the campsites to you');
    .catch(err => next(err));
})
//post req for the campsites path, once it hits next at all, it will go to the next relevant method
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // res.end(`Will add the partner: ${req.body.name} with description: ${req.body.description}`);
    Partner.create(req.body)
    .then(partner => {
        console.log('Partner Created ', partner);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //later when we study authentication, we willl explore how to restrict this to only priviledged users
    // res.end('Deleting all partners')
    Partner.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


partnerRouter.route('/:partnerId')
// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
//     //the next fx will pass control of the app routing to the next relelvant routing method (GET, POST.. etc.)
// })
//will catch all, we will use to set properties on the res obj
//any http with this path will trigger this method
//set up a path to a get req
.get((req, res, next) => {
    //res and headers are set by app.all so only out...
    // res.end(`Will send details of the partner: ${req.params.partnerId} to you`);
    Partner.findById(req.params.partnerId)
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
//post req for the campsites path, once it hits next at all, it will go to the next relevant method
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // res.write(`Updating the partner: ${req.params.partnerId} \n`);
    // res.end(`Will update the partner: ${req.body.name}
    // with description: ${req.body.description}`);
    Partner.findByIdAndUpdate(req.params.partnerId, {
        $set: req.body
    }, { new: true})
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //later when we study authentication, we willl explore how to restrict this to only priviledged users
    // res.end(`Deleting partner: ${req.params.partnerId}`)
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = partnerRouter;