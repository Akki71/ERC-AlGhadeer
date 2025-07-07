import React, { createContext, useState, useContext, useEffect } from "react";
 
const LanguageContext = createContext();
 
export const useLanguage = () => useContext(LanguageContext);
 
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
 
  const switchLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "en" ? "ar" : "en"));
  };
 
  useEffect(() => {
    const importRtlStyles = () => {
      if (language === "ar") {
        document.body.classList.add("rtl");
      } else {
        document.body.classList.remove("rtl");
      }
    };
 
    importRtlStyles();
  }, [language]);
 
  return (
    <LanguageContext.Provider value={{ language, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};