import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import $ from 'jquery';
import Moment from "moment";

import {Post, FirstPost, NotFound, ServerError, PleaseWait, Posting, SmallList, ModalThread} from '../templates.js';
import {Request, toast} from '../utils.js';
import {store, loadAct} from '../redux.js';

var Thread = React.createClass({
    getInitialState() {
        return {
            posts: this.props.data.posts,
            count_loaded: this.props.data.posts.length,
            count_full: this.props.data.count
        };
    },
    getMorePosts() {
        var self = this;
        var req_data = {
            lang: this.props.param.lang,
            board: this.props.param.board,
            thread: this.props.data.op_post._id,
            skip: this.state.count_loaded,
            limit: 5
        };
        Request('/api/posts', req_data, 'GET', self, function(posts) {
            self.setState({
                posts: posts.concat(self.state.posts),
                count_loaded: self.state.count_loaded + posts.length
            });
        });
    },
    getNewPosts() {
        var self = this;
        var req_data = {
            lang: this.props.param.lang,
            board: this.props.param.board,
            thread: this.props.data.op_post._id,
            count: this.state.count_full
        };
        Request('/api/new_posts', req_data, 'GET', self, function(posts) {
            self.setState({
                posts: self.state.posts.concat(posts),
                count_full: self.state.count_full + posts.length,
                count_loaded: self.state.count_loaded + posts.length
            });
        });
    },
    render() {
        var count_panel = '';
        if(this.state.count_full - this.state.count_loaded > 0) {
            count_panel = <article className="list-group count_panel">
                <li className="list-group-item">And {this.state.count_full - this.state.count_loaded} another posts...</li>
                <li className="list-group-item more_posts" onClick={this.getMorePosts}>Load more</li>
            </article>;
        }
        var params = {
            lang: this.props.param.lang,
            board: this.props.param.board,
            thread: this.props.data.op_post._id
        };
        var posts_arr = this.state.posts.map(function(post) {
            return <Post data={post} />;
        });
        return <section className="thread">
            <FirstPost data={this.props.data.op_post} param={this.props.param} read="true" />
            {count_panel}
            {posts_arr}
            <Posting button="Reply to this topic" addr="create_post" refresh={this.getNewPosts} param={params} small="true" />
        </section>;
    }
});

export var Board = React.createClass({
    mixins: [Router.State],
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
    componentDidUpdate() {
        if(this.state.loaded_content && window.location.hash) {
            store.dispatch(loadAct(window.location.hash.slice(1)));
            console.log(window.location.hash.slice(1));
            $('#modal-thread').modal('show');
        }
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
            });
        });
    },
    getContent() {
        var self = this;
        var req_data = {
            lang: this.props.params.lang,
            board: this.props.params.board,
            threads: JSON.stringify(self.state.threads.slice(self.state.start, (self.state.limit + self.state.start)))
        };
        Request('/api/short_threads', req_data, 'GET', self, function(threads) {
            self.setState({
                loaded_content: true,
                content: self.state.content.concat(threads),
                start: self.state.start + self.state.limit
            });
        });
    },
    render() {
        Moment.locale(this.props.params.lang);
        if(this.state.error) {
            return <NotFound />;
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
            var self = this;
            var threads_arr = this.state.content.map(function(thread) {
                return <Thread data={thread} param={self.props.params} />
            });
            return <article className="threads_list">
                <ModalThread lang={this.props.params.lang} board={this.props.params.board} />
                <SmallList lang={this.props.params.lang} />
                <Posting button="Create topic" addr="create_thread" thread="true" param={this.props.params}/>
                {threads_arr}
                <div className="clearfix"></div>
                <button className="btn btn-primary" onClick={this.getContent}>Load more topics</button>
            </article>;
        }
    }
});