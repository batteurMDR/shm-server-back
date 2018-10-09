'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    isRoot: {
        type: Boolean,
        default: false
    },
    permissions: {
        groups: {
            type: [{
                type: String,
            }],
            default: []
        },
        devices: {
            type: [{
                type: String,
            }],
            default: []
        }
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Users', UserSchema);