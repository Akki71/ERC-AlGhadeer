// rootReducer.js
import { combineReducers } from 'redux';
import buttonReducer from './buttonReducer';
import countReducer from './countReducer';
// import { configureStore } from '@reduxjs/toolkit';
 
const rootReducer = combineReducers({
    countReducer: countReducer,
    buttonReducer: buttonReducer
});
 
//const rootReducer = configureStore({reducer:getReducer})
 
export default rootReducer;
 