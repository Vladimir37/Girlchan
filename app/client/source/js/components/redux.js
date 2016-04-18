import {createStore} from "redux";

import {Request} from "./utils.js";

var initialState = {
    loaded: false,
    error: false,
    thread: null,
    content: null
};

function modalReducer(state, action) {
    state = state || initialState;
    switch(action.type) {
        case "LOAD":
            break;
        case "READY":
            return Object.assign(state, {
                loaded: true
            });
            break;
        case "ERROR":
            return Object.assign(state, {
                error: true
            });
            break;
        case "CLEAR":
            return initialState;
            break;
        default:
            console.log('Incorrect action');
            console.log(action.type);
            return state;
            break;
    }
}

export var store = createStore(modalReducer, initialState);

function loadAct(thread, lang, board) {
    var req_data = {
        lang,
        board,
        thread
    };
    Request('/api/full_thread', req_data, 'GET', this, function() {
        store.dispatch(readyAct());
    }, function(err) {
        console.log(err);
        store.dispatch(errorArt());
    });
    return {
        type: "LOAD",
        thread
    }
}
function readyAct() {
    return {
        type: "READY"
    }
}
function errorArt() {
    return {
        type: "ERROR"
    }
}
function clearAct() {
    return {
        type: "CLEAR"
    }
}