import React ,{useState,useEffect} from "react";
import dashboard_bg from "../assets/images/dashboard-bg.jpg";
import our_founder_1_1 from "../assets/images/our-founder-1-1.jpg";
import our_founder_2 from "../assets/images/our-founder-2.jpg";
import Partner from "../components/Partner";
import AL_Ghadeer_logo from "../assets/images/AL-Ghadeer-logo.png";
import BASE_PATH from '../serviceurls';
import Loader from "../components/Loader";
import { useLanguage } from "../redux/LanguageContext";
import Location from "../components/Location";


const AboutUs = () => {
  const [responseData, setResponseData] = useState(null);

  const [loading , setLoading] = useState(true)
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_PATH}Page/GetPageByName?pageName=about-us`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*'
          }
        });
        const data = await response.json();
        setResponseData(data); 
        setLoading(false);
  
        // Assuming there's only one page returned in the array
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // console.log(responseData);
  // console.log(responseData[0].SectionModels[0].LabelModels[0].EnglishDescription);

   const { language } = useLanguage();


  // useEffect(() => {
  
  //   setTimeout(() => {
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
        
          <img className="w-100"
            alt="Image Alt Text"
           src={responseData[0].SectionModels[0].LabelModels[0].MediaPath}
          />
           
        </div>
      </div>
      <div className="home_section_three secBg">
        <div className="full-container container">
          <div className="row">
            <div className="col-md-12">
              <div
                className="secTitle_wrap text-center mrg-b-30"
                data-aos="fade-up"
                data-aos-delay={300}
              >
             

               
                <div className="secTitle f-s-30 font-Lyon "
                 dangerouslySetInnerHTML={{
                  __html:
                  language === "en" 
                  ?responseData[0].SectionModels[1].LabelModels[0].EnglishDescription
                  :responseData[0].SectionModels[1].LabelModels[0].ArabicDescription  
                   }}
              />
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-7 col-lg-7">
              <div className="founder_bx position-relative">
                <div className="row">
                  <div className="col-sm-6 col-md-6 ">
                    <div className="arc-ourfounder-Wrp">
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
                      
                          <img className="w-100 objCvr mobImg" 
                            alt="Image Alt Text"
                        src={responseData[0].SectionModels[1].LabelModels[1].MediaPath}
                          />
                          
                           
                        </picture>
                        
                      </div>
                    </div>
                    
                   
                    <div className="founder_txt">
                            <div className="collection_subTitile f-s-20 font-Lyon clr-red-light">
                             
                              {language === "en"
                        ? " Our Founder"
                        : "مؤسس مشروع الغدير للحرف الإماراتية"}
                            </div>
                            <div className="collection_titile f-s-30 mrg-b-10 line_H_1 clr-red-light">
                        
                              {language === "en"
                        ? " Sheikha Shamsa Bint Hamdan Al Nahyan"
                        : "الشيخة شمسة بنت حمدان آل نهيان"}
                            </div>
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
                       
                          <img className="w-100"
                            alt="Image Alt Text"
                      src={responseData[0].SectionModels[1].LabelModels[2].MediaPath}
                          />
                           
                        </picture>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5 col-lg-3 align-self-center">
              <div data-aos="fade-up" data-aos-delay={300}>
                <div className="ourTxt mrg-b-20 line_H_1_5 f-s-18"
                    dangerouslySetInnerHTML={{
                      __html:
                      language === "en" 
                      ?responseData[0].SectionModels[1].LabelModels[3].EnglishDescription
                      :responseData[0].SectionModels[1].LabelModels[3].ArabicDescription  
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
                <div className="sec_subTitle font-Lyon f-s-20">   {language === "en"
                        ? "Thank you "
                        : "شكراً"}</div>
                <div className="secTitle f-s-30">
                {language === "en"
                        ? "  Our Partners &"
                        : "شركاؤنا و "}
                       
                         {language === "en"
                        ? " Supporters"
                        : "الداعمين"}
                </div>
              </div>
            </div>
          </div>
          <Partner />
        </div>
      </div>
      </div> )} </div>
    )}
    </>
  );
};

export default AboutUs;
