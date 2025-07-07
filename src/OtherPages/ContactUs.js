import handleClick from '../components/links';
import React, { useState, useEffect } from "react";
import { useLanguage } from '../redux/LanguageContext';
const ContactUs = () => {
  useEffect(() => { handleClick() }, [handleClick])
  useEffect(() => {

    window.scrollTo(0, 0);
  }, []);
  const { language } = useLanguage();
  return (
    <div className="privacyPolicy_sec secBg">
      <div className="full-container container">
        <div className="row justify-content-center">
          <div className="col-md-6 align-self-center">
            <div className="contactUs_wrap">
              <div className="secTitle_wrap mrg-b-30">
                <div className="sec_subTitle font-Lyon f-s-40">   {language === "en"
                  ? "Contact Us  "
                  : "اتصل بنا "} </div>
              </div>
              <form>
                <div className="formGroup mrg-b-30">
                  <input type="text" name="yourName" className="cstInput" placeholder={language === "en" ? " Enter your Name" : "أدخل اسمك"} />
                </div>
                <div className="formGroup mrg-b-30">
                  <input type="text" name="yourEmail" className="cstInput" placeholder={language === "en" ? " Enter your Email" : "أدخل بريدك الإلكتروني"} />
                </div>
                <div className="formGroup mrg-b-30">
                  <input type="text" name="yourPhoneNumber" className="cstInput" placeholder={language === "en" ? " Enter your Phone Number" : "أدخل رقم هاتفك"} />
                </div>
                <div className="formGroup mrg-b-30">
                  <textarea placeholder={language === "en" ? " leave us a message ..." : "اترك لنا رسالة..."} className="cstInput" rows={6} defaultValue={""} />
                </div>
                <div className="formGroup">
                  <button type="submit" className="contactSubmit font-Lyon clr-pink-light">
                    {language === "en"
                      ? "Submit"
                      : "تقديم"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6">
            <div className="contactMap">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d465130.67126320105!2d54.22895215776209!3d24.387099417952445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e440f723ef2b9%3A0xc7cc2e9341971108!2sAbu%20Dhabi%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sin!4v1690030881498!5m2!1sen!2sin" width="100%" height={800} style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default ContactUs






// import React, { useState, useEffect } from "react";
// import emailjs from 'emailjs-com';
// import { useLanguage } from '../redux/LanguageContext';

// const ContactUs = () => {
//   const [formData, setFormData] = useState({
//     yourName: '',
//     yourEmail: '',
//     yourPhoneNumber: '',
//     message: ''
//   });

//   const { language } = useLanguage();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Send email using EmailJS
//     emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData, 'YOUR_USER_ID')
//       .then((response) => {
//         console.log('Email sent successfully:', response);
//         alert('Email sent successfully!');
//       })
//       .catch((error) => {
//         console.error('Failed to send email:', error);
//         alert('Failed to send email. Please try again later.');
//       });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   return (
//     <div className="privacyPolicy_sec secBg">
//       <div className="full-container container">
//         <div className="row justify-content-center">
//           <div className="col-md-6 align-self-center">
//             <div className="contactUs_wrap">
//               <div className="secTitle_wrap mrg-b-30">
//                 <div className="sec_subTitle font-Lyon f-s-40">
//                   {language === "en" ? "Contact Us" : "اتصل بنا"}
//                 </div>
//               </div>
//               <form onSubmit={handleSubmit}>
//                 <div className="formGroup mrg-b-30">
//                   <input
//                     type="text"
//                     name="yourName"
//                     className="cstInput"
//                     placeholder={language === "en" ? "Enter your Name" : "أدخل اسمك"}
//                     value={formData.yourName}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="formGroup mrg-b-30">
//                   <input
//                     type="text"
//                     name="yourEmail"
//                     className="cstInput"
//                     placeholder={language === "en" ? "Enter your Email" : "أدخل بريدك الإلكتروني"}
//                     value={formData.yourEmail}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="formGroup mrg-b-30">
//                   <input
//                     type="text"
//                     name="yourPhoneNumber"
//                     className="cstInput"
//                     placeholder={language === "en" ? "Enter your Phone Number" : "أدخل رقم هاتفك"}
//                     value={formData.yourPhoneNumber}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="formGroup mrg-b-30">
//                   <textarea
//                     name="message"
//                     placeholder={language === "en" ? "Leave us a message ..." : "...."}
//                     className="cstInput"
//                     rows={6}
//                     value={formData.message}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="formGroup">
//                   <button type="submit" className="contactSubmit font-Lyon clr-pink-light">
//                     {language === "en" ? "Submit" : "تقديم"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//           <div className="col-md-6">
//             <div className="contactMap">
//               <iframe
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d465130.67126320105!2d54.22895215776209!3d24.387099417952445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e440f723ef2b9%3A0xc7cc2e9341971108!2sAbu%20Dhabi%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sin!4v1690030881498!5m2!1sen!2sin"
//                 width="100%"
//                 height={800}
//                 style={{ border: 0 }}
//                 allowFullScreen
//                 loading="lazy"
//                 referrerPolicy="no-referrer-when-downgrade"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactUs;
