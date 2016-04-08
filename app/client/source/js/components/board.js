import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Post, FirstPost, NotFound, ServerError} from 'templates.js';
import Request from 'utils.js';

var Thread = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        var posts_arr = this.props.data.posts.map(function(post) {
            return <Post data={post} />;
        });
        return <section className="thread">
            <FirstPost data={data.op_post} />
            {posts_arr}
        </section>;
    }
});

export default React.createClass({
    getInitialState() {
        return {
            loaded: false,
            error: false,
            threads: null,
            content: null
        };
    },
    get_threads() {
        var self = this;
        var req_data = {
            lang: this.props.params.lang,
            board: this.props.params.board
        };
        Request('/api/page', req_data, 'GET', function() {
            //
        });
    },
    render() {
        //
    }
});