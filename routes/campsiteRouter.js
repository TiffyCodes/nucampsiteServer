//EXPRESS ROUTER for campsites and campsites/campsiteID


const express = require('express');
//set up a new router
const campsiteRouter = express.Router();
//updating router to be able to interact with campsites data from DB
const Campsite = require('../models/campsite');

campsiteRouter.route('/')
//the path doesn't need to be campsites since we will set it up in server.js, first set up the require
//******* PASTING THE 5 ROUTING METHODS WE COPIED FROM SERVER.JS AND PUT THEM HERE BUT CHAIN THEM TOGETHER */
//Will remove app, path from parameter list bc it is above, AND REMOVE THE ; that signals end of chain
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
    Campsite.find()
    .then(campsites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsites);
        //the above will automatically close the stream afterwards, so don't need res.end
    })
    // res.end('Will send all the campsites to you');
    .catch(err => next(err));
})
//post req for the campsites path, once it hits next at all, it will go to the next relevant method
.post((req, res, next) => {
    //will get the info from the request body, mongoose will check the data to make sure it fits the Schema
    Campsite.create(req.body)
    .then(campsite => {
        console.log('Campsite Created ', campsite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
    // res.end(`Will add the campsites: ${req.body.name} with description: ${req.body.description}`);
})
//don't need to add next here bc put is not allowed
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})
.delete((req, res, next) => {
    //later when we study authentication, we willl explore how to restrict this to only priviledged users
    // res.end('Deleting all campsites')
    Campsite.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


//using a route parameter.  Like route params in React (Native)- so it will use what the user puts here as the campsiteId.  So for now we are just echoing back what they have.  
campsiteRouter.route("/:campsiteId")
// ********* REMOVED FROM SERVER BC WE IMPLEMENTED THESE INPUTS BELOW FOR THE CAMPSITE ROUTER DURING ASSMT 1
// adding support for 4 more endpoints, but these will support a diff path
// using a route parameter using :
// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
.get((req, res, next) => {
    // res.end(`Will send details of the campsite: ${req.params.campsiteId} to you`);
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
})
// don't need to add next bc aren't accepting post requests
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})

.put((req, res, next) => {
    // res.write(`Updating the campsite: ${req.params.campsiteId} \n`);
    // res.end(`Will update the campsite: ${req.body.name}
    // with description: ${req.body.description}`);
    //we parsed this out from the req body sent to us
    //was sent as the JSON formated body of the req message and we are echoing back as text

    Campsite.findByIdAndUpdate(req.params.campsiteId, {
        $set: req.body
    }, { new: true})
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
    })

.delete((req, res, next) => {
    // res.end(`Deleting campsite: ${req.params.campsiteId}`);
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});
//*********


//****** */
module.exports = campsiteRouter;