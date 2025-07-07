import { createStore } from 'redux';
// import countReducer from './countReducer';
import rootReducer from './rootReducer';
// import buttonReducer from './buttonReducer';
 

const store = createStore(rootReducer);
 
export default store;