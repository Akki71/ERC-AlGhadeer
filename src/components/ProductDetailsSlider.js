import React, { Fragment, memo, useEffect, useState, useContext } from "react";
import Slider from "react-slick";
import { useParams, useNavigate, json } from "react-router-dom";
import minus_icon from "../assets/images/minus-icon.png";
import DUMMY from "../assets/images/noimage.jpg";
import { ToastContainer, toast } from 'react-toastify';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import handleAddToWishlist from '../utils/wishlistUtils';
import Loader from './Loader';
import { DataContext } from "../utils/ApiContext";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import BASE_PATH from '../serviceurls';
import DOMPurify from "dompurify";
import { useLanguage } from '../redux/LanguageContext';
function ProductsDetails() {
 
  const [mainProducts, setProducts] = useState([]);
  const [showimg, setShowimg] = useState(false)
  const navigate = useNavigate();
  const [loaderFirst, setLoader] = useState(true)
  const { language } = useLanguage();
  const [selectedColor, setSelectedColor] = useState();
  const [QuantityOfProduct, setQuantityOfProduct] = useState();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
 
  useEffect(() => {
 
    if (!token) {
      console.error('Token not found.');
      return;
    }
 
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_PATH}Product/GetAllProducts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*',
          },
        });
 
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
 
        const data = await response.json();
        setProducts(data);
        setLoading(false);
        setLoader(false);
 
        const product = data.find(product => product.ProductId.toString() === id);
