var models = require('../basis/models');
var stack = require('./stack');
var serialize = require('../basis/serialize');

var api_actions = {
    // todo Из конфига, а не базы
    langs(req, res, next) {
        models.Langs.find().then(function(result) {
            res.end(serialize(0, result));
        }).catch(function(err) {
            console.log(err);
            res.end(serialize(1));
        });
    }
};

module.exports = api_actions;