import React from "react";
import {Router, Route, browserHistory} from "react-router";
import ReactDOM from "react-dom";

import {Board} from "./board_c.js";
import {Thread} from "./thread_c.js";

$(document).ready(function() {
    ReactDOM.render((<Router history={browserHistory}>
        <Route path="/:lang/:board" component={Board}></Route>
        <Route path="/:lang/:board/:thread" component={Board}></Route>
    </Router>
    ), document.getElementsByClassName('main_content')[0]);
});
//<Route path="/" component={}></Route>