//  console.log("product",product);
 
        if (product) {
          const firstSize = product.ProductSizeList[0];
         
 
          const Quantityfor = firstSize.Quantity
          setQuantityOfProduct(Quantityfor)
          if (firstSize && firstSize.ProductColors) {
            const parsedColors = JSON.parse(firstSize.ProductColors);
 
            // console.log(parsedColors);
 
            if (parsedColors.length > 0) {
              setColorData(parsedColors[0]);
              setSelectedColor(parsedColors[0].ProductColorId);
 
            }
 
          }
        }
 
 
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
        setLoader(false);
      }
    };
 
    fetchProducts();
  }, [token, setProducts]);
 
 
  const { id } = useParams();
 
  var settings = {
    infinite: true,
    arrows: false,
 
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 2000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
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
 
  const tokenlogin = localStorage.getItem('loginToken');
  const UserID = localStorage.getItem('UserID');
  const HandleAddToCart = async (product, quantitya, language, tokenlogin, UserID, colorData) => {
    // console.log(quantitya);
    // console.log(product);
    // console.log(colorData);
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
          ProductSizeId: product.ProductSizeList[selectedSizeIndex].ProductSizeId,
          OrderPrice: product.ProductSizeList[selectedSizeIndex].ProductPrice,
          OrderQuantity: quantitya,
          ProductColorOrdered: JSON.stringify(colorData),
          TotalAmount: product.ProductSizeList[selectedSizeIndex].ProductPrice * 1,
          Status: "Incart",
 
        }),
      };
      const response = await fetch(apiUrl, requestOptions);
 
      if (response.ok) {
        const data = await response.json();
        setActiveCartProducts(prevProducts => [...prevProducts, product.ProductId]);
 
        // console.log("Add to Cart Response:", data.ProductId);
        // console.log("Add to Cart OrderQuantity:", data.OrderQuantity);
 
        toast.success(
          language === "en"
            ? "Product added to cart successfully!"
            : "تمت إضافة المنتج إلى سلة التسوق بنجاح!"
        );
        // useCounter.getState().incrCounter();
      } else if (response.status === 401) {
        localStorage.removeItem("loginToken");
        localStorage.removeItem("UserID");
 
        toast.error(
          language === "en"
            ? "Please Login to access your cart !"
            : "الرجاء تسجيل الدخول للوصول إلى سلة التسوق الخاصة بك!"
        );
        setTimeout(() => {
          navigate("/login")
        }, 3000);
 
      } else {
        // Handle other error cases
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        language === "en"
          ? "Failed to add the product to the cart."
          : "لم نستطع إضافة المنتج إلى سلة التسوق."
      );
 
    }
 
  };
 
  const { data, setData } = useContext(DataContext);
  const handleCloseforQuantity = () => setshowModalforQuantity(false);
 
  const updateData = async () => {
    if (!UserID) {
      const products = JSON.parse(localStorage.getItem("guestProduct")) || [];
      setData(products.length)
      // console.log(products.length);
    } else {
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
        // console.log("cartData", cartData)
 
        setData(cartData.length); // Assuming setData is defined elsewhere
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
 
  const [quantitya, setQuantity] = useState(1);
  const handleQuantityChange = (newQuantity, Quantity) => {
 
    // console.log("new", Quantity, newQuantity);
    if (Quantity < newQuantity) {
      console.error("unexpected quantity");
 
    }
    if (Quantity >= newQuantity) {
      const updatedQuantity = Math.max(1, newQuantity);
 
      setQuantity(updatedQuantity);
    }
    else {
      handleShowforQuantity();
    }
 
  };
  const [showModalforQuantity, setshowModalforQuantity] = useState(false);
  const [activeCartProducts, setActiveCartProducts] = useState([]);
 
  // console.log(quantitya);
  const handleShowforQuantity = () => {
    setshowModalforQuantity(true)
    setTimeout(() => {
      setshowModalforQuantity(false);
    }, 2000);
  }
 
 
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeWishlistProducts, setActiveWishlistProducts] = useState([]);
 
 
  const fetchWishlistData = async () => {
  if (!UserID) {
      return
    }
    const apiUrl = `${BASE_PATH}Wishlist/GetWishlistByUserId/${UserID}`;
 
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${tokenlogin}`,
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
    const loadWishlistData = async () => {
      const wishlistData = await fetchWishlistData();
      if (wishlistData) {
        // Extract product IDs from the wishlist data
        const wishlistProductIds = wishlistData.map(item => item.ProductId);
        // Update the state to mark products in the wishlist as active
        setActiveWishlistProducts(wishlistProductIds);
      }
    };
 
    loadWishlistData();
  }, []);
  const [userOrders, setUserOrders] = useState([]);
  const GuestLogin = (product, colorData) => {
    // console.log(colorData);
 
    const productdetails = {
      ProductId: product.ProductId,
      CategoryId: product.CategoryId,
      SubCategoryId: product.SubCategoryId,
      CategoryNameE: product.CategoryNameE,
      SubCategoryNameE: product.SubCategoryNameE,
      SubCategoryNameA: product.SubCategoryNameA,
      ProductAvailableQuantity: product.ProductSizeList[selectedSizeIndex].Quantity,
      ProductNameE: product.ProductNameE,
      ProductColorOrdered: JSON.stringify(colorData),
      ProductNameA: product.ProductNameA,
      IsProductActive: product.IsProductActive,
      ProductSizeNameE: product.ProductSizeList[selectedSizeIndex].ProductSizeNameE,
      ProductSizeNameA: product.ProductSizeList[selectedSizeIndex].ProductSizeNameA,
      ProductCurrentPrice: product.ProductSizeList[selectedSizeIndex].ProductPrice,
      ProductSizeId: product.ProductSizeList[selectedSizeIndex].ProductSizeId,
      OrderPrice: product.ProductSizeList[selectedSizeIndex].ProductPrice,
      OrderQuantity: quantitya,
      TotalAmount: product.ProductSizeList[selectedSizeIndex].ProductPrice * quantitya,
      Status: "",
      Weight: product.ProductSizeList[selectedSizeIndex].Weight,
    };
 
    let products = JSON.parse(localStorage.getItem("guestProduct")) || [];
 
    const productExists = products.some(
      (item) => item.ProductSizeId === productdetails.ProductSizeId
    );
 
    if (!productExists) {
      products.push(productdetails);
      localStorage.setItem("guestProduct", JSON.stringify(products));
      setData(products.length)
 
    } else {
      let existingProduct = products.find(
        (item) => item.ProductSizeId === productdetails.ProductSizeId
      );
 
      existingProduct.ProductColorOrdered = JSON.stringify(colorData);
      localStorage.setItem("guestProduct", JSON.stringify(products));
 
    }
    toast.success(
      language === "en"
        ? "Product added to cart successfully!"
        : "تمت إضافة المنتج إلى سلة التسوق بنجاح!"
    );
  }
 
  useEffect(() => {
 
    cartquantity();
  }, [userOrders]);
 
  const cartquantity = () => {
    // console.log("userOrders:", userOrders);
    // console.log("id:", id);
    let ourproduct = userOrders.filter((product) => product.ProductId.toString() === id);
 
 
    // console.log("ourproduct:", ourproduct);
 
    if (ourproduct.length > 0) {
      const ourproductUnit = ourproduct[0].OrderQu;
      // console.log("ourproductUnit (if):", ourproductUnit);
      setQuantity(ourproductUnit);
    } else {
      // If product not found, set default quantity to 1
      const ourproductUnit = 1;
      // console.log("ourproductUnit (else):", ourproductUnit);
      setQuantity(ourproductUnit);
    }
  };
 
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
 
 
  const handleSizeClick = (index) => {
    setSelectedSizeIndex(index);
 
    let Maindata = null;
    let product = mainProducts.find((product) => product.ProductId.toString() === id);
    if (product) {
      let size = product.ProductSizeList[index];
      const Quantityfor = size.Quantity
      setQuantityOfProduct(Quantityfor)
      if (size && size.ProductColors) {
        let parsedColors = JSON.parse(size.ProductColors);
        if (parsedColors && parsedColors.length > 0) {
          Maindata = parsedColors[0];
        }
      }
    }
 
    if (Maindata) {
      setSelectedColor(Maindata.ProductColorId);
      setColorData(Maindata);
    } else {
      setSelectedColor(null);
      setColorData(null);
    }
 
  };
 
  const [colorData, setColorData] = useState(null)
 
  const [imagetodisplay, setimagetodisplay] = useState("");
 
 
  const [imageSrc, setImageSrc] = useState([]);
 
 
  useEffect(() => {
    const product = mainProducts.find(product => product.ProductId.toString() === id);
    
    if (product && product.ProductSizeList.length > 0) {
      const selectedSize = product.ProductSizeList[selectedSizeIndex];
      let colors;
      
      try {
        colors = selectedSize && JSON.parse(selectedSize.ProductColors);
      } catch (error) {
        console.error("Error parsing ProductColors:", error);
        return;
      }
      
      if (colors && colors.length > 0) {
        const defaultColor = colors[0];
        setSelectedColor(defaultColor.ProductColorId);
        handleColorClick(defaultColor);
  
        // Log the image count for the selected color
        let productImages;
        
        try {
          productImages = defaultColor && JSON.parse(defaultColor.ProductImagePath);
        } catch (error) {
          console.error("Error parsing ProductImagePath:", error);
          productImages = []; // Handle the case where parsing fails
        }
  
        // console.log("Default selected color image count:", productImages ? productImages.length : 0);
      }
    }
  }, [selectedSizeIndex, mainProducts, id]);
  
  
  const handleColorClick = (item) => {
    setColorData(item);
  
    let productImages = [];
    if (item.ProductImagePath && item.ProductImagePath.trim() !== '') {
      try {
        productImages = JSON.parse(item.ProductImagePath);
      } catch (error) {
        console.error('Error parsing ProductImagePath:', error);
      }
    }
  
    if (productImages.length > 0) {
      const uniqueImagePaths = [...new Set(productImages.map(img =>  img.ImagePath.replace('http://192.168.17.172:81/', BASE_PATH)))];
      setImageSrc(uniqueImagePaths);
    }
  
    setSelectedColor(item.ProductColorId);
  };

  
  useEffect(() => {
    window.scrollTo(0, 0);
    const productImages = mainProducts.filter((product) => product.ProductId.toString() === id);
    let allImagePathsSet = new Set();
  
    if (productImages.length > 0) {
      const checkImages = productImages[0].ProductSizeList;
  
      if (checkImages) {
        checkImages.forEach(item => {
          let productColors;
  
          try {
            productColors = JSON.parse(item.ProductColors);
          } catch (error) {
            console.error("Error parsing ProductColors:", error);
            return;
          }
  
          if (productColors) {
            productColors.forEach(color => {
              let imagePaths;
  
              try {
                imagePaths = JSON.parse(color.ProductImagePath);
                // console.log(imagePaths);
                
              } catch (error) {
                console.error("Error parsing ProductImagePath:", error);
                return;
              }
  
              if (imagePaths) {
                imagePaths.forEach(img => {
                  const modifiedImagePath = img.ImagePath.replace('http://192.168.17.172:81/', BASE_PATH);
                  allImagePathsSet.add(modifiedImagePath);
                });
              } else {
                // console.log("No image paths found in ProductImagePath.");
              }
            });
          } else {
            // console.log("No product colors found in ProductColors.");
          }
        });
      } else {
        // console.log("No images found in ProductSizeList.");
      }
  
      const allImagePaths = Array.from(allImagePathsSet);
      // console.log(allImagePaths);
    } else {
      // console.log("No matching product found or ProductSizeList is empty.");
    }
  }, [mainProducts, id]);
  

  
  
  // Ensure removeDuplicates is defined
  // const removeDuplicates = (array) => {
  //   const uniqueImages = array.reduce((acc, current) => {
  //     if (!acc.includes(current)) {
  //       acc.push(current);
  //     }
  //     return acc;
  //   }, []);
  //   return uniqueImages;
  // };
  
  
 
 
 
    //
 
  // const extractImagePaths = (checkImages) => {
  //   let allImagePaths = [];
  //   checkImages.forEach(item => {
  //     const productColors = JSON.parse(item.ProductColors);
  //     productColors.forEach(color => {
  //       const imagePaths = JSON.parse(color.ProductImagePath);
  //       imagePaths.forEach(img => {
  //         allImagePaths.push(img.ImagePath);
  //       });
  //     });
  //   });
  //   return allImagePaths;
  // };
  // const paths = extractImagePaths(jsonData);
  // setImagePaths(paths);
 
 
 
 
 
 
  // Calculate the number of slides to show
  // const slidesToShowCount = productImages.length

  
  var settingsVertical = {
    infinite: imageSrc.length > 1, // Disable infinite scroll if only one image
    arrows: false,
    vertical: imageSrc.length > 1, // Enable vertical scrolling if more than one image
    verticalSwiping: imageSrc.length > 1, // Enable vertical swiping if more than one image
    slidesToShow: imageSrc.length > 3 ? 3 : imageSrc.length, // Show only available images, up to 3
    slidesToScroll: 1,
    autoplay: imageSrc.length > 1, // Disable autoplay if only one image
    autoplaySpeed: 2000,
    speed: 2000,
    responsive: [
      {
        breakpoint: 992, // Large screens (desktops)
        settings: {
          slidesToShow: imageSrc.length > 3 ? 3 : imageSrc.length,
        },
      },
      {
        breakpoint: 768, // Medium screens (tablets)
        settings: {
          slidesToShow: imageSrc.length > 2 ? 2 : imageSrc.length,
          vertical: imageSrc.length > 1, // Enable vertical scroll if more than one image
          verticalSwiping: imageSrc.length > 1, // Enable vertical swiping if more than one image
        },
      },
      {
        breakpoint: 480, // Small screens (phones)
        settings: {
          slidesToShow: 1, // Show only 1 image on small screens
          vertical: false, // Disable vertical scrolling for small screens
          verticalSwiping: false, // Disable vertical swiping for small screens
          arrows: false, // Disable arrows on small screens
          autoplay: imageSrc.length > 1, // Enable autoplay if more than one image
          autoplaySpeed: 3000, // Adjust autoplay speed for better experience on mobile
        },
      },
    ],
  };
  

   
  const uniqueImages = new Set();
  return (
    <Fragment>
      {/* <GetProducts setProducts={setProducts} /> */}
      <>{loaderFirst ?
 
 
        <div id="hola">
 
          <div id="preloader">
 
 
            <Loader />
 
          </div>
        </div>
        : loading ? (
          <div id="hola">
 
            <div id="preloader">
              <div className="loader-logo mx-auto mrg-b-30">
 
              </div>
              <div className="loadingTxt text-center">
                <div className="txtSummary f-s-20">
                  <Loader />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="erc-our-product prou-secWrp secBg">
            <div className="full-container container">
              <div className="row">
                <ToastContainer />
                <div className="col-md-6">
                  {mainProducts
                    .filter((product) => product.ProductId.toString() === id)
                    .map((product) => (
                      <div className="product-img-slide" key={product.ProductId}>
                        {loading && <Loader />}
                        <Slider {...settings}>
                          {imageSrc.map((src, index) => (
                            <div className="product-img-display" key={index}>
                              <img
                                decoding="async"
                                src={showimg ? imagetodisplay : src}
                                className="w-100"
                                loading="lazy"
                                alt="Product Image"
                              />
                            </div>
                          ))}
                        </Slider>
                      </div>
                    ))}
                </div>
 
                <div className="col-md-2">
  {mainProducts
    .filter((product) => product.ProductId.toString() === id)
    .map((product) => (
      <div className="img-selectSlide" key={product.ProductId}>
        <Slider className="custom-slider" {...settingsVertical}>
          {imageSrc.map((src, index) => (
            <div className="prod-img-select" key={index}>
              <Link>
                <img
                  decoding="async"
                  src={src}
                  onMouseOver={() => {
                    setimagetodisplay(src);
                    setShowimg(true);
                    setTimeout(() => {
                      setShowimg(false);
                    }, 1000);
                  }}
                  className="w-100"
                  loading="lazy"
                />
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    ))}
</div>
 
                {mainProducts
                  .filter((product) => product.ProductId.toString() === id)
                  .map((product) => (
                    <div className="col-md-4" key={product.ProductId}>
                      <div className="prod-Txt-cont">
                        <div className="con-brdB">
                          <div
                            className="secTitle f-s-30 font-Lyon line_H_1"
                            data-aos="fade-up"
                            data-aos-delay={300}
                          >
                            {language === "en"
                              ? product.ProductNameE
                              : product.ProductNameA}
                          </div>
                          <div
                            className="f-s-20"
                            data-aos="fade-up"
                            data-aos-delay={600}
                          >
                            {language === "en"
                              ? product.CategoryNameE
                              : product.CategoryNameA}
                          </div>
                        </div>
                        <div className="op-ade-Wishlist d-flex justify-content-between align-items-center">
 
                          <div className="f-s-20">AED {product.ProductSizeList[selectedSizeIndex].ProductPrice}</div>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>   {language === "en"
                              ? "Add to Wishlist"
                              : "أضف إلى قائمة الأمنيات"} </Tooltip>}
                          >
                            <Link
                              className={`f-s-20 wishlist-icon ${activeWishlistProducts.includes(product.ProductId) ? "active_wishlist" : ""}`}
                              data-bs-toggle="tooltip"
                              onClick={() => handleAddToWishlist(product.ProductId, product.SubCategoryId, product.CategoryId, UserID, tokenlogin, language, navigate, toast, setActiveWishlistProducts, setIsWishlist)}
                              data-bs-title="Add to Wishlist"
                            >
 
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                fill="#9F926D"
                                className="bi bi-heart de-activeHeart"
                                viewBox="0 0 16 16"
                              >
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill activeHeart d-none" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
                              </svg>
                            </Link>
                          </OverlayTrigger>
                        </div>
 
 
                        <div className="d-flex">
 
                          <div className="qty-container w-100 d-flex align-items-center">
 
 
                            <button
                              className="btn p-0 qty-btn-minus"
                              type="button"
                              onClick={() => {
                                const quantity = product.ProductSizeList[selectedSizeIndex].Quantity;
                                // console.log(quantity);
                                handleQuantityChange(quantitya - 1, quantity);
                              }}
 
                            >
                              <img
                                src={minus_icon}
                                className="w-100"
                                alt="Minus"
                              />
                            </button>
 
                            <input
                              type="text"
                              name="qty"
 
                              value={quantitya}
                              className="input-qty w-100"
                              readOnly
                            />
                            <button
                              className="btn p-0 qty-btn-plus"
                              type="button"
 
                              onClick={() => {
                                const quantity = product.ProductSizeList[selectedSizeIndex].Quantity;
                                // console.log(quantity);
                                handleQuantityChange(quantitya + 1, quantity);
                              }}
 
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 255.99185 255.99185" width="16" height="16">
                                <g fill="#9f926d" fillRule="evenodd" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: 'normal' }}>
                                  <g transform="scale(10.66667,10.66667)">
                                    <path d="M11,2v9h-9v2h9v9h2v-9h9v-2h-9v-9z"></path>
                                  </g>
                                </g>
                              </svg>
                            </button>
                          </div>
 
                          <button
                            // onMouseOver={console.log(QuantityOfProduct)}
                            type="button"
                            className="btn w-100 btn-addCart font-Lyon"
                            onClick={() => {
                              if (!UserID) {
 
                                GuestLogin(product, colorData);
 
                              } else {
                                HandleAddToCart(product, quantitya, language, tokenlogin, UserID, colorData);
                                setTimeout(() => {
                                  updateData();
                                }, 3000);
                              }
                            }}
                            disabled={QuantityOfProduct < 1}
                          >
                            {QuantityOfProduct < 1 ? (
                              <span style={{ color: 'red' }}>

                                {language === "en" ? "Out of Stock" : "غير متاح"}
                              </span>
                            ) : (
                                language === "en" ? "Add to Cart" : "أضف إلى السلة"
                            )}
                          </button>
 
                        </div>
                        {/* )} */}
                        <div className="size-Wrp">
                          <div className="font-Lyon mb-1">
                            {language === "en"
                              ? "  Product Size   "
                              : " حجم المنتج   "}
                          </div>
                          <div className="productSize-wrp">
                            {product.ProductSizeList.map((size, index) => (
 
                              <div key={index}  >
 
 
                                <button
                                  //  className="sizebtn"
                                  style={{
                                    minWidth: '35px',
                                    minHeight: "35px",
                                    // marginRight: '10px',
                                    marginBottom: '10px',
                                    padding: '5px 10px',
                                    background: index === selectedSizeIndex ? '#9F926D' : 'transparent',
                                    color: index === selectedSizeIndex ? '#fff' : '#9F926D',
                                    border: `1px solid ${index === selectedSizeIndex ? '#9F926D' : '#000'}`,
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => handleSizeClick(index)}
 
                                >
 
                                  {language === "en"
                                    ? size.ProductSizeNameE
                                    : size.ProductSizeNameA}
                                </button>
                              </div>
                            ))}
                            <div>
 
                            </div>
                          </div>
                       
                          <div className="productSize-wrp">
                            {product.ProductSizeList.map((size, index) => (
                              index === selectedSizeIndex && (
                                <div key={index}>
                                  {size.ProductColors && JSON.parse(size.ProductColors).length > 0 ? (
                                    <>
                                      <div>
                                        <div className="font-Lyon mb-1">
                                          {language === "en" ? 'Product color' : 'لون المنتج'}
                                        </div>
                                        <div className="selectImagesWrp">
                                          {JSON.parse(size.ProductColors).map((item, colorIndex) => {
                                            const isSelected = selectedColor === item.ProductColorId;
                                            const updatedImagePath = item.ImagePath.replace('http://192.168.17.172:81/', BASE_PATH);
                                            return (
                                              <div className="selectItem" key={colorIndex}>
                                                <label className="select-ImagePattern">
                                                  <input
                                                    type="radio"
                                                    name="radio-control"
                                                    value={item.ProductColorId}
                                                    checked={isSelected}
                                                    onChange={() => handleColorClick(item)}
                                                  />
                                                  <div className={`selectImg ${isSelected ? 'selected' : ''}`}>
                                                    <img src={updatedImagePath} alt={item.ProductColorNameE} />
                                                  </div>
                                                  <span className="proName">
                                                    {language === "en" ? item.ProductColorNameE : item.ProductColorNameA}
                                                  </span>
                                                </label>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    ''
                                  )}
                                </div>
                              )
                            ))}
                          </div>
 
                        </div>
 
                        <div className="op-pro-discr con-brdB">
                          <div className="font-Lyon">
                            {language === "en" ? "Description" : "الوصف "}
                          </div>
                          <p dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize( language === "en"
                              ? product.ProductDescE
                              : product.ProductDescA
                         ),  }} />
                        </div>
                        <div className="op-pro-discr con-brdB">
                          <div className="font-Lyon">
                            {language === "en" ? "Details:" : "التفاصيل:"}
                          </div>
 
                          <p dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize( language === "en"
                              ? product.PackagingDetailsE
                              : product.PackagingDetailsA
                         ),  }} />
 
                        </div>
                        <div className="op-pro-discr con-brdB">
                          <div className="font-Lyon">
 
                            {language === "en" ? "Package Details and Dimensions" : "الوصف "}
                          </div>
                          <p dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize( language === "en"
                              ? product.ProductInfoE
                              : product.ProductInfoA
                         ),  }} />
                        </div>
 
                        <div className="op-pro-discr">
                          <div className="font-Lyon">
                            {language === "en" ? "Lead Time:" : "المهلة:"}
                          </div>
                          <p>
                            {language === "en"
                              ? "Required 5 working days to be shipped"
                              : "يستغرق 5 أيام عمل من أجل شحنها "}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </>
      <Modal show={showModalforQuantity} onHide={handleCloseforQuantity} centered>
        <Modal.Header closeButton>
          <Modal.Title>{language === "en" ? "Maximum quantity" : "الكمية القصوى "} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {language === "en" ? " You have reached the maximum quantity allowed for the product." : "تم الوصول للحد الأقصى للشراء لهذا المنتج"}
 
        </Modal.Body>
      </Modal>
    </Fragment>
  );

}

export default memo(ProductsDetails);




// import React, { Fragment, memo, useEffect, useState, useContext } from "react";
// import Slider from "react-slick";
// import { useParams, useNavigate, json } from "react-router-dom";
// import minus_icon from "../assets/images/minus-icon.png";
// import plus_icon from "../assets/images/plus-icon.png";
// import red from "../assets/images/red.png";
// import green from "../assets/images/green.png";

// import grey from "../assets/images/grey.png";


// import { ToastContainer, toast } from 'react-toastify';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';
// import handleAddToWishlist from '../utils/wishlistUtils';
// import Loader from './Loader';
// import { DataContext } from "../utils/ApiContext";
// import { Link } from "react-router-dom";
// import Modal from "react-bootstrap/Modal";
// import BASE_PATH from '../serviceurls';
// import { useLanguage } from '../redux/LanguageContext';
// function ProductsDetails() {

//   const [mainProducts, setProducts] = useState([]);
//   const [showimg, setShowimg] = useState(false)
//   const navigate = useNavigate();
//   const [loaderFirst, setLoader] = useState(true)
//   const { language } = useLanguage();
//   const [selectedColor, setSelectedColor] = useState();

//   const [loading, setLoading] = useState(true);
//   const token = localStorage.getItem('token');

//   useEffect(() => {

//     if (!token) {
//       console.error('Token not found.');
//       return;
//     }

//     const fetchProducts = async () => {
//       try {
//         const response = await fetch(`${BASE_PATH}Product/GetAllProducts`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'accept': '*/*',
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch products');
//         }

//         const data = await response.json();
//         setProducts(data);
//         setLoading(false);
//         setLoader(false);

//         const product = data.find(product => product.ProductId.toString() === id);

//         if (product) {
//           const firstSize = product.ProductSizeList[0];


//           if (firstSize && firstSize.ProductColors) {
//             const parsedColors = JSON.parse(firstSize.ProductColors);


//             if (parsedColors.length > 0) {
//               setColorData(parsedColors[0]);
//               setSelectedColor(parsedColors[0].Id);

//             }

//           }
//         }


//       } catch (error) {
//         console.error('Error fetching products:', error);
//         setLoading(false);
//         setLoader(false);
//       }
//     };

//     fetchProducts();
//   }, [token, setProducts]);


//   const { id } = useParams();

//   var settings = {
//     infinite: true,
//     arrows: false,

//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2000,
//     speed: 2000,
//     responsive: [
//       {
//         breakpoint: 992,
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//     ],
//   };

//   const tokenlogin = localStorage.getItem('loginToken');
//   const UserID = localStorage.getItem('UserID');
//   const HandleAddToCart = async (product, quantitya, language, tokenlogin, UserID, colorData) => {
    // console.log(quantitya);
//     console.log(colorData);
//     console.log("Adding to Cart - Product Details:", product);
//     try {
//       console.log("OrderQuantity", quantitya);

//       const apiUrl = `${BASE_PATH}Order/AddOrderInCart`;
//       const requestOptions = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${tokenlogin}`,
//         },
//         body: JSON.stringify({
//           ProductId: product.ProductId,
//           CategoryId: product.CategoryId,
//           SubCategoryId: product.SubCategoryId,
//           UserID: UserID,
//           ProductSizeId: product.ProductSizeList[selectedSizeIndex].ProductSizeId,
//           OrderPrice: product.ProductSizeList[selectedSizeIndex].ProductPrice,
//           OrderQuantity: quantitya,
//           ProductColorOrdered: JSON.stringify(colorData),
//           TotalAmount: product.ProductSizeList[selectedSizeIndex].ProductPrice * 1,
//           Status: "",

//         }),
//       };
//       const response = await fetch(apiUrl, requestOptions);

//       if (response.ok) {
//         const data = await response.json();
//         setActiveCartProducts(prevProducts => [...prevProducts, product.ProductId]);

//         console.log("Add to Cart Response:", data.ProductId);
//         console.log("Add to Cart OrderQuantity:", data.OrderQuantity);

//         toast.success(
//           language === "en"
//             ? "Product added to cart successfully!"
//             : "تمت إضافة المنتج إلى سلة التسوق بنجاح!"
//         );
//         // useCounter.getState().incrCounter();
//       } else if (response.status === 401) {
//         localStorage.removeItem("loginToken");
//         localStorage.removeItem("UserID");

//         toast.error(
//           language === "en"
//             ? "Please Login to access your cart !"
//             : "الرجاء تسجيل الدخول للوصول إلى سلة التسوق الخاصة بك!"
//         );
//         setTimeout(() => {
//           navigate("/login")
//         }, 3000);

//       } else {
//         // Handle other error cases
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       toast.error(
//         language === "en"
//           ? "Failed to add the product to the cart."
//           : "لم نستطع إضافة المنتج إلى سلة التسوق."
//       );

//     }

//   };

//   const { data, setData } = useContext(DataContext);
//   const handleCloseforQuantity = () => setshowModalforQuantity(false);

//   const updateData = async () => {
//     if (!UserID) {
//       const products = JSON.parse(localStorage.getItem("guestProduct")) || [];
//       setData(products.length)
//       console.log(products.length);
//     } else {
//       try {
//         const cartApiUrl = `${BASE_PATH}Order/GetAllUserOrdersInCartByUserId?userId=${UserID}`;
//         const [cartResponse] = await Promise.all([
//           fetch(cartApiUrl, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${tokenlogin}`,
//             },
//           }),
//         ]);

//         if (!cartResponse.ok) {
//           throw new Error(`HTTP error! Status: ${cartResponse.status}`);
//         }

//         const cartData = await cartResponse.json();
//         console.log("cartData", cartData)

//         setData(cartData.length); // Assuming setData is defined elsewhere
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     }
//   };

//   const [imagetodisplay, setimagetodisplay] = useState("");
//   const [quantitya, setQuantity] = useState(1);
//   const handleQuantityChange = (newQuantity, Quantity) => {

//     console.log("new", Quantity, newQuantity);
//     if (Quantity < newQuantity) {
//       console.error("unexpected quantity");

//     }
//     if (Quantity >= newQuantity) {
//       const updatedQuantity = Math.max(1, newQuantity);

//       setQuantity(updatedQuantity);
//     }
//     else {
//       handleShowforQuantity();
//     }

//   };
//   const [showModalforQuantity, setshowModalforQuantity] = useState(false);
//   const [activeCartProducts, setActiveCartProducts] = useState([]);

//   // console.log(quantitya);
//   const handleShowforQuantity = () => {
//     setshowModalforQuantity(true)
//     setTimeout(() => {
//       setshowModalforQuantity(false);
//     }, 2000);
//   }
//   const [imageSrcs, setImageSrcs] = useState(['', '', '']);

//   useEffect(() => {

//     const fetchImages = async () => {
//       try {
//         const imageUrls = await Promise.all([
//           importProductImage(id, 1),
//           importProductImage(id, 2),
//           importProductImage(id, 3),
//           importProductImage(id, 4),
//           importProductImage(id, 5),
//           importProductImage(id, 6),
//           importProductImage(id, 7),
//           importProductImage(id, 8),
//         ]);

//         // Check if any of the image URLs are non-empty
//         const hasImages = imageUrls.some(url => url && url !== '');
//         if (hasImages) {
//           setImageSrcs(imageUrls);

//         }
//         setLoading(false);
//       } catch (error) {
//         console.error('Error loading images:', error);
//       }
//     };

//     fetchImages();
//   }, [id]);


//   const importProductImage = async (ProductId, imageNumber) => {
//     const loadImage = (format) => {
//       const basePath = `${BASE_PATH}Images/Product/images/products/`;

//       const imagePath = `${basePath}${ProductId}/${imageNumber}.${format}`;
//       const image = new Image();
//       image.src = imagePath;
//       //console.log(image.src);
//       return new Promise((resolve, reject) => {
//         image.onload = () => {
//           console.log(`Image loaded successfully: ${imagePath}`);
//           resolve(imagePath);
//         };
//         image.onerror = () => {
//           // console.error(`Error loading ${format.toUpperCase()} image for product ${ProductId}: ${imagePath}`);
//           reject(`Error loading ${format.toUpperCase()} image for product ${ProductId}`);
//         };
//       });
//     };
//     try {
//       const imagePath = await loadImage('jpg');
//       console.log(`JPG image found for product ${ProductId}: ${imagePath}`);
//       return imagePath;
//     } catch {
//       try {
//         const imagePath = await loadImage('png');
//         // console.log(`PNG image found for product ${ProductId}: ${imagePath}`);
//         return imagePath;
//       } catch {
//         // console.error(`Error loading both PNG and JPG images for product ${ProductId}`);
//         return '';
//       }
//     }
//   };

//   const [isWishlist, setIsWishlist] = useState(false);
//   const [activeWishlistProducts, setActiveWishlistProducts] = useState([]);


//   const fetchWishlistData = async () => {

//     const apiUrl = `${BASE_PATH}Wishlist/GetWishlistByUserId/${UserID}`;

//     try {
//       const response = await fetch(apiUrl, {
//         method: 'GET',
//         headers: {
//           'accept': '*/*',
//           'Authorization': `Bearer ${tokenlogin}`,
//         },
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log('Wishlist Data:', data);
//       return data; // Return the wishlist data
//     } catch (error) {
//       console.error('Error fetching wishlist data:', error);

//     }
//   };

//   useEffect(() => {
//     const loadWishlistData = async () => {
//       const wishlistData = await fetchWishlistData();
//       if (wishlistData) {
//         // Extract product IDs from the wishlist data
//         const wishlistProductIds = wishlistData.map(item => item.ProductId);
//         // Update the state to mark products in the wishlist as active
//         setActiveWishlistProducts(wishlistProductIds);
//       }
//     };

//     loadWishlistData();
//   }, []);
//   const [userOrders, setUserOrders] = useState([]);
//   const GuestLogin = (product, colorData) => {
//     console.log(colorData);

//     const productdetails = {
//       ProductId: product.ProductId,
//       CategoryId: product.CategoryId,
//       SubCategoryId: product.SubCategoryId,
//       CategoryNameE: product.CategoryNameE,
//       SubCategoryNameE: product.SubCategoryNameE,
//       SubCategoryNameA: product.SubCategoryNameA,
//       ProductAvailableQuantity: product.ProductSizeList[selectedSizeIndex].Quantity,
//       ProductNameE: product.ProductNameE,
//       ProductColorOrdered: JSON.stringify(colorData),
//       ProductNameA: product.ProductNameA,
//       IsProductActive: product.IsProductActive,
//       ProductSizeNameE: product.ProductSizeList[selectedSizeIndex].ProductSizeNameE,
//       ProductSizeNameA: product.ProductSizeList[selectedSizeIndex].ProductSizeNameA,
//       ProductCurrentPrice: product.ProductSizeList[selectedSizeIndex].ProductPrice,
//       ProductSizeId: product.ProductSizeList[selectedSizeIndex].ProductSizeId,
//       OrderPrice: product.ProductSizeList[selectedSizeIndex].ProductPrice,
//       OrderQuantity: quantitya,
//       TotalAmount: product.ProductSizeList[selectedSizeIndex].ProductPrice * quantitya,
//       Status: "",
//     };

//     let products = JSON.parse(localStorage.getItem("guestProduct")) || [];

//     const productExists = products.some(
//       (item) => item.ProductSizeId === productdetails.ProductSizeId
//     );

//     if (!productExists) {
//       products.push(productdetails);
//       localStorage.setItem("guestProduct", JSON.stringify(products));
//       setData(products.length)

//     } else {
//       let existingProduct = products.find(
//         (item) => item.ProductSizeId === productdetails.ProductSizeId
//       );

//       existingProduct.ProductColorOrdered = JSON.stringify(colorData);
//       localStorage.setItem("guestProduct", JSON.stringify(products));

//     }
//     toast.success(
//       language === "en"
//         ? "Product added to cart successfully!"
//         : "تمت إضافة المنتج إلى سلة التسوق بنجاح!"
//     );
//   }

//   useEffect(() => {

//     cartquantity();
//   }, [userOrders]);

//   const cartquantity = () => {
//     console.log("userOrders:", userOrders);
//     console.log("id:", id);
//     let ourproduct = userOrders.filter((product) => product.ProductId.toString() === id);


//     console.log("ourproduct:", ourproduct);

//     if (ourproduct.length > 0) {
//       const ourproductUnit = ourproduct[0].OrderQu;
//       console.log("ourproductUnit (if):", ourproductUnit);
//       setQuantity(ourproductUnit);
//     } else {
//       // If product not found, set default quantity to 1
//       const ourproductUnit = 1;
//       console.log("ourproductUnit (else):", ourproductUnit);
//       setQuantity(ourproductUnit);
//     }
//   };

//   const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);


//   const handleSizeClick = (index) => {
//     setSelectedSizeIndex(index);

//     let Maindata = null;
//     let product = mainProducts.find((product) => product.ProductId.toString() === id);
//     if (product) {
//       let size = product.ProductSizeList[index];
//       if (size && size.ProductColors) {
//         let parsedColors = JSON.parse(size.ProductColors);
//         if (parsedColors && parsedColors.length > 0) {
//           Maindata = parsedColors[0];
//         }
//       }
//     }

//     if (Maindata) {
//       setSelectedColor(Maindata.Id);
//       setColorData(Maindata);
//     } else {
//       setSelectedColor(null);
//       setColorData(null);

//     }

//   };

//   const [colorData, setColorData] = useState(null)
//   const handleColorClick = (item) => {
//     console.log(item);
//     setSelectedColor(item.Id);
//     setColorData(item)


//   };
//   const productImages = mainProducts
//     .filter((product) => product.ProductId.toString() === id)
//     .flatMap((product) =>
//       imageSrcs.filter((imageSrc) => imageSrc && imageSrc !== '')
//     );

//   // Calculate the number of slides to show
//   const slidesToShowCount = productImages.length


//   console.log(slidesToShowCount);
//   var settingsVertical = {
//     infinite: true,
//     arrows: false,
//     vertical: true,
//     // verticalSwiping: true,
//     slidesToShow: slidesToShowCount,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2000,
//     speed: 2000,
//     responsive: [
//       {
//         breakpoint: 992,
//         settings: {
//           slidesToShow: 3,
//         },
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 2,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 2,
//           vertical: false,
//           verticalSwiping: true,
//         },
//       },
//     ],
//   };
//   return (
//     <Fragment>
//       {/* <GetProducts setProducts={setProducts} /> */}
//       <>{loaderFirst ?


//         <div id="hola">

//           <div id="preloader">


//             <Loader />

//           </div>
//         </div>
//         : loading ? (
//           <div id="hola">

//             <div id="preloader">
//               <div className="loader-logo mx-auto mrg-b-30">

//               </div>
//               <div className="loadingTxt text-center">
//                 <div className="txtSummary f-s-20">
//                   <Loader />
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="erc-our-product prou-secWrp secBg">
//             <div className="full-container container">
//               <div className="row">
//                 <ToastContainer />
//                 <div className="col-md-6">
//                   {mainProducts
//                     .filter((product) => product.ProductId.toString() === id)
//                     .map((product) => (
//                       <div className="product-img-slide" key={product.ProductId}>

//                         {loading && <Loader />}
//                         <Slider {...settings}>

//                           {imageSrcs
//                             .filter(imageSrc => imageSrc && imageSrc !== '')
//                             .map((imageSrc, index) => (
//                               <div className="product-img-display" key={index}>
//                                 <img
//                                   decoding="async"

//                                   // alt={product.ProductId}
//                                   src={showimg ? imagetodisplay : imageSrc}
//                                   // src={imagetodisplay}
//                                   // setimagetodisplay(imageSrc)
//                                   //src={imageSrc}
//                                   className="w-100"
//                                   loading="lazy"
//                                   onError={(e) => {
//                                     console.error(`Error loading image for ProductId: ${product.ProductId}`, e);
//                                     e.target.src = `${BASE_PATH}Images/Product/images/products/default.png`;

//                                   }}
//                                 />
//                               </div>
//                             ))}
//                         </Slider>
//                       </div>
//                     ))}
//                 </div>

//                 <div className="col-md-2">
//                   {mainProducts
//                     .filter((product) => product.ProductId.toString() === id)
//                     .map((product) => (
//                       <div className="img-selectSlide" key={product.ProductId}>
//                         <Slider className="custom-slider" {...settingsVertical}>
//                           {imageSrcs
//                             .filter(imageSrc => imageSrc && imageSrc !== '')
//                             .map((imageSrc, index) => (
//                               <div className="prod-img-select" key={index}>
//                                 {imageSrc && (
//                                   <Link>
//                                     <img
//                                       decoding="async"
//                                       onMouseOver={() => {
//                                         setimagetodisplay(imageSrc); setShowimg(true); setTimeout(() => {
//                                           setShowimg(false)
//                                         }, 1000);
//                                       }}
//                                       src={imageSrc}
//                                       className="w-100"
//                                       loading="lazy"
//                                     />
//                                   </Link>
//                                 )}
//                               </div>
//                             ))}
//                         </Slider>

//                       </div>
//                     ))}
//                 </div>

//                 {mainProducts
//                   .filter((product) => product.ProductId.toString() === id)
//                   .map((product) => (
//                     <div className="col-md-4" key={product.ProductId}>
//                       <div className="prod-Txt-cont">
//                         <div className="con-brdB">
//                           <div
//                             className="secTitle f-s-30 font-Lyon line_H_1"
//                             data-aos="fade-up"
//                             data-aos-delay={300}
//                           >
//                             {language === "en"
//                               ? product.ProductNameE
//                               : product.ProductNameA}
//                           </div>
//                           <div
//                             className="f-s-20"
//                             data-aos="fade-up"
//                             data-aos-delay={600}
//                           >
//                             {language === "en"
//                               ? product.CategoryNameE
//                               : product.CategoryNameA}
//                           </div>
//                         </div>
//                         <div className="op-ade-Wishlist d-flex justify-content-between align-items-center">

//                           <div className="f-s-20">AED {product.ProductSizeList[selectedSizeIndex].ProductPrice}</div>
//                           <OverlayTrigger
//                             placement="top"
//                             overlay={<Tooltip>   {language === "en"
//                               ? "Add to Wishlist"
//                               : "أضف إلى قائمة الأمنيات"} </Tooltip>}
//                           >
//                             <Link
//                               className={`f-s-20 wishlist-icon ${activeWishlistProducts.includes(product.ProductId) ? "active_wishlist" : ""}`}
//                               data-bs-toggle="tooltip"
//                               onClick={() => handleAddToWishlist(product.ProductId, product.SubCategoryId, product.CategoryId, UserID, tokenlogin, language, navigate, toast, setActiveWishlistProducts, setIsWishlist)}
//                               data-bs-title="Add to Wishlist"
//                             >

//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width={16}
//                                 height={16}
//                                 fill="#9F926D"
//                                 className="bi bi-heart de-activeHeart"
//                                 viewBox="0 0 16 16"
//                               >
//                                 <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
//                               </svg>
//                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill activeHeart d-none" viewBox="0 0 16 16">
//                                 <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
//                               </svg>
//                             </Link>
//                           </OverlayTrigger>
//                         </div>


//                         <div className="d-flex">

//                           <div className="qty-container w-100 d-flex align-items-center">


//                             <button
//                               className="btn p-0 qty-btn-minus"
//                               type="button"
//                               onClick={() => {
//                                 const quantity = product.ProductSizeList[selectedSizeIndex].Quantity;
//                                 console.log(quantity);
//                                 handleQuantityChange(quantitya - 1, quantity);
//                               }}

//                             >
//                               <img
//                                 src={minus_icon}
//                                 className="w-100"
//                                 alt="Minus"
//                               />
//                             </button>

//                             <input
//                               type="text"
//                               name="qty"

//                               value={quantitya}
//                               className="input-qty w-100"
//                               readOnly
//                             />
//                             <button
//                               className="btn p-0 qty-btn-plus"
//                               type="button"

//                               onClick={() => {
//                                 const quantity = product.ProductSizeList[selectedSizeIndex].Quantity;
//                                 console.log(quantity);
//                                 handleQuantityChange(quantitya + 1, quantity);
//                               }}

//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 255.99185 255.99185" width="16" height="16">
//                                 <g fill="#9f926d" fillRule="evenodd" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: 'normal' }}>
//                                   <g transform="scale(10.66667,10.66667)">
//                                     <path d="M11,2v9h-9v2h9v9h2v-9h9v-2h-9v-9z"></path>
//                                   </g>
//                                 </g>
//                               </svg>
//                             </button>
//                           </div>

//                           <button
//                             // onMouseOver={console.log(quantitya)}
//                             type="button"
//                             className="btn w-100 btn-addCart font-Lyon"
//                             onClick={() => {
//                               if (!UserID) {

//                                 GuestLogin(product, colorData);

//                               } else {
//                                 HandleAddToCart(product, quantitya, language, tokenlogin, UserID, colorData);
//                                 setTimeout(() => {
//                                   updateData();
//                                 }, 3000);
//                               }
//                             }}
//                           >
//                             {language === "en"
//                               ? "Add to Cart "
//                               : "أضف إلى السلة"}
//                           </button>

//                         </div>
//                         {/* )} */}
//                         <div className="size-Wrp">
//                           <div className="font-Lyon mb-1">
//                             {language === "en"
//                               ? "  Product Size   "
//                               : " حجم المنتج   "}
//                           </div>
//                           <div className="productSize-wrp">
//                             {product.ProductSizeList.map((size, index) => (

//                               <div key={index}  >


//                                 <button
//                                   //  className="sizebtn"
//                                   style={{
//                                     minWidth: '35px',
//                                     minHeight: "35px",
//                                     // marginRight: '10px',
//                                     marginBottom: '10px',
//                                     padding: '5px 10px',
//                                     background: index === selectedSizeIndex ? '#9F926D' : 'transparent',
//                                     color: index === selectedSizeIndex ? '#fff' : '#9F926D',
//                                     border: `1px solid ${index === selectedSizeIndex ? '#9F926D' : '#000'}`,
//                                     borderRadius: '5px',
//                                     cursor: 'pointer'
//                                   }}
//                                   onClick={() => handleSizeClick(index)}

//                                 >

//                                   {language === "en"
//                                     ? size.ProductSizeNameE
//                                     : size.ProductSizeNameA}
//                                 </button>
//                               </div>


//                             ))}


//                             <div>

//                             </div>
//                           </div>
//                           {/* <div className="font-Lyon mb-1">
//                                         {language === "en"
//                                           ? 'Product available  in'
//                                           : 'لون المنتج'}
//                                       </div> */}
//                           <div className="productSize-wrp">
//                             {product.ProductSizeList.map((size, index) => (
//                               index === selectedSizeIndex && (
//                                 <div key={index}>
//                                   {size.ProductColors && JSON.parse(size.ProductColors).length > 0 ? (
//                                     <>
//                                       <div>
//                                         <div className="font-Lyon mb-1">
//                                           {language === "en" ? 'Product color' : 'لون المنتج'}
//                                         </div>
//                                         <div className="selectImagesWrp">
//                                           {JSON.parse(size.ProductColors).map((item, colorIndex) => {
//                                             const isSelected = selectedColor === item.Id;
//                                             return (
//                                               <div className="selectItem" key={colorIndex}>
//                                                 <label className="select-ImagePattern">
//                                                   <input
//                                                     type="radio"
//                                                     name="radio-control"
//                                                     value={item.Id}
//                                                     checked={isSelected}
//                                                     onClick={() => handleColorClick(item)}
//                                                     onChange={() => setSelectedColor(item.Id)}
//                                                   />
//                                                   <div className={`selectImg ${isSelected ? 'selected' : ''}`}>
//                                                     <img src={item.ImagePath} alt={item.ProductColorNameE} />
//                                                   </div>
//                                                   <span className="proName">
//                                                     {language === "en" ? item.ProductColorNameE : item.ProductColorNameA}
//                                                   </span>
//                                                 </label>
//                                               </div>
//                                             );
//                                           })}
//                                         </div>
//                                       </div>
//                                     </>
//                                   ) : (
//                                     ''
//                                   )}
//                                 </div>
//                               )
//                             ))}
//                           </div>


//                         </div>



//                         <div className="op-pro-discr con-brdB">
//                           <div className="font-Lyon">
//                             {language === "en" ? "Description" : "الوصف "}
//                           </div>
//                           <p dangerouslySetInnerHTML={{
//                             __html: language === "en"
//                               ? product.ProductDescE
//                               : product.ProductDescA
//                           }} />
//                         </div>
//                         <div className="op-pro-discr con-brdB">
//                           <div className="font-Lyon">
//                             {language === "en" ? "Details:" : " التفاصيل:"}
//                           </div>

//                           <p dangerouslySetInnerHTML={{
//                             __html: language === "en"
//                               ? product.PackagingDetailsE
//                               : product.PackagingDetailsA
//                           }} />

//                         </div>
//                         <div className="op-pro-discr con-brdB">
//                           <div className="font-Lyon">

//                             {language === "en" ? "Package Details and Dimensions" : "الوصف "}
//                           </div>
//                           <p dangerouslySetInnerHTML={{
//                             __html: language === "en"
//                               ? product.ProductInfoE
//                               : product.ProductInfoA
//                           }} />
//                         </div>

//                         <div className="op-pro-discr">
//                           <div className="font-Lyon">
//                             {language === "en" ? "Lead Time:" : "المهلة: "}
//                           </div>
//                           <p>
//                             {language === "en"
//                               ? "Required 5 working days to be shipped"
//                               : "يستغرق 5 أيام عمل من أجل شحنها "}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </>
//       <Modal show={showModalforQuantity} onHide={handleCloseforQuantity} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>{language === "en" ? "Maximum quantity" : "الكمية القصوى"} </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {language === "en" ? " You have reached the maximum quantity allowed for the product." : "تم الوصول للحد الأقصى للشراء لهذا المنتج "}

//         </Modal.Body>
//       </Modal>
//     </Fragment>
//   );
// }

// export default memo(ProductsDetails);