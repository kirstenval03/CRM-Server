const { Schema, model } = require('mongoose');

const customerSchema = new Schema({
    firstName:String,
    lastName:String,
    email:String,
    phone:String, 
    vip: Boolean,
    revenue: Number,
    date: Date,
    utmSource:String,
},{
    timestamps: true
}
)

module.exports = model('Customer', customerSchema)