'use strict';
var config = require('../../config'),
    mongoose = require('mongoose'),
    io = require('socket.io')((config.port+1)),
    State = mongoose.model('States'),
    Device = mongoose.model('Devices'),
    Log = mongoose.model('Logs'),
    getUser = require('../utils');

var devices = {

};

exports.list_all_states = function (req, res) {
    State.find({
        'device': req.params.deviceId
    }).sort('-created').limit(50).exec(function (err, states) {
        if (err)
            res.send(err);
        getUser(req.userId, function (user) {
            if (user.isRoot) {
                res.json(states);
            } else {
                user.permissions.devices.map(udevice => {
                    if (udevice == req.params.deviceId) {
                        res.json(states);
                    }
                });
            }
        });
    });
};

exports.add_state = function (req, res) {
    req.body.device = req.params.deviceId;
    var new_state = new State(req.body);
    Device.findOneAndUpdate({
        _id: req.params.deviceId
    }, {
        offline: false
    }, {
        new: true
    }, function (err, device) {
        if (err)
            res.send(err);
    });
    clearTimeout(devices[req.params.deviceId]);
    devices[req.params.deviceId] = setTimeout(function () {
        Device.findOneAndUpdate({
            _id: req.params.deviceId
        }, {
            offline: true
        }, {
            new: true
        }, function (err, device) {
            if (err)
                res.send(err);
            var new_log = new Log({
                device: req.params.deviceId,
                type: "error",
                msg: device.name + " is offline"
            });
            new_log.save(function (err, log) {
                if (err)
                    res.send(err);
            });
        });
    }, req.body.refreshTime * 1000 * 2);
    new_state.save(function (err, state) {
        if (err)
            res.send(err);
        io.emit('update', state);
        res.json(state);
    });
};