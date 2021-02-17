'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifyToken: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    salt: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordTokenExpireAt: {
        type: String,
        default: null,
    },
    picture: {
        type: String,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

module.exports = mongoose.model('User', userSchema);
