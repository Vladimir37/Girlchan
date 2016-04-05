var http = require('http');

var app = require('./app/app');
var config = require('./config');

http.createServer(app).listen(config.port_main);