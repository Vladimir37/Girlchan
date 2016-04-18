import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from "react-router";
import $ from 'jquery';
import Moment from "moment";

import {Post, FirstPost, NotFound, ServerError, PleaseWait, Posting, SmallList} from '../templates.js';
import {Request, toast} from '../utils.js';

