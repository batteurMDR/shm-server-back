'use strict';
module.exports = function(app) {
    var log = require('../controllers/logController'),
        VerifyToken = require('../../VerifyToken');

    // log Routes
    app.route('/logs/:deviceId')
        .get(VerifyToken, log.list_all_logs);


    app.route('/log/:deviceId')
        .post(log.add_log);
};