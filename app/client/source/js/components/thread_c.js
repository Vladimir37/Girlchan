import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Post, FirstPost, NotFound, ServerError, PleaseWait} from './templates.js';
import Request from './utils.js';

export var Thread = React.createClass({
    getInitialState() {
        return {
            loaded_thread: false,
            error: false,
            first_post: null,
            posts: [],
            count: 0
        }
    },
    render() {
        //
    }
});