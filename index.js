// IMPORT 
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    app = express()
http = require('http'),
    url = require('url'),
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

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
};

// DB CONNECTION
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/' + config.dbName, {
    useNewUrlParser: true
});


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


// SEND 404 IF ROUTE DOESN'T EXIST
app.use(function (req, res) {
    res.status(404).send({
        url: req.originalUrl + ' not found'
    })
});

// RETURN WEB INTERFACE
http.createServer(function (req, res) {
    console.log(`${req.method} ${req.url}`);
    const parsedUrl = url.parse(req.url);

    const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
    let pathname = path.join(path.join(__dirname,'public'), sanitizePath);
    fs.exists(pathname, function (exist) {
        if (!exist) {
            pathname = path.join(__dirname,'public/');
        }

        if (fs.statSync(pathname).isDirectory()) {
            pathname += 'index.html';
        }
        
        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                const ext = path.parse(pathname).ext;
                res.setHeader('Content-type', mimeType[ext] || 'text/plain');
                res.end(data);
            }
        });
    });
}).listen(80);

// LOG PORTS
console.log('SHM RESTful API server started on: ' + port);
console.log('SHM web server started on: 80');