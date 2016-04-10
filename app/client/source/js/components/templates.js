import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from "react-router";
import Random from "random-token";
import Moment from "moment";

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
        var read = '';
        if(this.props.read) {
            read = <a href={"/" + this.props.param.lang + "/" + this.props.param.board + "/" + this.props.data._id}>
                <button className="btn btn-xs full_read_btn">Read</button>
            </a>
        }
        return <article className="panel panel-primary">
            <article className="panel-heading">{Moment(this.props.data.time).format('LTS L')} {read}</article>
            <article className="panel-body">{this.props.data.text}</article>
        </article>;
    }
});

export var Post = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        return <article className="panel panel-default post">
            <article className="panel-heading">{Moment(this.props.data.time).format('LTS L')}</article>
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
            lang: this.props.param.lang,
            board: this.props.param.board,
            content: this.state.textValue,
            thread: this.props.param.thread
        };
        Request(url, req_data, 'POST', this, function(thread_addr) {
            if(self.props.thread) {
                window.location.pathname = '/' + req_data.lang + '/' + req_data.board + '/' + thread_addr;
            }
            else {
                toast('Post successfuly created!');
                self.setState({
                    textValue: ''
                });
                self.props.refresh();
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
        var className = this.props.small ? 'post_form' : 'thread_form';
        var target_id = 'target_' + Random(16);
        return <article className={"panel panel-info posting_form " + className}>
            <article className="panel-heading" data-toggle="collapse" data-target={'#' + target_id}>
                <h3 className="panel-title">{this.props.button}</h3>
            </article>
            <article id={target_id} className="collapse panel-body">
                <textarea className="form-control" placeholder="Your post..." value={this.state.textValue} onChange={this.handleChange}></textarea>
                <button className="btn btn-primary btn-sm" onClick={this.submitForm}>Submit</button>
            </article>
        </article>;
    }
});

export var SmallList = React.createClass({
    getInitialState() {
        return {
            loaded: false,
            boards: null
        };
    },
    getBoards() {
        var self = this;
        Request('/api/boards', {}, 'GET', self, function(boards) {
            self.setState({
                loaded: true,
                boards
            });
        });
    },
    render() {
        if(!this.state.loaded) {
            this.getBoards();
            return <ul className="breadcrumb">
                <li>Loading...</li>
            </ul>;
        }
        else {
            var lang = this.props.lang;
            var boards = this.state.boards.map(function(board) {
                return <li>
                    <a href={"/" + lang + "/" + board.addr}>
                        {board.names[lang]}
                    </a>
                </li>;
            });
            return <ul className="breadcrumb">
                {boards}
            </ul>;
        }
    }
});