import React, { useEffect, useState } from 'react'
import dashboard_bg from "../assets/images/dashboard-bg.jpg";
import Partner from "../components/Partner";
import AL_Ghadeer_logo from "../assets/images/AL-Ghadeer-logo.png";
import { BASE_PATH} from "../serviceurls";
import { useLanguage } from '../redux/LanguageContext';
const OurHistory = () => {

const { language} = useLanguage(); 
 const [imgUrl, setImgUrl] = useState('');

  const handleImageError = (event) => {
    console.error("Error loading image:", event.target.src);
  };

  useEffect(() => {
    // Fetch the image URL from the server
    fetch('https://picsum.photos/200/300')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        return response.url;
      })
      .then(url => setImgUrl(url))
      .catch(error => console.error('Error fetching image:', error));
  }, []);

  // const [loading , setLoading] = useState(true)
  //   useEffect(() => {
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 1000);
  //   }, []);



  return (
    <>
    {/* {loading ? ( */}
   
    
      {/* <div id="hola">
        <div id="preloader">
          <div className="loader-logo mx-auto mrg-b-30">
            <picture className="w-100 d-block">
              <source srcSet={AL_Ghadeer_logo} media="(min-width: 768px)" className="w-100 deskImg" loading="lazy" />
              <img decoding="async" src={AL_Ghadeer_logo} alt="" className="w-100 mobImg" loading="lazy" />
            </picture>
          </div>
          <div className="loadingTxt text-center">
            <div className="txtSummary f-s-20">
              {language === "en" ? "Loading..." : "تحميل…"}
            </div>
          </div>
        </div>
      </div>
    ) : ( */}
    <div>
      <div className="topBanner_sec">
        <div className="topBanner_inn">
        <img src={`${BASE_PATH}Images/Product/images/dashboard-bg.jpg`} className="w-100" alt="" />

        </div>
        {/* <div className="topBanner_inn">
          <img src={imgUrl} className="w-100" alt="" onError={handleImageError} />
        </div> */}
      </div>
      <div className="home_section_three secBg">
        <div className="full-container container">
          <div className="row">
            <div className="col-md-12">
              <div className="secTitle_wrap text-center mrg-b-30" data-aos="fade-up" data-aos-delay={200}>
                <div className="sec_subTitle f-s-20"> Lorem Ipsum is simply dummy text </div>
                <div className="secTitle f-s-30 font-Lyon ">
             

                {language === "en"
                        ? "Our History "
                        : "   تاريخنا"}
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="timeline-container" data-aos="fade-up" data-aos-delay={300}>
                <div className="timeline-block timeline-block-right">
                  <div className="marker">
                  </div>
                  <div className="timeline-content">
                    <h3>   {language === "en"
                        ? "January 2023 "
                        : "2023 يناير"}</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                  </div>
                </div>
                <div className="timeline-block timeline-block-left">
                  <div className="marker">
                  </div>
                  <div className="timeline-content">
                    <h3>  {language === "en"
                        ? "February 2023  "
                        : "2023 فبراير "}</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                  </div>
                </div>
                <div className="timeline-block timeline-block-right">
                  <div className="marker">
                  </div>
                  <div className="timeline-content">
                    <h3>   {language === "en"
                        ? "March 2023 "
                        : "2023 مارس"}</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                  </div>
                </div>
                <div className="timeline-block timeline-block-left">
                  <div className="marker">
                  </div>
                  <div className="timeline-content">
                    <h3>  {language === "en"
                        ? "April 2023  "
                        : "2023 أبريل"}</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                  </div>
                </div>
                <div className="timeline-block timeline-block-right">
                  <div className="marker">
                  </div>
                  <div className="timeline-content">
                    <h3> {language === "en"
                        ? "May 2023   "
                        : "2023 مايو"}</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                  </div>
                </div>
                <div className="timeline-block timeline-block-left">
                  <div className="marker">
                  </div>
                  <div className="timeline-content">
                    <h3>   {language === "en"
                        ? "June 2023 "
                        : "2023 يونيو"}</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                  </div>
                </div>
                <div className="timeline-block timeline-block-right">
                  <div className="marker">
                  </div>
                  <div className="timeline-content">
                    <h3>  {language === "en"
                        ? "July 2023  "
                        : "2023 يوليو"}</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                  </div>
                </div>
                <div className="timeline-block timeline-block-left">
                  <div className="marker">
                  </div>
                  <div className="timeline-content">
                    <h3>  {language === "en"
                        ? "August 2023  "
                        : "2023 أغسطس"}</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                  </div>
                </div>
                <div className="timeline-block timeline-block-right">
                  <div className="marker">
                  </div>
                  <div className="timeline-content">
                    <h3>   {language === "en"
                        ? "September 2023 "
                        : "2023 سبتمبر"}</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                  </div>
                </div>
                <div className="timeline-block timeline-block-left">
                  <div className="marker">
                  </div>
                  <div className="timeline-content">
                    <h3>   {language === "en"
                        ? "October 2023 "
                        : "2023 أكتوبر"}</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                  </div>
                </div>
                <div className="timeline-block timeline-block-right">
                  <div className="marker">
                  </div>
                  <div className="timeline-content">
                    <h3>   {language === "en"
                        ? "November 2023 "
                        : "2023 نوفمبر"}</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                  </div>
                </div>
                <div className="timeline-block timeline-block-left">
                  <div className="marker">
                  </div>
                  <div className="timeline-content">
                    <h3>   {language === "en"
                        ? "December 2023 "
                        : "2023 ديسمبر"}</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
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
    {/* )} */}
    </>
  )

}

export default OurHistory