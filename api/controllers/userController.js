'use strict';
var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    config = require('../../config'),
    getUser = require('../utils');

exports.list_all_users = function(req, res) {
    User.find({}, {
        password: 0
    }, function(err, users) {
        if (err)
            res.send(err);
        getUser(req.userId, function(user) {
            if (user.isRoot) {
                return res.json(users);
            } else {
                return res.json([user]);
            }
        });
    });
};

exports.create_a_user = function(req, res) {
    getUser(req.userId, function(user) {
        if (user.isRoot) {
            req.body.password = bcrypt.hashSync(req.body.password, 8);
            var new_user = new User(req.body);
            new_user.save(function(err, user) {
                if (err)
                    res.send(err);
                var token = jwt.sign({
                    id: user._id
                }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({
                    auth: true,
                    token: token
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

exports.read_a_user = function(req, res) {
    getUser(req.userId, function(user) {
        if (user.isRoot || user._id == req.params.userId) {
            User.findById(req.params.userId, {
                password: 0
            }, function(err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            });
        } else {
            return res.status(401).send({
                auth: false,
                message: 'Not Authorize'
            });
        }
    });
};

exports.update_a_user = function(req, res) {
    getUser(req.userId, function(user) {
        if (user.isRoot || user._id == req.params.userId) {
            User.findOneAndUpdate({
                _id: req.params.userId
            }, req.body, {
                new: true
            }, function(err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            });
        } else {
            return res.status(401).send({
                auth: false,
                message: 'Not Authorize'
            });
        }
    });
};

exports.delete_a_user = function(req, res) {
    getUser(req.userId, function(user) {
        if (user.isRoot) {
            User.remove({
                _id: req.params.userId
            }, function(err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            });
        } else {
            return res.status(401).send({
                auth: false,
                message: 'Not Authorize'
            });
        }
    });
};

exports.read_me = function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        });

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err)
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });

        User.findById(decoded.id, {
            password: 0
        }, function(err, user) {
            if (err)
                return res.status(500).send("There was a problem finding the user.");
            if (!user)
                return res.status(404).send("No user found.");

            res.status(200).send(user);
        });
    });
};

exports.login = function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err)
            return res.status(500).send('Error on the server.');
        if (!user)
            return res.status(404).send('No user found.');
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid)
            return res.status(401).send({
                auth: false,
                token: null
            });
        var token = jwt.sign({
            id: user._id
        }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({
            auth: true,
            token: token
        });
    });
};