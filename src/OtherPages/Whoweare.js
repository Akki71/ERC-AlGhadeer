import React,{useEffect, useState} from 'react'
import dashboard_bg from "../assets/images/dashboard-bg.jpg";
import AL_Ghadeer_logo from "../assets/images/AL-Ghadeer-logo.png";

import BASE_PATH from '../serviceurls';
import { useLanguage } from '../redux/LanguageContext';
import { PencilFill, Gear,List,ArrowRepeat,CloudDownload ,Headphones,Layers } from 'react-bootstrap-icons';
import Loader from '../components/Loader';
const Whoweare = () => {
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
                        ? "Who we are "
                        : " من نحن  "}
                 </div>
              </div>
            </div>
          </div>
          <div className="row our-offer-items less-carousel">
           
            
        
     
            {/* End Single Item */}
            {/* Single Item */}
            <div className="col-md-12 col-sm-6 equal-height ">
              <div className="item">
           
                <h4>
                {language === "en"
                        ? "AlGhadeer UAE Crafts, a prominent non-profit organization dedicated to empowering women artisans through traditional crafts and skills development."
                        : "الغدير للحرف الإماراتية، منظمة بارزة غير ربحية مكرسة لتمكين النساء من خلال الحرف التقليدية وتنمية المهارات."}
                </h4>
                {/* <p>
                {language === "en"
                        ? "AlGhadeer UAE Crafts, a prominent non-profit organization dedicated to empowering women artisans through traditional crafts and skills development."
                        : "AlGhadeer UAE Crafts, a prominent non-profit organization dedicated to empowering women artisans through traditional crafts and skills development."}

                
                </p> */}
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

export default Whoweare