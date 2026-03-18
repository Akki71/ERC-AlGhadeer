import React, { useState, useEffect } from "react";
import DashboardNav from "./DashboardNav";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import Loader from '../components/Loader';
import { BASE_PATH} from "../serviceurls";
import { useLanguage } from "../redux/LanguageContext";

const Password = () => {
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
  const [passwordError, setPasswordError] = useState('');
  const [confirmpasswordError, setConfirmPasswordError] = useState('');
  const [newpasswordError, setNewPasswordError] = useState("");

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
    setPasswordError('');
    setConfirmPasswordError('');
    setNewPasswordError('');
   
  };


  const validateForm = () => {
    resetErrors();


    if ( !password || !newpassword || !confirmpassword ) {      

      setPasswordError(password ? '' : (language === "en" ? 'Password is required' : '  كلمة السر '));

      setConfirmPasswordError(confirmpassword ? '' : (language === "en" ? 'Confirm Password is required' : '   تأكيد كلمة السر'));
      setNewPasswordError(newpassword ? '' : (language === "en" ? 'New Password is required' : ' كلمة سر جديدة مطلوبة  '));

      return false;
  }

  
  const PasswordRegex = /^.{8,20}$/;

  
  if (!PasswordRegex.test(newpassword)) {
    setNewPasswordError(language === "en" ? 'The password must be a minimum of 8 characters long' : '   كلمة السر لا تقل عن 8 رموز   ');

      return false;
  }
  
  if (newpassword !== confirmpassword) {
      toast.error(language === "en" ? "Passwords do not match." : "  كلمات السر غير متطابقة");
      setConfirmPassword('');
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
  
      Password: newpassword,
      OldPassword: password,

    };

    try {
      // setcon(true);

      const response = await fetch(`${BASE_PATH}Security/ChangeUserPassword`, {
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
        toast.success(language === "en" ? "Details updated successfully" : "  تم تحديث البيانات بنجاح");

        setPassword('');
        setNewPassword('');
        setConfirmPassword('');

      } else {
        const data = await response.json();
        if (data === "Old Password is invalid.") {
          setPassword('');
          toast.error(language === "en" ? "Old Password is invalid." : " كلمة السر القديمة غير صحيحة  ");

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
                            {language === "en" ? "Password Change" : "تغيير كلمة السر "}
                          </p>
                          <div className="form-group">
                            <input
                              type={PasswordVisible ? "text" : "password"}
                              id="password"
                              placeholder={language === "en" ? "Password" : "كلمة المرور "}
                              className={`cstInput ${passwordError ? 'is-invalid' : ''}`}
                              value={password}
                              required
                              // onKeyUp={handleKeyUp}

                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="input-group-text" onClick={handlePasswordVisibility}>
                              {PasswordVisible ? (
                                <Eye />
                              ) : (
                                <EyeSlash />
                              )}
                            </div>
                            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                          </div>
                          <div className="form-group">
                            <input
                              type={PasswordVisibleN ? "text" : "password"}
                              id="password_1"
                              placeholder={language === "en" ? "New Password" : "كلمة المرور الجديدة "}
                              className={`cstInput ${newpasswordError ? 'is-invalid' : ''}`}
                              value={newpassword}
                              required
                              // onKeyUp={handleKeyUp}

                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <div className="input-group-text" onClick={handlePasswordVisibilityforNewPassword}>
                              {PasswordVisibleN ? (
                                <Eye />
                              ) : (
                                <EyeSlash />
                              )}
                            </div><br/>
                            
                            {newpasswordError && <div className="invalid-feedback">{newpasswordError}</div>}
                          
                            

                          </div>
                          <div className="form-group">
                            
                              <input
                                type={PasswordVisibleC ? "text" : "password"}
                                id="password_2"
                                placeholder={
                                  language === "en"
                                    ? "Confirm New Password"
                                    : "تأكيد كلمة المرور الجديدة"
                                }
                                className={`cstInput ${confirmpasswordError ? 'is-invalid' : ''}`}
                                value={confirmpassword}
                                required
                                onChange={(e) => setConfirmPassword(e.target.value)}
                              />
                              <div className="input-group-text" onClick={handlePasswordVisibilityforCPassword}>
                                {PasswordVisibleC ? (
                                  <Eye />
                                ) : (
                                  <EyeSlash />
                                )}
                              </div>
                            
                            {confirmpasswordError && <div className="invalid-feedback">{confirmpasswordError}</div>}
                          </div>



                          <div className="form-group text-center">
                            <button
                              className="submitBtn"
                              type="submit"
                              onClick={submitAccountDetails}
                              // disabled={newpassword !== confirmpassword}
                            >
                              {language === "en" ? "  Save Changes" : "     حفظ التغييرات"}
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

export default Password;
