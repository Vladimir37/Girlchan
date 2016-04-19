import {createStore} from "redux";

import {Request} from "./utils.js";

var initialState = {
    thread: null
};

function modalReducer(state, action) {
    state = state || initialState;
    switch(action.type) {
        case "LOAD":
            return {
                thread: action.thread
            };
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

export function loadAct(thread) {
    return {
        type: "LOAD",
        thread
    }
}
function clearAct() {
    return {
        type: "CLEAR"
    }
}