var models = require('../basis/models');
var errors = require('../basis/errors');

class BoardController {
    page(req, res, next) {
        res.render('main');
    }
}

module.exports = BoardController;