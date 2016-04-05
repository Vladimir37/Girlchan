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

var postSchema = new mongoose.Schema({
    lang: String,
    board: String,
    answer: Boolean,
    thread: String,
    time: Date,
    text: String
});
models.Post = mongoose.model('Post', postSchema);

mongoose.connect('mongodb://localhost/girlchan');

module.exports = models;