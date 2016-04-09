import React from 'react';
import ReactDOM from 'react-dom';

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
        return null;
    },
    render() {
        return <article className="posting_form">
            <button className="btn btn-primary" data-toggle="collapse" data-target="#posting">{this.props.button}</button>
            <article id="posting" className="collapse">
                <from method="POST" action={"/api/" + this.props.addr}>
                    <textarea className="form-control" placeholder="Your post..." required></textarea>
                    <button className="btn btn-primary btn-sm">Submit</button>
                </from>
            </article>
        </article>;
    }
});