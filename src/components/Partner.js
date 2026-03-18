import React, { Fragment, memo, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { BASE_PATH} from "../serviceurls";

function Partner() {
  const [responseData, setResponseData] = useState(null);
  useEffect(() => { 
    const fetchData = async () => {
      try {
      const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_PATH}Page/GetPageByName?pageName=thank-you-footer`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*'
          }
        });
        const data = await response.json();
        setResponseData(data); 
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const renderPartnerLogos = () => {
    if (!responseData || !responseData[0]) {
      return null;
    }

    const logos = JSON.parse(responseData[0].SectionModels[0].LabelModels[0].MediaPath);

    return logos.map((logo, index) => (
      <div className="slide-item" key={index}>
        <div className="partnerBx-img">
          <picture className="w-100 d-block">
            <img
              decoding="async"
              src={logo.ImagePath}
              alt={`Partner Logo ${index + 1}`}
              className="w-100 mobImg"
              loading="lazy"
            />
          </picture>
        </div>
      </div>
    ));
  };

  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 3000,
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
      <div className="row justify-content-center" data-aos="fade-up" data-aos-delay={300}>
        <div className="col-lg-10">
          <div className="partner-slider thmArrow">
            <Slider {...settings}>{renderPartnerLogos()}</Slider>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default memo(Partner);
