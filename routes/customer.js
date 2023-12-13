var express = require('express');
var router = express.Router();

const Customer = require('../models/Customer');

const isAuthenticated = require('../middleware/isAuthenticated');
const isCustomerOwner = require("../middleware/isCustomerOwner")

//DISPLAY ALL CUSTOMERS
router.get('/', (req, res, next) => {
  
    Customer.find()
        .then((allCustomers) => {
            res.json(allCustomers)
        })
        .catch((err) => {
            console.error(err); 
            next(err)
        })

});


//SEE CUSTOMER DETAILS
router.get('/customer-detail/:customerId', (req, res, next) => {
    const { customerId } = req.params;

    Customer.findById(customerId)
        .populate({
            path: 'comments',
            populate: { path: 'author' }
        })
        .then((foundCustomer) => {
            res.json(foundCustomer);
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
});

//CREATE A NEW CUSTOMER
router.post('/new-customer', isAuthenticated, (req, res, next) => {
    console.log("Received POST request at /new-customer");

    const { firstName, lastName, email, phone, source, coach } = req.body

    Customer.create(
        { 
            firstName,
            lastName,
            email,
            phone, 
            source,
            coach
        }
        )
        .then((newCustomer) => {
            res.json(newCustomer)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})


//UPDATE CUSTOMER INFO
router.post('/customer-update/:customerId', isAuthenticated, isCustomerOwner, (req, res, next) => {

    const { customerId } = req.params

    const { firstName, lastName, email, phone, source, coach } = req.body

    Customer.findByIdAndUpdate(
        customerId,
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
        .then((updatedCustomer) => {
            res.json(updatedCustomer)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
})

module.exports = router;