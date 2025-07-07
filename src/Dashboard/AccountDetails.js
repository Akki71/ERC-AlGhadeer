import React, { useState, useEffect } from "react";
import DashboardNav from "./DashboardNav";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import BASE_PATH from '../serviceurls';

import Loader from '../components/Loader';
import { useLanguage } from "../redux/LanguageContext";

const AccountDetails = () => {
  const [con, setcon] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [PasswordVisible, setPasswordVisible] = useState(false);
  const [PasswordVisibleN, setPasswordVisibleN] = useState(false);
  const [PasswordVisibleC, setPasswordVisibleC] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmpasswordError, setConfirmPasswordError] = useState('');
  const [newpasswordError, setNewPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [firstError, setFirstError] = useState('');
  const [lastError, setLastError] = useState('');
  const UserID = localStorage.getItem('UserID'); 
   const tokenlogin = localStorage.getItem('loginToken');
  const navigate = useNavigate();

  const { language } = useLanguage();

  const handlePasswordVisibility = () => {
    setPasswordVisible(!PasswordVisible);
  };
  const handlePasswordVisibilityforNewPassword = () => {
    setPasswordVisibleN(!PasswordVisibleN);
  }
  const handlePasswordVisibilityforCPassword = () => {
    setPasswordVisibleC(!PasswordVisibleC);
  }

  useEffect(() => {
    if (!UserID) {
      navigate("/login")
      return;
    }

    const apiUrlUser = `${BASE_PATH}Security/GetUserById?id=${UserID}`;

    fetch(apiUrlUser, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenlogin}`,
      },
    })
    .then((response) => response.json())
    .then((userData) => {
      setUserDetails(userData);
      setEmail(userData.EmailId || "");
      setFirstName(userData.FirstName || "");
      setLastName(userData.LastName || "");
      setMobile(userData.Mobile || "");
    })
    .catch((error) => {
      // localStorage.removeItem("loginToken");
      // localStorage.removeItem("UserID");
      navigate("/login")
    });
  }, [UserID, tokenlogin]);

  useEffect(() => {
    window.scrollTo(0, 300);
    resetErrors();
    
    resetErrors();
  }, []);

  const resetErrors = () => {
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setNewPasswordError('');
    setFirstError('');
    setLastError('');
    setMobileError('');
  };


  const validateForm = () => {
    resetErrors();
    if (!email || !mobile) {      
      setEmailError(email ? '' : (language === "en" ? "Email is required" : "عنوان البريد الإلكتروني"));
      setFirstError(firstName ? '' : (language === "en" ? 'First Name is required' : "الاسم الأول مطلوب"));
      setLastError(lastName ? '' : (language === "en" ? 'Last Name is required' : "الاسم الأخير مطلوب"));      
      setMobileError(mobile ? '' :  (language === "en" ? 'Mobile Number is required' : "رقم الهاتف مطلوب"));
      return false;
  }
  
  const validNum = /^\d{7,16}$/;
  if (!validNum.test(mobile)) {
      setMobileError( (language === "en" ? 'Please enter a valid mobile number' : "يرجى ادخال رقم تليفون متاح"));
      return false;
  }
  
  const validName = /^[A-Za-z]+$/; // Modified regex to allow only alphabets
  if (!validName.test(firstName)) {
    setFirstError(language === "en" ? 'Only alphabets are allowed for the First Name' : "الحروف الأبجدية فقط مسموح بها في الاسم الأول");

      return false;
  }
  
  if (!validName.test(lastName)) {
    setLastError(language === "en" ? 'Only alphabets are allowed for the Last Name' :"الحروف الأبجدية فقط مسموح بها في الاسم الأخير");
      return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
  }
  
    return true;
  
  };

  const submitAccountDetails = async (e) => {
    e.preventDefault();



    if (!validateForm()) {
      return;
    }

    const details = {
      UserId: parseInt(UserID),
      FirstName: firstName,
      LastName: lastName,
      EmailId: email,
      Mobile: mobile,
    };

    try {
      // setcon(true);

      const response = await fetch(`${BASE_PATH}Security/UpdateUser`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${tokenlogin}`,
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(details),
      });

      if (response.ok) {
 
        
        // console.log('User details updated successfully');
        toast.success(language === "en" ? "Details updated successfully" : "تم تحديث البيانات بنجاح");
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');

      } else {
        const data = await response.json();
        if (data === "Old Password is invalid.") {
          setPassword('');
          toast.error(language === "en" ? "Old Password is invalid." : "كلمة السر القديمة غير صحيحة");
        }

         else {
          console.error('Failed to update user details');
          toast.error(language === "en" ? "Failed to update details" : "فشل في تحديث البيانات");
          fetchUserDetails();
        }
        // console.log(data);
        // setcon(false);
        // setPasswordError(data.error || 'Failed to update details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleKeyUp = () => {
    validateForm();
};
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
      if (userData.FirstName) {
        setFirstName(userData.FirstName);
      } else {
        setFirstName();
        // localStorage.removeItem('loginToken');
        // localStorage.removeItem('UserID');
        // If first name not found, navigate to login page based on selected language
        navigate("/login")
      }
    } else {
      console.error('Error fetching user details:', response.statusText);
    }
  } catch (error) {
    console.error('An error occurred during fetch:', error);
  }
};
  return (
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
              <DashboardNav />
            </div>
            <div className="col-md-9 col-xl-8 col-xxl-8">
              <div className="rightdashboard">
                <div className="row">
                  <div className="col-md-7">
                    <div className="formWrap">
                      {con ? (
                        // <form onSubmit={validateForm}>
                        <>
                         <p>
                            {language === "en" ? " Account Details" : "تفاصيل الحساب"}
                          </p>
                          <div className="form-group">
                            <input
                              type="text"
                              placeholder={language === "en" ? "First Name*" : "الاسم الأول*"}
                              className={`cstInput ${firstError ? 'is-invalid' : ''}`}
                              value={firstName}
                              pattern="[A-Za-z]+"
                              required
                              // onKeyUp={handleKeyUp}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                            {firstError && <div className="invalid-feedback">{firstError}</div>}
                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              placeholder={language === "en" ? "Last Name*" : "اسم العائلة*"}
                              className={`cstInput ${lastError ? 'is-invalid' : ''}`}
                              // onKeyUp={handleKeyUp}

                              value={lastName}
                              pattern="[A-Za-z]+"
                              onChange={(e) => setLastName(e.target.value)}
                            />
                            {lastError && <div className="invalid-feedback">{lastError}</div>}

                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              placeholder={language === "en" ? "Mobile No" : "رقم الهاتف"}
                              className={`cstInput ${mobileError ? 'is-invalid' : ''}`}
                              value={mobile}
                              pattern="[0-9]*"
                              required
                              // onKeyUp={handleKeyUp}

                              onChange={(e) => setMobile(e.target.value)}
                            />
                            {mobileError && <div className="invalid-feedback">{mobileError}</div>}
                          </div>
                          <div className="form-group">
                            <input
                              type="email"
                              placeholder={language === "en" ? "E-mail" : "البريد الإلكتروني"}
                              className={`cstInput ${emailError ? 'is-invalid' : ''}`}
                              value={email}
                              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                              required
                              // onKeyUp={handleKeyUp}

                              onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailError && <div className="invalid-feedback">{emailError}</div>}
                          </div>
                         



                          <div className="form-group text-center">
                            <button
                              className="submitBtn"
                              type="submit"
                              onClick={submitAccountDetails}
                              // disabled={newpassword !== confirmpassword}
                            >
                              {language === "en" ? "  Save Changes" :"حفظ التغييرات"}
                            </button>
                          </div>
                          </>
                        // </form>
                      ) : <Loader />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
