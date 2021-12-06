import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import reducer from '../reducers/reducers.js'
import thunk from 'redux-thunk';

export const store = createStore(reducer, applyMiddleware(logger, thunk));
