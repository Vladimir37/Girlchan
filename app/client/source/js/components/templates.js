import React from 'react';
import ReactDOM from 'react-dom';

import {Request, toast} from './utils.js';

export var NotFound = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        return <article className="error">
            <h2>Error 404</h2>
            <h3>Page not found.</h3>
        </article>;
    }
});

export var ServerError = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        return <article className="error">
            <h2>Error 500</h2>
            <h3>Server error! Try again later.</h3>
        </article>;
    }
});

export var PleaseWait = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        return <article className="loading">
            <h3>Please wait...</h3>
            <img src="/src/images/main/load.gif" alt="loading"/>
        </article>;
    }
});

export var FirstPost = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        return <article className="panel panel-primary">
            <article className="panel-heading">{this.props.data.time}</article>
            <article className="panel-body">{this.props.data.text}</article>
        </article>;
    }
});

export var Post = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        return <article className="panel panel-default">
            <article className="panel-heading">{this.props.data.time}</article>
            <article className="panel-body">{this.props.data.text}</article>
        </article>;
    }
});

export var Posting = React.createClass({
    getInitialState() {
        return {
            textValue: ''
        };
    },
    submitForm() {
        if(!this.state.textValue) {
            toast('Required fields are empty!', true);
            return false;
        }
        var self = this;
        var url = "/api/" + this.props.addr;
        var req_data = {
            lang: this.props.params.lang,
            board: this.props.params.board,
            content: this.state.textValue,
            thread: this.props.params.thread
        };
        Request(url, req_data, 'POST', this, function(data) {
            if(this.props.thread) {
                window.location.pathname = '/' + req_data.lang + '/' + req_data.board + '/' + data._id;
            }
            else {
                toast('Post successfuly created!');
                self.setState({
                    textValue: ''
                });
            }
        }, function() {
            toast('Server error!', true);
        });
    },
    handleChange(event) {
        this.setState({
            textValue: event.target.value
        });
    },
    render() {
        return <article className="posting_form">
            <button className="btn btn-primary" data-toggle="collapse" data-target="#posting">{this.props.button}</button>
            <article id="posting" className="collapse">
                <textarea className="form-control" placeholder="Your post..." value={this.state.textValue} onChange={this.handleChange}></textarea>
                <button className="btn btn-primary btn-sm">Submit</button>
            </article>
        </article>;
    }
});