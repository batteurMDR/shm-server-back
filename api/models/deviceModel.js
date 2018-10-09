'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DeviceSchema = new Schema({
    uid: {
        type: String,
        required: 'Enter the uid of the device'
    },
    offline: {
        type: Boolean,
        default: false
    },
    group: {
        type: String
    },
    name: {
        type: String,
        required: 'Enter the name of the device'
    },
    system: {
        type: String
    },
    hardware: {
        type: String
    },
    release: {
        type: String
    },
    version: {
        type: String
    },
    arch: {
        type: String
    },
    cpu: {
        type: String
    },
    refreshTime: {
        type: Number
    },
    created: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: ['tracking', 'tracked']
        }],
        default: ['tracking']
    }
});

module.exports = mongoose.model('Devices', DeviceSchema);