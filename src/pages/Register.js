import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from './AuthService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { useLanguage } from '../redux/LanguageContext';

const Register = () => {
   const { language } = useLanguage();


  const navigate = useNavigate();

  const [user, setUser] = useState({
    FirstName: '',
    LastName: '',
    EmailId: '',
    Password: '',
  });
  const [PasswordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [firstError, setFirstError] = useState('');
  const [lastError, setLastError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
    if (name === 'FirstName') {
      const firstRegex = /^[a-zA-Z]+$/;
      setFirstError(firstRegex.test(value) ? '' : (language === "en" ? 'Please enter a valid First Name' : 'يرجى ادخال الاسم الاول'));

    }
    if (name === 'LastName') {
      const lastRegex = /^[a-zA-Z]+$/;
      setLastError(lastRegex.test(value) ? '' : (language === "en" ? 'Please enter a valid Last Name' : ' يرجى ادخال الاسم الاول'));

    }
    if (name === 'EmailId') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(value) ? '' : (language === "en" ? 'Please enter a valid email address.' : 'يرجى ادخال  عنوان بريد إلكتروني متاح '));

    }
    if (name === 'Password') {
      setPasswordError(value.length >= 8 ? '' : (language === "en" ? 'Password must be at least 8 characters long.' : 'كلمة السر على الأقل 8 رموز'));

    }
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!PasswordVisible);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate user inputs
    if (!user.FirstName || !user.LastName || !user.EmailId || !user.Password) {
      setEmailError(user.EmailId ? '' : (language === "en" ? 'Email is required' : 'عنوان البريد الإلكتروني '));
      setPasswordError(user.Password ? '' : (language === "en" ? 'Password is required' : 'كلمة السر '));
      setFirstError(user.FirstName ? '' : (language === "en" ? 'First Name is required' : 'الاسم الأول مطلوب'));
      setLastError(user.LastName ? '' : (language === "en" ? 'Last Name is required'    : 'الاسم الأخير مطلوب'));
      
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(user.EmailId) ? '' : (language === "en" ? 'Please enter a valid email address.' : 'يرجى ادخال  عنوان بريد إلكتروني متاح'));
    setPasswordError(user.Password.length >= 8 ? '' : (language === "en" ? 'Password must be at least 8 characters long.' : 'كلمة السر على الأقل 8 رموز'));

   

    if (emailError || passwordError) {
      return;
    }

    try {
      const response = await AuthService.register(
        user.FirstName,
        user.LastName,
        user.EmailId,
        user.Password,
      );

      // console.log('Registration response:', response);

      if (response) {
        if (response.status === 200) {

          setShowModal(true);
          if (response.data === "EmailId is already registered, Please login.") {
           
            toast.error(language === "en" ? "Email ID is already registered. Please log in." : " البريد الإلكتروني مسجل بالفعل. الرجاء تسجيل الدخول.");
            setTimeout(() => {

            
                navigate("/login");
            },4000);
          } else if (response.data === "Verification Email has been sent to your emailid successfully.") {


            toast.success(language === "en" ? "Registration successful!" : "تسجيل دخول بنجاح ");
            setTimeout(() => {

          
                navigate("/login") 
              
            }, 2000);
          } else {

            console.error('Failed to update user details');
            toast.error(language === "en" ? "Failed to update details" : " فشل في تحديث البيانات");

          }
          // console.log(response.data); 
        } else {
  
          console.error('Failed to update user details');
          toast.error(language === "en" ? "Failed to update details" : "فشل في تحديث البيانات");

        }
      } else {
    
        console.error('Failed to receive response');
      }
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  const handlePasswordVisibilityforNewPassword = () => {
    setPasswordVisible(!PasswordVisible);
  }

  return (
    <div className="section_register secBg">
      <ToastContainer />
      <div className="full-container container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-xxl-3">
            <div className="loginBx_wrap">
              <div className="secTitle_wrap text-center mrg-b-30">
                <div className="sec_subTitle font-Lyon f-s-40">
                  {language === "en" ? "Register" : "تسجيل  "}
                </div>
              </div>
              <div className="formWrap">
                <form onSubmit={handleRegister}>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder={language === "en" ? "First Name*" : "الاسم الأول* "}
                      name="FirstName"
                      className={`cstInput ${firstError ? 'is-invalid' : ''}`}
                      value={user.FirstName}
                      
                      onChange={handleInputChange}
                    />
                    {firstError && <div className="invalid-feedback">{firstError}</div>}
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder={language === "en" ? "Last Name*" : "اسم العائلة*"}
                      className={`cstInput ${lastError ? 'is-invalid' : ''}`}
                      name="LastName"
                      value={user.LastName}
                      
                      onChange={handleInputChange}
                    />
                    {lastError && <div className="invalid-feedback">{lastError}</div>}
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder={language === "en" ? "E-mail*" : "بريد إلكتروني*"}
                      className={`cstInput ${emailError ? 'is-invalid' : ''}`}
                      name="EmailId"
                      value={user.EmailId}
                      
                      onChange={handleInputChange}
                    />
                    {emailError && <div className="invalid-feedback">{emailError}</div>}
                  </div>
                  <div className="form-group">
                    <input
                      type={PasswordVisible ? 'text' : 'password'}
                      id="Password"
                      placeholder={language === "en" ? "Password*" : "كلمة المرور*"}
                      className={`cstInput ${passwordError ? 'is-invalid' : ''}`}
                      name="Password"
                      value={user.Password}
                      onChange={handleInputChange}
                    />
                  <div className="input-group-text" onClick={handlePasswordVisibilityforNewPassword}>
                            {PasswordVisible ? (
                              <Eye />
                            ) : (
                              <EyeSlash />
                            )}
                          </div>

                    {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                  </div>
                  <div className="form-group text-center">
                    <button type="submit" className="submitBtn">
                      {language === "en" ? "Create account" : "إنشاء حساب"}
                    </button>
                  </div>
                  <div className="alreadyTxt text-center">
                    {language === "en" ? "   Already have an account?" : "هل لديك حساب؟"}
      
                      <Link to="/login" className="text-decoration-underline">
                       
                      {language === "en" ? "   Login" : " تسجيل الدخول"}

                      
                      </Link>
                 
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Modal show={showModal} onHide={() => setShowModal(false)}>
       
          <Modal.Title>Registration Status</Modal.Title>
      
        <Modal.Body>{successMessage}</Modal.Body>
        <Modal.Footer>
        
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default Register;
