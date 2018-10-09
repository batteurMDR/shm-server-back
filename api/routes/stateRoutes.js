'use strict';
module.exports = function(app) {
    var state = require('../controllers/stateController'),
        VerifyToken = require('../../VerifyToken');

    // state Routes
    app.route('/states/:deviceId')
        .get(VerifyToken, state.list_all_states);


    app.route('/state/:deviceId')
        .post(state.add_state);
};