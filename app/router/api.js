var express = require('express');

var API = require('../controllers/api');

var router = express.Router();
var api = new API();

router.get('/langs', api.langs.bind(api));
router.get('/boards', api.boards.bind(api));
router.get('/short_threads', api.short_threads.bind(api));
router.get('/posts', api.posts.bind(api));
router.get('/page', api.page.bind(api));
router.get('/full_thread', api.full_thread.bind(api));
router.get('/new_posts', api.new_posts.bind(api));
router.get('/check_logging', api.check_logging.bind(api));
router.post('/mod', api.authorization.bind(api));
router.post('/create_thread', api.create_thread.bind(api));
router.post('/create_post', api.create_post.bind(api));

module.exports = router;