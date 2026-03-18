import React, { useState, useEffect } from "react";
import our_vision_logo from "../assets/images/our-vision-logo.png";
import OurStorySlider from "../components/OurStory.slider";
import Partner from "../components/Partner";
import AL_Ghadeer_logo from "../assets/images/AL-Ghadeer-logo.png";
import { BASE_PATH} from "../serviceurls";
import Loader from "../components/Loader";
import { useLanguage } from '../redux/LanguageContext';
import Location from "../components/Location";
import DOMPurify from "dompurify";

function OurStory() {
  const [responseData, setResponseData] = useState(null);
  const [loading , setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_PATH}Page/GetPageByName?pageName=our-story`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*'
          }
        });
        setLoading(false);
        const data = await response.json();
        setResponseData(data); 
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  // console.log(responseData);
  // console.log(responseData[0].SectionModels[0].LabelModels[0].EnglishDescription);

   const { language } = useLanguage();

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  // }, []);
  return (
    <>
    {loading ? (
   
    
      <div id="hola">
        <div id="preloader">
          <div className="loader-logo mx-auto mrg-b-30">
          <Loader/>
          </div>
        </div>
      </div>
    ) : (


    <div>
      {responseData && responseData[0] && responseData[0].SectionModels && (
        <div>
          <div className="home_section_five secBg ">


            <div className="full-container container">
              <div className="row">
                <div className="col-md-6 align-self-center order-1 order-md-0">
                  <div
                    className="who-we-are mx-auto"
                    data-aos="fade-up"
                    data-aos-delay={300}
                  >
                    <div className="inspirationTxt_1 f-s-20 font-Lyon"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          language === "en"
                            ? responseData[0].SectionModels[0].LabelModels[0].EnglishDescription
                            : responseData[0].SectionModels[0].LabelModels[0].ArabicDescription
                    ),   }}
                    />

                    {/* <div className="inspirationTxt_1 f-s-30"
                      dangerouslySetInnerHTML={{
                        __html:
                          language === "en"
                            ? responseData[0].SectionModels[0].LabelModels[1].EnglishDescription
                            : responseData[0].SectionModels[0].LabelModels[1].ArabicDescription
                      }}
                    /> */}

                    <div className="inspirationCont line_H_1_2 mrg-b-30"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          language === "en"
                            ? responseData[0].SectionModels[0].LabelModels[2].EnglishDescription
                            : responseData[0].SectionModels[0].LabelModels[2].ArabicDescription
                     ),  }}
                    />

                  </div>
                </div>
                <div className="col-md-6 order-0 order-md-1">
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
                      {/* <source
                        srcSet={who_we_are_img_1}
                        media="(min-width: 768px)"
                        className="w-100 deskImg"
                      /> */}
                      <img
                        decoding="async"
                        alt="Image Alt Text"
                        src={responseData[0].SectionModels[0].LabelModels[3].MediaPath}

                        className="w-100 mobImg"
                        loading="lazy"
                      />
                    </picture>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="home_section_three secBg_dark">
            <div className="full-container container">
              <div className="row">
                <div className="col-md-7 col-lg-9">
                  <div className="founder_bx position-relative">
                    <div className="row">
                      <div className="col-sm-6 col-md-6">
                        <div className="collectionBx collectionBx_1 position-relative z-index-9">
                          <div className="founderImgBig mrg-b-10 slide-overlay-wrap">
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
                              {/* <source
                                srcSet={our_founder_1}
                                media="(min-width: 768px)"
                                className="w-100 objCvr deskImg"
                              /> */}
                              <img
                                decoding="async"
                                alt="Image Alt Text"
                                src={responseData[0].SectionModels[1].LabelModels[0].MediaPath}

                                className="w-100 objCvr mobImg"
                                loading="lazy"
                              />
                            </picture>
                          </div>

                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6">
                        <div className="collectionBx collectionBx_2">
                          <div className="founderImg mrg-b-10 slide-overlay-wrap">
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
                              {/* <source
                                srcSet={our_founder_2}
                                media="(min-width: 768px)"
                                className="w-100 deskImg"
                              /> */}
                              <img
                                decoding="async"
                                alt="Image Alt Text"
                                src={responseData[0].SectionModels[1].LabelModels[1].MediaPath}

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
                <div className="col-md-5 col-lg-3">
                  <div
                    className=" our-Founder-contBx"
                    data-aos="fade-up"
                    data-aos-delay={300}
                  >
                    <div className="ourTxt mrg-b-20 clr-pink-light font-Lyon line_H_1_2"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          language === "en"
                            ? responseData[0].SectionModels[1].LabelModels[2].EnglishDescription
                            : responseData[0].SectionModels[1].LabelModels[2].ArabicDescription
                     ),  }}
                    />

                    <div className="ourTxt mrg-b-20 clr-pink-light line_H_1_2"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(

                          language === "en"
                            ? responseData[0].SectionModels[1].LabelModels[3].EnglishDescription
                            : responseData[0].SectionModels[1].LabelModels[3].ArabicDescription
                       ),}
                      }
                    />

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="home_section_four position-relative overflow-hidden">
            <div className="sec-bottLogo">
              <img src={our_vision_logo} className="w-100" />
            </div>
            <OurStorySlider />
          </div>
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
                      {language === "en"
                        ? "Thank you "
                        : "شكراً"}
                    </div>
                    <div className="secTitle f-s-30">
                      {language === "en"
                        ? "  Our Partners &"
                        : "شركاؤنا و "}

                      {language === "en"
                        ? " Supporters"
                        :" الداعمين"}
                    </div>
                  </div>
                </div>
              </div>
              <Partner />

            </div>

          </div> </div>)}</div>
           )}
    
           </>



  );
}
export default OurStory;






