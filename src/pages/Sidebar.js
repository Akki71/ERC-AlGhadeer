import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../redux/LanguageContext';

const Sidebar = ({ responseData, currentNewsId }) => {
  const { language } = useLanguage();
  const location = useLocation();
  
  const getLabelValue = (section, labelName, property) => {
    const label = section.LabelModels.find(label => label.LabelName === labelName);
    return label ? label[property] : null;
  };

  return (
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
                .filter(newsItem => newsItem.SrNo !== currentNewsId) // Filter out current news item
                .map(newsItem => (
                  <li className="row mrg-b-30" key={newsItem.SrNo}>
                    <div className="col-6">
                      <div className="recentBlogImg">
                        <Link to={`/newsdetails?id=${newsItem.SrNo}`} className="d-block">
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
                          to={`/newsdetails?id=${newsItem.SrNo}`} 
                          className="primary-clr line_H_1_2 d-block"
                        >
                          {newsItem.Title}
                        </Link>
                      </div>
                    </div>
                  </li>
                ))
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
  );
};

export default Sidebar;
