import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const AOSHandler = () => {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 500,
      offset: 50,
      once: true,
    });
  }, []);

  useEffect(() => {
    AOS.refresh();
    window.scrollTo(0, 0);
  }, [location]);

  return null; 
};

export default AOSHandler;
