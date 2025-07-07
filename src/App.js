import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Homepage from "./pages/Homepage";
import AOS from "aos";
import "aos/dist/aos.css";
import TokenPage from "./utils/TokenPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "font-awesome/css/font-awesome.min.css";
import "./assets/css/stylesheet.css";
import ContactUs from "./OtherPages/ContactUs";
import AboutUs from "./OtherPages/AboutUs";
import WhatweOffer from "./OtherPages/WhatweOffer";
import OurStory from "./OtherPages/OurStory";
import OurHistory from "./OtherPages/OurHistory";
import Privacypolicy from "./OtherPages/Privacypolicy";
import OurPeople from "./OtherPages/OurPeople";
import HowWework from "./OtherPages/HowWework";
import OurProduct from "./pages/OurProduct";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgotpass from "./pages/Forgotpass";
import TermsCondition from "./pages/TermsCondition";
import OurProductlisting from "./pages/OurProductlisting";
import NotFound from "./OtherPages/NotFound";
import Dasboard from "./Dashboard/Dasboard";
import AccountDetails from "./Dashboard/AccountDetails";
import DashboardNav from "./Dashboard/DashboardNav";
import OrderList from "./Dashboard/OrderList";
import Address from "./Dashboard/Address";
import Blog from "./OtherPages/Blog";
import BlogDetails from "./OtherPages/BlogDetails";
import AL_Ghadeer_logo from "./assets/images/AL-Ghadeer-logo.png";
import CartPage from "./cart/CartPage";
import Checkout from "./cart/Checkout";
import OurCrafts from "./OtherPages/OurCrafts";
import Favorites from "./OtherPages/Favorites";
import Contribute from "./OtherPages/Contribute";
import Faq from "./OtherPages/Faq";
import OrderDetails from "./Dashboard/OrderDetails";
import PaymentCallback from "./cart/PaymentCallback";
import { DataContext } from "./utils/ApiContext";
import Password from "./Dashboard/Password";
import EventsServices from "./OtherPages/EventsServices";
import Workshops from "./OtherPages/Workshops";
import Joinus from "./OtherPages/Joinus";
import { LanguageProvider } from './redux/LanguageContext';
import Whatoffer from "./OtherPages/Whoweare";
import Whoweare from "./OtherPages/Whoweare";
import NewsPage, { News } from "./pages/NewsPage";
import NewsDetails from "./OtherPages/NewsDetails";
import CheckoutGuest from "./cart/CheckoutGuest";
import AOSHandler from "./AOSHandler";
// import { Newspaper } from "react-bootstrap-icons";
// import { useLanguage } from '../redux/LanguageContext';
 
 
const App = () => {
 
  const [loading, setLoading] = useState(true);
  const [getToken, setGetToken] = useState(localStorage.getItem('token'));
  const [data, setData] = useState([0]);

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      startEvent: "load",
      duration: 500,
      offset: 50,
    });
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    if (!getToken) {
      setGetToken(localStorage.getItem('token'));
    }
  }, [getToken]);

  function SamsungPage() {
    window.location.href = '/samsung.html';
    return null; // Nothing to render as redirection happens
  }
  return (
    <Router>
       <AOSHandler />
      <div>
        <div>
          <TokenPage setGetToken={setGetToken} />
          {loading ? (
            <div id="hola">
              <div id="preloader">
                <div className="loader-logo mx-auto mrg-b-30">
                  <picture className="w-100 d-block">
                    <source srcSet={AL_Ghadeer_logo} media="(min-width: 768px)" className="w-100 deskImg" loading="lazy" />
                    <img decoding="async" src={AL_Ghadeer_logo} alt="" className="w-100 mobImg" loading="lazy" />
                  </picture>
                </div>
                <div className="loadingTxt text-center">
                  <div className="txtSummary f-s-20">
                    Loading...
                  </div>
                </div>
              </div>
            </div>
          ) : (
              <LanguageProvider>
            <DataContext.Provider value={{ data, setData }}>
              <Layout>
                <Routes>
                <Route path="/samsung" element={<SamsungPage />} />
                  <Route path="/"element={<Homepage />} />
                  <Route path="/dashboard" element={<Dasboard />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blogdetails" element={<BlogDetails />} />
                  <Route path="/accountdetails" element={<AccountDetails />} />
                  <Route path="/dashboardnav" element={<DashboardNav />} />
                  <Route path="/orderlist" element={<OrderList />} />
                  <Route path="/address" element={<Address />} />
                  <Route path="/contactus" element={<ContactUs />} />
                  <Route path="/aboutus" element={<AboutUs />} />
                  <Route path="/whatweoffer" element={<WhatweOffer />} />
                  <Route path="/ourstory" element={<OurStory />} />
                  <Route path="/ourhistory" element={<OurHistory />} />
                  <Route path="/ourpeople" element={<OurPeople />} />
                  <Route path="/howwework" element={<HowWework />} />
                  <Route path="/orderdetails/:id" element={<OrderDetails />} />
                  <Route path="/paymentcallback" element={<PaymentCallback />} />
                  <Route path="/ourproduct/:categoryNameE/:ProductNameE/:id" element={<OurProduct />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/cartpage" element={<CartPage />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/ourCrafts" element={<OurCrafts />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/password" element={<Password />} />
                  <Route path="/Contribute" element={<Contribute />} />
                  <Route path="/ourproductlisting" element={<OurProductlisting />}  />
                  <Route path="/forgotpass" element={<Forgotpass />} />
                  <Route path="/termscondition" element={<TermsCondition />} />
                  <Route path="/privacypolicy" element={<Privacypolicy />} />
                  <Route path="/joinus" element={<Joinus />} />
                  <Route path="/workshops" element={<Workshops />} />
                  <Route path="/eventsServices" element={<EventsServices />} />
                  <Route path="/whoweare" element={<Whoweare />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/newsdetails/:id"element={<NewsDetails />}/>
                  <Route path="/checkoutGuest"element={<CheckoutGuest />}/>


 
                  <Route path="*" element={<NotFound />} />
 
                </Routes>
              </Layout>
            </DataContext.Provider>
              </LanguageProvider>
 
          )}
        </div>
      </div>
    </Router>
  );
};
 
export default App;