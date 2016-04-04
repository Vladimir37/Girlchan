var mongoose = require('mongoose');

var connection = mongoose.connection;

//connection check
connection.on('open', function() {
    console.log('Connection to DB created!');
});
connection.on('error', function(err) {
    console.log('Error connect to DB!');
    console.log(err);
});

// Models
var models = {};

var adminSchema = new mongoose.Schema({
    name: String,
    pass: String
});
models.Admin = mongoose.model('Admin', adminSchema);

var langSchema = new mongoose.Schema({
    name: String,
    addr: String
});
models.Langs = mongoose.model('Lang', langSchema);

var boardSchema = new mongoose.Schema({
    name: String,
    addr: String
});
models.Board = mongoose.model('Board', boardSchema);

var postSchema = new mongoose.Schema({
    board: String,
    answer: Boolean,
    thread: String,
    time: Date,
    text: String
});
models.Post = mongoose.model('Post', postSchema);

mongoose.connect('mongodb://localhost/girlchan');

module.exports = models;