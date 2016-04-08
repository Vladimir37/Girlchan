import React from "react";
import {Router, Route, browserHistory} from "react-router";
import ReactDOM from "react-dom";

import {Board} from "./board.js";

$(document).ready(function() {
    ReactDOM.render((<Router history={browserHistory}>
        <Route path="/:lang/:board" component={Board}></Route>
    </Router>
    ), document.getElementsByClassName('main_content')[0]);
});
//<Route path="/" component={}></Route>