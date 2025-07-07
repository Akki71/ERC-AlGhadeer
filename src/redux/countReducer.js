import { SET_COUNT } from '../redux/countActions';
import React, { useEffect, useState } from 'react';
import BASE_PATH from '../serviceurls';

let externalCount = 0;

const VCounter = () => {
  const [countvariable, setcountvariable] = useState(0);
  const UserID = localStorage.getItem("UserID");
  const tokenlogin = localStorage.getItem("loginToken");

  const fetchData = async () => {
    try {
      const cartApiUrl = `${BASE_PATH}Order/GetAllUserOrdersInCartByUserId?userId=${UserID}`;
      const cartResponse = await fetch(cartApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenlogin}`,
        },
      });
      if (!cartResponse.ok) {
        throw new Error(`HTTP error! Status: ${cartResponse.status}`);
      }
      const cartData = await cartResponse.json();
      const cartItemCount = cartData.length || 0;
      setcountvariable(cartItemCount);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    if (UserID && tokenlogin) {
      fetchData();
    }
  }, [UserID, tokenlogin]);

  useEffect(() => {
    externalCount = countvariable;
  }, [countvariable]);

  return null;
};

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