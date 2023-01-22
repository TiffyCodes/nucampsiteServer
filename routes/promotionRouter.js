//EXPRESS ROUTER for promotions and promotions/promotionID

const express = require('express');
//set up a new router
const promotionRouter = express.Router();

promotionRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
    //the next fx will pass control of the app routing to the next relelvant routing method (GET, POST.. etc.)
})
//will catch all, we will use to set properties on the res obj
//any http with this path will trigger this method
//set up a path to a get req
.get((req, res) => {
    //res and headers are set by app.all so only out...
    res.end(`Will send details of all the promotions to you`);
})
//post req for the campsites path, once it hits next at all, it will go to the next relevant method
.post((req, res) => {
    res.end(`Will add the promotion: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res) => {
    //later when we study authentication, we willl explore how to restrict this to only priviledged users
    res.end('Deleting all promotions')
});



promotionRouter.route('/:promotionId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
    //the next fx will pass control of the app routing to the next relelvant routing method (GET, POST.. etc.)
})
//will catch all, we will use to set properties on the res obj
//any http with this path will trigger this method
//set up a path to a get req
.get((req, res) => {
    //res and headers are set by app.all so only out...
    res.end(`Will send details of the promotion: ${req.params.promotionId} to you`);
})
//post req for the campsites path, once it hits next at all, it will go to the next relevant method
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
})
.put((req, res) => {
    res.write(`Updating the promotion: ${req.params.promotionId} \n`);
    res.end(`Will update the promotion: ${req.body.name}
    with description: ${req.body.description}`);
})
.delete((req, res) => {
    //later when we study authentication, we willl explore how to restrict this to only priviledged users
    res.end(`Deleting promotion: ${req.params.promotionId}`)
});

module.exports = promotionRouter;