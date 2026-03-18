import React, { useState, useEffect } from "react";
// import banner_img from "../assets/images/banner-img-1.jpg";
import banner_logo from "../assets/images/banner-logo.png";
import down_arrow from "../assets/images/down-arrow.png";
import Partner from "../components/Partner";
import handleClick from "../components/links.js";
import RelatedProductsSlider from "../components/HomeRelatedProducts.js";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import TokenPage from "../utils/TokenPage.js";
import BASE_PATH from "../serviceurls.js";
import Loader from "../components/Loader.js";
import { useLanguage } from "../redux/LanguageContext";
import Location from "../components/Location.js";
import DOMPurify from "dompurify";
const Homepage = () => {
  useEffect(() => {
    handleClick();
  }, [handleClick]);

  const { language } = useLanguage();
  const [getToken, setGetToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState(null);
  const navigate = useNavigate();

  const redirectToHowWeWorken = () => {
    navigate("/howwework");
  };

  const redirectToCraftsen = () => {
    navigate("/ourcrafts");
  };

  const fetchToken = async () => {
    try {
      const postData = {
        UserName: "GHADEER",
        Password: "GHADEER123",
        GrantType: "password",
      };

      const response = await fetch(`${BASE_PATH}Security/GetToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }

      const data = await response.json();
      localStorage.setItem("token", data.AccessToken);
      setGetToken(data.AccessToken);

      // Set token expiration time
      const expirationTime = new Date().getTime() + 3500000; // 1 hour in milliseconds
      localStorage.setItem("tokenExpiration", expirationTime);
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_PATH}Page/GetPageByName?pageName=home`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResponseData(data);
        setLoading(false);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      await fetchToken(); // Refresh token
      fetchData(); // Retry fetching data after token refresh
    }
  };

  useEffect(() => {
    if (getToken) {
      fetchData();
    }
  }, [getToken]);
  return (
    <div>
      <ToastContainer />
      <TokenPage setGetToken={setGetToken} />

      {loading ? (
        <div id="hola">
          <div id="preloader">
            <Loader />
          </div>
        </div>
      ) : (
        <div>
          {responseData && responseData[0] && responseData[0].SectionModels && (
            <div>
              <div className="home_section_one vh-100 position-relative slide-overlay-wrap">
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
                <div className="rev-slider">
                  <div className="slide-item">
                    <div className="topBanner_sec position-relative">
                      <div className="topBanner">
                        <picture className="w-100 d-block h-100">
                          <img
                            decoding="async"
                            className="w-100 h-100 objCvr objPosition mobImg"
                            loading="lazy"
                            src={
                              responseData[0].SectionModels[0].LabelModels[1]
                                .MediaPath
                            }
                            alt="Image Alt Text"
                          />
                        </picture>
                      </div>
                      <div className="topBanner_txt">
                        <div className="topBannerInn_txt">
                          <div className="topBanner_secInn">
                            <div
                              className="bannerTxt f-s-20 font-Lyon text-center light-pink-clr line_H_1_2 mrg-b-65"
                              data-aos="fade-up"
                              data-aos-duration={700}
                              data-aos-delay={600}
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  language === "en"
                                    ? responseData[0].SectionModels[0].LabelModels[0].EnglishDescription
                                    : responseData[0].SectionModels[0].LabelModels[0].ArabicDescription
                                ),
                              }}
                            />
                            <div
                              className="banner-logo"
                              data-aos="fade-up"
                              data-aos-duration={700}
                              data-aos-delay={900}
                            >
                              <picture className="w-100 d-block">
                                <img
                                  decoding="async"
                                  className="w-100 objCvr mobImg"
                                  loading="lazy"
                                  alt="Image Alt Text"
                                  src={banner_logo}
                                />
                              </picture>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="downArrow">
                  <div className="downArrow_inn bounce">
                    <picture className="w-100 d-block">
                      <source
                        srcSet={down_arrow}
                        media="(min-width: 768px)"
                        className="w-100 objCvr deskImg"
                      />
                      <img
                        decoding="async"
                        src={down_arrow}
                        className="w-100 objCvr mobImg"
                        loading="lazy"
                      />
                    </picture>
                  </div>
                </div>
              </div>
              <div className="home_section_two secBg erc-slidersection">
                <div className="full-container container">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="secTitle_wrap text-center mrg-b-30">
                        <div
                          className="sec_subTitle font-Lyon f-s-20"
                          data-aos="fade-up"
                          data-aos-delay={300}
                        >
                          {language === "en"
                            ? "Our Best Sellers"
                            : " الأكثر مبيعاً لدينا  "}
                        </div>
                        <div
                          className="secTitle f-s-30"
                          data-aos="fade-up"
                          data-aos-delay={600}
                        >
                          {language === "en"
                            ? " Shop our Products"
                            : "تسوق منتجاتنا "}
                        </div>
                      </div>
                    </div>
                  </div>
                  <RelatedProductsSlider />
                </div>
              </div>
              <div className="home_section_three secBg_dark">
                <div className="full-container container">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="shopCollection_bx">
                        <div className="row">
                          <div className="col-sm-6 col-md-6">
                            <div className="collectionBx collectionBx_1 position-relative z-index-9">
                              <div className="collectionImg mrg-b-10 slide-overlay-wrap">
                                <div
                                  className="slideOver slide-bg-1 slide-left"
                                  data-aos="slide-left"
                                  data-aos-delay={500}
                                  data-aos-duration={500}
                                />
                                <div
                                  className="slideOver slide-left"
                                  data-aos="slide-left"
                                  data-aos-delay={200}
                                  data-aos-duration={500}
                                />
                                <picture className="w-100 d-block">
                                  <img
                                    decoding="async"
                                    className="w-100 objCvr mobImg"
                                    loading="lazy"
                                    alt="Image Alt Text"
                                    src={
                                      responseData[0].SectionModels[1]
                                        .LabelModels[0].MediaPath
                                    }
                                  />
                                </picture>
                              </div>
                              {/* <div className="collectionBx_txt">
                                <div
                                  className="collection_subTitile f-s-20 font-Lyon clr-pink-light"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      language === "en"
                                        ? responseData[0].SectionModels[1]
                                            .LabelModels[3].EnglishDescription
                                        : responseData[0].SectionModels[1]
                                            .LabelModels[3].ArabicDescription,
                                  }}
                                />

                                <div className="collection_titile f-s-30 mrg-b-10 line_H_1 clr-pink-light">
                                  {language === "en" ? "The Green" : "ذا جرين"}
                                </div>
                              </div> */}
                            </div>
                          </div>
                          <div className="col-sm-6 col-md-6">
                            <div className="collectionBx collectionBx_2">
                              <div className="collectionBx_txt mrg-t-100">
                                <div
                                  className="collection_subTitile font-Lyon clr-pink-light line_H_1_2 mrg-b-20"
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                      language === "en"
                                        ? responseData[0].SectionModels[1].LabelModels[1].EnglishDescription
                                        : responseData[0].SectionModels[1].LabelModels[1].ArabicDescription
                                    ),
                                  }}
                                />
                              </div>
                              <div className="collectionImg mrg-b-10 slide-overlay-wrap">
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
                                <picture className="w-100 d-block">
                                  <img
                                    decoding="async"
                                    className="w-100 mobImg"
                                    loading="lazy"
                                    alt="Image Alt Text"
                                    src={
                                      responseData[0].SectionModels[1]
                                        .LabelModels[2].MediaPath
                                    }
                                  />
                                </picture>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 align-self-center">
                      <div
                        className="collection_contBx"
                        data-aos="fade-up"
                        data-aos-delay={300}
                      >
                        <div
                          className="collectionContTxt mrg-b-30 clr-pink-light"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              language === "en"
                                ? responseData[0].SectionModels[1]
                                  .LabelModels[4].EnglishDescription
                                : responseData[0].SectionModels[1]
                                  .LabelModels[4].ArabicDescription,
                            ),
                          }}
                        />

                        <div className="collectionCont_btn">
                          <Link
                            to="/ourproductlisting"
                            onClick={handleClick}
                            className="collectionShop_btn font-Lyon clr-pink-light"
                          >
                            {language === "en" ? " Shop Now" : " تسوق الآن "}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="home_section_four">
                <div className="craft-highlightImg_wrap position-relative">
                  <div className="craft-highlightImg slide-overlay-wrap">
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
                      {/* <source
                  srcSet={craft_highlight_img}
                  media="(min-width: 768px)"
                  className="w-100 h-100 objCvr deskImg"
                /> */}
                      <img
                        decoding="async"
                        className="w-100 h-100 objCvr mobImg"
                        loading="lazy"
                        alt="Image Alt Text"
                        src={
                          responseData[0].SectionModels[2].LabelModels[0]
                            .MediaPath
                        }
                      />
                    </picture>
                  </div>
                  <div className="craftCont">
                    <div
                      className="craftCont_inn mx-auto text-center"
                      data-aos="fade-up"
                      data-aos-delay={900}
                    >
                      <div
                        className="craftTxt_1 f-s-20 font-Lyon clr-pink-light"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            language === "en"
                              ? responseData[0].SectionModels[2].LabelModels[1]
                                .EnglishDescription
                              : responseData[0].SectionModels[2].LabelModels[1]
                                .ArabicDescription,
                       ),  }}
                      />
                      <div
                        className="craftTxt_2 f-s-20 clr-pink-light"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            language === "en"
                              ? responseData[0].SectionModels[2].LabelModels[2]
                                .EnglishDescription
                              : responseData[0].SectionModels[2].LabelModels[2]
                                .ArabicDescription,
                      ),   }}
                      />

                      <div
                        className="craftTxt_3 clr-pink-light mrg-b-30"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            language === "en"
                              ? responseData[0].SectionModels[2].LabelModels[3]
                                .EnglishDescription
                              : responseData[0].SectionModels[2].LabelModels[3]
                                .ArabicDescription,
                        ), }}
                      />
                      <div
                        className="craftTxt_3 clr-pink-light mrg-b-30"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            language === "en"
                              ? responseData[0].SectionModels[2].LabelModels[4]
                                .EnglishDescription
                              : responseData[0].SectionModels[2].LabelModels[4]
                                .ArabicDescription,
                        ), }}
                      />
                      <div className="support_btn">
                        <button
                          onClick={(e) => {
                            handleClick();
                            redirectToCraftsen();
                          }}
                          className="collectionShop_btn font-Lyon clr-pink-light"
                        >
                          {" "}
                          {language === "en"
                            ? "Learn More "
                            : "  تعرف على المزيد    "}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="home_section_five secBg">
                <div className="full-container container">
                  <div className="row">
                    <div className="col-md-6 align-self-center">
                      <div
                        className="inspiration-cont mx-auto"
                        data-aos="fade-up"
                        data-aos-delay={300}
                      >
                        <div
                          className="inspirationTxt_1 f-s-20 font-Lyon"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              language === "en"
                                ? responseData[0].SectionModels[3]
                                  .LabelModels[0].EnglishDescription
                                : responseData[0].SectionModels[3]
                                  .LabelModels[0].ArabicDescription,
                        ),   }}
                        />

                        <div
                          className="inspirationTxt_1 f-s-30"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              language === "en"
                                ? responseData[0].SectionModels[3]
                                  .LabelModels[1].EnglishDescription
                                : responseData[0].SectionModels[3]
                                  .LabelModels[1].ArabicDescription,
                          ), }}
                        />
                        {/* 
                      <div className="inspirationCont line_H_1_2 mrg-b-30 "
                        dangerouslySetInnerHTML={{
                          __html:

                            language === "en"
                              ? responseData[0].SectionModels[3].LabelModels[2].EnglishDescription
                              : responseData[0].SectionModels[3].LabelModels[2].ArabicDescription
                        }}
                      /> */}

                        <div
                          className="inspirationCont line_H_1_2 mrg-b-30"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              language === "en"
                                ? responseData[0].SectionModels[3]
                                  .LabelModels[3].EnglishDescription
                                : responseData[0].SectionModels[3]
                                  .LabelModels[3].ArabicDescription,
                         ),  }}
                        />

                        <div className="support_btn">
                          <button
                            onClick={(e) => {
                              handleClick();
                              redirectToHowWeWorken();
                            }}
                            // onClick={redirectToHowWeWorken}
                            className="collectionShop_btn font-Lyon clr-pink-light"
                          >
                            {language === "en"
                              ? "Learn More "
                              : "   تعرف على المزيد   "}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="inspiration-imgWrap slide-overlay-wrap">
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
                        <picture className="w-100 d-block">
                          <img
                            decoding="async"
                            className="w-100 mobImg"
                            loading="lazy"
                            alt="Image Alt Text"
                            src={
                              responseData[0].SectionModels[3].LabelModels[4]
                                .MediaPath
                            }
                          />
                        </picture>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Location />
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
                          {language === "en" ? "Thank you " : "شكراً"}
                        </div>
                        <div className="secTitle f-s-30">
                          {language === "en"
                            ? "  Our Partners &"
                            : "شركاؤنا و "}

                          {language === "en" ? " Supporters" : "  الداعمين"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Partner />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Homepage;
