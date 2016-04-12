import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from "react-router";
import Random from "random-token";
import Moment from "moment";
import Cookies from "js-cookie";

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
        var color_panel = '';
        if(this.props.data.color) {
            color_panel = <article className="color_panel circle" style={{background: "#" + this.props.data.color}}></article>;
        }
        if(this.props.read) {
            read = <a href={"/" + this.props.param.lang + "/" + this.props.param.board + "/" + this.props.data._id}>
                <button className="btn btn-xs full_read_btn">Read</button>
            </a>
        }
        return <article className="panel panel-primary">
            <article className="panel-heading">{Moment(this.props.data.time).format('LTS L')} {read} {color_panel}</article>
            <article className="panel-body">{this.props.data.text}</article>
        </article>;
    }
});

export var Post = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        var color_panel = '';
        if(this.props.data.color) {
            color_panel = <article className="color_panel circle" style={{background: "#" + this.props.data.color}}></article>;
        }
        return <article className="panel panel-default post">
            <article className="panel-heading">{Moment(this.props.data.time).format('LTS L')} {color_panel}</article>
            <article className="panel-body">{this.props.data.text}</article>
        </article>;
    }
});

export var Posting = React.createClass({
    getInitialState() {
        var current_color = Cookies.get('gc_color');
        return {
            textValue: '',
            color: current_color || null
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
            color: this.state.color,
            thread: this.props.param.thread
        };
        if(this.state.color) {
            Cookies.set('gc_color', this.state.color, { expires: 7 });
        }
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
    changeText(event) {
        this.setState({
            textValue: event.target.value
        });
    },
    changeColor(event) {
        var new_color = event.target.value;
        if(new_color == 'None') {
            new_color = null;
        }
        this.setState({
            color: new_color
        });
    },
    render() {
        var className = this.props.small ? 'post_form' : 'thread_form';
        var target_id = 'target_' + Random(16);
        var color = <article className="color_posting">Colorless</article>;
        if(this.state.color) {
            color = <article className="circle" style={{background: "#" + this.state.color}}></article>;
        }
        return <article className={"panel panel-info posting_form " + className}>
            <article className="panel-heading" data-toggle="collapse" data-target={'#' + target_id}>
                <h3 className="panel-title">{this.props.button}</h3>
            </article>
            <article id={target_id} className="collapse panel-body">
                {color}
                <textarea className="form-control" placeholder="Your post..." value={this.state.textValue} onChange={this.changeText}></textarea>
                <select name="color" value={this.state.color} onChange={this.changeColor}>
                    <option>None</option>
                    <option value="00C0FF">Blue</option>
                    <option value="FF6736">Orange</option>
                    <option value="FF0000">Red</option>
                    <option value="6AFF36">Green</option>
                    <option value="CB36FF">Violet</option>
                    <option value="FFFC33">Yellow</option>
                    <option value="F757A9">Pink</option>
                    <option value="9C57F7">Purple</option>
                </select>
                <br/>
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