var express = require('express');

var api = require('../actions/api');

var router = express.Router();

router.get('/langs', api.langs);

module.exports = router;