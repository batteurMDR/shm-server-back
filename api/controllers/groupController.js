'use strict';
var mongoose = require('mongoose'),
    Group = mongoose.model('Groups'),
    getUser = require('../utils');

exports.list_all_groups = function(req, res) {
    Group.find({}, function(err, groups) {
        if (err)
            res.send(err);
        getUser(req.userId, function(user) {
            if (user.isRoot) {
                res.json(groups);
            } else {
                var response = [];
                groups.map(group => {
                    user.permissions.groups.map(ugroup => {
                        if (ugroup == group._id) {
                            response.push(group);
                        }
                    });
                });
                res.json(response);
            }
        });
    });
};

exports.create_a_group = function(req, res) {
    getUser(req.userId, function(user) {
        if (user.isRoot) {
            var new_device = new Group(req.body);
            new_device.save(function(err, group) {
                if (err)
                    res.send(err);
                res.json(group);
            });
        } else {
            return res.status(401).send({
                auth: false,
                message: 'Not Authorize'
            });
        }
    });
};

exports.read_a_group = function(req, res) {
    Group.findById(req.params.groupId, function(err, group) {
        if (err)
            res.send(err);
        getUser(req.userId, function(user) {
            if (user.isRoot) {
                res.json(group);
            } else {
                user.permissions.groups.map(ugroup => {
                    if (ugroup == group._id) {
                        return res.json(group);
                    }
                });
            }
        });
    });
};

exports.update_a_group = function(req, res) {
    getUser(req.userId, function(user) {
        if (user.isRoot) {
            Group.findOneAndUpdate({
                _id: req.params.groupId
            }, req.body, {
                new: true
            }, function(err, group) {
                if (err)
                    res.send(err);
                res.json(group);
            });
        } else {
            return res.status(401).send({
                auth: false,
                message: 'Not Authorize'
            });
        }
    });
};

exports.delete_a_group = function(req, res) {
    getUser(req.userId, function(user) {
        if (user.isRoot) {
            Group.remove({
                _id: req.params.groupId
            }, function(err, group) {
                if (err)
                    res.send(err);
                res.json({
                    message: 'Group successfully deleted'
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