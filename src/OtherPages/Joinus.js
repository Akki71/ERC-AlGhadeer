import React, { useState, useEffect } from "react";
import { useLanguage } from "../redux/LanguageContext";
import BASE_PATH, { ERC_ReCAPTCHA } from "../serviceurls";
import ReCAPTCHA from "react-google-recaptcha";
import Loader from "../components/Loader";
 import DOMPurify from "dompurify";
const Joinus = () => {
  const { language } = useLanguage();
  const [showReCAPTCHA, setShowReCAPTCHA] = useState(false);
  const [Data, setData] = useState(null);
   const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    yourName: "",
    yourEmail: "",
    yourPhoneNumber: "",
    yourMessage: "",
  });
  const [errors, setErrors] = useState({});
  const [captchaValue, setCaptchaValue] = useState(null);
  const token = localStorage.getItem("token");
 
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
  }, []);
 
  const validateForm = () => {
    const newErrors = {};
 
    if (!formData.yourName) {
      newErrors.yourName =
        language === "en" ? "Name is required" : "Name is required";
    }
 
    if (!formData.yourEmail) {
      newErrors.yourEmail =
        language === "en" ? "Email is required" : "عنوان البريد الإلكتروني";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.yourEmail)) {
        newErrors.yourEmail =
          language === "en" ? "Invalid email format" : "Invalid  email format";
      }
    }
 
    if (!formData.yourPhoneNumber) {
      newErrors.yourPhoneNumber =
        language === "en"
          ? 'Mobile Number is required' : "رقم الهاتف مطلوب";
    }
 
    if (!formData.yourMessage) {
      newErrors.yourMessage =
        language === "en" ? "Message is required" : "Message is required";
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
 
  const onChangerecaptcha = (value) => {
    setCaptchaValue(value);
    // console.log("Captcha value:", value);
    if (value) {
      Sendtoapi();
    } else {
      alert(
        language === "en"
          ? "ReCAPTCHA validation failed"
          : "فشل التحقق من ReCAPTCHA"
      );
    }
    setShowReCAPTCHA(false);
  };
 
  const modaldataforcheck = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowReCAPTCHA(true);
      // console.log("Form Data:", formData);
    }
  };
 
  const Sendtoapi = async () => {
 
    const payload = {
      CommunitySupportContactId: Math.floor(Math.random() * 1000000),
      BecomeAnArtisan: "Become an Artisan",
      Name: formData.yourName,
      Email: formData.yourEmail,
      PhoneNumber: formData.yourPhoneNumber,
      LeaveUsMessage: formData.yourMessage,
    };
 
    try {
      const response = await fetch(
        `${BASE_PATH}Page/PostCommunitySupportContacts`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json-patch+json",
          },
          body: JSON.stringify(payload),
        }
      );
 
      if (response.ok) {
        const data = await response.json();
        // console.log("API Response:", data);
        alert(
          language === "en"
            ? "Form submitted successfully!"
            : "تم إرسال النموذج بنجاح!"
        );
        setFormData({
          yourName: "",
          yourEmail: "",
          yourPhoneNumber: "",
          yourMessage: "",
        });
        setCaptchaValue(null); // Reset ReCAPTCHA value
      } else {
        console.error("Failed to submit form:", response.status);
        if (response.status === 401) {
          alert(language === "en" ? "Unauthorized request" : "طلب غير مصرح به");
        } else {
          alert(
            language === "en" ? "Failed to submit form" : "فشل في إرسال النموذج"
          );
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        language === "en"
          ? "An error occurred while submitting the form"
          : "حدث خطأ أثناء إرسال النموذج"
      );
    }
  };
 
  useEffect(() => {
    handleViewDetails();
  }, []);
  const handleViewDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_PATH}Page/GetPageByName?pageName=our-community`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      // console.log("resultttt", result[0])
      // console.log("resultttt", result[0].SectionModels[0].LabelModels[0].MediaPath);
      // src={Data[0].SectionModels[1].LabelModels[0].MediaPath}
      setLoading(false);
      setData(result)
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };
// console.log("hihihihihi",Data);
 
 
  return (
    <>
    {loading ? (
      <div id="hola">
        <div id="preloader">
          <Loader />
        </div>
      </div>
    ) : (
    <>
    {Data && Data[0] && Data[0].SectionModels && (
<>
    <div className="secBg">
      <div className="full-container container">
        <div>
          <ul className="list-unstyled mb-0 pt-5 d-flex flex-column gap-5">
            <li className="list-block-item">
              <div className="row justify-content-center align-items-center">
                <div className="col-lg-5 order-1">
                  <div className="craftImg mrg-b-10">
                  <img className="w-100"
            alt="Image Alt Text"
           src={Data[0].SectionModels[0].LabelModels[4].MediaPath}
          />
                    {/* <img src={require("../assets/images/Bitmap.jpg")} alt="" /> */}
                  </div>
                </div>
                <div className="col-lg-5 order-0">
                  <div className="ourCraft_bx">
                    <div className="craftTitle f-s-30 font-Lyon mrg-b-10"
                    dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                  language === "en"
                  ?Data[0].SectionModels[0].LabelModels[0].EnglishDescription
                  :Data[0].SectionModels[0].LabelModels[0].ArabicDescription  
                   ), }}
              />
                    {/* </div> */}
                    {/* <div className="craftSummary text-justify">
                      <p>
                        By registering in Al Ghadeer Emirati Craft Project, you
                        will have the opportunity to receive training and
                        produce contemporary local products. It will help you
                        obtain sustainable support throughout the year, allowing
                        you to grow and succeed
                      </p>
 
                      <ul>
                        <li>Free training on all crafts for the members</li>
                        <li>Empowering craftwomen on several levels</li>
                        <li>
                          Developing their hobbies and gain new skills in line
                          with Al Ghadeer's vision
                        </li>
                        <li>Providing raw materials for product production</li>
                        <li>
                          The working system is flexible (from Al Ghadeer
                          workshop or the craftwoman house)
                        </li>
                        <li>
                          Empowering people of determination from craftswomen
                        </li>
                        <li>Bank card account</li>
                      </ul>
                     
                    </div> */}
                    <div className="craftSummary text-justify"
                     
                       dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                  language === "en"
                  ?Data[0].SectionModels[0].LabelModels[2].EnglishDescription
                  :Data[0].SectionModels[0].LabelModels[2].ArabicDescription  
                  ),  }}
              />
                    <div className="craftSummary text-justify"></div>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-block-item">
              <div className="row justify-content-center align-items-center">
                <div className="col-lg-5">
                  <div className="craftImg mrg-b-10">
                    <img
                               src={Data[0].SectionModels[0].LabelModels[5].MediaPath}
 
                      // src={require("../assets/images/registration-feature.jpg")}
                      alt=""
                    />
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="ourCraft_bx">
                    <div className="craftTitle f-s-30 font-Lyon mrg-b-10"
                    dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                  language === "en"
                  ?Data[0].SectionModels[0].LabelModels[1].EnglishDescription
                  :Data[0].SectionModels[0].LabelModels[1].ArabicDescription  
                  ),  }}
              />                  
                {/* </div> */}
                    {/* <div className="craftSummary">
                      <ul>
                        <li>Emirates ID</li>
                        <li>Personal Photo</li>
                        <li>Passport Photo</li>
                        <li>Resident Visa (for Expatriates)</li>
                      </ul>
                    </div> */}
                    <div className="craftSummary"
                    dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                  language === "en"
                  ?Data[0].SectionModels[0].LabelModels[3].EnglishDescription
                  :Data[0].SectionModels[0].LabelModels[3].ArabicDescription  
                   ), }}
              />
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="privacyPolicy_sec">
        <div className="full-container container">
          <div className="row justify-content-center">
            <div className="col-md-7 align-self-center">
              <div className="contactUs_wrap">
                <div className="secTitle_wrap mrg-b-30">
                  <div className="sec_subTitle font-Lyon f-s-40">
                    {" "}
                    {language === "en"
                      ? "Be part of AlGhadeer community  "
                      : "  كن جزء من مجتمع الغدير   "}{" "}
                  </div>
                </div>
                <form>
                  <div className="formGroup mrg-b-30">
                    <div className="cstInput">
                      {language === "en"
                        ? "Become an Artisan"
                        : "نموذج الانضمام الى حرفيين الغدير."}
                    </div>
                  </div>
                  <div className="formGroup mrg-b-30">
                    <input
                      type="text"
                      name="yourName"
                      className="cstInput"
                      placeholder={language === "en" ? "Name" : "أدخل اسمك"}
                      value={formData.yourName}
                      onChange={handleInputChange}
                    />
                    {errors.yourName && (
                      <span className="error" style={{ color: "red" }}>{errors.yourName}</span>
                    )}
                  </div>
                  <div className="formGroup mrg-b-30">
                    <input
                      type="text"
                      name="yourEmail"
                      className="cstInput"
                      placeholder={
                        language === "en" ? "Email" : "أدخل بريدك الإلكتروني"
                      }
                      value={formData.yourEmail}
                      onChange={handleInputChange}
                    />
                    {errors.yourEmail && (
                      <span className="error" style={{ color: "red" }}>{errors.yourEmail}</span>
                    )}
                  </div>
                  <div className="formGroup mrg-b-30">
                    <input
                      type="text"
                      name="yourPhoneNumber"
                      className="cstInput"
                      placeholder={
                        language === "en" ? "Phone Number" : "أدخل رقم هاتفك"
                      }
                      value={formData.yourPhoneNumber}
                      onChange={handleInputChange}
                    />
                    {errors.yourPhoneNumber && (
                      <span className="error" style={{ color: "red" }}>{errors.yourPhoneNumber}</span>
                    )}
                  </div>
                  <div className="formGroup mrg-b-30">
                    <textarea
                      name="yourMessage"
                      placeholder={
                        language === "en"
                          ? "Leave us a message"
                          : "اترك لنا رسالة"
                      }
                      className="cstInput"
                      rows={6}
                      value={formData.yourMessage}
                      onChange={handleInputChange}
                    />
                    {errors.yourMessage && (
                      <span className="error" style={{ color: "red" }}>{errors.yourMessage}</span>
                    )}
                  </div>
                  {showReCAPTCHA ? (
                  <ReCAPTCHA   sitekey={ERC_ReCAPTCHA} onChange={onChangerecaptcha} />
                ) : (
                  <div className="formGroup">
                    <button type="submit" onClick={modaldataforcheck} className="contactSubmit font-Lyon clr-pink-light">
                      {language === "en" ? "Submit" : "تقديم"}
                    </button>
                  </div>
                )}
                </form>
                <div>
                  {/* <button className="contactSubmit font-Lyon clr-pink-light">
                    {language === "en" ? "Submit" : "تقديم"}
                  </button> */}
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="contactMap">
                <img
                src={Data[0].SectionModels[1].LabelModels[0].MediaPath}
                  // src={`${BASE_PATH}Images/workshop/1.jpg`}
                  className="w-100 h-100"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )}
  </>
)}
</>
  );
};
 
export default Joinus;