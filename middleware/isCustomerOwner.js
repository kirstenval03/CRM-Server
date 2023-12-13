const Customer = require('../models/Customer');


const isCustomerOwner = (req, res, next) => {
    const { customerId } = req.params;

    Customer.findById(customerId)
        .then((foundCustomer) => {
            console.log("req.user:", req.user);
            console.log("foundCustomer:", foundCustomer);

            if (foundCustomer.owner._id.toString() === req.user._id.toString()) {
                next();
            } else {
                res.status(403).json({ message: "Access denied. You are not the coach for this Customer." });
            }
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
};

module.exports = isCustomerOwner;
