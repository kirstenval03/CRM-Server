const { Schema, model } = require('moongose');

const clientSchema = new Schema({
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

module.exports = model('Client', clientSchema)