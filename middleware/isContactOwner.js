const Contact = require('../models/Contact');


const isContactOwner = (req, res, next) => {
    const { contactId } = req.params;

    Contact.findById(contactId)
        .then((foundContact) => {
            console.log("req.user:", req.user);
            console.log("foundContact:", foundContact);

            if (foundContact.owner._id.toString() === req.user._id.toString()) {
                next();
            } else {
                res.status(403).json({ message: "Access denied. You are not the coach for this Contact." });
            }
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
};

module.exports = isContactOwner;