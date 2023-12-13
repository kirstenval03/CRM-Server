const { Schema, model } = require('mongoose');

const customerSchema = new Schema({
    firstName:String,
    lastName:String,
    email:String,
    phone:String, 
    source: String,
    coach: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    leadStatus:String,
},{
    timestamps: true
}
)

module.exports = model('Customer', customerSchema)