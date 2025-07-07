let initialState = { value: false }
 
function buttonReducer(state = initialState, action) {
    if (action.type === 'CHNAGE') {
        return {
            value: (true)
        };
    }
    if (action.type === 'CHNAGEDEFAULT') {
        return {
            value: (false)
        };
    }
   
 
    return state;
}
 
export default buttonReducer;