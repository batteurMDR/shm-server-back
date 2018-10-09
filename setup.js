var process = require('process'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Group = require('./api/models/groupModel'),
    User = require('./api/models/userModel'),
    Input = require('prompt-input'),
    bcrypt = require('bcryptjs');

var db = new Input({
    name: 'db',
    message: 'Name for the DB ?'
});

var group = new Input({
    name: 'group',
    message: 'Name for the default group ?'
});

var username = new Input({
    name: 'username',
    message: 'Username ? (E-Mail)'
});

var password = new Input({
    name: 'password',
    message: 'Password ?'
});

var port = new Input({
    name: 'port',
    message: 'Which port do you want to use for the API ?'
});

var secret = new Input({
    name: 'secret',
    message: 'Choose a secret passphrase for JSONWebTokens ?'
});

var domain = new Input({
    name: 'domain',
    message: 'What is the public URL ? (deciplex.com)'
});

db.ask(function (dbName) {
    mongoose.Promise = global.Promise;
    mongoose.set('debug', false);
    mongoose.connect('mongodb://localhost/' + dbName, {
        useNewUrlParser: true
    });
    group.ask(function (groupName) {
        var new_group = new Group({
            name: groupName
        });
        new_group.save(function (err, group) {
            if (err)
                console.error(err);
            username.ask(function (email) {
                password.ask(function (pass) {
                    pass = bcrypt.hashSync(pass, 8);
                    var new_user = new User({
                        email: email,
                        password: pass,
                        isRoot: true
                    });
                    new_user.save(function (err, user) {
                        if (err)
                            console.error(err);
                    });
                    port.ask(function (portNumber) {
                        secret.ask(function (secretPhrase) {
                            domain.ask(function (domainName) {
                                const backConfig = "module.exports = {\n" +
                                    "    'secret' : '" + secretPhrase + "',\n" +
                                    "    'port' : " + portNumber + ",\n" +
                                    "    'defaultGroup' : '" + group._id + "',\n" +
                                    "    'dbName' : '" + dbName + "'\n" +
                                    "};";
                                fs.writeFile('./config.js', backConfig, (err) => {
                                    if (err) throw err;
                                    const frontConfig = "export const API_URL = 'http://" + domainName + ":" + portNumber + "/';\n" +
                                        "export const SOCKET_URL = 'http://" + domainName + ":" + (parseInt(portNumber) + 1) + "/';\n";
                                    fs.writeFile('../shm-server-front/src/constants.js', frontConfig, (err) => {
                                        if (err) throw err;
                                        process.exit();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});