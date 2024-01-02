const { Schema, model } = require('mongoose');


const userRoles = {
    ADMIN: 'admin',
    SALES_COACH: 'sales_coach',
    ACADEMY_MEMBER: 'academy_member'
};

const userSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    position:{
        type: String,
    },
    role: {
        type: String,
        enum: [userRoles.ADMIN, userRoles.SALES_COACH, userRoles.ACADEMY_MEMBER],
        required: true
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    // Assign role based on email domain (or other business logic)
    if (this.isNew) {
        if (this.email.endsWith('@e3events.io')) {
            this.role = userRoles.ADMIN;
        } else if (this.email.endsWith('@youreventcoach.com')) {
            this.role = userRoles.SALES_COACH;
        } else {
            this.role = userRoles.ACADEMY_MEMBER;
        }
    }

    next();
});

module.exports = model('User', userSchema);
 