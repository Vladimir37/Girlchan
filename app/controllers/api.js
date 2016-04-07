var models = require('../basis/models');
var stacks = require('./stack');
var serialize = require('../basis/serialize');

class ApiController {
    constructor() {
        var self = this;
        models.Lang.find().then(function(langs) {
            self.all_languages = langs;
        }).catch(function(err) {
            console.log(err);
        });
        models.Board.find().then(function(boards) {
            self.all_boards = boards;
        }).catch(function(err) {
            console.log(err);
        });
    }
    langs(req, res, next) {
        res.end(serialize(0, this.all_languages));
    }
    boards(req, res, next) {
        res.end(serialize(0, this.all_boards));
    }
    page(req, res, next) {
        var lang = req.body.lang;
        var board = req.body.board;
        if(stacks[lang][board]) {
            res.end(serialize(0, stacks[lang][board].stack));
        }
        else {
            res.end(serialize(1));
        }
    }
    short_threads(req, res, next) {
        var threads = [];
        var lang = req.body.lang;
        var board = req.body.board;
        var thread_arr;
        try {
            thread_arr = JSON.parse(req.body.threads);
        }
        catch(err) {
            res.end(serialize(2));
        }
        thread_arr.forEach(function(thread_id) {
            var op_post_req = models.Post.findOne({
                lang,
                board,
                _id: thread_id
            });
            var posts_req = models.Post.find({
                lang,
                board,
                answer: true,
                thread: thread_id
            }).sort({
                time: -1
            }).limit(5);
            var count_req = models.Post.count({
                lang,
                board,
                answer: true,
                thread: thread_id
            });
            Promise.all([op_post_req, posts_req, count_req]).then(function(short_thread_res) {
                var short_thread = {
                    op_post: short_thread_res[0],
                    posts: short_thread_res[1].reverse(),
                    count: short_thread_res[2]
                };
                threads.push(short_thread);
            }).catch(function(err) {
                res.end(serialize(1));
                console.log(err);
            });
        });
        res.end(serialize(0, threads));
    }
    posts(req, res, next) {
        var lang = req.body.lang;
        var board = req.body.board;
        var thread = req.body.thread;
        var skip = req.body.skip;
        var limit = req.body.limit;
        models.Post.find({
            lang,
            board,
            answer: true,
            thread: thread
        }).sort({
            time: -1
        }).skip(skip).limit(limit).then(function(posts) {
            res.end(serialize(0, posts.reverse()));
        }).catch(function(err) {
            res.end(serialize(1));
            console.log(err);
        });
    }
    full_thread(req, res, next) {
        var lang = req.body.lang;
        var board = req.body.board;
        var thread = req.body.thread;
        var op_post = models.Post.findOne({
            lang,
            board,
            _id: thread
        });
        var posts = models.Post.find({
            lang,
            board,
            answer: true,
            thread: thread
        }).sort({
            time: 1
        });
        Promise.all([op_post, posts]).then(function(thread_content) {
            var result = {
                op_post: thread_content[0],
                posts: thread_content[1]
            };
            res.end(serialize(0, result));
        }).catch(function(err) {
            res.end(serialize(1));
            console.log(err);
        });
    }
}

module.exports = ApiController;