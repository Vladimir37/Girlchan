import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from "react-router";

import {NotFound, PleaseWait} from '../templates.js';
import {Request} from '../utils.js';

export var List = React.createClass({
    mixins: [Router.State],
    getInitialState() {
        return {
            loaded: false,
            error: false,
            boards: []
        }
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
        if(this.state.error) {
            return <NotFound />;
        }
        else if(!this.state.loaded) {
            this.getBoards();
            return <PleaseWait />;
        }
        else {
            var current_lang = this.props.params.lang;
            var boards = this.state.boards.map(function(board) {
                return <a href={"/" + current_lang + "/" + board.addr}>
                    <h2>{board.names[current_lang]}</h2>
                </a>;
            });
            return <article className="boards">{boards}</article>;
        }
    }
});