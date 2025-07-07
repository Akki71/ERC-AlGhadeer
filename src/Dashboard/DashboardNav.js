
import React,{useEffect,useContext} from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import BASE_PATH from '../serviceurls';
import { useLanguage } from '../redux/LanguageContext';
import { DataContext } from "../utils/ApiContext";
 
 
const DashboardNav = () => {
  const { language } = useLanguage();
  const { data, setData } = useContext(DataContext);
 
  const UserID = localStorage.getItem('UserID');
  const tokenlogin = localStorage.getItem('loginToken');
 
 
  useEffect(() => {
    if (!UserID) {
      const loginPath = "/login"
      navigate(loginPath);
    }
  }, [UserID, language]);
 
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const value = useSelector((store) => store.buttonReducer.value);
  const handleLogout = () => {
    updateData();
    setData(0);
    localStorage.removeItem('loginToken');
    localStorage.removeItem('UserID');
    navigate("/login")
    
  };
  const onbuttonClick = () => {
    dispatch({
      type: "CHNAGEDEFAULT",
    });
  }
  const updateData = async () => {
    if (!UserID) {
      const products = JSON.parse(localStorage.getItem("guestProduct")) || [];
      setData(products.length);
      // console.log(products.length);
      return;
    }
    try {
      const cartApiUrl = `${BASE_PATH}Order/GetAllUserOrdersInCartByUserId?userId=${UserID}`;
      const [cartResponse] = await Promise.all([
        fetch(cartApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenlogin}`,
          },
        }),
      ]);

      if (!cartResponse.ok) {
        throw new Error(`HTTP error! Status: ${cartResponse.status}`);
      }

      const cartData = await cartResponse.json();
      // console.log("cartData", cartData)
      setData(cartData.length);
    
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
 
  useEffect(() => {
    updateData();
  }, []);
  return (
    <div>
     
      <div className="dashnav">
        <ul className="list-unstyled mb-0">
          <li className="list-block-item dashNav-item">
           
              <NavLink to="/dashboard" className="dashNav-link" onClick={onbuttonClick}  activeClassName="active">
              {language === "en" ?   "Dashboard" :"   لوحة الحساب  "}
              </NavLink>
           
          </li>
 
          <li className="list-block-item dashNav-item">
         
            <NavLink to="/orderlist" className={`dashNav-link ${value ? "active" : ""}`} aria-current="page" activeClassName="active" >           {language === "en" ?    "Orders": "    الطلبات"}
              </NavLink>
           
          </li>
 
 
          <li className="list-block-item dashNav-item">
         
              <NavLink to="/address" className="dashNav-link" onClick={onbuttonClick}  activeClassName="active">
              {language === "en" ?    "Address" :" العناوين"}
              </NavLink>
       
          </li>
 
          <li className="list-block-item dashNav-item">
           
              <NavLink to="/accountdetails" onClick={onbuttonClick} className="dashNav-link" activeClassName="active">
              {language === "en" ? "Account Details": "  تفاصيل الحساب"}
              </NavLink>
         
          </li>
 
          <li className="list-block-item dashNav-item">
         
              <NavLink to="/password" className="dashNav-link" onClick={onbuttonClick}  activeClassName="active">
              {language === "en" ?     "Password" : " كلمة المرور"}
              </NavLink>
         
          </li>
          <button type="button" className="submitBtn w-100" onClick={handleLogout}>
 
            {language === "en"
              ? "  Logout   "
              : "  تسجيل الخروج"}
          </button>
        </ul>
      </div>
    </div>
  );
};
 
export default DashboardNav;
 