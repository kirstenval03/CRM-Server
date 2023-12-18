const { Schema, model } = require('mongoose');

const clientSchema = new Schema({
    name:String,
    company:String,
    email:String,
    phone:String, 
}, {
timestamps: true
}
)

module.exports = model('Client', clientSchema)