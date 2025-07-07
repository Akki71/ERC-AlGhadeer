import add_to_cart_icon from "../assets/images/add-to-cart-icon.png";
import add_to_wishlist_icon from "../assets/images/add-to-wishlist-icon.png";
import React, { Fragment, memo, useState, useEffect, useContext } from "react";
import axiosInstance from "../axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { ToastContainer, toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import BASE_PATH from "../serviceurls";
import handleAddToCart from "../utils/cartUtils";
import handleAddToWishlist from "../utils/wishlistUtils";
import GetProducts from "../utils/GetProducts";
import { DataContext } from "../utils/ApiContext";
import Loader from "./Loader";
import GuestLogin from "../GustLogin/GuestLogin";
import { useLanguage } from "../redux/LanguageContext";
import DUMMY from "../assets/images/noimage.jpg";

function HomeRelatedProducts() {
  const [isWishlist, setIsWishlist] = useState(false);
  const [mainProducts, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeWishlistProducts, setActiveWishlistProducts] = useState([]);
  const tokenlogin = localStorage.getItem("loginToken");
  const UserID = localStorage.getItem("UserID");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [number, setnumber] = useState(1);
  const [visibleProducts, setVisibleProducts] = useState(8);

  const handleLoadMore = () => {
    navigate("/ourproductlisting");
    // setnumber(number + 1);
    // setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 4);
  };
  const { language } = useLanguage();

  const fetchWishlistData = async () => {
    const apiUrl = `${BASE_PATH}Wishlist/GetWishlistByUserId/${UserID}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${tokenlogin}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    }
  };
  var settings = {
    infinite: true,
    slidesToShow: 4,
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
          arrows: false,
          dots: true,
        },
      },
    ],
  };
  useEffect(() => {
    const loadWishlistData = async () => {
      const wishlistData = await fetchWishlistData();
      if (wishlistData) {
        const wishlistProductIds = wishlistData.map((item) => item.ProductId);
        setActiveWishlistProducts(wishlistProductIds);
      }
    };
    loadWishlistData();
  }, []);

  const handleAddToWishlistAndUpdate = async (
    ProductId,
    SubCategoryId,
    CategoryId,
    UserID,
    tokenlogin,
    language,
    navigate,
    toast
  ) => {
    await handleAddToWishlist(
      ProductId,
      SubCategoryId,
      CategoryId,
      UserID,
      tokenlogin,
      language,
      navigate,
      toast,
      setActiveWishlistProducts, // Pass setActiveWishlistProducts
      setIsWishlist // Pass setIsWishlist
    );
  };
  const [imagePaths, setImagePaths] = useState([]);

  useEffect(() => {
    if (mainProducts.length > 0) {
      const newImagePaths = {};
      mainProducts.forEach((product) => {
        const productColors = JSON.parse(
          product.ProductSizeList[0].ProductColors || "[]"
        );
        newImagePaths[product.ProductId] = productColors
          .map((color) => {
            const productImages = JSON.parse(color.ProductImagePath || "[]");
            const srNo1Image = productImages.find((image) => image.SrNo === 1);
            return srNo1Image ? srNo1Image.ImagePath : null;
          })
          .filter(Boolean); // Filter out null values
      });
      setImagePaths(newImagePaths);
    }
  }, [mainProducts]);
  const importProductImage = (ProductId, format = "PNG") => {
    const basePath = `${BASE_PATH}Images/Product/images/products/`;

    const imageUrl = `${basePath}${ProductId}/1.${format.toLowerCase()}`; // Assuming format is provided without a leading

    return imageUrl;
  };

  const importProductImageWrapper = (ProductId, format) => {
    try {
      return importProductImage(ProductId, format);
    } catch (error) {
      // console.error(`Error loading image for product ${ProductId}:`, error);
      // Provide a default image URL if loading fails
      return `${BASE_PATH}Images/Product/images/products/default.png`;
    }
  };

  const { data, setData } = useContext(DataContext);

  const updateData = async () => {
    if (!UserID) {
      const products = JSON.parse(localStorage.getItem("guestProduct")) || [];
      setData(products.length);
      // console.log(products.length);
    } else {
      try {
        const cartApiUrl = `${BASE_PATH}Order/GetAllUserOrdersInCartByUserId?userId=${UserID}`;

        const response = await fetch(cartApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenlogin}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const cartData = await response.json();
        setData(cartData.length);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    }
  };
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      // console.error('Token not found.');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_PATH}Product/GetAllBestSellerProducts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });
    
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
    
        const data = await response.json();
        console.log("ALL PRODUCTS:", data);
    
      
        const bestSellers = data.filter(product => product.IsBestSeller === true);
        console.log("BESTSELLER PRODUCTS:", bestSellers);
    
        setProducts(bestSellers); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    

    fetchProducts();
  }, [token, setProducts]);
  const [CartProduct, setCartProduct] = useState([]);
  const [activeCartProducts, setActiveCartProducts] = useState([]);
  const fetchUserOrdersAndCheckQuantity = async () => {
    const apiUrl = `${BASE_PATH}Order/GetAllUserOrdersInCartByUserId?userId=${UserID}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${tokenlogin}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // console.log('Wishlist Data:', data);
      return data; // Return the wishlist data
    } catch (error) {
      // console.error('Error fetching wishlist data:', error);
    }
  };
  useEffect(() => {
    fetchUserOrdersAndCheckQuantity();
  }, []);
  useEffect(() => {
    const loadCartData = async () => {
      const CartData = await fetchUserOrdersAndCheckQuantity();
      // console.log(CartData);
      if (CartData) {
        setCartProduct(CartData.map((item) => item.OrderId));
        const CartproductId = CartData.map((item) => item.ProductId);
        // console.log(CartproductId);
        setActiveCartProducts(CartproductId);
      }
    };
    loadCartData();
  }, []);
  const formatUrlSegment = (str) => {
    return str.toLowerCase().replace(/\s+/g, "-");
  };
  return (
    <Fragment>
      <>
        {loading ? (
          <div>
            <div>
              <Loader />
            </div>
          </div>
        ) : (
          <div className="most-likeSlider erc-cst-clider">
            <div className="row">
              {mainProducts.map((product) => (

                <div
                  className="col-sm-6 col-md-6 col-lg-3"
                  key={product.ProductId}
                >
                  <div
                    className="productBx mrg-b-30"
                    data-aos="fade-up"
                    data-aos-delay={100}
                  >
                    <div className="product-img position-relative">
                      <div className="product-imgInn">
                        <picture className="w-100 d-block">
                          <a
                            href={`/OurProduct/${formatUrlSegment(
                              product.CategoryNameE
                            )}/${formatUrlSegment(product.ProductNameE)}/${
                              product.ProductId
                            }`}
                          >
                            <img
                              decoding="async"
                              alt={product.ProductId}
                              // onMouseOver={() => console.log(typeof (id))}

                              src={
                                imagePaths[product.ProductId]
                                  ? imagePaths[product.ProductId][0]
                                  : DUMMY
                              }
                              className="w-100 objCvr mobImg"
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = `${BASE_PATH}Images/Product/images/products/default.pn`;
                              }}
                            />
                          </a>
                        </picture>
                      </div>
                    </div>
                    <div className="productTitle_wrp text-center mrg-b-20">
                      <div className="productTitle font-Lyon">
                        <a
                          href={`/OurProduct/${formatUrlSegment(
                            product.CategoryNameE
                          )}/${formatUrlSegment(product.ProductNameE)}/${
                            product.ProductId
                          }`}
                          className=""
                        >
                          {language === "en"
                            ? product.ProductNameE
                            : product.ProductNameA}
                        </a>{" "}
                      </div>
                      <div className="productTitle">
                        AED {product.ProductSizeList[0].ProductPrice}
                      </div>
                    </div>
                    <div className="productWrap_btns text-center">
                      <ul className="productWrap_btns_list mb-0">
                        <li className="list-inline-item">
                          <a
                            href={`/OurProduct/${formatUrlSegment(
                              product.CategoryNameE
                            )}/${formatUrlSegment(product.ProductNameE)}/${
                              product.ProductId
                            }`}
                            className="learnMore_btn"
                          >
                            {language === "en"
                              ? "Learn More"
                              : "تعرف على المزيد"}
                          </a>
                        </li>
                        <li className="list-inline-item">
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip>
                                {language === "en"
                                  ? "Add to Wishlist"
                                  : "أضف إلى قائمة الأمنيات"}
                              </Tooltip>
                            }
                          >
                            <Link
                              className={`addTo-wishlist ${
                                activeWishlistProducts.includes(
                                  product.ProductId
                                )
                                  ? "active_wishlist"
                                  : ""
                              }`}
                              onClick={() =>
                                handleAddToWishlistAndUpdate(
                                  product.ProductId,
                                  product.SubCategoryId,
                                  product.CategoryId,
                                  UserID,
                                  tokenlogin,
                                  language,
                                  navigate,
                                  toast
                                )
                              }
                              data-bs-toggle="tooltip"
                              data-bs-title="Add to Wishlist"
                            >
                              <img
                                decoding="async"
                                src={add_to_wishlist_icon}
                                className="w-100 objCvr mobImg"
                                loading="lazy"
                              />
                            </Link>
                          </OverlayTrigger>
                        </li>
                        <li className="list-inline-item">
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip>
                                {language === "en"
                                  ? "Add to Cart"
                                  : "أضف إلى السلة "}
                              </Tooltip>
                            }
                          >
                            <Link
                              to={`/OurProduct/${formatUrlSegment(
                                product.CategoryNameE
                              )}/${formatUrlSegment(product.ProductNameE)}/${
                                product.ProductId
                              }`}
                              className="addTo-cart"
                              data-bs-toggle="tooltip"
                              data-bs-title="Add to Cart"
                            >
                              <img
                                decoding="async"
                                src={add_to_cart_icon}
                                className="w-100 objCvr mobImg"
                                loading="lazy"
                              />
                            </Link>
                          </OverlayTrigger>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className=" text-center">
              {/* {number < parseInt(mainProducts.length / 4) && ( */}
                <button className="loadmore-button " onClick={handleLoadMore}>
                  {/* {language === "en"
  ? " Load more "
  : "  تحميل المزيد "} */}
                  {language === "en" ? " Shop Now" : " تسوق الآن "}
                </button>
              {/* )} */}
            </div>
          </div>
        )}
      </>
    </Fragment>
  );
}

export default memo(HomeRelatedProducts);
