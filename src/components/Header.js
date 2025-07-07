import React, { useEffect, useState, useContext } from "react";
import AL_Ghadeer_main_logo from "../assets/images/AL-Ghadeer-main-logo.png";
import AL_Ghadeer_logo from "../assets/images/AL-Ghadeer-logo.png";
import footer_logo from "../assets/images/footer-logo.png";
import emirates_red_logo from "../assets/images/emirates-red-logo.png";
import { Link, useNavigate } from "react-router-dom";
import handleClick from "./links";
// import TokenPage from "../utils/TokenPage";
import BASE_PATH from "../serviceurls";
import { DataContext } from "../utils/ApiContext";
import TokenPage from "../utils/TokenPage";
import { ToastContainer, toast } from "react-toastify";
import { useLanguage } from "../redux/LanguageContext";
const Header = () => {
  const data = useContext(DataContext);
  const [getToken, setGetToken] = useState(localStorage.getItem("token"));
  const { data1, setData } = useContext(DataContext);
  // console.log(data);
  const { language, switchLanguage } = useLanguage();
  const UserID = localStorage.getItem("UserID");
  const tokenlogin = localStorage.getItem("loginToken");
  const [showicon, setshowicon] = useState(false);

  useEffect(() => {
    updateData();
    const handleScroll = () => {
      if (window.scrollY > 0) {
        document.querySelector("header").classList.add("fixed_header");
      } else {
        document.querySelector("header").classList.remove("fixed_header");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // const counter = useCounter((state) => state.counter);
  // console.log("counter", counter);


  const [show, setShow] = useState(false);
  const showSidebar = () => {
    setShow(false);
    setshowicon(false);

    // setclassforNavbar(false)
  };
  const handleToggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    switchLanguage(newLanguage);
  };
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();
 
  const fetchUserDetails = async () => {
    try {
      const apiUrlUser = `${BASE_PATH}Security/GetUserById?id=${UserID}`;

      const response = await fetch(apiUrlUser, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenlogin}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        if (userData.FirstName) {
          setFirstName(userData.FirstName);
        } else {
          // setFirstName();

          setTimeout(() => {
            navigate("/login")
          }, 3000);
        }
      } else {
        // console.error("Error fetching user details:", response.statusText);
      }
    } catch (error) {
      // console.error("An error occurred during fetch:", error);
    }
  };

  //useEffect(()=>{setShow(false)},[])

  // const handleClick = () => {
  //   // Get the body element
  //   const body = document.body;

  //   if (
  //     document.URL ===
  //     "http://localhost:3000/AlGhadeer_Emirati_Crafts_erc/en" ||
  //     document.URL ===
  //     "http://localhost:3000/AlGhadeer_Emirati_Crafts_erc/en/" ||
  //     document.URL ===
  //     "http://localhost:3000/AlGhadeer_Emirati_Crafts_erc/ar/" ||
  //     document.URL === "http://localhost:3000/AlGhadeer_Emirati_Crafts_erc/ar"
  //   ) {
  //     body.classList.add("home-pg");
  //     body.classList.remove("sub-page");
  //   } else {
  //     body.classList.remove("home-pg");
  //     body.classList.add("sub-page");
  //   }
  // };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // const handleLinkClick = () => {
  //   closeDropdown(); // Close dropdown when a link is clicked
  // };
  const [innavDiv, setinnavDiv] = useState(false);
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownMenuOpen(!isDropdownOpen);
  };

  const handleDropdownClose = () => {
    setIsDropdownMenuOpen(false);
  };
 
  const updateData = async () => {
    if (!UserID) {
      const products = JSON.parse(localStorage.getItem("guestProduct")) || [];
      setData(products.length);
      // console.log(products.length);
    }
    try {
      const cartApiUrl = `${BASE_PATH}Order/GetAllUserOrdersInCartByUserId?userId=${UserID}`;
      const [cartResponse] = await Promise.all([
        fetch(cartApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenlogin}`,
          },
        }),
      ]);

      if (!cartResponse.ok) {
        throw new Error(`HTTP error! Status: ${cartResponse.status}`);
      }

      const cartData = await cartResponse.json();
      // console.log("cartData", cartData);

      setData(cartData.length); // Assuming setData is defined elsewhere
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };
  return (
    <>
      {/* <ToastContainer/>  */}
      <TokenPage setGetToken={setGetToken} />

      <header className="header ">
        <nav className="main-nav navbar navbar-expand-lg">
          <div className="full-container container">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded={showicon}
              aria-label="Toggle navigation"
              // onClick={() => setShow(!show)}
              onClick={(e) => {
                setShow(!show);
                handleDropdownToggle();
                setshowicon(!showicon);
              }}
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <Link
              to="/"
              className="navbar-brand cstNavbar d-lg-none logoCentered"
            >
              <img
                decoding="async"
                src={AL_Ghadeer_main_logo}
                className="w-100 deskImg"
                loading="lazy"
              />
              <img
                decoding="async"
                src={AL_Ghadeer_logo}
                className="w-100 mobImg"
                loading="lazy"
              />{" "}
            </Link>

            {/* <div>
      {showMessage && <p>Count has increased!</p>}
 
    </div> */}
            <div
              id="navbarNav"
              className={`collapse navbar-collapse ${show ? "show" : ""}`}
            >
              <div className="navMng-In d-lg-flex justify-content-between w-100">
                <ul className="list-inline mb-0 brderMobile px-0">
                  <li
                    className="nav-item dropdown"
                    onMouseLeave={toggleDropdown}
                  >
                    <a
                      className="nav-link dropdown-toggle"
                      id="navbarDropdownMenuLink"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      onClick={() => {
                        // toggleDropdown();
                        setinnavDiv(!innavDiv);
                      }}
                    >
                      {language === "en" ? "  Our Story" : "قصتنا"}
                    </a>
                    <ul
                      className={`dropdown-menu ${innavDiv ? "show" : ""}`}
                      aria-labelledby="navbarDropdownMenuLink"
                      // onClick={handleDropdownCloseshowSidebar}
                      onMouseLeave={(e) => {
                        setinnavDiv(false);

                        handleDropdownClose();
                        handleClick();
                        fetchUserDetails();
                      }}
                    >
                      {/* <li>
                        <Link
                          to="/ourstory"
                          onClick={(e) => {
                            showSidebar();
                            setinnavDiv(!innavDiv);
                          }}
                          className="dropdown-item f-w-M "
                        >
                          {language === "en"
                            ? "    Our Story"
                            : "  قصتنا "}
                        </Link>
                      </li> */}

                      <li>
                        <Link
                          to="/aboutus"
                          onClick={(e) => {
                            showSidebar();
                            setinnavDiv(!innavDiv);
                          }}
                          className="dropdown-item f-w-M"
                        >
                          {language === "en" ? "About us" : "من نحن"}
                        </Link>
                      </li>
                      {/* <li>
                        {language === "en" ? (
                          <Link
                            to="/howwework/en"
                            onClick={(e) => {
                              showSidebar();
                              handleClick();
                              setinnavDiv(!innavDiv);
                            }}
                            className="dropdown-item f-w-M"
                          >
                            How we Work
                          </Link>
                        ) : (
                          <Link
                            to="/howwework/ar"
                            onClick={(e) => {
                              showSidebar();
                              handleClick();
                              setinnavDiv(!innavDiv);
                            }}
                            className="dropdown-item f-w-M"
                          >
                            كيف نعمل
                          </Link>
                        )}
                      </li> */}
                      {/* <li>

                        <Link
                          to="/blog"
                          onClick={(e) => {
                            showSidebar();
                            handleClick();
                            setinnavDiv(!innavDiv);
                          }}
                          className="dropdown-item f-w-M"
                        >
                          {language === "en" ? "Artisan Stories" : " قصص الحرفيين"}



                        </Link>



                      </li> */}

                      <li>

                        {/* <Link
                          to="/whatweoffer"
                          onClick={(e) => {
                            showSidebar();
                            handleClick();
                            setinnavDiv(!innavDiv);
                          }}
                          className="dropdown-item f-w-M"
 
                        >
 
                          {language === "en" ? " What we Offer" : "    ماذا نقدم "}
 
 
                        </Link> */}

                      </li>
                      {/* <li>
                        {language === "en" ? (
                          <Link
                            to="/ourhistory/en"
                            className="dropdown-item f-w-M"
                            onClick={(e) => {
                              showSidebar();
                              handleClick();
                              setinnavDiv(!innavDiv);
                            }}
                          >
                            Our History
                          </Link>
                        ) : (
                          <Link
                            to="/ourhistory/ar"
                            className="dropdown-item f-w-M"
                            onClick={(e) => {
                              showSidebar();
                              handleClick();
                              setinnavDiv(!innavDiv);
                            }}
                          >
                            تاريخنا
                          </Link>
                        )}
                      </li> */}

                      {/* <li>
                        {language === "en" ? (
                          <Link
                            to="/ourpeople/en"
                            onClick={(e) => {
                              showSidebar();
                              setinnavDiv(!innavDiv);
                              handleClick();
                            }}
                            className="dropdown-item f-w-M"
                          >
                            Our People
                          </Link>
                        ) : (
                          <Link
                            to="/ourpeople/ar"
                            onClick={(e) => {
                              showSidebar();
                              handleClick();
                              setinnavDiv(!innavDiv);
                            }}
                            className="dropdown-item f-w-M"
                          >
                            شعبنا
                          </Link>
                        )}
                      </li> */}
                      {/* <li>

                        <Link
                          to="/whoweare"
                          onClick={(e) => {
                            showSidebar();
                            handleClick();
                            setinnavDiv(!innavDiv);
                          }}
                          className="dropdown-item f-w-M"
                        >
                          {language === "en" ? "Who we are" : "    من نحن  "}



                        </Link>



                      </li> */}
                      <li>
                        <Link
                          to="/workshops"
                          onClick={(e) => {
                            showSidebar();
                            setinnavDiv(!innavDiv);
                            handleClick();
                          }}
                          className="dropdown-item f-w-M"
                        >
                          {language === "en"
                            ? " Workshops"
                            : " ورش عمل  "}
                        </Link>
                      </li>


                      <li>
                        <Link
                          to="/eventsServices"
                          onClick={(e) => {
                            showSidebar();
                            setinnavDiv(!innavDiv);
                            handleClick();
                          }}
                          className="dropdown-item f-w-M"
                        >
                          {language === "en"
                            ? "  Events Services"
                            : "  خدمات الفعاليات "}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/joinus"
                          onClick={(e) => {
                            showSidebar();
                            setinnavDiv(!innavDiv);
                            handleClick();
                          }}
                          className="dropdown-item f-w-M"
                        >
                          {language === "en"
                            ? " Be part of AlGhadeer community"
                            : "    كن جزءاً من مجتمعنا "}
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/ourproductlisting "
                      onClick={(e) => {
                        showSidebar();
                        handleClick();
                        fetchUserDetails();
                      }}
                      className="nav-link"
                    >
                      {language === "en"
                        ? " Our Products"
                        : "منتجاتنا "}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/ourcrafts"
                      aria-controls="navbarNav"
                      onClick={(e) => {
                        showSidebar();
                        handleClick();
                        fetchUserDetails();
                      }}
                      aria-expanded="false"
                      aria-label="Toggle navigation"
                      className="nav-link"
                    >
                      {/* {language === "en"
                        ? " Our Crafts"
                        : "أعمالنا الحرفية "} */}
                       
{language === "en"
                          ? "Emirati Crafts"
                          : " الحرف الإماراتية    "}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/news"
                      aria-controls="navbarNav"
                      onClick={(e) => {
                        showSidebar();
                        handleClick();
                        fetchUserDetails();
                      }}
                      aria-expanded="false"
                      aria-label="Toggle navigation"
                      className="nav-link"
                    >
                      {language === "en"
                        ? "  News "
                        : "الأخبار  "}
                    </Link>
                  </li>
                </ul>
                <ul
                  className="logoWrap d-none d-lg-block "
                  onClick={(e) => {
                    fetchUserDetails();
                    handleClick();
                  }}
                >
                  <Link to="/" className="navbar-brand cstNavbar logoCentered">
                    <img
                      decoding="async"
                      src={AL_Ghadeer_main_logo}
                      className="w-100 homepage"
                      loading="lazy"
                    />
                    <img
                      decoding="async"
                      src={AL_Ghadeer_logo}
                      className="w-100 otherPage"
                      loading="lazy"
                    />
                  </Link>
                </ul>
                <ul
                  className="list-inline mb-0 text-md-right px-0"
                  onClick={(e) => {
                    showSidebar();
                    handleClick();
                    fetchUserDetails();
                  }}
                >
                  <li
                    className="nav-item"
                    onClick={(e) => {
                      fetchUserDetails();
                    }}
                  >
                    <Link to="/dashboard " className="nav-link">
                      {language === "en"
                        ? UserID && tokenlogin
                          ? "Dashboard"
                          : "Login"
                        : UserID && tokenlogin
                          ? "لوحة الحساب"
                          : "تسجيل الدخول"}


                    </Link>
                  </li>
                  <li className="nav-item"
                    onClick={(e) => { fetchUserDetails(); }}
                  >

<Link to="/cartpage" className="nav-link" >
                    {/* {language === "en" ? "Bag" : "سلة التسوق "} ({data.data}) */}
                    {language === "en" ? "My Cart" : "My Cart  "} ({data.data})
 
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      to="/favorites "
                      className="nav-link"
                      onClick={(e) => {
                        fetchUserDetails();
                      }}
                    >
                      {language === "en" ? "Favorites" : "المفضل لدينا  "}
                    </Link>
                  </li>
                </ul>
                <ul className="list-inline px-0 mb-0 d-block d-lg-none text-center">
                  <li className="list-block-item">
                    <div className="menuLogo_1">
                      <img src={emirates_red_logo} className="w-100" />
                    </div>
                  </li>
                  <li className="list-block-item">
                    <div className="menuTxt text-center">
                      {language === "en"
                        ? "  An Initiative by  the Emirates Red Crescent"
                        : "مبادرة من الهلال الأحمر الإماراتي"}
                    </div>
                  </li>
                  <li className="list-block-item">
                    <div className="menuLogo_2">
                      <img src={footer_logo} className="w-100" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="langaugeRight_sec">
              <ul className="list-inline mb-0 px-0">
                <li className="list-inline-item">
                  <div className="langaugeList">
                    {/* <select
                      value={language}
                      onChange={handleLanguageChange}
                    >
                      <option className="langaugeListO" value="en">
                        English
                      </option>
                      <option className="langaugeListO" value="ar">
                        العربية
                      </option>
                    </select> */}
                    <button className="nav-link" onClick={handleToggleLanguage}>
                      {language === 'en' ? 'العربية' : 'English'}
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );

};

export default Header;
