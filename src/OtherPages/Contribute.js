import React,{useEffect} from 'react'
import { Link } from "react-router-dom";
import handleClick from '../components/links';

import Partner from '../components/Partner'
import dashboard_bg from "../assets/images/dashboard-bg.jpg";
import contribute_icon_1 from "../assets/images/contribute-icon-1.png";
import contribute_icon_2 from "../assets/images/contribute-icon-2.png";
import contribute_icon_3 from "../assets/images/contribute-icon-3.png";
import contribute_icon_4 from "../assets/images/contribute-icon-4.png";
import contribute_icon_5 from "../assets/images/contribute-icon-5.png";
import contribute_icon_6 from "../assets/images/contribute-icon-6.png";
import { BASE_PATH} from "../serviceurls";
import { useLanguage } from '../redux/LanguageContext';
const Contribute = () => {
    useEffect(() => { handleClick() }, [handleClick])
    const { language } = useLanguage();
    const email = 'marhaba@alghadeeruaecrafts.ae';
    useEffect(() => {    window.scrollTo(0, 0);  }, []);
    return (

        <div>
            <div className="topBanner_sec">
                <div className="topBanner_inn">
                   <img src={`${BASE_PATH}Images/Product/dashboard-bg.jpg`} className="w-100" alt="" />

                </div>

            </div>
            <div className="home_section_three secBg">
                <div className="full-container container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="secTitle_wrap text-center mrg-b-30" data-aos="fade-up" data-aos-delay={300}>

                                <div className="secTitle f-s-30 font-Lyon ">     {language === "en"
                                    ? " Contribute"
                                    : " ساهم"}</div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-9">
                            <div className="contribute-sec">
                                <div className="row justify-content-center">
                                    <div className="col-md-6 col-lg-6 col-xl-4">
                                        <div className="contributeBx text-center mrg-b-30" data-eq="contributeBx-hq">
                                            <Link to={`mailto:${email}`} className="d-block">


                                                <div className="contribute-icon mrg-b-10 mx-auto">
                                                    <img src={contribute_icon_1} className="w-100" alt />
                                                </div>
                                                <div className="contribute-txt f-s-30 font-Lyon mrg-b-10 light-pink-clr">
                                                    {language === "en"
                                                        ? "Photography "
                                                        : "التصوير "}

                                                </div>
                                                <div className="contribute-summary">
                                                    {language === "en"
                                                        ? "  Artisans  - Events - Products"
                                                        : "  الحرفيات - الفعاليات - المنتجات  "} </div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-6 col-xl-4">
                                        <div className="contributeBx text-center mrg-b-30" data-eq="contributeBx-hq">
                                            <Link to={`mailto:${email}`} className="d-block">


                                                <div className="contribute-icon mrg-b-10 mx-auto">
                                                    <img src={contribute_icon_2} className="w-100" alt />
                                                </div>
                                                <div className="contribute-txt f-s-30 font-Lyon mrg-b-10 light-pink-clr">
                                                    {language === "en"
                                                        ? "Videography "
                                                        : "التصوير بالفيديو "}
                                                </div>
                                                <div className="contribute-summary">
                                                    {language === "en"
                                                        ? " Documentary of our artisans- Events - Process of products "
                                                        : "وثائقي عن الحرفيات - الفعاليات - عملية صنع المنتجات"}
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-6 col-xl-4">
                                        <div className="contributeBx text-center mrg-b-30" data-eq="contributeBx-hq">
                                            <Link to={`mailto:${email}`} className="d-block">


                                                <div className="contribute-icon mrg-b-10 mx-auto">
                                                    <img src={contribute_icon_3} className="w-100" alt />
                                                </div>
                                                <div className="contribute-txt f-s-30 font-Lyon mrg-b-10 light-pink-clr">
                                                    {language === "en"
                                                        ? " Social Media  "
                                                        : "وسائل التواصل الاجتماعي "}
                                                </div>
                                                <div className="contribute-summary">

                                                    {language === "en"
                                                        ? " Create campaigns to sell products "
                                                        : "إنشاء حملات لبيع المنتجات"} </div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-6 col-xl-4">
                                        <div className="contributeBx text-center mrg-b-30" data-eq="contributeBx-hq">
                                            <Link to={`mailto:${email}`} className="d-block">


                                                <div className="contribute-icon mrg-b-10 mx-auto">
                                                    <img src={contribute_icon_4} className="w-100" alt />
                                                </div>
                                                <div className="contribute-txt f-s-30 font-Lyon mrg-b-10 light-pink-clr">
                                                    {language === "en"
                                                        ? "Product Design"
                                                        : "تصميم المنتج "}
                                                </div>
                                                <div className="contribute-summary">
                                                    {language === "en"
                                                        ? " Create contemporary products using handmade ِEmirati "
                                                        : "    ننتج منتجات يدوية إماراتية معاصرة    "}
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-6 col-xl-4">
                                        <div className="contributeBx text-center mrg-b-30" data-eq="contributeBx-hq">
                                            <Link to={`mailto:${email}`} className="d-block">


                                                <div className="contribute-icon mrg-b-10 mx-auto">
                                                    <img src={contribute_icon_5} className="w-100" alt />
                                                </div>
                                                <div className="contribute-txt f-s-30 font-Lyon mrg-b-10 light-pink-clr">
                                                    {language === "en"
                                                        ? "Storytelling "
                                                        : " القص"}
                                                </div>
                                                <div className="contribute-summary">
                                                    {language === "en"
                                                        ? "Description of products - crafts - craftswomen "
                                                        : " وصف المنتجات - الحرف اليدوية - الحرفيات"}
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-6 col-xl-4">
                                        <div className="contributeBx text-center mrg-b-30" data-eq="contributeBx-hq">
                                            <Link to={`mailto:${email}`} className="d-block">


                                                <div className="contribute-icon mrg-b-10 mx-auto">
                                                    <img src={contribute_icon_6} className="w-100" alt />
                                                </div>
                                                <div className="contribute-txt f-s-30 font-Lyon mrg-b-10 light-pink-clr">
                                                    {language === "en"
                                                        ? " Sales"
                                                        : " مبيعات"}
                                                </div>
                                                <div className="contribute-summary">
                                                    {language === "en"
                                                        ? " Fund raising - sell products  "
                                                        : " جمع التبرعات - بيع المنتجات "}
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="f-s-20 text-center">

                                {language === "en"
                                    ? "                            For sponsorship and financial support opportunities, kindly contact us at  "
                                    : " للحصول على فرص الرعاية والدعم المالي ، يرجى الاتصال بنا على"}
                                <a href="mailto:marhaba@alghadeeruaecrafts.ae" className="f-w-SB clrPrimary text-decoration-underline">marhaba@alghadeeruaecrafts.ae</a>.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="home_section_seven secBg">
                <div className="full-container container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="secTitle_wrap text-center mrg-b-30" data-aos="fade-up" data-aos-delay={300}>
                                <div className="sec_subTitle font-Lyon f-s-20">  {language === "en"
                                    ? "Thank you "
                                    : "شكراً"} </div>
                                <div className="secTitle f-s-30">  {language === "en"
                                    ? "  Our Partners &"
                                    : "شركاؤنا و "}

                                    {language === "en"
                                        ? " Supporters"
                                        : "  الداعمين"} </div>
                            </div>
                        </div>
                    </div>
                    <Partner />
                </div>
            </div>
        </div>


    )
}

export default Contribute
