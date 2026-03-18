import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_PATH} from "../serviceurls";
import { ToastContainer, toast } from "react-toastify";

import { useLanguage } from '../redux/LanguageContext';
function Forgotpass() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const UserID = localStorage.getItem('UserID');
  const token = localStorage.getItem('token');
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage(null); // Clear previous error messages when the user starts typing
  };

  const navigate = useNavigate();

  const handleRecoverPassword = async () => {
    if (!email) {
      const message = 'Please enter your email.';
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const message = 'Please enter a valid email address.';
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    try {
      const response = await fetch(`${BASE_PATH}Security/ForgotPassword?emailId=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      const cleanedMessage = responseData.replace(/"/g, '').trim();


      if (cleanedMessage) {
        toast.info(cleanedMessage);
      }

      // Navigate only on the exact match
      if (cleanedMessage === 'Verification Code has been sent to your email') {
        navigate('/reset-password', {
          state: { email },
          // replace: true, 
        });

      } else {
        setErrorMessage(cleanedMessage || 'Password recovery failed.');
      }
    } catch (error) {
      console.error('An error occurred during password recovery:', error);
      const message = 'An error occurred during password recovery.';
      setErrorMessage(message);
      toast.error(message);
    }
  };




  return (
    <div className="section_register secBg">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="full-container container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-xxl-3">
            <div className="loginBx_wrap">
              <div className="secTitle_wrap text-center mrg-b-30">
                <div className="sec_subTitle font-Lyon f-s-40">

                  {language === "en"
                    ? "  Recover password   "
                    : " إستعادة كلمة المرور "}
                </div>
              </div>
              <div className="formWrap">
                <form>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder={language === "en" ? " Enter your Email" : "أدخل بريدك الإلكتروني "}
                      className="cstInput"
                      value={email}
                      onChange={handleEmailChange}
                    />
                    {errorMessage && <div className="text-danger mt-1">{errorMessage}</div>}
                  </div>
                  <div className="form-group text-center">
                    <button type="button" className="submitBtn" onClick={handleRecoverPassword}>


                      {language === "en" ? "     Recover   " : " استعادة "}
                    </button>
                  </div>

                  <div className="d-md-flex align-items-center justify-content-center">
                    <div className="alreadyTxt text-center">

                      {language === "en" ? "    Remember your password?  " : " هل تتذكر كلمة المرور الخاصة بك؟ "}


                      <Link to="/login" className="text-decoration-underline">


                        {language === "en" ? "        Back to login  " : "     العودة لتسجيل الدخول      "}


                      </Link>

                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forgotpass;
