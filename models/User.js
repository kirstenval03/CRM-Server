const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    firstName:String,
    lastName:String,
    email:{
        type:String,
        unique: true,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    isE3:{
        type:Boolean,
        default: false
    }
}, {
    timestamps: true
});

userSchema.pre('save', function (next) {
    // Check if the email contains the domain "@e3events.io"
    if (this.email.endsWith('@e3events.io')) {
      this.isE3 = true;
    }
  
    next();
  });
  
  module.exports = model("User", userSchema);