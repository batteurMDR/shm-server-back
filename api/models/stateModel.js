'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Device = mongoose.model('Devices');


var StateSchema = new Schema({
    device: {
        type: String
    },
    cpu: {
        type: Number
    },
    ram: {
        type: Number
    },
    disk: {
        type: Number
    },
    tempCpu: {
        type: Number
    },
    tempGpu: {
        type: Number
    },
    pingSys: {
        type: Number
    },
    pingExt: {
        type: Number
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('States', StateSchema);