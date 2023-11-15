const Client = require('../models/Client');


const isClientOwner = (req, res, next) => {
    const { clientId } = req.params;

    Client.findById(clientId)
        .then((foundClient) => {
            console.log("req.user:", req.user);
            console.log("foundClient:", foundClient);

            if (foundClient.owner._id.toString() === req.user._id.toString()) {
                next();
            } else {
                res.status(403).json({ message: "Access denied. You are not the coach for this client." });
            }
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
};

module.exports = isClientOwner;
