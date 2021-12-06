import {combineReducers} from 'redux';
import boardReducer from './boardreducer.js';

export default combineReducers({    
    boardStates: boardReducer
});