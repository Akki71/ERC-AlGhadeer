import React, { useEffect, useState, useContext } from "react";
import img1 from "../assets/images/product-img-6.png";
import add_to_cart_icon from "../assets/images/add-to-cart-icon.png";
import add_to_wishlist_icon from "../assets/images/added-in-favorites.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import handleAddToCart from '../utils/cartUtils';
import BASE_PATH from "../serviceurls";
import AL_Ghadeer_logo from "../assets/images/AL-Ghadeer-logo.png";
import { DataContext } from "../utils/ApiContext";
import Loader from "../components/Loader"; // Import your loader component
import { useLanguage } from '../redux/LanguageContext';
import { Link, useNavigate } from "react-router-dom";
import OurCrafts from "./OurCrafts";
const Favorites = () => {
  const [wishlistData, setWishlistData] = useState([]);

const { language} = useLanguage();
  const quantitya = "1";

  const navigate = useNavigate();
  const UserID = localStorage.getItem("UserID");
  const tokenlogin = localStorage.getItem("loginToken");
  const fetchWishlistData = async () => {
    if (!UserID) {
      localStorage.removeItem("loginToken");
      localStorage.removeItem("UserID");
      setTimeout(() => {
      navigate("/login")
      }, 0);
      return;
    }
    const apiUrl = `${BASE_PATH}Wishlist/GetWishlistByUserId/${UserID}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${tokenlogin}`,
        },
      });
      if (response.status === 401) {
        localStorage.removeItem("loginToken");
        localStorage.removeItem("UserID");
        // Unauthorized or Bad Request - Redirect to login page or handle the error accordingly
        setTimeout(() => {

       navigate("/login")
        }, 100);
      } else if (!response.ok) {
        // Handle other error cases
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // console.log(data);

      const activeProducts = data.filter((item) => item.IsProductActive);
      const transformedData = activeProducts.map((item) => ({
        ProductId: item.ProductId,
        CategoryId: item.CategoryId,
        SubCategoryId: item.SubCategoryId,
        OrderPrice: item.OrderPrice,
        ProductPrice: item.ProductSizeList[0].ProductPrice,
        ProductSizeId: item.ProductSizeList[0].ProductSizeId,
        CategoryNameE: item.CategoryNameE,
        CategoryNameA: item.CategoryNameA,
        ProductNameE: item.ProductNameE,
        ProductNameA: item.ProductNameA,
        WishlistId: item.WishlistId,
        UserID: UserID,
        SubCategoryId: item.SubCategoryId,
      }));

      // console.log("Transformed Wishlist Data:", transformedData);
      setWishlistData(transformedData);
      setLoader(false);

      // Now you can use the transformed data as needed in your React component state or perform any other actions.
    } catch (error) {
      // console.error('Error fetching wishlist data:', error);
      // localStorage.removeItem("loginToken");
      // localStorage.removeItem("UserID");
      navigate("/login")
    }
  };

  useEffect(() => {
    // Call the function to fetch wishlist data
    fetchWishlistData();
    // console.log(wishlistData);
  }, []);

  const importProductImage = (ProductId, format = "PNG") => {
    const apiUrl = `${BASE_PATH}Wishlist/GetWishlistByUserId/${UserID}`;

    const basePath = `${BASE_PATH}Images/Product/images/products/`;
    const imageUrl = `${basePath}${ProductId}/1.${format.toLowerCase()}`; // Assuming format is provided without a leading dot

    return imageUrl;
  };

  const importProductImageWrapper = (ProductId, format) => {
    try {
      return importProductImage(ProductId, format);
    } catch (error) {
      // console.error(`Error loading image for product ${ProductId}:`, error);
      return `${BASE_PATH}Images/Product/images/products/default.png`;
    }
  };

  const [userOrders, setUserOrders] = useState([]);

  const handleRemoveProduct = (WishlistId) => {
    // console.log(WishlistId);

    const updatedWishlistData = wishlistData.filter(
      (order) => order.WishlistId !== WishlistId
    );
    setWishlistData(updatedWishlistData);

    const apiUrl = `${BASE_PATH}Wishlist/RemoveWishlist?wishlistId=${WishlistId}`;
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenlogin}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("Product removed:", data);

        toast.success(
          language === "en"
            ? " Product removed from wishlist!"
            : "تمت إزالة المنتج من قائمة الأمنيات!"
        );
      })
      .catch((error) => {
        // console.error("Error removing order:", error);
      });
  };
  const { data, setData } = useContext(DataContext);
  const updateData = async () => {
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
      console.error("Error fetching data:", error);
    }
  };
  const formatUrlSegment = (str) => {
    return str.toLowerCase().replace(/\s+/g, '-');
  };
  // const handleAddToCart = async (product) => {

      // console.log("Adding to Cart - Product Details:", product);

  //     const apiUrl = `${BASE_PATH}Order/AddOrderInCart`;

  //     const requestOptions = {
  //         method: "POST",
  //         headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${tokenlogin}`,
  //         },
  //         body: JSON.stringify({
  //             ProductId: product.ProductId, // Adjust property name if needed
  //             CategoryId: product.CategoryId, // Adjust property name if needed
  //             SubCategoryId: product.SubCategoryId,
  //             UserId: UserID,
  //             OrderPrice: product.OrderPrice,
  //             Units: 1, // You might adjust this based on the actual quantity selected by the user
  //             TotalAmount: product.OrderPrice * 1, // You might adjust this based on the actual quantity selected by the user
  //             Status: "",

  //         }),
  //     };

  //     try {
  //         const response = await fetch(apiUrl, requestOptions);
  //         const data = await response.json();
  //         console.log("Add to Cart Response:", data);
  //         toast.success(language === "en" ? "Product added to cart successfully!" : "تمت إضافة المنتج إلى سلة التسوق بنجاح!");

  //         // Redirect to the cart page after adding to cart
  //         const productDetails = {
  //             productNameE: product.productNameE,
  //             productNameA: product.productNameA,
  //             subCategoryNameE: product.subCategoryNameE,
  //             subCategoryNameA: product.subCategoryNameA,
  //             OrderPrice: product.OrderPrice,
  //             ProductId: product.ProductId,
  //             CategoryID: product.categoryID,
  //             subCategoryID: product.subCategoryID,
  //             quantitypro: 1, // You might adjust this based on the actual quantity selected by the user
  //         };

  //         const updatedProductDetails = { ...productDetails, OrderId: data.OrderId, UserID: data.UserId };

  //         // navigate("/cartpage/en", { state: { productDetails: updatedProductDetails } });
  //     } catch (error) {
  //         console.error("Error adding to cart:", error);
  //         toast.error(language === "en" ? "Failed to add the product to the cart." : " لم نستطع إضافة المنتج إلى سلة التسوق.");

  //         localStorage.removeItem("loginToken");
  //         localStorage.removeItem("UserID");
  //         language === "en" ?
  //             navigate("/login/en") :
  //             navigate("/login/ar");
  //     }
  // };
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [loaderFirst, setLoader] = useState(true);

  useEffect(() => {
    if (showRedirectMessage) {
      // console.log("Redirect message is being shown");
      const timeoutId = setTimeout(() => {
        setShowRedirectMessage(false);
      }, 3000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [showRedirectMessage]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  // useEffect(() => {
  //     // Initialize tooltips
  //     const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  //     tooltipTriggerList.map(function (tooltipTriggerEl) {
  //       return new bootstrap.Tooltip(tooltipTriggerEl);
  //     });
  //   }, []);

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

  const handleAddToCart = async (
    product,
    quantitya,
    language,
    tokenlogin,
    UserID,
    navigate,
    toast,
    setActiveCartProducts
  ) => {
    // console.log(quantitya);
    // console.log(product);
    // console.log("Adding to Cart - Product Details:", product);
    try {
      // console.log("OrderQuantity", quantitya);

      const apiUrl = `${BASE_PATH}Order/AddOrderInCart`;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenlogin}`,
        },
        body: JSON.stringify({
          ProductId: product.ProductId,
          CategoryId: product.CategoryId,
          SubCategoryId: product.SubCategoryId,
          UserID: UserID,
          ProductSizeId: product.ProductSizeId,
          OrderPrice: product.ProductPrice,
          OrderQuantity: quantitya,
          TotalAmount: product.ProductPrice * 1,
          Status: "",
        }),
      };
      const response = await fetch(apiUrl, requestOptions);

      if (response.ok) {
        const data = await response.json();
        setActiveCartProducts((prevProducts) => [
          ...prevProducts,
          product.ProductId,
        ]);

        // console.log("Add to Cart Response:", data.ProductId);
        // existingProductIds.push(data.ProductId);
        // console.log("Add to Cart OrderQuantity:", data.OrderQuantity);

        // localStorage.setItem("Cart_Response", JSON.stringify(existingProductIds));

        toast.success(
          language === "en"
            ? "Product added to cart successfully!"
            : "تمت إضافة المنتج إلى سلة التسوق بنجاح!"
        );
        // useCounter.getState().incrCounter();
      } else if (response.status === 401) {
        localStorage.removeItem("loginToken");
        localStorage.removeItem("UserID");
        // Unauthorized or Bad Request - Redirect to login page or handle the error accordingly
        toast.error(
          language === "en"
            ? "Please Login to access your cart !"
            : "الرجاء تسجيل الدخول للوصول إلى سلة التسوق الخاصة بك!"
        );
        // setTimeout(() => {
        //     language === "en"
        //         ? navigate("/login/en")
        //         : navigate("/login/ar");
        // }, 3000);
      } else {
        // Handle other error cases
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        language === "en"
          ? "Failed to add the product to the cart."
          :"لم نستطع إضافة المنتج إلى سلة التسوق."
      );
    }
  };
  return (
    <>
      {loaderFirst ? (
        <div id="hola">
          <div id="preloader">
            <Loader />
          </div>
        </div>
      ) : (
        <div>
          <ToastContainer />
          <div className="home_section_two secBg pt-100">
            {showRedirectMessage && (
              <div className="f-s-20 d-flex h-100 align-items-center justify-content-center">
                {language === "en"
                  ? " User is not logged in. Redirecting to login page   "
                  : "لم يتم تسجيل دخول المستخدم. إعادة التوجيه إلى صفحة تسجيل الدخول"}
              </div>
            )}
            <div className="full-container container">
              <div className="row">
                <div className="col-md-12">
                  <div className="secTitle_wrap text-center mrg-b-30">
                    <div
                      className="sec_subTitle font-Lyon f-s-20"
                      data-aos="fade-up"
                      data-aos-delay={300}
                    >
                      {" "}
                      {language === "en"
                        ? "  Our Best Favorites "
                        : "أفضل مفضلاتنا "}
                    </div>
                    <div
                      className="secTitle f-s-30"
                      data-aos="fade-up"
                      data-aos-delay={600}
                    >
                      {language === "en" ? "Favorites" : "المنتجات المُفَضّلة"}
                    </div>
                    {wishlistData.length ? (
                      ""
                    ) : (
                      <div className="f-s-20 d-flex h-100 align-items-center justify-content-center">
                        <p>
                          {language === "en"
                            ? "No products in the Favorites."
                            : "لا توجد منتجات في المفضلة."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-8 col-xl-10">
                  <div className="row">
                    {wishlistData
                      .sort((a, b) => b.WishlistId - a.WishlistId) // Sort the array based on WishlistId in descending order
                      .map((order) => (
                        <div
                          className="col-sm-6 col-md-6 col-lg-4"
                          key={order.WishlistId}
                        >
                          <div
                            className="productBx mrg-b-30"
                            data-aos="fade-up"
                            data-aos-delay={800}
                          >
                            <div className="product-img position-relative">
                              <div className="product-imgInn">
                                <picture className="w-100 d-block">
                                  {language === "en" ? (
                                    <Link
                                      to={`/OurProduct/${formatUrlSegment(order.CategoryNameE)}/${formatUrlSegment(order.ProductNameE)}/${order.ProductId}`}
                                    >
                                      <img
                                        decoding="async"
                                        alt={order.ProductId}
                                        src={importProductImageWrapper(
                                          order.ProductId
                                        )}
                                        className="w-100 objCvr mobImg"
                                        loading="lazy"
                                        // onLoad={() => console.log(`Image loaded for ProductId: ${order.ProductId}`)}
                                        onError={(e) => {
                                          // console.error(`Error loading image for ProductId: ${order.ProductId}`, e);
                                          e.target.src = `${BASE_PATH}Images/Product/images/products/default.png`; // Set default image
                                        }}
                                      />
                                    </Link>
                                  ) : (
                                    <Link
                                      to={`/OurProduct/${order.CategoryNameE}/${order.ProductId}/ar`}
                                    >
                                      <img
                                        decoding="async"
                                        alt={order.ProductId}
                                        src={importProductImageWrapper(
                                          order.ProductId
                                        )}
                                        className="w-100 objCvr mobImg"
                                        loading="lazy"
                                        // onLoad={() => console.log(`Image loaded for ProductId: ${order.ProductId}`)}
                                        onError={(e) => {
                                          // console.error(`Error loading image for ProductId: ${order.ProductId}`, e);
                                          e.target.src = `${BASE_PATH}Images/Product/images/products/default.png`; // Set default image
                                        }}
                                      />
                                    </Link>
                                  )}
                                </picture>
                              </div>
                            </div>
                            <div className="productTitle_wrp text-center mrg-b-20">
                              <div className="productTitle font-Lyon">
                           
                                  <Link
                                    to={`/OurProduct/${formatUrlSegment(order.CategoryNameE)}/${formatUrlSegment(order.ProductNameE)}/${order.ProductId}`}
                                    className=""
                                  >
                                     {language === "en"
                                          ? order.ProductNameE
                                          : order.ProductNameA
                                          }
                                    
                                  </Link>
                     
                          
                              </div>

                              <div className="productTitle">
                              
                                AED {order.ProductPrice}
                                
                              </div>
                            </div>
                            <div className="productWrap_btns text-center">
                              <ul className="productWrap_btns_list mb-0">
                                <li className="list-inline-item">
                        
                                    <Link
                                      to={`/OurProduct/${formatUrlSegment(order.CategoryNameE)}/${formatUrlSegment(order.ProductNameE)}/${order.ProductId}`}
                                      className="learnMore_btn"
                                    >
                                     

                                      {language === "en"
                                          ? "  Learn More "
                                          : "  تعرف على المزيد   "}
                                    </Link>
                                
                                </li>
                                <li className="list-inline-item">
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip>
                                        {language === "en"
                                          ? "Remove from Wishlist"
                                          : "إزالة من قائمة الأمنيات"}
                                      </Tooltip>
                                    }
                                  >
                                    <Link
                                      onClick={() =>
                                        handleRemoveProduct(order.WishlistId)
                                      }
                                      className="addTo-wishlist"
                                    >
                                      <picture className="w-100 d-block">
                                        <source
                                          srcSet={add_to_wishlist_icon}
                                          media="(min-width: 768px)"
                                          className="w-100 objCvr deskImg "
                                        />
                                        <img
                                          decoding="async"
                                          src={add_to_wishlist_icon}
                                          className="w-100 objCvr mobImg "
                                          loading="lazy"
                                        />
                                      </picture>
                                    </Link>
                                  </OverlayTrigger>
                                </li>

                                <li className="list-inline-item">
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip>
                                        {" "}
                                        {language === "en"
                                          ? "Add to Cart "
                                          : "أضف إلى السلة"}
                                      </Tooltip>
                                    }
                                  >
                                    <Link
                                      // onClick={() => {
                                      //   // if (!activeCartProducts.includes(order.ProductId)) {

                                      //   handleAddToCart(
                                      //     order,
                                      //     quantitya,
                                      //     language,
                                      //     tokenlogin,
                                      //     UserID,
                                      //     navigate,
                                      //     toast,
                                      //     setActiveCartProducts
                                      //   );
                                      //   // setTimeout(() => {
                                      //   updateData();
                                      //   // }, 3000);
                                      //   // }
                                      //   // else {
                                      //   //     toast.success(language === "en" ? "Product already in Cart!" : "        منتج في سلة التسوق");

                                      //   // }
                                      // }}
                                      to={`/OurProduct/${formatUrlSegment(order.CategoryNameE)}/${formatUrlSegment(order.ProductNameE)}/${order.ProductId}`}
                                      className="addTo-cart"
                                    >
                                      <picture className="w-100 d-block">
                                        <source
                                          srcSet={add_to_cart_icon}
                                          media="(min-width: 768px)"
                                          className="w-100 objCvr deskImg"
                                        />
                                        <img
                                          decoding="async"
                                          src={add_to_cart_icon}
                                          className="w-100 objCvr mobImg"
                                          loading="lazy"
                                        />
                                      </picture>
                                    </Link>
                                  </OverlayTrigger>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Favorites;
