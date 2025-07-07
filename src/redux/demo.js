import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCount } from '../redux/countActions';
const Demo = () => {
  const dispatch = useDispatch();
  const count = useSelector((store) => store.countReducer.count);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();
  const UserID = localStorage.getItem("UserID");
  const tokenlogin = localStorage.getItem("loginToken");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartApiUrl = `https://api.alghadeeruaecrafts.ae/Order/GetAllUserOrdersInCartByUserId?userId=${UserID}`;
        const wishlistApiUrl = `${BASE_PATH}Wishlist/GetWishlistByUserId/${UserID};

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
        dispatch(setCount(cartItemCount));
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
   
      <p>Count: {count}</p>
    </div>
  );
  }
 
 
 
 
export default Demo