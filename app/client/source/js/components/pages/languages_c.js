import React from 'react';
import ReactDOM from 'react-dom';

import {ServerError, PleaseWait} from './../templates.js';
import {Request} from './../utils.js';

export var Languages = React.createClass({
    getInitialState() {
        return {
            loaded: false,
            error: false,
            langs: []
        }
    },
    getLanguages() {
        var self = this;
        Request('/api/langs', {}, 'GET', self, function(langs) {
            self.setState({
                loaded: true,
                langs
            });
        });
    },
    render() {
        if(this.state.error) {
            return <ServerError />;
        }
        else if(!this.state.loaded) {
            this.getLanguages();
            return <PleaseWait />;
        }
        else {
            var languages = this.state.langs.map(function(lang) {
                return <a href={"/" + lang.addr}>
                    <h2>{lang.name}</h2>
                </a>;
            });
            return <article className="languages">{languages}</article>;
        }
    }
});