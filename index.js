// IMPORT 
var express = require('express'),
    path = require('path'),
    app = express()
    front = express(),
    mongoose = require('mongoose'),
    cors = require('cors'),
    Group = require('./api/models/groupModel'),
    Device = require('./api/models/deviceModel'),
    State = require('./api/models/stateModel'),
    Log = require('./api/models/logModel'),
    User = require('./api/models/userModel'),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    config = require('./config')
    port = config.port;


// DB CONNECTION
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/'+config.dbName, { useNewUrlParser: true });


// EXPRESS MIDDLEWARE
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());


// DEFINE ROUTES FOR API
var groupRoutes = require('./api/routes/groupRoutes');
var userRoutes = require('./api/routes/userRoutes');
var deviceRoutes = require('./api/routes/deviceRoutes');
var stateRoutes = require('./api/routes/stateRoutes');
var logRoutes = require('./api/routes/logRoutes');
groupRoutes(app);
userRoutes(app);
deviceRoutes(app);
stateRoutes(app);
logRoutes(app);


// LISTEN ON PORT
app.listen(port);
front.listen(8080);


// SEND 404 IF ROUTE DOESN'T EXIST
app.use(function(req, res) {
    res.status(404).send({
        url: req.originalUrl + ' not found'
    })
});

// RETURN WEB INTERFACE
front.use(express.static('public'));

// LOG PORTS
console.log('SHM RESTful API server started on: ' + port);
console.log('SHM web server started on: 8080');