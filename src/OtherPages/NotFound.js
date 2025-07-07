import React, { Fragment } from 'react'
import { useLanguage } from '../redux/LanguageContext';

const NotFound = () => {
      const { language } = useLanguage();

    return (
        <Fragment>
            <div className="page-not-found">
                <h2 style={{ font: "#000000" }}>                 
                     {language === "en"           
                                    ? "   Coming Soon.."    
                        : "قريباً.."}
                </h2>
             </div>
        </Fragment>
    )
}

export default NotFound
