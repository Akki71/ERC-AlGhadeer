import React,{useEffect, useState} from 'react'
import dashboard_bg from "../assets/images/dashboard-bg.jpg";
import AL_Ghadeer_logo from "../assets/images/AL-Ghadeer-logo.png";

import { BASE_PATH} from "../serviceurls";
import { useLanguage } from '../redux/LanguageContext';
import { PencilFill, Gear,List,ArrowRepeat,CloudDownload ,Headphones,Layers } from 'react-bootstrap-icons';
import Loader from '../components/Loader';
const WhatweOffer = () => {
const { language} = useLanguage();  useEffect(() => {
    // Include the script
    const script = document.createElement('script');
    script.src = '/assets/js/site-scripts.js';
    script.async = true;
    document.body.appendChild(script);

    // Clean up
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  // const [loading , setLoading] = useState(true)
    // useEffect(() => {
    //   setTimeout(() => {
    //     setLoading(false);
    //   }, 500);
    // }, []);

  return (
        <>
    {/* {loading ? ( */}
   
    
      {/* <div id="hola">
        <div id="preloader">
          <Loader/>
        </div>
      </div> */}
    {/* ) : ( */}
    <>
      <div className="topBanner_sec">
        <div className="topBanner_inn">
        <img src={`${BASE_PATH}Images/Product/images/dashboard-bg.jpg`} className="w-100" alt="" />

        </div>
      </div>
      <section className="we-offer-area text-center secBg">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="secTitle_wrap text-center mrg-b-30" >
                {/* <div className="sec_subTitle f-s-20"> Lorem Ipsum is simply dummy text </div> */}
                <div className="secTitle f-s-30 font-Lyon ">
                {language === "en"
                        ? "What we offer"
                        : "ماذا نقدم"}
                 </div>
              </div>
            </div>
          </div>
          <div className="row our-offer-items less-carousel">
            {/* Single Item */}
            <div className="col-md-4 col-sm-6 equal-height">
              <div className="item">
                <i aria-hidden="true" >

                  <PencilFill />
                </i>
                <h4>

                {language === "en"
                        ? "Project creation"
                        : "إنشاء المشروع"}
                </h4>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>
            </div>
            {/* End Single Item */}
            {/* Single Item */}
            <div className="col-md-4 col-sm-6 equal-height">
              <div className="item">
                <i aria-hidden="true" >
                  <Gear />
                </i>
                <h4>

                {language === "en"
                        ? "Software Development"
                        : "تطوير البرمجيات"}
                </h4>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>
            </div>
            {/* End Single Item */}
            {/* Single Item */}
            <div className="col-md-4 col-sm-6 equal-height">
              <div className="item">
                <i  aria-hidden="true" >
                <Layers />
                </i>
                <h4>
                {language === "en"
                        ? "Project Management "
                        : "إدارة المشاريع"}
                </h4>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>
            </div>
            {/* End Single Item */}
            {/* Single Item */}
            <div className="col-md-4 col-sm-6 equal-height">
              <div className="item">
                <i aria-hidden="true" >
                <ArrowRepeat />

                </i>
                <h4>
                {language === "en"
                        ? "Project Impliment "
                        : "تنفيذ المشروع"}
                </h4>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>
            </div>
            {/* End Single Item */}
            {/* Single Item */}
            <div className="col-md-4 col-sm-6 equal-height">
              <div className="item">
                <i  aria-hidden="true" >
                <CloudDownload  />
                  </i>
                <h4>
                {language === "en"
                        ? "Software Update"
                        : "تحديث النظام"}
                        
                </h4>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>
            </div>
            {/* End Single Item */}
            {/* Single Item */}
            <div className="col-md-4 col-sm-6 equal-height">
              <div className="item">
                <i  aria-hidden="true" >
                <Headphones />
                  </i>
                <h4>
                {language === "en"
                        ? "24/7 Support"
                        : "دعم 24/7"}
                </h4>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>
            </div>
            {/* End Single Item */}
          </div>
        </div>
      </section>
</>
    {/* )} */}
    </>
  )

}

export default WhatweOffer