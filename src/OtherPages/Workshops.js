import React, { useEffect, useState } from "react";
import Partner from "../components/Partner";
import handleClick from "../components/links";
import {BASE_PATH,AUTH_PAYLOAD} from "../serviceurls";
import dashboard from "../assets/images/dashboard-bg.jpg";
import Loader from "../components/Loader";
import { useLanguage } from "../redux/LanguageContext";
import TokenPage from "../utils/TokenPage";
import DOMPurify from "dompurify";
const Workshops = () => {
  const [loading, setLoading] = useState(true);
  const [getToken, setGetToken] = useState(localStorage.getItem("token"));
const fetchData = async () => {
  try {
    const token = localStorage.getItem("token");
    // console.log("Token retrieved from localStorage:", token);

    const response = await fetch(
      `${BASE_PATH}Page/GetPageByName?pageName=workshop`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      // console.log("Raw API response data:", data);

      if (Array.isArray(data)) {
        data.forEach((page) => {
          if (page.SectionModels && Array.isArray(page.SectionModels)) {
            page.SectionModels.forEach((section) => {
              // console.log("Section Name:", section.SectionName);

              if (Array.isArray(section.LabelModels)) {
                section.LabelModels.forEach((label) => {
                  // console.log("Label Name:", label.LabelName);
                });
              } else {
                console.warn(
                  "LabelModels is not an array or undefined:",
                  section.LabelModels
                );
              }
            });
          } else {
            console.warn("SectionModels is not an array or undefined:", page.SectionModels);
          }
        });
      } else {
        console.error("Unexpected data structure. Expected an array.");
      }

      setResponseData(data); // Assuming you want to store the entire array
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

  useEffect(() => {
    if (getToken) {
      fetchData();
    
    }
  }, [getToken]);
  useEffect(() => {
    handleClick();
  }, [handleClick]);
  const [responseData, setResponseData] = useState(null);
  const { language } = useLanguage();



  return (
    <>
      <TokenPage setGetToken={setGetToken} />
      {loading ? (
        <div id="hola">
          <div id="preloader">
            <Loader />

         
          </div>
        </div>
      ) : (
        <div>
          <div className="topBanner_sec">
          <div className="topBanner_inn">
  <img
    src={responseData?.[0]?.SectionModels?.[0]?.LabelModels?.[0]?.MediaPath || `${BASE_PATH}Images/Product/images/dashboard-bg.jpg`}
    className="w-100"
    alt="Banner Image"
  />
</div>

          </div>
          <div></div>


          <div>
            <div className="home_section_three secBg">
              <div className="full-container container">
                <div className="row">
                  <div className="col-md-12">
                    <div
                      className="secTitle_wrap text-center mrg-b-30"
                      data-aos="fade-up"
                      data-aos-delay={300}
                    >
                      <div className="secTitle f-s-30 font-Lyon ">
                        {" "}
                        {language === "en" ? " Workshops  " : "ورش عمل "}{" "}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" container">
                  <div className="row rowGap-30 cstRow">
                  <div className="row">
  {responseData && responseData.length > 0 ? (
    responseData.map((page, pageIndex) =>
      page.SectionModels && page.SectionModels.length > 0 ? (
        page.SectionModels.map((section, sectionIndex) =>
          section.LabelModels && section.LabelModels.length > 0 ? (
            section.LabelModels.map((label, labelIndex) => {
              const descriptionData = JSON.parse(
                language === "en"
                  ? label.EnglishDescription || "[]"
                  : label.ArabicDescription || "[]"
              );

              return descriptionData.map((item, itemIndex) => (
                <div key={itemIndex} className="col-md-6 col-lg-4">
                  <div className="workshopCard">
                    <div className="workshopThumb">
                      <img src={item.ImagePath} alt={item.Title} />
                    </div>
                    <div className="workshopText">
                      <div className="f-s-30 font-Lyon mrg-b-5 line_H_1_2">
                        {item.Title || "No Title"}
                      </div>
                      <div className="d-flex justify-content-between workshop-line">
                        <div className="f-s-20">
                          {item.SubTitle || "No Subtitle"}
                        </div>
                        <div className="f-s-20 font-Lyon">
                          {item.SubTitlePrice || "N/A"}
                        </div>
                      </div>
                      <div className="d-flex gap-3 justify-content-between">
                        <div
                          className="f-s-20"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize( item.Description  ),}}
                        ></div>
                        <div className="f-s-20 font-Lyon">
                          {item.DescriptionPrice || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ));
            })
          ) : (
            <div key={sectionIndex} className="col-12">
              <p>No Labels Found</p>
            </div>
          )
        )
      ) : (
        <div key={pageIndex} className="col-12">
          <p>No Sections Found</p>
        </div>
      )
    )
  ) : (
    <div className="col-12">
      <p>No Data Found</p>
    </div>
  )}
</div>
                    {/* <div className="col-md-6 col-lg-4">
                      <div className="workshopCard">
                        <div className="workshopThumb">
                          <img
                            src={require("../assets/images/al-ghadeer-1/talli-braclate-making.jpg")}
                            alt="Demo"
                          />
                        </div>
                        <div className="workshopText">
                          <div className=" f-s-30 font-Lyon mrg-b-5 line_H_1_2">
                            {language === "en"
                              ? "Talli Braclate Making"
                              : "صنع أسوارة التلي"}
                          </div>
                          <div className="d-flex justify-content-between workshop-line">
                            <div className="f-s-20 ">                                {language === 'en' ? 'Artisan Cost' : 'تكلفةالحرفية '}
                            </div>
                            <div className="f-s-20 font-Lyon">1,500</div>
                          </div>
                          <div className="d-flex gap-3 justify-content-between">
                            <div className="f-s-20 ">

                              {language === "en"
                                ? "Workshop Equipment per person  Includes (Talli, Threads)"
                                : "  أدروات الورشة للشخص الواحد   تشمل (التلي، خيوط)"}
                            </div>
                            <div className="f-s-20 font-Lyon">50</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="workshopCard">
                        <div className="workshopThumb">
                          <img
                            src={require("../assets/images/al-ghadeer-1/drawing-on-tote-bag.jpg")}
                            alt="Demo"
                          />
                        </div>
                        <div className="workshopText">
                          <div className=" f-s-30 font-Lyon mrg-b-5 line_H_1_2">
                            {language === "en"
                              ? "Drawing on Tote Bag"
                              : "الرسم على حقيبة قماشية"}
                          </div>
                          <div className="d-flex justify-content-between workshop-line">
                            <div className="f-s-20 ">                                {language === 'en' ? 'Artisan Cost' : 'تكلفةالحرفية '}
                            </div>
                            <div className="f-s-20 font-Lyon">1,500</div>
                          </div>
                          <div className="d-flex gap-3 justify-content-between">
                            <div className="f-s-20 ">
                              {language === "en"
                                ? "Workshop Equipment per person  Includes (Colors, Fabric Bag)"
                                : " أدروات الورشة للشخص الواحد   تشمل (الألوان، الحقيبة القماشية)"}
                            </div>
                            <div className="f-s-20 font-Lyon">70</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="workshopCard">
                        <div className="workshopThumb">
                          <img
                            src={require("../assets/images/al-ghadeer-1/planting-in-a-khoos-basket.jpg")}
                            alt="Demo"
                          />
                        </div>
                        <div className="workshopText">
                          <div className=" f-s-30 font-Lyon mrg-b-5 line_H_1_2">
                            {language === "en"
                              ? "Planting in a Khoos Basket"
                              : "صناعة الطربوش"}
                          </div>
                          <div className="d-flex justify-content-between workshop-line">
                            <div className="f-s-20 ">                                {language === 'en' ? 'Artisan Cost' : 'تكلفةالحرفية '}
                            </div>
                            <div className="f-s-20 font-Lyon">1,500</div>
                          </div>
                          <div className="d-flex gap-3 justify-content-between">
                            <div className="f-s-20 ">
                              {language === "en"
                                ? "Workshop Equipment per person  Includes (Khous basket, Plants, Soil)"
                                : "  أدروات الورشة للشخص الواحد  تشمل (سلة خوص، الزراعة، التربة)  "}
                            </div>
                            <div className="f-s-20 font-Lyon">90</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="workshopCard">
                        <div className="workshopThumb">
                          <img
                            src={require("../assets/images/al-ghadeer-1/sadu-braclate-making.jpg")}
                            alt="Demo"
                          />
                        </div>
                        <div className="workshopText">
                          <div className=" f-s-30 font-Lyon mrg-b-5 line_H_1_2">
                            {language === "en"
                              ? "Sadu Braclate Making"
                              : "صنع أسوارة السدو"}
                          </div>
                          <div className="d-flex justify-content-between workshop-line">
                            <div className="f-s-20 ">                                {language === 'en' ? 'Artisan Cost' : 'تكلفةالحرفية '}
                            </div>
                            <div className="f-s-20 font-Lyon">1,500</div>
                          </div>
                          <div className="d-flex gap-3 justify-content-between">
                            <div className="f-s-20 ">
                              {language === "en"
                                ? "Workshop Equipment per person  Includes (Sadu, Threads)"
                                : "أدروات الورشة للشخص الواحد    تشمل (السدو، الخيوط)"}
                            </div>
                            <div className="f-s-20 font-Lyon">60</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="workshopCard">
                        <div className="workshopThumb">
                          <img
                            src={require("../assets/images/al-ghadeer-1/dye-fabric-with-natural.jpg")}
                            alt="Demo"
                          />
                        </div>
                        <div className="workshopText">
                          <div className=" f-s-30 font-Lyon mrg-b-5 line_H_1_2">
                            {language === "en"
                              ? "Dye Fabric with Natural Materials"
                              : "صبغ القماش بمواد طبيعية"}
                          </div>
                          <div className="d-flex justify-content-between workshop-line">
                            <div className="f-s-20 ">                                {language === 'en' ? 'Artisan Cost' : 'تكلفةالحرفية '}
                            </div>
                            <div className="f-s-20 font-Lyon">1,500</div>
                          </div>
                          <div className="d-flex gap-3 justify-content-between">
                            <div className="f-s-20 ">
                              {language === "en"
                                ? "Workshop Equipment  Includes (Dyes, Fabric Bag/Shirt)"
                                : "أدروات الورشة   تشمل (الأصباغ، حقيبة قماشية/قميص)"}
                            </div>
                            <div className="f-s-20 font-Lyon">150</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="workshopCard">
                        <div className="workshopThumb">
                          <img
                            src={require("../assets/images/al-ghadeer-1/planting-in-a-khoos-basket-2.jpg")}
                            alt="Demo"
                          />
                        </div>
                        <div className="workshopText">
                          <div className=" f-s-30 font-Lyon mrg-b-5 line_H_1_2">
                            {language === "en"
                              ? "Planting in a Khoos Basket"
                              : "صناعة الطربوش"}
                          </div>
                          <div className="d-flex justify-content-between workshop-line">
                            <div className="f-s-20 ">                                {language === 'en' ? 'Artisan Cost' : 'تكلفةالحرفية '}
                            </div>
                            <div className="f-s-20 font-Lyon">1,500</div>
                          </div>
                          <div className="d-flex gap-3 justify-content-between">
                            <div className="f-s-20 ">
                              {language === "en"
                                ? "Workshop Equipment per person   Includes (Tarboush Threads)"
                                : "أدروات الورشة للشخص الواحد   تشمل (خيوط الطربوش)"}
                            </div>
                            <div className="f-s-20 font-Lyon">30</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="workshopCard">
                        <div className="workshopThumb">
                          <img
                            src={require("../assets/images/al-ghadeer-1/making-coasters-with-talli.jpg")}
                            alt="Demo"
                          />
                        </div>
                        <div className="workshopText">
                          <div className=" f-s-30 font-Lyon mrg-b-5 line_H_1_2">
                            {language === "en"
                              ? "Making Coasters with Talli"
                              : "صناعة قاعدة أكواب بالتلي"}
                          </div>
                          <div className="d-flex justify-content-between workshop-line">
                            <div className="f-s-20 ">                                {language === 'en' ? 'Artisan Cost' : 'تكلفةالحرفية '}
                            </div>
                            <div className="f-s-20 font-Lyon">1,500</div>
                          </div>
                          <div className="d-flex gap-3 justify-content-between">
                            <div className="f-s-20 ">
                              {language === "en"
                                ? "Workshop Equipment per person  Includes (Talli, Base)"
                                : "أدروات الورشة للشخص الواحد   تشمل (التلي، القاعدة)"}
                              {language === "en" ? "" : ""}
                            </div>
                            <div className="f-s-20 font-Lyon">70</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="workshopCard">
                        <div className="workshopThumb">
                          <img
                            src={require("../assets/images/al-ghadeer-1/suhail-star-with-khous.jpg")}
                            alt="Demo"
                          />
                        </div>
                        <div className="workshopText">
                          <div className=" f-s-30 font-Lyon mrg-b-5 line_H_1_2">
                            {language === "en"
                              ? "Suhail Star with Khous"
                              : "نجم سهيل بالخوص"}
                          </div>
                          <div className="d-flex justify-content-between workshop-line">
                            <div className="f-s-20 ">                                {language === 'en' ? 'Artisan Cost' : 'تكلفةالحرفية '}
                            </div>
                            <div className="f-s-20 font-Lyon">1,500</div>
                          </div>
                          <div className="d-flex gap-3 justify-content-between">
                            <div className="f-s-20 ">
                              {language === "en"
                                ? "Workshop Equipment per person Includes (Khous)"
                                : "أدروات الورشة للشخص   تشمل (الخوص)"}
                            </div>
                            <div className="f-s-20 font-Lyon">45 </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 col-lg-4">
                      <div className="workshopCard">
                        <div className="workshopThumb">
                          <img
                            src={require("../assets/images/al-ghadeer-1/sadu-chams.jpg")}
                            alt="Demo"
                          />
                        </div>
                        <div className="workshopText">
                          <div className=" f-s-30 font-Lyon mrg-b-5 line_H_1_2">
                            {language === "en"
                              ? "Sadu Chams"
                              : "ميداليات السدو"}
                          </div>
                          <div className="d-flex justify-content-between workshop-line">
                            <div className="f-s-20 ">                                {language === 'en' ? 'Artisan Cost' : 'تكلفةالحرفية '}
                            </div>
                            <div className="f-s-20 font-Lyon">1,500</div>
                          </div>
                          <div className="d-flex gap-3 justify-content-between">
                            <div className="f-s-20 ">
                              {language === "en"
                                ? "Workshop Equipment per person Includes (Sadu, Keychain)"
                                : "أدروات الورشة للشخص الواحد   تشمل (السدو، الحلقة)"}
                            </div>
                            <div className="f-s-20 font-Lyon">45</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="workshopCard">
                        <div className="workshopThumb">
                          <img
                            src={require("../assets/images/al-ghadeer-1/making-and-casting-candles.jpg")}
                            alt="Demo"
                          />
                        </div>
                        <div className="workshopText">
                          <div className=" f-s-30 font-Lyon mrg-b-5 line_H_1_2">
                            {language === "en"
                              ? "Making and Casting Candles"
                              : "صناعة قاعدة أكواب بالتلي"}
                          </div>
                          <div className="d-flex justify-content-between workshop-line">
                            <div className="f-s-20 ">                                {language === 'en' ? 'Artisan Cost' : 'تكلفةالحرفية '}
                            </div>
                            <div className="f-s-20 font-Lyon">1,500</div>
                          </div>
                          <div className="d-flex gap-3 justify-content-between">
                            <div className="f-s-20 ">
                              {language === "en"
                                ? "Workshop Equipment per person Includes (Jar, Talli, Wax and Perfume for the Candle)"
                                : "  أدروات الورشة للشخص الواحد  تشمل (الجرة، التلي، الواكس والعطر للشمعة)"}
                            </div>
                            <div className="f-s-20 font-Lyon">70</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="workshopCard">
                        <div className="workshopThumb">
                          <img
                            src={require("../assets/images/al-ghadeer-1/khous-charms.jpg")}
                            alt="Demo"
                          />
                        </div>
                        <div className="workshopText">
                          <div className=" f-s-30 font-Lyon mrg-b-5 line_H_1_2">
                            {language === "en"
                              ? "Khous Charms (Camels / Birds)"
                              : "صناعة ميدليات الخوص (جمال / طيور)"}
                          </div>
                          <div className="d-flex justify-content-between workshop-line">
                            <div className="f-s-20 ">
                              {language === 'en' ? 'Artisan Cost' : 'تكلفةالحرفية '}
                            </div>
                            <div className="f-s-20 font-Lyon">1,500</div>
                          </div>
                          <div className="d-flex gap-3 justify-content-between">
                            <div className="f-s-20 ">
                              {language === "en"
                                ? "Workshop Equipment  Includes (Khous)"
                                : "أدروات الورشة  تشمل (الخوص)"}
                            </div>
                            <div className="f-s-20 font-Lyon"> 35</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="workshopCard">
                        <div className="workshopThumb">
                          <img
                            src={require("../assets/images/al-ghadeer-1/burqa-making.jpg")}
                            alt="Demo"
                          />
                        </div>
                        <div className="workshopText">
                          <div className=" f-s-30 font-Lyon mrg-b-5 line_H_1_2">
                            {language === "en"
                              ? "Burqa Making"
                              : "صناعة براقع"}
                          </div>
                          <div className="d-flex justify-content-between workshop-line">
                            <div className="f-s-20 ">

                              {language === 'en' ? 'Artisan Cost' : 'تكلفةالحرفية '}
                            </div>
                            <div className="f-s-20 font-Lyon">1,500</div>
                          </div>
                          <div className="d-flex gap-3 justify-content-between">
                            <div className="f-s-20 ">
                              {language === "en"
                                ? "Workshop Equipment per person Includes (Jar, Talli, Wax and Perfume for the Candle)"
                                : "أدروات الورشة للشخص الواحد  تشمل (قطعة البرقع، الخيوط، العصا، الحبل)"}
                            </div>
                            <div className="f-s-20 font-Lyon"> 60</div>
                          </div>
                        </div>
                      </div>
                    </div> */}
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
                        {" "}
                        {language === "en" ? "Thank you " : "شكراً"}{" "}
                      </div>
                      <div className="secTitle f-s-30">
                        {" "}
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

        </div>
      )}
    </>
  );
};

export default Workshops;
