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