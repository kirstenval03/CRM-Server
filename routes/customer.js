var express = require('express');
var router = express.Router();

const Customer = require('../models/Contact');
const isAuthenticated = require('../middleware/isAuthenticated');
const isCustomerOwner = require("../middleware/isContactOwner");
const { fetchAndSaveCustomerData } = require('../services/googleSheetsService'); // Adjust the path as needed


//GET CUSTOMERS FROM GOOGLE-SHEETS
router.get('/import-from-google-sheets', async (req, res) => {
    await fetchAndSaveCustomerData();
    res.send('Customer data import initiated');
});

// DISPLAY ALL CUSTOMERS
router.get('/', (req, res, next) => {
    Customer.find()
        .then((allCustomers) => {
            res.json(allCustomers);
        })
        .catch((err) => {
            console.error(err); 
            next(err);
        });
});

// SEE CUSTOMER DETAILS
router.get('/customer-detail/:customerId', (req, res, next) => {
    const { customerId } = req.params;

    Customer.findById(customerId)
        .then((foundCustomer) => {
            res.json(foundCustomer);
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
});

// CREATE A NEW CUSTOMER
router.post('/new-customer', isAuthenticated, (req, res, next) => {
    const { firstName, lastName, email, phone, vip, revenue, date, utmSource, leadStatus } = req.body;

    Customer.create({ 
        firstName,
        lastName,
        email,
        phone,
        vip,
        revenue,
        date: new Date(date),
        utmSource,
        leadStatus
    })
    .then((newCustomer) => {
        res.json(newCustomer);
    })
    .catch((err) => {
        console.log(err);
        next(err);
    });
});

// UPDATE CUSTOMER INFO
router.post('/customer-update/:customerId', isAuthenticated, isCustomerOwner, (req, res, next) => {
    const { customerId } = req.params;
    const { firstName, lastName, email, phone, vip, revenue, date, utmSource, leadStatus } = req.body;

    Customer.findByIdAndUpdate(
        customerId,
        {
            firstName,
            lastName,
            email,
            phone,
            vip,
            revenue,
            date: new Date(date),
            utmSource,
            leadStatus
        },
        { new: true }
    )
    .then((updatedCustomer) => {
        res.json(updatedCustomer);
    })
    .catch((err) => {
        console.log(err);
        next(err);
    });
});

module.exports = router;
