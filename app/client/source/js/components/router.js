import React from "react";
import {Router, Route, browserHistory} from "react-router";
import ReactDOM from "react-dom";

import {ServerError, NotFound, PleaseWait} from './templates.js';

import {Languages} from "./pages/languages_c.js";
import {List} from "./pages/list_c.js";
import {Board} from "./pages/board_c.js";
import {Thread} from "./pages/thread_c.js";
import {Login} from "./pages/login_c.js";

$(document).ready(function() {
    ReactDOM.render((<Router history={browserHistory}>
        <Route path="/" component={Languages}></Route>
        <Route path="/mod" component={Login}></Route>
        <Route path="/:lang" component={List}></Route>
        <Route path="/:lang/:board" component={Board}></Route>
        <Route path="*" component={NotFound}></Route>
    </Router>
    ), document.getElementsByClassName('main_content')[0]);
});