'use strict';
module.exports = function(app) {
    var group = require('../controllers/groupController'),
        VerifyToken = require('../../VerifyToken');

    // group Routes
    app.route('/groups')
        .get(VerifyToken, group.list_all_groups)
        .post(VerifyToken, group.create_a_group);


    app.route('/group/:groupId')
        .get(VerifyToken, group.read_a_group)
        .put(VerifyToken, group.update_a_group)
        .delete(VerifyToken, group.delete_a_group);
};