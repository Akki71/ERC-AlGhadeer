import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import handleClick from "../components/links";
import { BASE_PATH} from "../serviceurls";
import Loader from "../components/Loader";
import { useLanguage } from "../redux/LanguageContext";

const Faq = () => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleClick();
  }, [handleClick]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_PATH}Page/GetPageByName?pageName=faq`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          }
        );
        const data = await response.json();
        setResponseData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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

  const renderTeamMembers = () => {
    const peopleLabel = getLabelValue("FAQ");

    if (!peopleLabel) {
      return null;
    }

    const teamMembers = JSON.parse(
      language === "en"
        ? peopleLabel.EnglishDescription
        : peopleLabel.ArabicDescription
    );

    return teamMembers.map((teamMember, index) => (
      <div className="accordion-item" key={index}>
        <h2 id={`regularHeading${index}`} className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#acc-${index}`}
            aria-expanded="true"
            aria-controls={`acc-${index}`}
          >
            {language === "en" ? teamMember.Heading : teamMember.Heading}
          </button>
        </h2>
        <div
          id={`acc-${index}`}
          className="accordion-collapse collapse"
          aria-labelledby={`regularHeading${index}`}
          data-bs-parent="#regularAccordionRobots"
        >
          <div className="accordion-body">
            {language === "en" ? teamMember.Content : teamMember.Content}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      {loading ? (
        <div id="hola">
          <div id="preloader">
            <Loader />
          </div>
        </div>
      ) : (
        <div>
          {responseData && responseData[0] && responseData[0].SectionModels && (
            <div className="privacyPolicy_sec secBg">
              <div className="full-container container">
                <div className="row justify-content-center">
                  <div className="col-md-9">
                    <div className="secTitle_wrap text-center mrg-b-30">
                      <div className="sec_subTitle font-Lyon f-s-40">
                        {language === "en" ? "Faq's " : "الأسئلة الشائعة "}
                      </div>
                    </div>
                    <div
                      className="accordion cstAccodian"
                      id="regularAccordionRobots"
                    >
                      <div>{renderTeamMembers()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Faq;
