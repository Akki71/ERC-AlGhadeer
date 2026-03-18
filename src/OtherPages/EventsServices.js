import React, { useEffect, useState } from "react";
import dashboard_bg from "../assets/images/dashboard-bg.jpg";
import AL_Ghadeer_logo from "../assets/images/AL-Ghadeer-logo.png";
import { Link, useNavigate } from "react-router-dom";
import {BASE_PATH,AUTH_PAYLOAD} from "../serviceurls";
import DOMPurify from "dompurify";
import { useLanguage } from "../redux/LanguageContext";
import {
  PencilFill,
  Gear,
  List,
  ArrowRepeat,
  CloudDownload,
  Headphones,
  Layers,
} from "react-bootstrap-icons";

import Partner from "../components/Partner";
import handleClick from "../components/links";


import Loader from "../components/Loader";

const EventsServices = () => {

  const [responseData, setResponseData] = useState(null);
  const [sectionTwo, setSectionTwo] = useState(null)
  const { language } = useLanguage();
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    // Include the script
    const script = document.createElement("script");
   script.src = "/assets/js/site-scripts.js";
    script.async = true;
    document.body.appendChild(script);

    // Clean up
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    fetchData()
    fetchDataPrice()
  }, [])

  // const [loading , setLoading] = useState(true)
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 500);
  // }, []);
  const [loading, setLoading] = useState(true);
  const [getToken, setGetToken] = useState(localStorage.getItem("token"));
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      // console.log("Token retrieved from localStorage:", token);

      const response = await fetch(
        `${BASE_PATH}Page/GetPageByName?pageName=event`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        setSectionTwo(data[0].SectionModels[1].LabelModels[0])
        setResponseData(data);
        setLoading(false);
      } else {
        console.error("Failed to fetch data. Response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);

      // Retry or handle token refresh logic
      await fetchToken();
      fetchData();
    }
  };

  const fetchDataPrice = async () => {
    try {
      const token = localStorage.getItem("token");
      // console.log("Token retrieved from localStorage:", token);

      const response = await fetch(
        `${BASE_PATH}Page/GetPrices`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );

      if (response.ok) {
        const data = await response.json(); // Parse JSON data
        // console.log("Fetched data:", data);
        setPriceData(data);

      } else {
        console.error("Failed to fetch data. Response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);



    }
  };



  const fetchToken = async () => {
    try {
    

      const response = await fetch(`${BASE_PATH}Security/GetToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(AUTH_PAYLOAD),
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

  return (
    <>
      {loading ? <div id="hola">
        <div id="preloader">
          <Loader />
        </div>
      </div> :
        <>
          <div className="topBanner_sec">
            <div className="topBanner_inn">
              <div className="topBanner_inn">
                <img
                  src={
                    responseData?.[0]?.SectionModels?.[0]?.LabelModels?.[0]?.MediaPath ||
                    `${BASE_PATH}Images/Product/images/dashboard-bg.jpg`
                  }
                  className="w-100"
                  alt="Banner"
                />
              </div>

            </div>
          </div>
          <section className="we-offer-area text-center secBg">
            <div className="container">
              <div className="row ">
                <div className="col-md-12">
                  <div className="secTitle_wrap text-center mrg-b-30">
                    {/* <div className="sec_subTitle f-s-20"> Lorem Ipsum is simply dummy text </div> */}

                    <div className="secTitle f-s-30 font-Lyon">

                      {language === "en"
                        ? "Events Services "
                        : " خدمات الفعاليات  "}

                    </div>
                  </div>
                  <div className="secTitle_wrap text-center mrg-b-30">
                    {/* <div className="sec_subTitle f-s-20"> Lorem Ipsum is simply dummy text </div> */}



                    <div className="secTitle f-s-30 font-Lyon d-flex gap-2 justify-content-center">

                      {language === "en" ? (
                        <>

                          <Link
                            to="/workshops"
                            style={{
                              textDecoration: "underline", // Underline only "Workshops"
                              color: "inherit", // Match text color
                              display: 'inline-flex'
                            }}
                          >
                            Workshops
                          </Link>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize( responseData[0].SectionModels[0].LabelModels[1].EnglishDescription
                           ),  }}
                          />
                        </>
                      ) : (
                        <>
                          <Link
                            to="/workshops"
                            style={{
                              textDecoration: "underline", // Underline only "ورش عمل"
                              color: "inherit", // Match text color
                            }}
                          >
                            ورش عمل {" "}
                          </Link>
                          <span
                            dangerouslySetInnerHTML={{
                              __html:  DOMPurify.sanitize(responseData[0].SectionModels[0].LabelModels[1].ArabicDescription
                            ), }}
                          />

                        </>
                      )}
                    </div>

                  </div>
                </div>
              </div>
              {/* <div className="row our-offer-items less-carousel">
           
            <div className="col-md-12 col-sm-6 equal-height ">
              <div className="item">
           
                <h4>
                {language === "en"
                        ? "We tailor your events to meet your needs, offering everything from flower arrangements and tableware accessories to authentic Emirati food and beverage services. All our setups feature contemporary Emirati design. "
                        : "نحن نصمم فعاليتك حسب احتياجاتكم، ونقدم كل شيء من تنسيقات الزهور مع اكسسوارات المنزل الخاصة فينا وأدوات المائدة بالإضافة الى المأكولات والمشروبات الإماراتية الأصيلة. تتميز جميع تنسيقاتنا بتصميم إماراتي معاصر. "}
                </h4>
             
              </div>
            </div>
     
          </div> */}
              {/* <div className="row">
      {responseData?.[0]?.SectionModels?.map((section, sectionIndex) =>
              section.LabelModels?.map((label, labelIndex) => {
                const descriptionData = JSON.parse(
                  language === "en"
                    ? label.EnglishDescription
                    : label.ArabicDescription
                );
 
                return descriptionData.map((item, itemIndex) => (
                  <div
                    className="col-md-6 col-lg-4"
                    key={`${label.LabelId}-${itemIndex}`}
                  >
                    <div className="workshopCard">
                      <div className="workshopThumb">
                        <img src={item.ImagePath} alt={item.Title} />
                      </div>
                      <div className="workshopText">
                        <div className="f-s-30 font-Lyon mrg-b-5 text-start line_H_1_2">
                          {item.Title}
                        </div>
                      </div>
                    </div>
                  </div>
                ));
              })
            )}
              </div> */}

              {language === "en" ?
                <div className="row rowGap-30 cstRow">
                  {JSON.parse(sectionTwo.EnglishDescription).map((section, sectionIndex) =>
                    <div className="col-md-6 col-lg-4" key={sectionIndex}>
                      <div className="workshopCard">
                        <div className="workshopThumb">
                          <img
                            // src={require("../assets/images/al-ghadeer-2/tali.jpg")}
                            src={section.ImagePath}

                            alt="Demo"
                          />
                        </div>
                        <div className="workshopText">
                          <div className=" f-s-30 font-Lyon mrg-b-5 text-start line_H_1_2">
                            {/*  */}
                            {section.Title}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* <div className="col-md-6 col-lg-4">
                <div className="workshopCard">
                  <div className="workshopThumb">
                    <img
                      src={require("../assets/images/al-ghadeer-2/spinning.jpg")}
                      alt="Demo"
                    />
                  </div>
                  <div className="workshopText">
                    <div className=" f-s-30 font-Lyon mrg-b-5 text-start line_H_1_2">
                      {language === "en" ? "Sadu  " : "  السدو "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="workshopCard">
                  <div className="workshopThumb">
                    <img
                      src={require("../assets/images/al-ghadeer-2/tarboush-making.jpg")}
                      alt="Demo"
                    />
                  </div>
                  <div className="workshopText">
                    <div className=" f-s-30 font-Lyon mrg-b-5 text-start line_H_1_2">
                      {language === "en"
                        ? " Tarboush Making "
                        : "  صناعة الطرابيش "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="workshopCard">
                  <div className="workshopThumb">
                    <img
                      src={require("../assets/images/al-ghadeer-2/sadu.jpg")}
                      alt="Demo"
                    />
                  </div>
                  <div className="workshopText">
                    <div className=" f-s-30 font-Lyon mrg-b-5 text-start line_H_1_2">
                      {language === "en" ? " Sadu " : "  السدو "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="workshopCard">
                  <div className="workshopThumb">
                    <img
                      src={require("../assets/images/al-ghadeer-2/burqa-making.jpg")}
                      alt="Demo"
                    />
                  </div>
                  <div className="workshopText">
                    <div className=" f-s-30 font-Lyon mrg-b-5 text-start line_H_1_2">
                      {language === "en"
                        ? "   Burqa Making"
                        : " صناعة البرقع  "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="workshopCard">
                  <div className="workshopThumb">
                    <img
                      src={require("../assets/images/al-ghadeer-2/henna.jpg")}
                      alt="Demo"
                    />
                  </div>
                  <div className="workshopText">
                    <div className=" f-s-30 font-Lyon mrg-b-5 text-start line_H_1_2">
                      {language === "en" ? " Henna " : " الحنة  "}
                    </div>
                  </div>
                </div>
              </div> */}
                </div>

                :
                <div className="row rowGap-30 cstRow">
                  {JSON.parse(sectionTwo.ArabicDescription).map((section, sectionIndex) =>
                    <div className="col-md-6 col-lg-4">
                      <div className="workshopCard">
                        <div className="workshopThumb">
                          <img
                            // src={require("../assets/images/al-ghadeer-2/tali.jpg")}
                            src={section.ImagePath}

                            alt="Demo"
                          />
                        </div>
                        <div className="workshopText">
                          <div className=" f-s-30 font-Lyon mrg-b-5 text-start line_H_1_2">
                            {/*  */}
                            {section.Title}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                </div>
              }

              <div className="py-5">
                <div className="secTitle f-s-30 font-Lyon mb-2">
                  {language === "en" ? "Price" : "  الأسعار "}{" "}
                </div>
                <div className="row">
                  <div className="col-md-6 mx-auto">
                    <table className="table priceList-table">
                      <tbody>
                        {priceData && priceData.length > 0 ? (
                          priceData.map((priceItem) => (
                            <tr key={priceItem.PriceId}>
                              <td className="text-start f-s-20 font-Lyon mrg-b-5 text-start line_H_1_2">
                                {language === "en"
                                  ? priceItem.DescriptionE
                                  : priceItem.DescriptionA}
                              </td>
                              <td className="f-s-20 font-Lyon mrg-b-5 text-start line_H_1_2">
                                AED {priceItem.Price.toLocaleString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="text-center">
                              {language === "en"
                                ? "No prices available"
                                : "لا توجد أسعار متاحة"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      }
      {/* )} */}
    </>
  );
};

export default EventsServices;
