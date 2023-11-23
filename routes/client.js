var express = require('express');
var router = express.Router();

const Client = require('../models/Client');

const isAuthenticated = require('../middleware/isAuthenticated');
const isClientOwner = require("../middleware/isClientOwner");

//DISPLAY ALL CLIENTS 
router.get('/', (req, res, next) => {
  
    Client.find()
        .then((allClients) => {
            res.json(allClients)
        })
        .catch((err) => {
            console.error(err); 
            next(err)
        })

});


//SEE CLIENT DETAILS
router.get('/client-detail/:clientId', (req, res, next) => {
    const { clientId } = req.params;

    Client.findById(clientId)
        .populate({
            path: 'comments',
            populate: { path: 'author' }
        })
        .then((foundClient) => {
            res.json(foundClient);
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
});

//CREATE A NEW CLIENT
router.post('/new-client', isAuthenticated, (req, res, next) => {
    console.log("Received POST request at /new-client");

    const { firstName, lastName, email, phone, source, coach } = req.body

    Client.create(
        { 
            firstName,
            lastName,
            email,
            phone, 
            source,
            coach
        }
        )
        .then((newClient) => {
            res.json(newClient)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})


//UPDATE Client INFO
router.post('/client-update/:clientId', isAuthenticated, isClientOwner, (req, res, next) => {

    const { clientId } = req.params

    const { firstName, lastName, email, phone, source, coach } = req.body

    Client.findByIdAndUpdate(
        clientId,
        {
            firstName,
            lastName,
            email,
            phone, 
            source,
            coach
        },
        { new: true}
    )
        .then((updatedClient) => {
            res.json(updatedClient)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
})

module.exports = router;