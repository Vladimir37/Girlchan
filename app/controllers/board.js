var models = require('../basis/models');
var errors = require('../basis/errors');

class BoardController {
    constructor() {
        var self = this;
        var boards_data = {};
        var lang_req = models.Lang.find();
        var board_req = models.Board.find();
        Promise.all([lang_req, board_req]).then(function(data) {
            data[0].forEach(function(lang) {
                boards_data[lang.addr] = {
                    name: lang.name,
                    boards: {}
                };
                data[1].forEach(function(board) {
                    boards_data[lang.addr].boards[board.addr] = board.names[lang.addr];
                });
            });
            self.boards = boards_data;
            console.log('Boards data successfully created');
        }).catch(function(err) {
            console.log(err);
        });
    }
    index(req, res, next) {
        res.render('pages/index', {
            data: this.boards
        });
    }
    boards_list(req, res, next) {
        var lang = req.params.lang;
        if(this.boards[lang]) {
            res.render('pages/boards', {
                data: this.boards,
                lang
            });
        }
        else {
            errors.e404(req, res, next);
        }
    }
    page(req, res, next) {
        res.render('pages/main');
    }
}

module.exports = BoardController;