import React, { useEffect, useState } from 'react';
import { BASE_PATH} from "../serviceurls";
import { useLanguage } from '../redux/LanguageContext';
import DOMPurify from "dompurify";
const BlogDetails = () => {


    const { language } = useLanguage();

  const [responseData, setResponseData] = useState(null);

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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  if (!responseData) {
    return null; // Or you can render a loading spinner or message
  }
  return (
    <div className="blogSec secBg">
      <div className="full-container container">
        <div className="row">
          <div className="col-xl-9">
            <div className="blogDetails_wrap">
              {responseData && responseData[0] && responseData[0].SectionModels && (
                <>
                  <div className="blogDetails_title f-s-30 font-Lyon mrg-b-20">
                    {responseData[0].SectionModels[0].LabelModels.find(label => label.LabelName === "Title").EnglishDescription}
                  </div>
                  <div className="blogDetailsImg mrg-b-30">
                    <img src={responseData[0].SectionModels[0].LabelModels.find(label => label.LabelName === "Blog Image").MediaPath} className="w-100" alt="Blog Image" />
                  </div>
                  <div className="txtSummary">
                    <div dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize( responseData[0].SectionModels[0].LabelModels.find(label => label.LabelName === "Description").EnglishDescription
                   ),  }} />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-xl-3">
            <div className="blogRightBx">
              <div className="recentblog_bx mrg-b-30">
                <div className="rightside_title f-w-B font-Lyon f-s-20 mrg-b-10 text-uppercase">RECENT POSTS</div>
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
                                  __html: DOMPurify.sanitize( language === "en"
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
                <div className="rightside_title f-w-B font-Lyon f-s-20 mrg-b-10 text-uppercase">SEARCH BY TAGS</div>
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
  );
};

export default BlogDetails;
