import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from "react-router";
import $ from 'jquery';
import Moment from "moment";

import {Post, FirstPost, NotFound, ServerError, PleaseWait, Posting} from './templates.js';
import {Request, toast} from './utils.js';

export var Thread = React.createClass({
    mixins: [Router.State],
    getInitialState() {
        return {
            loaded_thread: false,
            loading: false,
            error: false,
            first_post: null,
            posts: [],
            count: 0
        }
    },
    getAllPosts() {
        var self = this;
        var req_data = {
            lang: this.props.params.lang,
            board: this.props.params.board,
            thread: this.props.params.thread
        };
        Request('/api/full_thread', req_data, 'GET', self, function(thread) {
            self.setState({
                loaded_thread: true,
                first_post: thread.op_post,
                posts: thread.posts,
                count: thread.count
            });
        });
    },
    getNewPosts() {
        var self = this;
        self.setState({
            loading: true
        });
        var req_data = {
            lang: this.props.params.lang,
            board: this.props.params.board,
            thread: this.props.params.thread,
            count: this.state.count
        };
        Request('/api/new_posts', req_data, 'GET', self, function(new_posts) {
            var all_posts = self.state.posts.concat(new_posts);
            self.setState({
                loading: false,
                posts: all_posts,
                count: all_posts.length
            });
        });
    },
    render() {
        Moment.locale(this.props.params.lang);
        if(this.state.error) {
            return <ServerError />;
        }
        else if(!this.state.loaded_thread) {
            this.getAllPosts();
            return <PleaseWait />;
        }
        else {
            var posts_arr = this.state.posts.map(function(post) {
                return <Post data={post} />;
            });
            var footer;
            if(this.state.loading) {
                footer = <img src="/src/images/main/load.gif" alt="loading_footer" />;
            }
            else {
                footer = <button className="btn btn-primary" onClick={this.getNewPosts}>Load new!</button>;
            }
            return <section className="full_thread">
                <FirstPost data={this.state.first_post} />
                {posts_arr}
                {footer}
                <Posting button="Create post" addr="create_post" refresh={this.getNewPosts} param={this.props.params} />
            </section>;
        }
    }
});