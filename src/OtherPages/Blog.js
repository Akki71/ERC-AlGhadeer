import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_PATH} from "../serviceurls";
import Loader from '../components/Loader';
import { useLanguage } from '../redux/LanguageContext';
import DOMPurify from "dompurify";
const Blog = () => {
  const [responseData, setResponseData] = useState(null);
  const [loading , setLoading] = useState(true)



    const { language } = useLanguage();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_PATH}Page/GetPageByName?pageName=our-blog`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*'
          }
        });
        const data = await response.json();
        setResponseData(data);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // console.log(responseData);

  return (
    <> {loading ? (
   
    
      <div id="hola">
        <div id="preloader">
         <Loader/>
        </div>
      </div>
    ) : (
    <>
      {responseData && responseData[0] && responseData[0].SectionModels && (
        <div className="blogSec secBg">
          <div className="full-container container">
            <div className="row">
              <div className="col-xl-9">
                <div className="blogList_wrap">
                  <div className="row">
                    {responseData[0].SectionModels.map((section, index) => (
                      <div className="col-sm-6 col-md-4" key={index}>
                        <div className="blogBx mrg-b-50">
                          <div className="blogImg position-relative">
                            <a className="blogImg-lik d-block">
                              <img
                                src={responseData[0].SectionModels[0].LabelModels[4].MediaPath}
                                className="w-100"
                                loading="lazy"
                                alt="Blog Image"
                              />
                            </a>
                            <div className="blogdate f-s-20">
                              {section.LabelModels.find(label => label.LabelName === "Date").EnglishDescription}
                            </div>
                          </div>
                          <div className="blogTitle">
                            <div className="blogTitle_wrap mrg-b-10">
                              <a className="blogTitle-link f-w-B font-Lyon" dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize( language === "en"
                                  ? section.LabelModels.find(label => label.LabelName === "Title").EnglishDescription
                                  : section.LabelModels.find(label => label.LabelName === "Title").ArabicDescription
                              ), }} />
                            </div>
                            <div className="blogTitle_wrap mrg-b-10">
                              <a className="blogTitle-link f-w-B font-Lyon" dangerouslySetInnerHTML={{
                                __html:  DOMPurify.sanitize(language === "en"
                                  ? section.LabelModels.find(label => label.LabelName === "Author").EnglishDescription
                                  : section.LabelModels.find(label => label.LabelName === "Author").ArabicDescription
                             ),  }} />
                            </div>
                            {/* <div className="blogTxt_summary f-s-14 mrg-b-20" dangerouslySetInnerHTML={{
                              __html: language === "en"
                                ? section.LabelModels.find(label => label.LabelName === "Description").EnglishDescription
                                : section.LabelModels.find(label => label.LabelName === "Description").ArabicDescription
                            }} /> */}
                          </div>
                          <div className="readMore_btn mrg-t-30">
                        
                            <Link to="/blogdetails" className="readMore font-Lyon"> 
                              {language === "en"
                        ? "     Read More "
                        : "اقرأ المزيد"}
                           
                            
                          
                            </Link>

                           
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-xl-3">
                <div className="blogRightBx">
                  <div className="recentblog_bx mrg-b-30">
                    <div className="rightside_title f-w-B font-Lyon f-s-20 mrg-b-10 text-uppercase">
                      
                    {language === "en" ? 
                      " RECENT POSTS"
                        : 
                        "المنشورات الحديثة"  }
                          
                     </div>
                    <div className="recentBlogList_wrap">
                      <ul className="list-unstyled mb-0">
                        {responseData[0].SectionModels.map((section, index) => (
                          <li className="row mrg-b-30" key={index}>
                            <div className="col-6">
                              <div className="recentBlogImg">
                                <a className="d-block">
                                  <img
                                    src={section.LabelModels.find(label => label.LabelName === "Blog Image").MediaPath}
                                    className="w-100"
                                    alt="Blog Image"
                                  />
                                </a>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="recentBlog_title">
                                <a className="primary-clr line_H_1_2 d-block" dangerouslySetInnerHTML={{
                                  __html:  DOMPurify.sanitize(language === "en"
                                    ? section.LabelModels.find(label => label.LabelName === "Title").EnglishDescription
                                    : section.LabelModels.find(label => label.LabelName === "Title").ArabicDescription
                                ), }} />
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="recentblog_bx mrg-b-30">
                    <div className="rightside_title f-w-B font-Lyon f-s-20 mrg-b-10 text-uppercase">
                    {language === "en" ? 
                      " SEARCH BY TAGS"
                        : 
                          "ابحث بالكلمات" }
                    
                    </div>
                    <div className="taglist_wrap">
                      <ul className="list-inline mb-0">
                        <li className="list-inline-item"> <a className="primary-clr"> Lorem ipsum </a></li>
                        <li className="list-inline-item"> <a className="primary-clr"> dolor sit amet </a></li>
                        <li className="list-inline-item"> <a className="primary-clr"> consectetur </a></li>
                        <li className="list-inline-item"> <a className="primary-clr"> adipisicing elit </a></li>
                        <li className="list-inline-item"> <a className="primary-clr"> eiusmod tempor </a></li>
                        <li className="list-inline-item"> <a className="primary-clr"> Lorem ipsum </a></li>
                        <li className="list-inline-item"> <a className="primary-clr"> dolor sit amet </a></li>
                        <li className="list-inline-item"> <a className="primary-clr"> consectetur </a></li>
                        <li className="list-inline-item"> <a className="primary-clr"> adipisicing elit </a></li>
                        <li className="list-inline-item"> <a className="primary-clr"> eiusmod tempor </a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>)}</>
  );
};

export default Blog;


