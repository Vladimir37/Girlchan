var models = require('../basis/models');
var config = require('../../config');

class Board {
    constructor(lang, board) {
        var self = this;
        models.Post.find({
            lang,
            board,
            answer: false
        }).sort({
            date: -1
        }).then(function(threads) {
            var stack = [];
            threads.forEach(function(thread) {
                stack.push(thread._id.toString());
            });
            self.stack = stack;
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
            this.stack.unshift(this.stack.splice(index, 1)[0]);
        }
    }
}

// Initialization
var stacks = {};

var stack_data_request = [models.Lang.find(), models.Board.find()];

Promise.all(stack_data_request).then(function(result) {
    result[0].forEach(function(lang) {
        stacks[lang.addr] = {};
        result[1].forEach(function(board) {
            stacks[lang.addr][board.addr] = new Board(lang.addr, board.addr);
        });
    });
}).then(function() {
    console.log('Stack successfully created');
}).catch(function(err) {
    console.log('Stack creation error');
    console.log(err);
});

module.exports = stacks;