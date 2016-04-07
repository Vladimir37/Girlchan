var express = require('express');

var api = require('./api');
var board = require('./board');

var router = express.Router();

router.use('/api', api);
router.use('/', board);

module.exports = router;