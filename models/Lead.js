const { Schema, model } = require('mongoose');

const leadSchema = new Schema({
    name:String,
    email:String,
    coachName:String,
    coachEmail:String, 
},{
    timestamps: true
}
)

module.exports = model('Lead', leadSchema)