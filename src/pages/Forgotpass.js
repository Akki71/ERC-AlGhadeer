import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BASE_PATH from '../serviceurls';
import { useLanguage } from '../redux/LanguageContext';
function Forgotpass() {
const { language} = useLanguage();  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const UserID = localStorage.getItem('UserID');
  const tokenlogin = localStorage.getItem('loginToken');
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage(null); // Clear previous error messages when the user starts typing
  };
  

  const handleRecoverPassword = async () => {
    if (!email) {
      setErrorMessage('Please enter your email.');
      return;
    }

    try {
      const response = await fetch(`${BASE_PATH}Security/ForgotPassword?emailId=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${tokenlogin}`, // Use the token from localStorage
        },
      });

      if (response.ok) {
        // Password recovery email sent successfully
        // You may choose to show a success message or redirect the user
      } else {
        const responseData = await response.json();
        // Check for specific validation errors
        if (responseData.errors && responseData.errors.userId) {
          setErrorMessage(responseData.errors.userId[0]);
        } else {
          // Display a generic error message
          setErrorMessage(responseData.message || 'Password recovery failed. Please check your email.');
        }
      }
    } catch (error) {
      console.error('An error occurred during password recovery:', error);
      setErrorMessage('An error occurred during password recovery.');
    }
  };

  return (
    <div className="section_register secBg">
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
                  </div>
                  <div className="form-group text-center">
                    <button type="button" className="submitBtn" onClick={handleRecoverPassword}>
                  

                      {language === "en"                        ? "     Recover   "                        : " استعادة "}
                    </button>
                  </div>
                  {errorMessage && <div className="error-message">{errorMessage}</div>}
                  <div className="d-md-flex align-items-center justify-content-center">
                    <div className="alreadyTxt text-center">
                   
                      {language === "en"                        ? "    Remember your password?  "                        : " هل تتذكر كلمة المرور الخاصة بك؟ "}

                
                        <Link to="/login" className="text-decoration-underline">
                      

                          {language === "en"                        ? "        Back to login  "                        : "     العودة لتسجيل الدخول      "}

                      
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
