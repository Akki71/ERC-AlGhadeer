import React, { useState, useEffect } from 'react';
import Partner from '../components/Partner';
import team from '../assets/images/our-founder-1.jpg';
import handleClick from '../components/links';
import AL_Ghadeer_logo from "../assets/images/AL-Ghadeer-logo.png";
import BASE_PATH from '../serviceurls';
import Loader from '../components/Loader';
import { useLanguage } from '../redux/LanguageContext';


const OurPeople = () => {
  const [responseData, setResponseData] = useState(null);
  useEffect(() => { handleClick() }, [handleClick])
  const [loading , setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_PATH}Page/GetPageByName?pageName=our-people`, {
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
    if (!responseData || !responseData[0]?.SectionModels[1]?.LabelModels) {
      return null;
    }
    const section = responseData[0].SectionModels[1].LabelModels.find(
      (label) => label.LabelName === labelName
    );
    return section;
  };

  const renderTeamMembers = () => {
    const peopleLabel = getLabelValue('People');
    if (!peopleLabel) {
      return null;
    }

    const teamMembers = JSON.parse(
      language === 'en' ? peopleLabel.EnglishDescription : peopleLabel.ArabicDescription
    );

    return teamMembers.map((teamMember, index) => (
      <div key={index} className="col-md-4">
        <div className="teamBx text-center mrg-b-50">
          <div className="teamImg_sec mrg-b-20">
            <img src={teamMember.ImagePath} className="w-100" alt={teamMember.Name} />
          </div>
          <div className="teamName f-s-30 font-Lyon clr-pink-light">
            {language === 'en' ? teamMember.Name : teamMember.Name}
          </div>
          <div className="teamDesignation f-s-20 clr-pink-light">
            {language === 'en'
              ? teamMember.Designation
              : teamMember.Designation}
          </div>
          <div className="teamTxt_summary clr-pink-light">
            {language === 'en' ? teamMember.Description : teamMember.Description}
          </div>
        </div>
      </div>
    ));
  };
    // useEffect(() => {
    //   setTimeout(() => {
    //     setLoading(false);
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
      {responseData?.[0]?.SectionModels && (
        <div>
          <div className="topBanner_sec">
            <div className="topBanner_inn">
              <img
                src={responseData[0].SectionModels[0].LabelModels[0].MediaPath}

                className="w-100" alt="" />

            </div>
          </div>
          <div className="home_section_three secBg_dark">
            <div className="full-container container">
              <div className="row">
                <div className="col-md-12">
                  <div
                    className="secTitle_wrap text-center mrg-b-30"
                    data-aos="fade-up"
                    data-aos-delay={300}
                  >
                    <div className="sec_subTitle f-s-20 clr-pink-light">
                      {language === 'en'
                        ? responseData[0].SectionModels[1].LabelModels[0].EnglishDescription
                        : responseData[0].SectionModels[1].LabelModels[0].ArabicDescription}
                    </div>
                    <div className="secTitle f-s-30 font-Lyon clr-pink-light">
                    
                {language === "en"
                        ? "  Our People  "
                        : " شعبنا "}
                    
                    </div>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="ourTeam_wrap">
                    <div className="row justify-content-center">{renderTeamMembers()}</div>
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
      )}
    </div>
    )}
    </>
  );
};

export default OurPeople;
