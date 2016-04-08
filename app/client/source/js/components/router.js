import React from "react";
import {Router, Route, browserHistory} from "react-router";
import ReactDOM from "react-dom";

import Board from "board.js";

$(document).ready(function() {
    ReactDOM.render((<Router history={browserHistory}>
        <Route path="/" component={}></Route>
        <Route path="/" component={}></Route>
        <Route path="/" component={}></Route>
    </Router>
    ), document.getElementsById('main_content'));
});
//<Route path="/" component={}></Route>