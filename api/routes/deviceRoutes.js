'use strict';
module.exports = function(app) {
    var device = require('../controllers/deviceController'),
        VerifyToken = require('../../VerifyToken');

    // device Routes
    app.route('/devices')
        .get(VerifyToken, device.list_all_devices)
        .post(device.create_a_device);


    app.route('/device/:deviceId')
        .get(VerifyToken, device.read_a_device)
        .put(VerifyToken, device.update_a_device)
        .delete(VerifyToken, device.delete_a_device);
};