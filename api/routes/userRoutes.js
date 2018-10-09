'use strict';
module.exports = function(app) {
    var user = require('../controllers/userController'),
        VerifyToken = require('../../VerifyToken');

    // user Routes
    app.route('/users')
        .get(VerifyToken, user.list_all_users)
        .post(VerifyToken, user.create_a_user);

    app.route('/user/me')
        .get(user.read_me)
        .post(user.login);

    app.route('/user/:userId')
        .get(VerifyToken, user.read_a_user)
        .put(VerifyToken, user.update_a_user)
        .delete(VerifyToken, user.delete_a_user);
};