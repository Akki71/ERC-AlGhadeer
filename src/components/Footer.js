import React, { useState, useEffect } from "react";
import emirates_red_logo from "../assets/images/emirates-red-logo.png";
import AL_Ghadeer_logo from "../assets/images/AL-Ghadeer-logo.png";
import footerlogo from "../assets/images/footer-logo.png";
import { Link } from "react-router-dom";
import handleClick from "./links";
import { useLanguage } from "../redux/LanguageContext";
const Footer = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div>
      <div className="footer secBg">
        <div className="full-container container">
          <div className="row rowFooter justify-content-center">
            <div className="cst-col">
              <div className="footerBx">
                <ul className="list-unstyled">
                  <li className="list-block-item">
                    <Link
                      to="/faq"
                      onClick={(e) => {
                        handleClick();
                      }}
                      className="footer-link"
                    >
                      
                      {language === "en"
                        ? "  FAQ   "
                        : "الأسئلة الأكثر شيوعاً"}
                    </Link>
                  </li>
                  <li className="list-block-item">
                    <Link
                      to="/privacypolicy"
                      onClick={(e) => {
                        handleClick();
                      }}
                      className="footer-link"
                    >
                      
                      {language === "en"
                        ? "   Privacy Policy   "
                        : " سياسة الخصوصية "}
                    </Link>
                  </li>
                  <li className="list-block-item">
                    <Link
                      to="/termscondition"
                      onClick={(e) => {
                        handleClick();
                      }}
                      className="footer-link"
                    >
                      
                      {language === "en"
                        ? " Terms & Conditions    "
                        : "   الأحكام والشروط  "}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="cst-col">
              <div className="footerBx">
                <ul className="list-unstyled">
                  {/* <li className="list-block-item">
                    {language === "en" ? (
                      <Link to="/ourpeople/en" onClick={(e) => { handleClick(); }} className="footer-link"> Our Team </Link>
                    ) : (
                      <Link to="/ourpeople/ar" onClick={(e) => { handleClick(); }} className="footer-link"> فريقنا</Link>


                    )}</li> */}
                  <li className="list-block-item">
                    <Link
                      to="/contribute"
                      onClick={(e) => {
                        handleClick();
                      }}
                      className="footer-link"
                    >
                      
                      {language === "en"
                        ? "  Contribute   "
                        : " ساهم"}
                    </Link>
                  </li>
                  <li className="list-block-item">
                    <Link
                      to="/contactus"
                      onClick={(e) => {
                        handleClick();
                      }}
                      className="footer-link"
                    >
                      
                      {language === "en"
                        ? "   Contact Us  "
                        : "اتصل بنا "}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="footerBx">
                <div className="followTxt line_H_1_2">
                  {language === "en"
                    ? "        Follow us for updates and more on instagram"
                    : "  تابعونا لمعرفة آخر الأخبار والمزيد على الانستغرام "}

                  <a
                    href=""
                    target="_blank"
                    className="text-decoration-underline"
                  >
                    @alghadeeremiraticrafts
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 order-lg-1">
              <div className="footerBx w-80">
                <div className="followTxt line_H_1_2">
                  <span className="d-none d-lg-block">
                    {language === "en"
                      ? "  A developmental & entrepreneurial project by Emirates Red Crescent"
                      : "مشروع تنموي وريادي من قبل الهلال الأحمر الإماراتي"}
                  </span>

                  {language === "en"
                    ? " © 2024 AlGhadeer Emirati Crafts"
                    : "       الغدير للحرف الإماراتية © 2024 "}
                </div>
              </div>
            </div>
            <div className="col-lg-2 order-lg-2">
              <div className="emirates-red-logo">
                <picture className="w-100 d-block">
                  <source
                    srcSet={emirates_red_logo}
                    media="(min-width: 768px)"
                    className="w-100 deskImg"
                  />
                  <img
                    decoding="async"
                    src={emirates_red_logo}
                    className="w-100 mobImg"
                    loading="lazy"
                  />
                </picture>
              </div>
            </div>
            <div className="col-lg-2 align-self-center">
              <div className="footerBx">
                <div className="footerCenter-logo">
                  <picture className="w-100 d-block">
                    <source
                      srcSet={footerlogo}
                      media="(min-width: 768px)"
                      className="w-100 deskImg"
                    />
                    <img
                      decoding="async"
                      src={footerlogo}
                      className="w-100 mobImg"
                      loading="lazy"
                    />
                  </picture>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
