var express = require('express');

var api = require('./api');
var admin = require('./admin');
var board = require('./board');

var router = express.Router();

router.use('/api', api);
router.use('/admin', admin);
router.use('/', board);

module.exports = router;