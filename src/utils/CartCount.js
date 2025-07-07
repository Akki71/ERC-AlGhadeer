// CartCount.js
import React, { useState, useEffect } from 'react';
import reducer from '../redux/countReducer'; 
import BASE_PATH from '../serviceurls';

const initialState = {
  count: reducer().count // Accessing initial state from the reducer
};

const CartCount = () => {
  const [cartItemCount, setCartItemCount] = useState(initialState.count);
  const [wishlistCount, setWishlistCount] = useState(0); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartApiUrl = `${BASE_PATH}Order/GetAllUserOrdersInCartByUserId?userId=${UserID}`;
        const wishlistApiUrl = `${BASE_PATH}Wishlist/GetWishlistByUserId/${UserID}`;
        
 
        const [cartResponse, wishlistResponse] = await Promise.all([
          fetch(cartApiUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenlogin}`,
            },
          }),
          fetch(wishlistApiUrl, {
            method: "GET",
            headers: {
              accept: "*/*",
              Authorization: `Bearer ${tokenlogin}`,
            },
          }),
        ]);
 
        if (!cartResponse.ok) {
          throw new Error(`HTTP error! Status: ${cartResponse.status}`);
        }
 
        const cartData = await cartResponse.json();
        // console.log("User orders:", cartData);
        setCartItemCount(cartData.length);
 
        if (!wishlistResponse.ok) {
          throw new Error(`HTTP error! Status: ${wishlistResponse.status}`);
        }
 
        const wishlistData = await wishlistResponse.json();
        // console.log("Wishlist Data:", wishlistData);
        setWishlistCount(wishlistData.length);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };
 
    fetchData();
  }, [UserID, tokenlogin, navigate]);

  return (
    <div>
      <p>Cart Items: {cartItemCount}</p>
      <p>Wishlist Items: {wishlistCount}</p>
    </div>
  );
};

export default CartCount;
