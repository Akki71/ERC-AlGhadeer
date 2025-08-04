
import React, { useEffect, useState, useContext } from "react";
import banner_logo from "../assets/images/banner-logo.png";
import Partner from "../components/Partner";
import ProductDetailsSlider from "../components/ProductDetailsSlider";
import BASE_PATH from '../serviceurls';
import { useLanguage } from '../redux/LanguageContext';
import { useParams, Link, useNavigate } from "react-router-dom";
import CustomerBought from "./CustomerBought";
import GetAllCategories from "../utils/GetAllCategory";
import Location from "../components/Location";
 
const OurProduct = () => {
 
const { language } = useLanguage();
const { id, categoryNameE } = useParams();
// console.log(categoryNameE);
  const [allCategory, setAllCategory] = useState([]);
  const onedata = allCategory.find((cat) => cat.CategoryNameE === "Sadu")
  // console.log(onedata);
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [id]);
 
  const revertUrlSegment = (str) => {
    return str
      .replace(/_/g, ',')  // Replace underscores with commas
      .replace(/-/g, ' ');  // Replace hyphens with spaces
  };
 
  return (
    <div>
      <div>
        <GetAllCategories setAllCategory={setAllCategory} />
 
        <ProductDetailsSlider />
       
        {
          allCategory
            .filter((cat) => cat.CategoryNameE.toLowerCase() === revertUrlSegment(categoryNameE))
            .map((category) => (
              <div key={category.CategoryNameE}>
                <div className="craft-highlightImg_wrap position-relative">
                  <div className="sec-bottLogo">
                    <img src={banner_logo} alt="" className="w-100" />
                  </div>
                  <div className="slide-overlay-wrap caly-pottery">
                    <div
                      className="slideOver slide-bg-1 slide-right"
                      data-aos="slide-right"
                      data-aos-delay={500}
                      data-aos-duration={500}
                    />
                    <div
                      className="slideOver slide-right"
                      data-aos="slide-right"
                      data-aos-delay={200}
                      data-aos-duration={500}
                    />
                    <picture className="w-100 h-100 d-block">
                      <img
                        decoding="async"
                        alt=""
                        className="w-100 h-100 objCvr mobImg"
                        loading="lazy"
                        src={`${BASE_PATH}Images/Product/images/cally-pottry-mob-bg.jpg`}
                      />
                    </picture>
                  </div>
                  <div className="craftCont">
                    <div
                      className="craftCont_inn mx-auto text-center"
                      data-aos="fade-up"
                      data-aos-delay={900}
                    >
                      <div className="craftTxt_1 f-s-20 font-Lyon clr-pink-light">
                        {language === "en"
                          ? category.CategoryNameE
                          : category.CategoryNameA}
                      </div>
                      <div className="craftTxt_3 clr-pink-light mrg-b-30">
                        {language === "en"
                          ? category.CategoryDescriptionE
                          : category.CategoryDescriptionA}
                      </div>
                      <div className="collectionCont_btn">
                        <li className="collectionShop_btn font-Lyon clr-pink-light">
                          <Link
                            to="/ourcrafts"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                            className="nav-link"
                          >
                            {language === "en" ? "Learn More" : "تعرف على المزيد"}
                          </Link>
                        </li>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
        }
 
        <CustomerBought categoryNameE={categoryNameE} id={id} />
 
        <Location/>
        <div className="home_section_seven secBg">
          <div className="full-container container">
            <div className="row">
              <div className="col-md-12">
                <div
                  className="secTitle_wrap text-center mrg-b-30"
                  data-aos="fade-up"
                  data-aos-delay={300}
                >
                  <div className="sec_subTitle font-Lyon f-s-20">
                    { language === "en"
                      ? "Thank you "
                      : "شكراً"}
                  </div>
                  <div className="secTitle f-s-30">
 
 
                    { language === "en"
                      ? "  Our Partners &"
                      : " شركاؤنا و "}
 
                    { language === "en"
                      ? " Supporters"
                      : "  الداعمين"}
                  </div>
                </div>
              </div>
            </div>
 
            <Partner />
          </div>
        </div>
      </div>
    </div >
  );
};
 
export default OurProduct;
 
 
 





// import React, { useEffect, useState, useContext } from "react";
// import Partner from "../components/Partner";
// import ProductDetailsSlider from "../components/ProductDetailsSlider";
// import { useLanguage } from '../redux/LanguageContext';
// import { useParams, useNavigate, Link } from "react-router-dom";
// import CustomerBought from "./CustomerBought";
// const OurProduct = () => {
//   const { language } = useLanguage();
//   const { id, categoryNameE } = useParams();

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, []);
 
//   return (
//     <div>
//       <ProductDetailsSlider />
//     <CustomerBought categoryNameE={categoryNameE} /> 

//       <div className="home_section_six secBg_dark">
//         <div className="loactionFind_sec">
//           <div className="row g-0">
//             <div className="col-md-6">
//               <div className="mapLocation h-100">
//                 <iframe
//                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d465130.67126320105!2d54.22895215776209!3d24.387099417952445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e440f723ef2b9%3A0xc7cc2e9341971108!2sAbu%20Dhabi%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sin!4v1690030881498!5m2!1sen!2sin"
//                   width="100%"
//                   height="100%"
//                   style={{ border: 0 }}
//                   allowFullScreen
//                   loading="lazy"
//                   referrerPolicy="no-referrer-when-downgrade"
//                 />
//               </div>
//             </div>
//             <div className="col-md-6 align-self-center">
//               <div className="stokists_sec mx-auto" data-aos="fade-up" data-aos-delay={300}>
//                 <div className="findTxt f-s-20 clr-pink-light font-Lyon">
//                   {language === "en" ? " Where to find us" : " أين يمكنك إيجادنا"}
//                 </div>
//                 <div className="our-stockistsTxt f-s-30 clr-pink-light mrg-b-15 line_H_1">
//                   {language === "en" ? "  Our Stockists" : " مخزوننا"}
//                 </div>
//                 <div className="locationForm_wrap">
//                   <form>
//                     <div className="formGroup mrg-b-20">
//                       <select className="cstSelect">
//                         <option> UAE </option>
//                         <option> UAE </option>
//                         <option> UAE </option>
//                       </select>
//                     </div>
//                     <div className="formGroup mrg-b-20">
//                       <select className="cstSelect">
//                         <option> Abu Dhabi </option>
//                         <option> Abu Dhabi </option>
//                         <option> Abu Dhabi </option>
//                       </select>
//                     </div>
//                     <div className="formGroup mrg-b-20">
//                       <select className="cstSelect">
//                         <option> Louvre Abu Dhabi </option>
//                         <option> Louvre Abu Dhabi </option>
//                         <option> Louvre Abu Dhabi </option>
//                       </select>
//                     </div>
//                     <div className="formGroup">
//                       <button type="submit" className="collectionShop_btn font-Lyon clr-pink-light">
//                         {language === "en" ? "  Find Location" : " البحث عن الموقع"}
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="home_section_seven secBg">
//         <div className="full-container container">
//           <div className="row">
//             <div className="col-md-12">
//               <div className="secTitle_wrap text-center mrg-b-30" data-aos="fade-up" data-aos-delay={300}>
//                 <div className="sec_subTitle font-Lyon f-s-20">
//                   {language === "en" ? "Thank you " : "شكرا"}
//                 </div>
//                 <div className="secTitle f-s-30">
//                   {language === "en" ? "  Our Partners &" : "شركاؤنا و "}
//                   {language === "en" ? " Supporters" : " انصار"}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <Partner />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OurProduct;



