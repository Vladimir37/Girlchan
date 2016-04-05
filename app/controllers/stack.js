var models = require('../basis/models');
var langs = require('../data/languages');
var config = require('../../config');

class board {
    constructor(lang, board) {
        models.Post.find({
            lang,
            board,
            answer: false
        }).sort({
            date: -1
        }).then(function(threads) {
            var stack = [];
            threads.forEach(function(thread) {
                stack.push(thread._id);
            });
            this.stack = stack;
        }).catch(function(err) {
            throw err;
        });
    }
    add_thread(id) {
        this.stack.unshift(id);
        if(this.stack.length > config.max_threads) {
            var excess = this.stack.slice(config.max_threads);
            excess.forEach(function(thread) {
                this.delete_thread(thread);
            })
        }
    }
    delete_thread(id) {
        models.Post.remove({
            $or: [
                {thread: id},
                {id}
            ]
        }).catch(function(err) {
            console.log(err);
        });
    }
    bump_thread(id) {
        var index = this.stack.indexOf(id);
        if(index != -1) {
            this.stack.unshift(+this.stack.splice(index, 1));
        }
    }
};



module.exports = board;