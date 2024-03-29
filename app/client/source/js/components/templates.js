import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from "react-router";
import Random from "random-token";
import Moment from "moment";
import Cookies from "js-cookie";

import {Request, toast, markdown} from './utils.js';
import {store, loadAct, cleanAct} from './redux.js';

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
    readFullThread() {
        store.dispatch(loadAct(this.props.data._id));
        window.location.hash = this.props.data._id;
        $('#modal-thread').modal('show');
    },
    render() {
        var read = '';
        var color_panel = '';
        var admin_button = '';
        if(this.props.data.color) {
            color_panel = <article className="color_panel circle" style={{background: "#" + this.props.data.color}}></article>;
        }
        if(this.props.read) {
            read = <button className="btn btn-xs full_read_btn" onClick={this.readFullThread}>Read full thread</button>;
        }
        if(this.props.admin) {
            admin_button = <article className="admin_btns">
                <button className="btn btn-xs full_read_btn">Ban author</button>
                <button className="btn btn-xs full_read_btn">Move this topic</button>
                <button className="btn btn-xs full_read_btn">Delete this topic</button>
            </article>;
        }
        return <article className="panel panel-primary">
            <article className="panel-heading">
                <h4 className="modal-title">{this.props.data.title}</h4>
                {Moment(this.props.data.time).format('LTS L')} {read} {admin_button} {color_panel}
            </article>
            <article className="panel-body" dangerouslySetInnerHTML={markdown(this.props.data.text)} />
        </article>;
    }
});

export var Post = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        var color_panel = '';
        var admin_button = '';
        if(this.props.data.color) {
            color_panel = <article className="color_panel circle" style={{background: "#" + this.props.data.color}}></article>;
        }
        if(this.props.admin) {
            admin_button = <article className="admin_btns">
                <button className="btn btn-xs full_read_btn">Ban author</button>
                <button className="btn btn-xs full_read_btn">Delete this post</button>
            </article>;
        }
        return <article className="panel panel-default post">
            <article className="panel-heading">{Moment(this.props.data.time).format('LTS L')} {admin_button} {color_panel}</article>
            <article className="panel-body" dangerouslySetInnerHTML={markdown(this.props.data.text)} />
        </article>;
    }
});

export var Posting = React.createClass({
    getInitialState() {
        var current_color = Cookies.get('gc_color');
        return {
            titleValue: '',
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
            title: this.state.titleValue,
            content: this.state.textValue,
            color: this.state.color,
            thread: this.props.param.thread
        };
        if(this.state.color) {
            Cookies.set('gc_color', this.state.color, { expires: 7 });
        }
        Request(url, req_data, 'POST', this, function(thread_addr) {
            if(self.props.thread) {
                window.location.pathname = '/' + req_data.lang + '/' + req_data.board;
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
    changeTitle(event) {
        this.setState({
            titleValue: event.target.value
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
        var title = '';
        if(this.props.thread) {
            title = <input type="text" className="form-control posting_title" placeholder="Title" value={this.state.titleValue} onChange={this.changeTitle} />;
        }
        return <article className={"panel panel-info posting_form " + className}>
            <article className="panel-heading" data-toggle="collapse" data-target={'#' + target_id}>
                <h3 className="panel-title">{this.props.button}</h3>
            </article>
            <article id={target_id} className="collapse panel-body">
                {color}
                {title}
                <textarea className="form-control" placeholder="Your post..." value={this.state.textValue} onChange={this.changeText}></textarea>
                <input type="text" name="color" className="colorpick" value={this.state.color} onChange={this.changeColor} />
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

export var ModalThread = React.createClass({
    getInitialState() {
        return {
            thread: store.getState().thread,
            load_num: 0
        };
    },
    selectThread() {
        this.setState({
            thread: store.getState().thread,
            load_num: this.state.load_num + 1
        });
    },
    render() {
        var data = {
            lang: this.props.lang,
            board: this.props.board,
            thread: this.state.thread
        };
        var self = this;
        store.subscribe(function() {
            self.selectThread();
        });
        return <article className="modal fade" id="modal-thread" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <article className="modal-dialog modal-lg">
                <article className="modal-content">
                    <article className="modal-body">
                        <Thread data={data} num={this.state.load_num} />
                    </article>
                    <article className="modal-footer"></article>
                </article>
            </article>
        </article>;
    }
});

export var Thread = React.createClass({
    mixins: [Router.State],
    getInitialState() {
        return {
            load_num: 0,
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
            lang: this.props.data.lang,
            board: this.props.data.board,
            thread: this.props.data.thread
        };
        Request('/api/full_thread', req_data, 'GET', self, function(thread) {
            self.setState({
                error: false,
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
            lang: this.props.data.lang,
            board: this.props.data.board,
            thread: this.props.data.thread,
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
        Moment.locale(this.props.data.lang);
        if(this.props.num != this.state.load_num) {
            this.setState({
                load_num: this.props.num,
                loaded_thread: false,
                loading: false,
                error: false,
                first_post: null,
                posts: [],
                count: 0
            })
        }
        if(this.state.error) {
            return <NotFound />;
        }
        else if(!this.state.loaded_thread) {
            this.getAllPosts();
            return <PleaseWait />;
        }
        else {
            console.log(this.props.admin);
            var self = this;
            var posts_arr = this.state.posts.map(function(post) {
                return <Post data={post} admin={self.props.admin} />;
            });
            var footer;
            if(this.state.loading) {
                footer = <img src="/src/images/main/load.gif" alt="loading_footer" />;
            }
            else {
                footer = <button className="btn btn-primary" onClick={this.getNewPosts}>Load new!</button>;
            }
            return <section className="full_thread">
                <FirstPost data={this.state.first_post} admin={this.props.admin} />
                {posts_arr}
                {footer}
                <Posting button="Create post" addr="create_post" refresh={this.getNewPosts} param={this.props.data} />
            </section>;
        }
    }
});