var models = require('../basis/models');
var stack = require('./stack');
var serialize = require('../basis/serialize');

class ApiController {
    constructor() {
        var self = this;
        models.Lang.find().then(function(langs) {
            self.all_languages = langs;
        }).catch(function(err) {
            console.log(err);
        });
        models.Board.find().then(function(boards) {
            self.all_boards = boards;
        }).catch(function(err) {
            console.log(err);
        });
    }
    langs(req, res, next) {
        res.end(serialize(0, this.all_languages));
    }
    boards(req, res, next) {
        res.end(serialize(0, this.all_boards));
    }
}

module.exports = ApiController;