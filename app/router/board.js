var express = require('express');

var BoardController = require('../controllers/board');

var router = express.Router();
var board = new BoardController();

router.use(board.page.bind(board));

module.exports = router;