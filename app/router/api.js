var express = require('express');

var API = require('../controllers/api');

var router = express.Router();
var api = new API();

router.get('/langs', api.langs.bind(api));
router.get('/boards', api.boards.bind(api));

module.exports = router;