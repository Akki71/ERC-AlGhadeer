import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_PATH} from "../serviceurls";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email;

  useEffect(() => {
    // If no email is passed, redirect back to Forgot Password
    if (!emailFromState) {
      navigate('/forgotpass');
    }
  }, [emailFromState, navigate]);

  const [email] = useState(emailFromState || '');


  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const token = localStorage.getItem('token');

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [timeLeft, setTimeLeft] = useState(600); // 5 min timer

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/forgotpass');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!otp || !email) {
      setError('Please enter OTP and Email.');
      return;
    }

    try {
      const res = await fetch(`${BASE_PATH}Security/VerifyCode?emailid=${encodeURIComponent(email)}&code=${otp}`, {
        method: 'GET',
        headers: {
          Accept: '*/*',
        },
      });

      if (res.ok) {
        const userIdFromResponse = await res.json();
        setUserId(userIdFromResponse);
        setIsOtpVerified(true);

        toast.success('OTP verified successfully. You can now reset your password.');
      } else {
        const data = await res.text();
        if (data === 'User Not Found.') {
          navigate('/register');
        } else {
          setError(data); // Show message like "Verification Code is invalid."
        }
      }
    } catch (err) {
      setError('Verification failed. Try again.');
    }
  };

  const handleRecoverPassword = async () => {


    try {
      const response = await fetch(`${BASE_PATH}Security/ForgotPassword?emailId=${(email)}`, {
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
        setError(cleanedMessage || 'Password recovery failed.');
      }
    } catch (error) {
      console.error('An error occurred during password recovery:', error);
      const message = 'An error occurred during password recovery.';
      setError(message);
      toast.error(message);
    }
  };

  const handleResetPassword = async () => {
    setError(null);

    if (!password || !confirmPassword) {
      setError('Both password fields are required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const payload = {
      UserId: userId,
      Password: password,
      FirstName: "",
      LastName: "",
      Mobile: "",
      EmailId: email,
      IsEmailVerified: true,
      Token: "",
      OldPassword: ""
    };

    try {
      const res = await fetch(`${BASE_PATH}Security/ResetUserPassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
          Accept: '*/*',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Password reset successfully. Redirecting to login...');


        setTimeout(() => navigate('/login'), 3000);
      } else {
        const data = await res.text();
        setError(data || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="section_register secBg">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="full-container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-xxl-5">
            <div className="loginBx_wrap">
              <div className="secTitle_wrap text-center mrg-b-30">
                <div className="sec_subTitle font-Lyon f-s-40">Reset Password</div>
              </div>

              {!isOtpVerified && (
                <div className="text-center mb-3 font-Lyon">
                  OTP expires in <strong>{formatTime(timeLeft)}</strong>
                </div>
              )}


              <div className="formWrap">
                {!isOtpVerified && (
                  <>
                    <div className="form-group">
                      <input
                        type="email"
                        className="cstInput"
                        value={email}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="cstInput"
                        placeholder="Enter OTP you received on email"
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value);
                          setError(null); // Clear error on typing
                        }}
                      />
                      {error && <div className="text-danger mt-1">{error}</div>}

                      <div
                        className="mb-3 text-end font-Lyon"
                        
                        
                      >
                        <a  style={{ textAlign: 'right', cursor:'pointer' }}onClick={handleRecoverPassword}>Resend OTP</a>
                        
                      </div>
                    </div>


                    {/* {successMessage && <div className="text-success text-center mt-2">{successMessage}</div>} */}
                    <div className="form-group text-center">
                      <button className="submitBtn" onClick={handleVerifyOtp}>
                        Verify OTP
                      </button>
                    </div>
                  </>
                )}

                {isOtpVerified && (
                  <>

                    <div className="form-group position-relative">

                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="cstInput"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(null);
                        }}

                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                        }}
                      >
                        {showPassword ? <Eye /> : <EyeSlash />}
                      </span>
                    </div>

                    <div className="form-group position-relative">
                      <div className="position-relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="cstInput pr-5"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setError(null);
                          }}
                          style={{
                            paddingRight: '40px',
                          }}
                        />

                        <span
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{
                            position: 'absolute',
                            right: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            zIndex: 10,
                          }}
                        >
                          {showConfirmPassword ? <Eye /> : <EyeSlash />}
                        </span>
                      </div>
                      {error && <div className="text-danger mt-1">{error}</div>}
                    </div>



                    <div className="form-group text-center">
                      <button className="submitBtn" onClick={handleResetPassword}>
                        Submit
                      </button>
                    </div>
                  </>
                )}


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
