import React, { useEffect, useState } from 'react'
import Partner from '../components/Partner'
import product_gallery_2 from "../assets/images/product-gallery-2.png";
import handleClick from '../components/links';
import AL_Ghadeer_logo from "../assets/images/AL-Ghadeer-logo.png";
import BASE_PATH from '../serviceurls';
import crafts5 from "../assets/images/5crafts.jpg";
import crafts6 from "../assets/images/6crafts.jpg";
import crafts7 from "../assets/images/7crafts.jpg";

import dashboard from "../assets/images/dashboard-bg.jpg";
import Loader from '../components/Loader';
import { useLanguage } from '../redux/LanguageContext';

const OurCrafts = () => {
    const [loading, setLoading] = useState(true)

    useEffect(() => { handleClick() }, [handleClick])
    const [responseData, setResponseData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${BASE_PATH}Page/GetPageByName?pageName=our-crafts`, {
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
    const { language } = useLanguage();

    const getLabelValue = (labelName) => {
        if (!responseData || !responseData[0]?.SectionModels[0]?.LabelModels) {
            return null;
        }
        const section = responseData[0].SectionModels[0].LabelModels.find(
            (label) => label.LabelName === labelName
        );
        return section;
    };

    const renderOurCrafts = () => {
        const OurcraftLable = getLabelValue('Carousel');
        if (!OurcraftLable) {
            return null;
        }

        const OurCrafts = JSON.parse(
            language === 'en' ? OurcraftLable.EnglishDescription : OurcraftLable.ArabicDescription
        );
        // console.log(OurCrafts);
        return OurCrafts.map((OurCraft, index) => (
            <li className="list-block-item" key={OurCraft?.Id || index}>

                <div className="row justify-content-center align-items-center">
                    <div className="col-lg-5" >
                        <div className="craftImg mrg-b-10">   <img src={OurCraft.ImagePath} className="w-100" /> </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="ourCraft_bx">
                            <div className="craftTitle f-s-30 font-Lyon mrg-b-10">
                                {language === 'en' ? OurCraft.Title : OurCraft.Title}
                            </div>
                            {/* <div className="craftTitle f-s-20 font-Lyon mrg-b-10">
                                {language === 'en' ? OurCraft.SubTitle : OurCraft.SubTitle}
                            </div> */}

                            <div className="craftSummary text-justify"
    dangerouslySetInnerHTML={{
        __html: language === 'en' 
            ? OurCraft.ShortDescription 
            : OurCraft.ShortDescription 
    }} 
></div>
<div className="craftSummary text-justify"
    dangerouslySetInnerHTML={{
        __html: language === 'en' 
            ? OurCraft.LongDescription 
            : OurCraft.LongDescription 
    }} 
></div>

                        </div>
                    </div>
                </div>

            </li>
        ));
    };
    //   useEffect(() => {
    //     setTimeout(() => {
    //       setLoading(false);
    //     }, 1000);
    //   }, []);

    return (
        <>
            {loading ? (


                <div id="hola">
                    <div id="preloader">
                        <Loader />
                        {/* <div className="loader-logo mx-auto mrg-b-30">
                <picture className="w-100 d-block">
                  <source srcSet={AL_Ghadeer_logo} media="(min-width: 768px)" className="w-100 deskImg" loading="lazy" />
                  <img decoding="async" src={AL_Ghadeer_logo} alt="" className="w-100 mobImg" loading="lazy" />
                </picture>
              </div>
              <div className="loadingTxt text-center">
                <div className="txtSummary f-s-20">
                  {language === "en" ? "Loading..." : "تحميل…"}
                </div>
              </div> */}
                    </div>
                </div>
            ) : (
                <div>
                    <div className="topBanner_sec">
                        <div className="topBanner_inn">
                            <img src={`${BASE_PATH}Images/Product/dashboard-bg.jpg`} className="w-100" alt="" />


                        </div>
                    </div>
                    <div>

                    </div>
                    {/* <div className="home_section_three secBg">
                <div className="full-container container">
                    <div className="craftList_wrap">
                        <ul className="list-unstyled mb-0">
                            <li className="list-block-item">
                                <div className="row justify-content-center">{renderOurCrafts()}

                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div> */}



                    {responseData?.[0]?.SectionModels && (
                        <div>
                            {/* <div className="topBanner_sec"> */}
                            {/* <div className="topBanner_inn">
                            <img
                                src={responseData[0].SectionModels[0].LabelModels[0].MediaPath}
                                alt=""
                                className="w-100" />
                        </div> */}
                            {/* </div> */}
                            <div className="home_section_three secBg">
                                <div className="full-container container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="secTitle_wrap text-center mrg-b-30" data-aos="fade-up" data-aos-delay={300}>

                                                <div className="secTitle f-s-30 font-Lyon "> {language === "en"
                                                    ? " Our Crafts "
                                                    : "حرفنا"} </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="full-container container">
                                        <div className="craftList_wrap">
                                            <ul className="list-unstyled mb-0">{renderOurCrafts()}
                                              
                                               
                                            </ul>
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
                    )}
                </div>
            )}

        </>
    )
}

export default OurCrafts





// <li className="list-block-item">

// <div className="row justify-content-center align-items-center">
//     <div className="col-lg-5" >
//         <div className="craftImg mrg-b-10">
           
//             <img src={crafts5} alt="Craft" className="w-100" />

//         </div>
//     </div>
//     <div className="col-lg-5">
//         <div className="ourCraft_bx">
//             <div className="craftTitle f-s-30 font-Lyon mrg-b-10">
//                 {language === 'en' ?
//                     " Sewing craft"
//                     : "حرفة الخياطة الإماراتية"}
//             </div>
//             <div className="craftTitle f-s-20 font-Lyon mrg-b-10">
//                 {language === 'en' ? "The Emirati Sewing craft" : "حرفة الخياطة الإماراتية"}
//             </div>


//             <div className="craftSummary">
//                 {language === 'en'
//                     ? "Deeply embedded in the cultural and historical fabric of the United Arab Emirates, is a traditional practice that highlights the nation's rich heritage and artisanal skills. This craft involves creating traditional clothing items such as the 'kandura' for men and the 'abaya' for women, both of which are essential elements of Emirati identity and daily life. Previously, Emiratis used the Karakhana tailoring machine with a hand wheel to sew their garments. This practice ensures that these iconic garments continue to symbolize cultural identity and heritage."
//                     : " تعتبر هذه الممارسة المتجذرة بعمق في النسيج الثقافي والتاريخي لدولة الإمارات العربية المتحدة، ممارسة تقليدية تسلط الضوء على التراث الغني للدولة والمهارات الحرفية. وتقوم هذه الحرفة على صناعة الملابس التقليدية مثل  للرجال و العباية للنساء، وكلاهما عنصر أساسي في الهوية الإماراتية والحياة اليومية. في السابق، كان الإماراتييون يستخدمون ماكينة الخياطة ذات العجلة اليدوية لخياطة ملابسهم. حيث تضمن هذه الممارسة أن تستمر هذه الملابس المميزة في تمثيل الهوية الثقافية والتراث. "}
                    
//                     </div>
//         </div>
//     </div>
// </div>
// </li>
// <li className="list-block-item">
// <div className="row justify-content-center align-items-center">
//     <div className="col-lg-5" >
//         <div className="craftImg mrg-b-10">
           
//             <img src={crafts6} alt="Craft" className="w-100" />

//         </div>
//     </div>
//     <div className="col-lg-5">
//         <div className="ourCraft_bx">
//             <div className="craftTitle f-s-30 font-Lyon mrg-b-10">
//                 {language === 'en' ?
//                     " Burqa Making"
//                     : "صنع البرقع  "}
//             </div>
//             <div className="craftTitle f-s-20 font-Lyon mrg-b-10">
//                 {language === 'en' ? " Burqa Making" : "صنع البرقع"}
//             </div>


//             <div className="craftSummary">
//                 {language === 'en'
//                     ? "Is a traditional face covering the forehead, nose, and upper lips, leaving the eyes, cheeks, and mouth exposed. worn by some women in the United Arab Emirates and other parts of the Arabian Gulf. Women begin making the burqa by weaving a square piece of fabric from the sheila that is large enough to cover the entire face."
//                     : "هو غطاء وجه تقليدي يغطي الجبهة والأنف والشفاه العليا ويترك العينين والخدين والفم مكشوفين. ترتديه بعض النساء في دولة الإمارات العربية المتحدة وأجزاء أخرى من دول الخليج العربي. تبدأ النساء في صنع البرقع من خلال نسج قطعة قماش مربعة من الشيلة تكون كبيرة بما يكفي لتغطية الوجه بالكامل.  "}</div>
//         </div>
//     </div>
// </div>
// </li>
// <li className="list-block-item">
// <div className="row justify-content-center align-items-center">
//     <div className="col-lg-5" >
//         <div className="craftImg mrg-b-10">
          
//             <img src={crafts7} alt="Craft" className="w-100" />

//         </div>
//     </div>
//     <div className="col-lg-5">
//         <div className="ourCraft_bx">
//             <div className="craftTitle f-s-30 font-Lyon mrg-b-10">
//                 {language === 'en' ?
//                     " Others "
//                     : " المزيد  "}
//             </div>
//             <div className="craftTitle f-s-20 font-Lyon mrg-b-10">
//                 {language === 'en' ? "Others" : "المزيد"}
//             </div>


//             <div className="craftSummary">
//                 {language === 'en'
//                     ? "The art of embroidery, the art of weaving threds together, and the art of braiding. "

//                     : "  فن التطريز، وفن نسج الخيوط مع بعضها، وفن التضفير."}</div>
//         </div>
//     </div>
// </div>
// </li>