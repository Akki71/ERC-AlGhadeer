import React, {
  useEffect, useState, useContext
} from 'react';
import { DataContext } from "../utils/ApiContext";
import BASE_PATH from '../serviceurls';
import DashboardNav from './DashboardNav';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
 
import Loader from '../components/Loader';
import { useLanguage } from '../redux/LanguageContext';

 
const Dashboard = () => {
  const { language } = useLanguage();
 
  const navigate = useNavigate();
  const tokenlogin = localStorage.getItem('loginToken');
  const UserID = localStorage.getItem('UserID');
  const [userOrders, setUserOrders] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
 
  useEffect(() => {
 
    const fetchUserOrders = async () => {
      try {
        if (!UserID || !tokenlogin) {
          navigate("/login")
          return;
        }
        const apiUrl = `${BASE_PATH}Order/GetAllUserOrdersByUserId?userId=${UserID}`;
 
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenlogin}`,
          },
        });
 
        if (response.ok) {
          const data = await response.json();
          setUserOrders(data);
        } else if (response.status === 401) {
          localStorage.removeItem("loginToken");
          localStorage.removeItem("UserID");
          // Unauthorized or Bad Request - Redirect to login page or handle the error accordingly
          toast.error(
            language === "en"
              ? "Please Login to access your cart !"
              : "الرجاء تسجيل الدخول للوصول إلى سلة التسوق الخاصة بك!"
          );
          setTimeout(() => {
           
               navigate("/login")
             
          }, 3000);
 
        } else {
          console.error('Error fetching user orders:', response.statusText);
          localStorage.removeItem("loginToken");
          localStorage.removeItem("UserID");
          // Unauthorized or Bad Request - Redirect to login page or handle the error accordingly
          toast.error(
            language === "en"
              ? "Please Login to access your cart !"
              : "الرجاء تسجيل الدخول للوصول إلى سلة التسوق الخاصة بك!"
          );
          setTimeout(() => {
         
             navigate("/login")
             
          }, 3000);
        }
      } catch (error) {
        console.error('An error occurred during fetch:', error);
      }
    };
 
    fetchUserOrders();
  }, [UserID, tokenlogin, navigate]);
 
  useEffect(() => {
    if (!UserID) {
 
        navigate("/login")
     
      return;
    }
    const fetchUserDetails = async () => {
      try {
        const apiUrlUser = `${BASE_PATH}Security/GetUserById?id=${UserID}`;
 
        const response = await fetch(apiUrlUser, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenlogin}`,
          },
        });
 
        if (response.ok) {
          const userData = await response.json();
          setUserDetails(userData);
          setEmail(userData.EmailId || '');
          setFirstName(userData.FirstName || '');
          setLastName(userData.LastName || '');
          setMobile(userData.Mobile || '');
        } else if (response.status === 401) {
          localStorage.removeItem("loginToken");
          localStorage.removeItem("UserID");
          // Unauthorized or Bad Request - Redirect to login page or handle the error accordingly
          toast.error(
            language === "en"
              ? "Please Login to access your cart !"
              : "الرجاء تسجيل الدخول للوصول إلى سلة التسوق الخاصة بك!"
          );
          setTimeout(() => {
   
              navigate("/login")
             
          }, 3000);
 
        } else {
          console.error('Error fetching user details:', response.statusText);
          navigate("/login")
        }
       
      } catch (error) {
        console.error('An error occurred during fetch:', error);
      }
      setLoading(false);
    };
 
    fetchUserDetails();
  }, [UserID, tokenlogin]);
 
 
  const { data, setData } = useContext(DataContext);
 
  const handleLogout = () => {
    localStorage.removeItem('loginToken');
    localStorage.removeItem('UserID');
    setData(0);
  
    navigate("/login")
  };
 
  const [loading, setLoading] = useState(true)
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  // }, []);
 
  useEffect(() => { window.scrollTo(0, 300); }, []);
  return (
    <>
      {loading ? (
 
 
        <div id="hola">
          <div id="preloader">
            <Loader />
          </div>
        </div>
      ) : (
        <div>
          <div className="topBanner_sec">
            <div className="topBanner_inn">
              <img src={`${BASE_PATH}Images/Product/dashboard-bg.jpg`} className="w-100" alt="" />
 
 
            </div>
          </div>
          <ToastContainer />
 
          <div className="section_dashboard secBg">
            <div className="full-container container">
              <div className="row justify-content-center">
                <div className="col-md-3 col-xl-3 col-xxl-2">
                  {userDetails && <DashboardNav />}
                </div>
                <div className="col-md-9 col-xl-8 col-xxl-8">
                  <div className="rightdashboard">
                    <div className="f-s-20 mrg-b-15">
                      {userDetails ? (
                        <>
 
                          {language === "en" ? "        Hello  " : "  مرحبًا "}
 
                          {userDetails.FirstName} |{' '}
                          <Link to="" onClick={handleLogout} className="text-decoration-underline primary-clrzz primary-clr">
                            {language === "en"
                              ? "  LogOut   "
                              : "  تسجيل الخروج"}
                          </Link>
                        </>
                      ) : (
                        <>
 
                          {language === "en"
                            ? "   Hello Guest |"
                            : "مرحباً بك"}
                       
                            <Link to="/login" className="text-decoration-underline primary-clrzz primary-clr">
 
                                {language === "en" ? "Login" :"   تسجيل الدخول"}
                            </Link>
 
                         
 
                        </>
                      )}
                    </div>
                    <div className="f-s-20 mrg-b-15">
                      {language === "ar" ?
                        " اطلع على الطلبات الأخيرة، عدل عناوين الشحن وتفاصيل المستخدم"
                        :
 
                        "You can view your recent orders, manage your shipping and billing addresses, and account details."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
 
    </>
  );
};
 
export default Dashboard;