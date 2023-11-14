const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
    firstName:{
        type: String,
        trim:true,
        required:true
    },
    lastName:{
        type: String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
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

userSchema.pre('save', async function (next) {
    // Check if the email contains the domain "@e3events.io"
    if (this.email.endsWith('@e3events.io')) {
      this.isE3 = true;
    }

    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
    }
  
    next();
  });
  
  module.exports = model("User", userSchema);