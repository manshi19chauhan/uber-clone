const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullname:{
        firstname: {
            type: String,
            required: true,
            minlenght: [3, 'firstname must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'lastname must be at least 3 characters long'],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Do not return password in queries
    },
    socketId: {
        type: String,
        default: null
    },
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    vehicle: {
        color:{
            type: String,
            required: true,
            minlength: [3, 'Color must be at least 3 characters long'], 
        },
        plate: {
            type: String,
            required: true,
            unique: true,
            minlength: [3, 'Plate must be at least 3 characters long'],
        },
        capacity:{
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1'],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'bike', 'auto'],
        }
    },
    location: {
        lat: {
            type: Number,
        },
        log: {
            type: Number,
        }
    }
});

captainSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id,}, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

captainSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function(password) {
    if (!password) {
        throw new Error('Password is required');
    }
    return await bcrypt.hash(password, 10);
}

const captainModel = mongoose.model('Captain', captainSchema);

module.exports = captainModel;