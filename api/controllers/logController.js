'use strict';
var mongoose = require('mongoose'),
    Log = mongoose.model('Logs'),
    getUser = require('../utils');

exports.list_all_logs = function(req, res) {
    Log.find({
        'device': req.params.deviceId
    }).sort('-created').limit(50).exec(function(err, logs) {
        if (err)
            res.send(err);
        getUser(req.userId, function(user) {
            if (user.isRoot) {
                res.json(logs);
            } else {
                user.permissions.devices.map(udevice => {
                    if (udevice == req.params.deviceId) {
                        res.json(logs);
                    }
                });
            }
        });
    });
};

exports.add_log = function(req, res) {
    req.body.device = req.params.deviceId;
    var new_log = new Log(req.body);
    new_log.save(function(err, log) {
        if (err)
            res.send(err);
        res.json(log);
    });
};