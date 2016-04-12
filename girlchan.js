var http = require('http');

var app = require('./app/app');
var config = require('./config');

// Front-end bundle
//var webpack = require('./app/basis/webpack');
//webpack();

http.createServer(app).listen(config.port_main);