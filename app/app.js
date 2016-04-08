var express = require('express');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

var router = require('./router/__main__');
var errors = require('./basis/errors');

var app = express();

//render templates
app.set('view engine', 'jade');
app.set('views', __dirname +  '/client/views');

//cookies and POST data
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//favicon
//app.use(favicon(__dirname + '/client/source/img/main/favicon.ico'));

//public source
app.use('/src', express.static(__dirname + '/client/source'));

app.use('/', router);

//errors
app.use(errors.e404);
app.use(errors.render);

module.exports = app;