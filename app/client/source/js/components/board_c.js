import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from "react-router";
import $ from 'jquery';

import {Post, FirstPost, NotFound, ServerError, PleaseWait, Posting} from './templates.js';
import {Request, toast} from './utils.js';

var Thread = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        var posts_arr = this.props.data.posts.map(function(post) {
            return <Post data={post} />;
        });
        return <section className="thread">
            <FirstPost data={this.props.data.op_post} param={this.props.param} read="true" />
            {posts_arr}
        </section>;
    }
});

export var Board = React.createClass({
    mixins: [ Router.State ],
    getInitialState() {
        return {
            loaded_threads: false,
            loaded_content: false,
            error: false,
            threads: [],
            content: [],
            limit: 10,
            start: 0
        };
    },
    getThreads() {
        var self = this;
        var req_data = {
            lang: this.props.params.lang,
            board: this.props.params.board
        };
        Request('/api/page', req_data, 'GET', self, function(threads) {
            self.setState({
                loaded_threads: true,
                threads
            }, function(err) {

            });
        });
    },
    getContent() {
        var self = this;
        var req_data = {
            lang: this.props.params.lang,
            board: this.props.params.board,
            threads: JSON.stringify(self.state.threads.slice(self.state.start, self.state.limit))
        };
        Request('/api/short_threads', req_data, 'GET', self, function(threads) {
            console.log(threads);
            self.setState({
                loaded_content: true,
                content: self.state.content.concat(threads),
                start: self.state.start + self.state.limit
            });
        });
    },
    render() {
        var self = this;
        if(this.state.error) {
            return <ServerError />;
        }
        else if(!this.state.loaded_threads) {
            this.getThreads();
            return <PleaseWait />;
        }
        else if(!this.state.loaded_content) {
            this.getContent();
            return <PleaseWait />;
        }
        else {
            var threads_arr = this.state.content.map(function(thread) {
                return <Thread data={thread} param={self.props.params} />
            });
            return <article className="threads_list">
                <Posting button="Create thread" addr="create_thread" thread="true" param={this.props.params}/>
                {threads_arr}
            </article>;
        }
    }
});