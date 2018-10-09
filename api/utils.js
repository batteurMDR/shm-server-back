var jwt = require('jsonwebtoken');
var config = require('../config');
var mongoose = require('mongoose');
var User = mongoose.model('Users');

function getUser(id, cb) {
    User.findById(id, {
        password: 0
    }, function(err, user) {
        if (err)
            return
        if (!user)
            return

        cb(user);
    });
}
module.exports = getUser;