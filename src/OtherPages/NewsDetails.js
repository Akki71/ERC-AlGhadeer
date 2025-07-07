import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BASE_PATH from '../serviceurls';
import { useLanguage } from '../redux/LanguageContext';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const NewsDetails = () => {
  const { id } = useParams(); // Extract ID from URL
  const { language } = useLanguage();
  const [responseData, setResponseData] = useState(null);
  const [filteredNews, setFilteredNews] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_PATH}Page/GetPageByName?pageName=our-news`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*'
          }
        });
        const data = await response.json();
        setResponseData(data);

        if (data && data[0] && data[0].SectionModels) {
          const section = data[0].SectionModels.find(sec => 
            JSON.parse(language === 'en' ? sec.LabelModels.find(label => label.FieldTypeName === "Blog").EnglishDescription : sec.LabelModels.find(label => label.FieldTypeName === "Blog").ArabicDescription)
              .some(newsItem => newsItem.SrNo === parseInt(id))
          );
          if (section) {
            const newsItems = JSON.parse(language === 'en' ? section.LabelModels.find(label => label.FieldTypeName === "Blog").EnglishDescription : section.LabelModels.find(label => label.FieldTypeName === "Blog").ArabicDescription);
            const newsDetail = newsItems.find(newsItem => newsItem.SrNo === parseInt(id));
            setFilteredNews(newsDetail);

            // Exclude the current news item from recent posts
            const filteredRecentPosts = newsItems.filter(newsItem => newsItem.SrNo !== parseInt(id));
            setRecentPosts(filteredRecentPosts);
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id, language]);

  if (!filteredNews) {
    return <div id="hola">
    <div id="preloader">
      <div className="loader-logo mx-auto mrg-b-30"></div>
      <div className="loadingTxt text-center">
        <div className="txtSummary f-s-20">
          <Loader />
        </div>
      </div>
    </div>
  </div>;
  }

  return (
    <div className="blogSec secBg">
      <div className="full-container container">
        <div className="row">
          <div className="col-xl-9">
            <div className="blogDetails_wrap">
              <div className="blogDetails_title f-s-30 font-Lyon mrg-b-20">
                {filteredNews.Title}
              </div>
              <div className="blogDetailsImg mrg-b-30">
                <img 
                  src={filteredNews.ImagePath} 
                  className="w-100" 
                  alt={filteredNews.Title} 
                />
              </div>
              <div className="txtSummary">
                <div dangerouslySetInnerHTML={{
                  __html: filteredNews.Description
                }} />
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="blogRightBx">
              <div className="recentblog_bx mrg-b-30">
                <div className="rightside_title f-w-B font-Lyon f-s-20 mrg-b-10 text-uppercase">
                  {language === "en" ? "RECENT POSTS" : "المنشورات الأخيرة"}
                </div>
                <div className="recentBlogList_wrap">
                  <ul className="list-unstyled mb-0">
                    {recentPosts.map(newsItem => (
                      <Link to={`/newsdetails/${newsItem.SrNo}`}>
                      <li className="row mrg-b-30" key={newsItem.SrNo}>
                        <div className="col-6">
                          <div className="recentBlogImg">
                            <Link  to={`/newsdetails/${newsItem.SrNo}`} className="d-block">
                              <img
                                src={newsItem.ImagePath}
                                className="w-100"
                                alt={newsItem.Title}
                              />
                            </Link>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="recentBlog_title">
                            <Link 
                              className="primary-clr line_H_1_2 d-block"
                              href={`/newsdetails/${newsItem.SrNo}`}
                            >
                              {newsItem.Title}
                            </Link>
                          </div>
                        </div>
                      </li>
                      </Link>

                    ))}
                  </ul>
                </div>
              </div>
              <div className="recentblog_bx mrg-b-30">
                <div className="rightside_title f-w-B font-Lyon f-s-20 mrg-b-10 text-uppercase">
                  {language === "en" ? "SEARCH BY TAGS" : "ابحث بالكلمات"}
                </div>
                <div className="taglist_wrap">
                  <ul className="list-inline mb-0">
                    {/* Placeholder tags */}
                    <li className="list-inline-item"><a className="primary-clr">Lorem ipsum</a></li>
                    <li className="list-inline-item"><a className="primary-clr">dolor sit amet</a></li>
                    <li className="list-inline-item"><a className="primary-clr">consectetur</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;
