import React, { Fragment, memo, useState, useEffect } from 'react';
import Slider from "react-slick";
import our_vision_mob_bg from '../assets/images/our-vision-mob-bg.jpg';
import BASE_PATH from '../serviceurls';
import { useLanguage } from '../redux/LanguageContext';
function OurStorySlider() {
  const [responseData, setResponseData] = useState(null);
const { language} = useLanguage();  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_PATH}Page/GetPageByName?pageName=our-story`);

        const data = await response.json();
        setResponseData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  if (!responseData || !responseData[0]?.SectionModels[2]) {
    return null;
  }


  

  const carouselData =
  language === "ar"
    ? responseData[0].SectionModels[2].LabelModels[0].ArabicDescription
    : responseData[0].SectionModels[2].LabelModels[0].EnglishDescription;

const carousels = JSON.parse(carouselData || '[]');


  var settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 2000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Fragment>
      <div className="our-slider">
        <Slider {...settings}>
          {carousels.map((carousel, index) => (
            <div key={index} className="craft-highlightImg_wrap position-relative">
              <div className="craft-highlightImg mobbg-height">
                <picture className="w-100 h-100 d-block">
                  <img
                    decoding="async"
                    src={carousel.ImagePath || our_vision_mob_bg}
                    className="w-100 h-100 objCvr mobImg"
                    loading="lazy"
                    alt={`Carousel ${index}`}
                  />
                </picture>
              </div>
              <div className="our-vision">
                <div
                  className="our-vision-inner mx-auto text-center"
                  data-aos="fade-up"
                  data-aos-delay={900}
                >
                  <div className="our-vision_1 f-s-20 font-Lyon clr-pink-light">
                    {carousel.Title || 'Default Title'}
                  </div>
                  <div className="our-vision_2 f-s-30 clr-pink-light">{carousel.SubTitle}</div>
                  <div className="our-vision_3 clr-pink-light mrg-b-30">
                    {carousel.ShortDescription || 'Default Description'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </Fragment>
  );
}

export default memo(OurStorySlider);
