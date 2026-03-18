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
