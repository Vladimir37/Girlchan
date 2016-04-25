var express = require('express');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var router = require('./router/__main__');
var strategy = require('./basis/strategy');
var models = require('./basis/models');
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

//sessions and passport
app.use(session({
    secret: 'test',
    resave: true,
    saveUninitialized: true
}));

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    models.Admin.findOne({
        _id: id
    }).then(function(user) {
        done(null, user);
    }).catch(function(err) {
        done(err);
    });
});


//favicon
//app.use(favicon(__dirname + '/client/source/img/main/favicon.ico'));

//public source
app.use('/src', express.static(__dirname + '/client/source'));

app.use('/', router);

//errors
app.use(errors.e404);
app.use(errors.render);

module.exports = app;