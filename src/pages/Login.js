import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import AuthService from "./AuthService";
import { DataContext } from "../utils/ApiContext";
import { BASE_PATH} from "../serviceurls";
import { useLanguage } from "../redux/LanguageContext";
const Login = () => {
  const UserID = localStorage.getItem("UserID");
  const tokenlogin = localStorage.getItem("loginToken");
  const [PasswordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const { setData } = useContext(DataContext);
  const [credentials, setCredentials] = useState({
    EmailId: "",
    Password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { language } = useLanguage();
const handleInputChange = (e) => {
  const { name, value } = e.target;

  // Update input value
  setCredentials((prev) => ({
    ...prev,
    [name]: value,
  }));

  // Clear errors immediately when user starts typing
  if (name === "Password") {
    setPasswordError("");
    setErrorMessage("");
  }

  if (name === "EmailId") {
    setEmailError("");
    setErrorMessage("");

  }

  // Required field validation
  if (name === "EmailId") {
    if (value === "") {
      setEmailError(
        language === "en"
          ? "Email is required."
          : "البريد الإلكتروني مطلوب"
      );
    } else {
      // Live validation for email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(
        emailRegex.test(value)
          ? ""
          : language === "en"
          ? "Please enter a valid email address."
          : "يرجى ادخال عنوان بريد إلكتروني متاح"
      );
    }
  }

  if (name === "Password") {
    if (value === "") {
      setPasswordError(
        language === "en"
          ? "Password is required."
          : "كلمة المرور مطلوبة"
      );
    } else {
      // Live validation for password length
      setPasswordError(
        value.length >= 8
          ? ""
          : language === "en"
          ? "The password must be a minimum of 8 characters long"
          : "كلمة السر لا تقل عن 8 رموز"
      );
    }
  }
};


  const handlePasswordVisibilityforNewPassword = () => {
    setPasswordVisible(!PasswordVisible);
  };
  const handleLogin = async (e) => {

    // console.log("sdhfglsduifhsoif");
    
    e.preventDefault();
    if (!credentials.EmailId || !credentials.Password) {

    // console.log("sdhfglsduifhsoif");

      setErrorMessage(
        language === "en"
          ? "Please fill in both email and password."
          : "يرجى ملء كل من البريد الإلكتروني وكلمة المرور."
      );
      return;
    }
    try {
      const response = await AuthService.login(
        credentials.EmailId,
        credentials.Password,
        credentials.FirstName
      );

      if (response && response.status === 200) {
        addCartData(response.data.UserId, response.data.Token);
        const successMessage =
          language === "en" ? "Login successful!" : "تم تسجيل الدخول بنجاح!";

        await toast.promise(Promise.resolve(), {
          pending: successMessage,
          success: successMessage,
          error:"en"  
          ?"Login failed. Please check your credentials."
          : "فشل في تسجيل الدخول، يرجى التحقق من البيانات",
        });
        setErrorMessage(null);

        const currentDate = new Date().toDateString(); // Get the current date
        const storedDate = localStorage.getItem("loginDate");

        if (storedDate !== currentDate) {
          localStorage.removeItem("loginToken");
          localStorage.removeItem("UserID");
          localStorage.setItem("loginDate", currentDate); // Store the new date
        }

        const expirationTime = new Date().getTime() + 1800000; // Set expiration time to 30 minutes from now
        localStorage.setItem("loginToken", response.data.Token);
        localStorage.setItem("UserID", response.data.UserId);
        localStorage.setItem("tokenExpirationlogin", expirationTime);

        navigate("/ourproductlisting");

        // Show an alert to the user after 29 minutes to prompt re-login
        const alertTime = expirationTime - 60000; // 29 minutes before expiration
        setTimeout(() => {
          const confirmLogout = window.confirm(
            language === "en"
              ? "Your session is about to expire. Do you want to login again?"
              : "الجلسة الخاصة بك على وشك الانتهاء. هل ترغب في تسجيل الدخول مرة أخرى؟"
          );
          if (confirmLogout) {
            localStorage.removeItem("loginToken");
            localStorage.removeItem("UserID");
            navigate("/login"); // Redirect to login page
          }
        }, alertTime - new Date().getTime()); // Calculate time remaining until alert

        // Remove token and user ID from local storage after expiration
        setTimeout(() => {
          localStorage.removeItem("loginToken");
          localStorage.removeItem("UserID");
          localStorage.removeItem("tokenExpirationlogin");
          // Optionally, you can also redirect the user to the login page here
        }, expirationTime - new Date().getTime());
      } else {
        setErrorMessage(
          language === "en"
            ? "Login failed. Please check your credentials."
            : "فشل في تسجيل الدخول، يرجى التحقق من البيانات"
        );
      }
    } catch (error) {
      // console.log("Login failed:", error.response.data);
      if (error.response.data === "Password is invalid.") {
        setErrorMessage(error.response.data);
        toast.error(
          language === "en" ? " Password is invalid." : "كلمة السر غير صحيحة"
        );

        setCredentials({ ...credentials, Password: "" });
      } else if (error.response.data === "User Not Found. Please Signup.") {
        setErrorMessage(error.response.data);
        toast.error(
          language === "en"
            ? "User Not Found. Please Signup."
            : "مستخدم غير موجود، يرجى تسجيل الدخول"
        );

        setCredentials({ EmailId: "", Password: "" });
      } else {
        console.error("Login failed:", error);
        console.error("An error occurred during login:", error);
        // setErrorMessage("An error occurred during login.");
      }
    }
  };
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
      // console.log("cartData", cartData);

      setData(cartData.length); // Assuming setData is defined elsewhere
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    updateData();
  }, []);
  useEffect(() => {
    updateData();
  }, []);
  const token = localStorage.getItem("token");

  const addCartData = async (UserId, tokenlogin) => {
    try {
      // Retrieve the guest products from local storage
      let products = JSON.parse(localStorage.getItem("guestProduct")) || [];

      // Log UserId and products for debugging
      // console.log(UserId);
      // console.log(products);

      // Map the products to the required format for the API
      const product = products.map((product) => ({
        ProductId: product.ProductId,
        CategoryId: product.CategoryId,
        SubCategoryId: product.SubCategoryId,
        ProductSizeId: product.ProductSizeId,
        UserId: UserId,
        ProductColorOrdered: product.ProductColorOrdered,
        OrderPrice: product.OrderPrice,
        OrderQuantity: parseInt(product.OrderQuantity, 10), // ensure OrderQuantity is an integer
        TotalAmount: product.TotalAmount,
        Status: "", // keep this empty, we handle in backend as "InCart"
      }));

      // Log the formatted product data for debugging
      // console.log(product);

      // Define the API endpoint
      const apiUrl = `${BASE_PATH}Order/AddOrderInCartMany`;

      // Set up the request options
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenlogin}`,
        },
        body: JSON.stringify(product),
      };

      // Make the API call
      const response = await fetch(apiUrl, requestOptions);

      // Check if the response is okay
      if (response.ok) {
        // Successfully added to cart
        // Update data (presumably some UI or state update function)
        updateData();
        // Clear the guest product data from local storage
        localStorage.removeItem("guestProduct");
      } else {
        // Handle unsuccessful response
        const errorData = await response.json();
        console.error("Error adding to cart:", errorData);
        updateData();
      }
    } catch (error) {
      // Handle any errors that occur during the fetch
      console.error("Fetch error:", error);
      updateData();
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="section_register secBg">
        <div className="full-container container">
          <div className="row justify-content-center">
            <div className="col-md-7 col-xxl-3">
              <div className="loginBx_wrap">
                <div className="secTitle_wrap text-center mrg-b-30">
                  <div className="sec_subTitle font-Lyon f-s-40">
                    {language === "en" ? "  Login" :"تسجيل الدخول"}
                  </div>
                </div>
                <div className="formWrap">
                  <>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder={
                          language === "en" ? "E-mail*" :"بريد إلكتروني*"
                        }
                        className={`cstInput ${emailError ? "is-invalid" : ""}`}
                        name="EmailId"
                        value={credentials.EmailId}
                        onChange={handleInputChange}
                        required
                      />
                      {emailError && (
                        <div className="text-danger mt-1">{emailError}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <div className="position-relative">
                      <input
                        type={PasswordVisible ? "text" : "password"} // Change "Password" to "password"
                        placeholder={
                          language === "en" ? "Password*" : "كلمة المرور*"
                        }
                        className={`cstInput ${
                          passwordError || errorMessage ? "is-invalid" : ""
                        }`}
                        name="Password"
                        value={credentials.Password}
                        onChange={handleInputChange}
                        required
                      />
                   
                  
                    <div
                      className="input-group-text"
                      onClick={handlePasswordVisibilityforNewPassword}
                      style={{ cursor: 'pointer' }}
                    >
                      {PasswordVisible ? <Eye /> : <EyeSlash />}
                    </div>
                </div>

                  {passwordError && (
                    <div className="text-danger mt-1">{passwordError}</div>
                  )}
  {errorMessage && (
                      <div className="text-danger mt-1">{errorMessage}</div>
                    )}
                    </div>

                    {errorMessage && (
                      <div className="invalid-feedback">{errorMessage}</div>
                    )}
                    <div className="form-group text-center">
                      <button
                        type="submit"
                        className="submitBtn"
                        onClick={handleLogin}
                      >
                        {language === "en" ? "  Login" :"تسجيل الدخول"}
                      </button>
                    </div>
                    <div>
                      <div className="alreadyTxt text-center">
                        {language === "en"
                          ? "     New customer?"
                          : "عميل جديد؟"}

                        <Link
                          to="/register"
                          className="text-decoration-underline"
                        >
                          {language === "en"
                            ? "   Create an account"
                            : "إنشاء حساب"}
                        </Link>
                      </div>
                      <div className="alreadyTxt text-center">
                        <Link
                          to="/forgotpass"
                          className="text-decoration-underline"
                        >
                          {language === "en"
                            ? " Forgot your Password?  "
                            :"نسيت كلمة السر؟"}
                        </Link>
                      </div>

                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
