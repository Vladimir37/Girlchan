var express = require('express');

var api = require('../controllers/api');

var router = express.Router();

router.get('/langs', api.langs);

module.exports = router;