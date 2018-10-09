'use strict';
var mongoose = require('mongoose'),
    Group = mongoose.model('Groups'),
    Device = mongoose.model('Devices'),
    Log = mongoose.model('Logs'),
    State = mongoose.model('States'),
    config = require('../../config'),
    getUser = require('../utils');

exports.list_all_devices = function(req, res) {
    Device.find({}, function(err, devices) {
        if (err)
            res.send(err);
        getUser(req.userId, function(user) {
            if (user.isRoot) {
                res.json(devices);
            } else {
                var response = [];
                devices.map(device => {
                    user.permissions.devices.map(udevice => {
                        if (udevice == device._id) {
                            response.push(device);
                        }
                    });
                });
                res.json(response);
            }
        });
    });
};

exports.create_a_device = function(req, res) {
    req.body.group = config.defaultGroup;
    var new_device = new Device(req.body);
    new_device.save(function(err, device) {
        if (err)
            res.send(err);
        res.json(device);
    });
};

exports.read_a_device = function(req, res) {
    Device.findById(req.params.deviceId, function(err, device) {
        if (err)
            res.send(err);
        getUser(req.userId, function(user) {
            if (user.isRoot) {
                res.json(device);
            } else {
                user.permissions.devices.map(udevice => {
                    if (udevice == device._id) {
                        res.json(device);
                    }
                });
            }
        });
    });
};

exports.update_a_device = function(req, res) {
    getUser(req.userId, function(user) {
        if (user.isRoot) {
            Device.findOneAndUpdate({
                _id: req.params.deviceId
            }, req.body, {
                new: true
            }, function(err, device) {
                if (err)
                    res.send(err);
                res.json(device);
            });
        } else {
            return res.status(401).send({
                auth: false,
                message: 'Not Authorize'
            });
        }
    });
};

exports.delete_a_device = function(req, res) {
    getUser(req.userId, function(user) {
        if (user.isRoot) {
            Device.remove({
                _id: req.params.deviceId
            }, function(err, device) {
                if (err)
                    res.send(err);
                Log.find({
                    device: req.params.deviceId
                }, function(err, logs) {
                    if (err)
                        res.send(err);
                    for (var i = 0; i < logs.length; i++) {
                        Log.remove({
                            _id: logs[i]._id
                        }, function(err, req) {
                            if (err)
                                res.send(err);
                        })
                    }
                    State.find({
                        device: req.params.deviceId
                    }, function(err, states) {
                        if (err)
                            res.send(err);
                        for (var i = 0; i < states.length; i++) {
                            State.remove({
                                _id: states[i]._id
                            }, function(err, req) {
                                if (err)
                                    res.send(err);
                            })
                        }
                        res.json({
                            message: 'Device successfully deleted'
                        });
                    });
                });
            });
        } else {
            return res.status(401).send({
                auth: false,
                message: 'Not Authorize'
            });
        }
    });
};