//EXPRESS ROUTER for partners and partners/partnerID

const express = require('express');
//set up a new router
const partnerRouter = express.Router();

partnerRouter.route('/')
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
    res.end('Will send all the partners to you');
})
//post req for the campsites path, once it hits next at all, it will go to the next relevant method
.post((req, res) => {
    res.end(`Will add the partner: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete((req, res) => {
    //later when we study authentication, we willl explore how to restrict this to only priviledged users
    res.end('Deleting all partners')
});


partnerRouter.route('/:partnerId')
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
    res.end(`Will send details of the partner: ${req.params.partnerId} to you`);
})
//post req for the campsites path, once it hits next at all, it will go to the next relevant method
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
})
.put((req, res) => {
    res.write(`Updating the partner: ${req.params.partnerId} \n`);
    res.end(`Will update the partner: ${req.body.name}
    with description: ${req.body.description}`);
})
.delete((req, res) => {
    //later when we study authentication, we willl explore how to restrict this to only priviledged users
    res.end(`Deleting partner: ${req.params.partnerId}`)
});
module.exports = partnerRouter;