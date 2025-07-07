export const SET_COUNT = 'SET_COUNT';
 
export const setCount = (count) => {
    return {
        type: SET_COUNT,
        payload: count
    };
};