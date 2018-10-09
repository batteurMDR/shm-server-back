'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LogSchema = new Schema({
    device: {
        type: String
    },
    type: {
        type: String
    },
    msg: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Logs', LogSchema);