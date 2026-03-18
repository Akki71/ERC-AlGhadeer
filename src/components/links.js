import React from 'react'
import { BASE_PATH} from "../serviceurls";
 
const handleClick = () => {
    const body = document.body;
 
    // if (
    //     document.URL ===
    //     "http://localhost:3000/" 
    // ) {
    //     body.classList.add("home-pg");
    //     body.classList.remove("sub-page");
    // } else {
    //     body.classList.remove("home-pg");
    //     body.classList.add("sub-page");
    // }
    if (
        document.URL ===
       "https://www.alghadeeruaecrafts.ae/" 
     
       
    ) {
        body.classList.add("home-pg");
        body.classList.remove("sub-page");
    } else {
        body.classList.remove("home-pg");
        body.classList.add("sub-page");
    }
};
 
 
 
export default handleClick