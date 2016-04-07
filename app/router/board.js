var express = require('express');

var BoardController = require('../controllers/board');

var router = express.Router();
var board = new BoardController();

router.get('/', board.index.bind(board));
router.get('/:lang', board.boards_list.bind(board));

module.exports = router;