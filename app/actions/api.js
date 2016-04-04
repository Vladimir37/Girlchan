var models = require('../basis/models');
var serialize = require('../basis/serialize');

var api_actions = {
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