var passport = require('passport');

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
        var lang = req.query.lang;
        var board = req.query.board;
        if(stacks[lang][board]) {
            res.end(serialize(0, stacks[lang][board].stack));
        }
        else {
            res.end(serialize(1));
        }
    }
    short_threads(req, res, next) {
        var lang = req.query.lang;
        var board = req.query.board;
        var thread_arr;
        try {
            thread_arr = JSON.parse(req.query.threads);
        }
        catch(err) {
            res.end(serialize(2));
        }
        var threads_promises = [];
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
            threads_promises.push(Promise.all([op_post_req, posts_req, count_req]));
        });
        Promise.all(threads_promises).then(function(short_thread_res_arr) {
            var threads = [];
            short_thread_res_arr.forEach(function(short_thread_res) {
                var short_thread = {
                    op_post: short_thread_res[0],
                    posts: short_thread_res[1].reverse(),
                    count: short_thread_res[2]
                };
                threads.push(short_thread);
            });
            res.end(serialize(0, threads));
        }).catch(function(err) {
            res.end(serialize(1));
            console.log(err);
        });
    }
    posts(req, res, next) {
        var lang = req.query.lang;
        var board = req.query.board;
        var thread = req.query.thread;
        var skip = req.query.skip;
        var limit = req.query.limit;
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
        var lang = req.query.lang;
        var board = req.query.board;
        var thread = req.query.thread;
        if(!thread) {
            res.end(serialize(1));
            return false;
        }
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
                posts: thread_content[1],
                count: thread_content[1].length
            };
            res.end(serialize(0, result));
        }).catch(function(err) {
            console.log(err);
            res.end(serialize(1));
        });
    }
    new_posts(req, res, next) {
        var lang = req.query.lang;
        var board = req.query.board;
        var thread = req.query.thread;
        var count = req.query.count;
        models.Post.find({
            lang,
            board,
            answer: true,
            thread: thread
        }).sort({
            time: 1
        }).skip(count).then(function(posts) {
            res.end(serialize(0, posts));
        }).catch(function(err) {
            console.log(err);
            res.end(serialize(1));
        });
    }
    create_thread(req, res, next) {
        var lang = req.body.lang;
        var board = req.body.board;
        var text = req.body.content;
        var title = req.body.title || null;
        var color = req.body.color || null;
        var time_now = new Date();
        models.Post.create({
            lang,
            board,
            answer: false,
            time: time_now,
            title,
            text,
            color
        }).then(function(new_thread) {
            stacks[lang][board].add_thread(new_thread._id);
            res.end(serialize(0, new_thread._id));
        }).catch(function(err) {
            console.log(err);
            res.end(serialize(1));
        });
    }
    create_post(req, res, next) {
        var lang = req.body.lang;
        var board = req.body.board;
        var thread = req.body.thread;
        var text = req.body.content;
        var color = req.body.color || null;
        var time_now = new Date();
        models.Post.create({
            lang,
            board,
            answer: true,
            thread,
            time: time_now,
            text,
            color
        }).then(function() {
            stacks[lang][board].bump_thread(thread);
            res.end(serialize(0));
        }).catch(function(err) {
            console.log(err);
            res.end(serialize(1));
        });
    }
    authorization(req, res, next) {
        passport.authenticate('local', function(err, user) {
            if(err || !user) {
                res.end(serialize(1));
                return false;
            }
            req.logIn(user, function(err) {
                if(err) {
                    console.log(err);
                    res.end(serialize(1));
                }
                else {
                    res.end(serialize(0));
                }
            });
        })(req, res, next);
    }
    check_logging(req, res, next) {
        if(req.isAuthenticated()) {
            res.end(serialize(0));
        }
        else {
            res.end(serialize(1));
        }
    }
}

module.exports = ApiController;