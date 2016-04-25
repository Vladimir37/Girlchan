import React from 'react';
import ReactDOM from 'react-dom';

import {PleaseWait} from './../templates.js';
import {Request, toast} from './../utils.js';

export var Login = React.createClass({
    getInitialState() {
        return {
            logged: false,
            username: '',
            password: ''
        };
    },
    changeLogin(event) {
        this.setState({
            username: event.target.value
        })
    },
    changePass(event) {
        this.setState({
            password: event.target.value
        })
    },
    submit() {
        if(!this.state.username || !this.state.password) {
            toast('Required fields are empty!', true);
        }
        else {
            var self = this;
            Request('/api/mod', this.state, 'POST', self, function(data) {
                window.location.pathname = '/';
            }, function() {
                toast('Incorrect login or password!', true);
                self.setState({
                    password: ''
                });
            });
        }
    },
    render() {
        return <section className="login">
            <input type="text" value={this.state.username} onChange={this.changeLogin} className='form-control' placeholder='Login' />
            <br/>
            <input type="password" value={this.state.password} onChange={this.changePass} className='form-control' placeholder='Password' />
            <br/>
            <dutton className="btn btn-primary" onClick={this.submit}>Login</dutton>
        </section>
    }
});