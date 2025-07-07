import React, { useState } from 'react';
import { useLanguage } from "../redux/LanguageContext";

function Location() {

  const { language } = useLanguage();

  // Define stockistOptions before using them
  const stockistOptions = {
    "Abu Dhabi": [
      "Emirates Red Crescent",
      "Manarat Al Sadiyaat",
      "Yas Mall (Ether)",
      "Adnoc Head Quarter"
    ],
    "Dubai": [
      "Museum of Future",
      "Art Jameel"
    ],
    "Sharjah": [
      "House of Wisdom",
      "Gshar"
    ]
  };

  const mapUrls = {
    "Emirates Red Crescent": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d232329.0002709894!2d54.22652785910972!3d24.515215800000018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e66e494f3ae11%3A0xfd4be2db4599f2d!2sEmirates%20Red%20Crescent!5e0!3m2!1sen!2sin!4v1726226629027!5m2!1sen!2sin",
    "Manarat Al Sadiyaat": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3629.591568009183!2d54.41633497544613!3d24.534211378143677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e674216942777%3A0x9a2aa665d9cb7e67!2sManarat%20Al%20Saadiyat!5e0!3m2!1sen!2sin!4v1726226765500!5m2!1sen!2sin",
    "Yas Mall (Ether)": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7261.978904434307!2d54.601046880964184!3d24.48582231671825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e45d56fab2627%3A0x34d33688dea5db24!2sETHER!5e0!3m2!1sen!2sin!4v1726226851139!5m2!1sen!2sin",
    "Adnoc Head Quarter": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29053.399589601057!2d54.289191179101586!3d24.462060400000013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e65bfcc26165b%3A0x23f1d873203f5e6b!2sADNOC%20Head%20Office!5e0!3m2!1sen!2sin!4v1726227274718!5m2!1sen!2sin",
    "Museum of Future": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3629.606488098903!2d54.395561875446134!3d24.53369537814398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e6724630067f1%3A0x42191ffb02753df9!2sLouvre%20Abu%20Dhabi!5e0!3m2!1sen!2sin!4v1726227329357!5m2!1sen!2sin",
    "Art Jameel": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.2339966486707!2d55.33782197546803!3d25.229042477690502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d691492f097%3A0x9589ec3a10d15a86!2sJameel%20Arts%20Centre!5e0!3m2!1sen!2sin!4v1726227374923!5m2!1sen!2sin",
    "House of Wisdom": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.582289463007!2d55.5032955754709!3d25.318234577633234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ef5f595aa316c33%3A0xa9bdd9d6cc98cc28!2sHouse%20of%20Wisdom!5e0!3m2!1sen!2sin!4v1726227422539!5m2!1sen!2sin",
    "Gshar": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3605.3429108379!2d55.38193587547226!3d25.359821477606708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5ba78a66b6a5%3A0x92757622433bd22e!2sGshar!5e0!3m2!1sen!2sin!4v1726227461307!5m2!1sen!2sin"
  };

  // Set the default city and stockist
  const [selectedCity, setSelectedCity] = useState('Abu Dhabi');
  const [selectedStockist, setSelectedStockist] = useState(stockistOptions['Abu Dhabi'][0]); // Default to first stockist in Abu Dhabi
  const [mapUrl, setMapUrl] = useState(mapUrls[stockistOptions['Abu Dhabi'][0]]); // Default to first stockist's map

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    setSelectedStockist(stockistOptions[city][0]); // Set default stockist for the selected city
  };

  const handleStockistChange = (event) => {
    setSelectedStockist(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    setMapUrl(mapUrls[selectedStockist]); // Update the map URL based on the selected stockist
  };

  return (
    <div className="home_section_six secBg_dark">
      <div className="loactionFind_sec">
        <div className="row g-0">
          <div className="col-md-6">
            <div className="mapLocation h-100">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <div className="col-md-6 align-self-center">
            <div
              className="stokists_sec mx-auto"
              data-aos="fade-up"
              data-aos-delay={300}
            >
                <div className="findTxt f-s-20 clr-pink-light font-Lyon">
                {language === "en" ? "Where to find us" : "أين يمكنك إيجادنا"}
              </div>
              <div className="our-stockistsTxt f-s-30 clr-pink-light mrg-b-15 line_H_1">
                {language === "en" ? "Our Stockists" : "قائمة مخزوننا"}
              </div>
              
              <div className="locationForm_wrap">
                <div className="formGroup mrg-b-20">
                  <select
                    name="City"
                    id="city"
                    className="cstSelect"
                    value={selectedCity}
                    onChange={handleCityChange}
                  >
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Sharjah">Sharjah</option>
                  </select>
                </div>
                <div className="formGroup mrg-b-20">
                  <select
                    name="Stockist"
                    id="stockist"
                    className="cstSelect"
                    value={selectedStockist}
                    onChange={handleStockistChange}
                  >
                    {stockistOptions[selectedCity].map((stockist) => (
                      <option key={stockist} value={stockist}>
                        {stockist}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="formGroup">
                  <button
                    className="collectionShop_btn font-Lyon clr-pink-light"
                    onClick={handleSubmit}
                  >
                    {language === "en" ? "Find Location" : "ابحث عن موقع"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location;
