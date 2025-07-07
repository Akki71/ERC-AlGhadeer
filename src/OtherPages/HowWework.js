import React, { useState, useEffect } from 'react';
import dashboard_bg from "../assets/images/dashboard-bg.jpg";
import Partner from "../components/Partner";
import whoweare from "../assets/images/who-we-are-img-1.jpg"
import ourfounder from "../assets/images/our-founder-1-1.jpg"
import handleClick from '../components/links';
import AL_Ghadeer_logo from "../assets/images/AL-Ghadeer-logo.png";
import BASE_PATH from '../serviceurls';
import Loader from '../components/Loader';
import { useLanguage } from '../redux/LanguageContext';
import Location from '../components/Location';

const HowWework = () => {
  const [responseData, setResponseData] = useState(null);
  useEffect(() => { handleClick() }, [handleClick])
const { language} = useLanguage();  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_PATH}Page/GetPageByName?pageName=how-it-works`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*'
          }
        });
        const data = await response.json();
        setResponseData(data); 
        setLoading(false);
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  // console.log(responseData);



  const [loading , setLoading] = useState(true)
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
        <Loader/>
        </div>
      </div>
    ) : (
    <div>
      {responseData && responseData[0] && responseData[0].SectionModels && (
        <div>
          <div className="topBanner_sec">
            <div className="topBanner_inn">
              <img
                src={responseData[0].SectionModels[0].LabelModels[0].MediaPath}
                className="w-100" alt="" />
            </div>
          </div>
          <div className="home_section_three secBg">
            <div className="full-container container">
              <div className="row">
                <div className="col-md-12">
                  <div className="secTitle_wrap text-center mrg-b-30" data-aos="fade-up" data-aos-delay={300}>
                    <div className="sec_subTitle f-s-20"
                      dangerouslySetInnerHTML={{
                        __html: language === "en"
                          ? responseData[0].SectionModels[1].LabelModels[0].EnglishDescription
                          : responseData[0].SectionModels[1].LabelModels[0].ArabicDescription
                      }}
                    />
                    <div className="secTitle f-s-30 font-Lyon "> 
                    
                    {language === "en"
                        ? "How it Works"
                        : "كيف تعمل"} </div>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center mrg-b-50">
                <div className="col-md-5 col-lg-4 align-self-center order-1 order-md-0">
                  <div data-aos="fade-up" data-aos-delay={300}>

                    <div className="inspirationCont line_H_1_2 mrg-b-30"
                      dangerouslySetInnerHTML={{
                        __html: language === "en"
                          ? responseData[0].SectionModels[1].LabelModels[0].EnglishDescription
                          : responseData[0].SectionModels[1].LabelModels[0].ArabicDescription
                      }}
                    />

                    <div className="inspirationCont line_H_1_2 mrg-b-30"
                      dangerouslySetInnerHTML={{
                        __html: language === "en"
                          ? responseData[0].SectionModels[1].LabelModels[1].EnglishDescription
                          : responseData[0].SectionModels[1].LabelModels[1].ArabicDescription
                      }}


                    /></div>
                </div>
                <div className="col-md-5 col-lg-4 order-0 order-md-1">
                  <div className="inspiration-imgWrap slide-overlay-wrap">
                    <picture className="w-100 d-block">

                      <img decoding="async"
                        src={responseData[0].SectionModels[1].LabelModels[2].MediaPath}
                        alt="" className="w-100 mobImg" loading="lazy" />
                    </picture>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center mrg-b-50">
                <div className="col-md-5 col-lg-4">
                  <div className="inspiration-imgWrap slide-overlay-wrap">
                    <picture className="w-100 d-block">
                    
                      <img decoding="async" 
                       src={responseData[0].SectionModels[1].LabelModels[3].MediaPath}
                      alt="" className="w-100 mobImg" loading="lazy" />
                    </picture>
                  </div>
                </div>
                <div className="col-md-5 col-lg-4 align-self-center">
                  <div data-aos="fade-up" data-aos-delay={300}>

                    <div className="inspirationCont line_H_1_2 mrg-b-30"
                      dangerouslySetInnerHTML={{
                        __html: language === "en"
                          ? responseData[0].SectionModels[1].LabelModels[4].EnglishDescription
                          : responseData[0].SectionModels[1].LabelModels[4].ArabicDescription
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
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
                        : "   الداعمين"}
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
    </>

  )

}

export default HowWework