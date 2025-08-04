import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'; // Import useParams
import BASE_PATH from '../serviceurls';
import Loader from '../components/Loader';
import { useLanguage } from '../redux/LanguageContext';

const NewsPage = () => {
  const { id } = useParams(); // Extract ID from URL
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_PATH}Page/GetPageByName?pageName=our-news`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*',
          },
        });
        const data = await response.json();
        setResponseData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div id="hola">
        <div id="preloader">
          <Loader />
        </div>
      </div>
    );
  }

  if (!responseData || !responseData[0] || !responseData[0].SectionModels) {
    return <div>{language === "en" ? "No data available" : "لا توجد بيانات متاحة"}</div>;
  }

  const renderNewsItem = (newsItem) => {
    return (
      <div className="col-sm-6 col-md-4" key={newsItem.SrNo}>
        <div className="blogBx mrg-b-50">
          <div className="blogImg position-relative">
            <Link to={`/newsdetails/${newsItem.SrNo}`} className="blogImg-lik d-block">
              <img
                src={newsItem.ImagePath}
                className="w-100"
                loading="lazy"
                alt={newsItem.Title}
              />
            </Link>
            <div className="blogdate f-s-20">
              {newsItem.Date}
            </div>
          </div>
          <div className="blogTitle">
            <div className="blogTitle_wrap mrg-b-10">
              <Link to={`/newsdetails/${newsItem.SrNo}`} className="blogTitle-link f-w-B font-Lyon">
                {newsItem.Title}
              </Link>
            </div>
            <div className="blogTitle_wrap mrg-b-10">
              <span className="blogTitle-link f-w-B font-Lyon">
                {newsItem.Author}
              </span>
            </div>
          </div>
          <div className="readMore_btn mrg-t-30">
            <Link to={`/newsdetails/${newsItem.SrNo}`} className="readMore font-Lyon">
              {language === "en" ? "Read More" : "اقرأ المزيد"}
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (section) => {
    const blogLabel = section.LabelModels.find(label => label.FieldTypeName === "Blog");
    
    if (!blogLabel) return null;

    const newsItems = JSON.parse(
      language === "en" ? blogLabel.EnglishDescription : blogLabel.ArabicDescription
    );

    return (
      
      <div className="row">
        {newsItems
          .filter(newsItem => newsItem.SrNo !== parseInt(id)) // Hide the current news item
          .map((newsItem) => renderNewsItem(newsItem))
        }
      </div>
    );
  };

  return (
    <div className="blogSec secBg">
      <div className="full-container container">
        <div className="row">
          <div className="col-xl-9">
            <div className="blogList_wrap">
              {responseData[0].SectionModels.map(section => (
                <div key={section.SectionId}>
                  {renderSection(section)}
                </div>
              ))}
            </div>
          </div>
          <div className="col-xl-3">
            <div className="blogRightBx">
              <div className="recentblog_bx mrg-b-30">
                <div className="rightside_title f-w-B font-Lyon f-s-20 mrg-b-10 text-uppercase">
                  {language === "en" ? "RECENT POSTS" : "المنشورات الحديثة"}
                </div>
                <div className="recentBlogList_wrap">
                  <ul className="list-unstyled mb-0">
                    {responseData[0].SectionModels.map(section => (
                      JSON.parse(
                        language === "en"
                          ? section.LabelModels.find(label => label.FieldTypeName === "Blog").EnglishDescription
                          : section.LabelModels.find(label => label.FieldTypeName === "Blog").ArabicDescription
                      )
                        .filter(newsItem => newsItem.SrNo !== parseInt(id)) // Hide the current news item
                        .map((newsItem) => (
                          <Link to={`/newsdetails/${newsItem.SrNo}`}>
                          <li className="row mrg-b-30" key={newsItem.SrNo}>
                            <div className="col-6">
                              <div className="recentBlogImg d-block">
                              
                                  <img
                                    src={newsItem.ImagePath}
                                    className="w-100"
                                    alt={newsItem.Title}
                                  />
                               
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="recentBlog_title primary-clr line_H_1_2 d-block">
                               
                                  {newsItem.Title}
                                
                              </div>
                            </div>
                          </li>
                          </Link>
                        ))
                    ))}
                  </ul>
                </div>
              </div>
              {/* <div className="recentblog_bx mrg-b-30">
                <div className="rightside_title f-w-B font-Lyon f-s-20 mrg-b-10 text-uppercase">
                  {language === "en" ? "SEARCH BY TAGS" : "ابحث بالكلمات"}
                </div>
                <div className="taglist_wrap">
                  <ul className="list-inline mb-0">
                  
                    <li className="list-inline-item"><a className="primary-clr">Lorem ipsum</a></li>
                    <li className="list-inline-item"><a className="primary-clr">dolor sit amet</a></li>
                    <li className="list-inline-item"><a className="primary-clr">consectetur</a></li>
                  </ul>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
