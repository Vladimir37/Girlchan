var express = require('express');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

var app = express();

//render templates
app.set('view engine', 'jade');
app.set('views', __dirname +  '/client/view');

//cookies and POST data
app.use(cookieParser());
app.use(bodyParser());

//favicon
//app.use(favicon(__dirname + '/client/source/img/main/favicon.ico'));

//app.use('/', router);

//public source
app.use('/src', express.static(__dirname + '/client/source'));

//errors
//app.use(errors.e404);
//app.use(errors.render);

module.exports = app;