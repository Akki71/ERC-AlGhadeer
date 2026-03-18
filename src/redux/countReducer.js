import { SET_COUNT } from '../redux/countActions';

let externalCount = 0;



// const AnotherFunction = () => {
//   console.log("externalCount:", externalCount);
// }; 






const initialState = {
    count: externalCount
};
 
const countReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_COUNT:
            return {
                ...state,
                count: action.payload
            };
        default:
            return state;
    }
};
 
export default countReducer;