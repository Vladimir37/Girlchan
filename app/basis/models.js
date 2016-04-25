var mongoose = require('mongoose');

var connection = mongoose.connection;

//connection check
connection.on('open', function() {
    console.log('Connection to DB created');
});
connection.on('error', function(err) {
    console.log('Error connect to DB!');
    console.log(err);
});

// Models
var models = {};

var langSchema = new mongoose.Schema({
    addr: String,
    name: String
});
models.Lang = mongoose.model('Lang', langSchema);

var boardSchema = new mongoose.Schema({
    addr: String,
    names: Object
});
models.Board = mongoose.model('Board', boardSchema);

var adminSchema = new mongoose.Schema({
    username: String,
    password: String
});
models.Admin = mongoose.model('Admin', adminSchema);

var postSchema = new mongoose.Schema({
    lang: String,
    board: String,
    answer: Boolean,
    thread: String,
    time: Date,
    title: String,
    text: String,
    color: String
});
models.Post = mongoose.model('Post', postSchema);

mongoose.connect('mongodb://localhost/girlchan');

module.exports = models;