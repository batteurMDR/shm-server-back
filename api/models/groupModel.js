'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var GroupSchema = new Schema({
    name: {
        type: String,
        required: 'Enter the name of the device'
    },
    group: {
        type: String
    }
});

module.exports = mongoose.model('Groups', GroupSchema);