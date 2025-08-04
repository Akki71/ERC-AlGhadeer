import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import add_to_wishlist_icon from "../assets/images/add-to-wishlist-icon.png";
import add_to_icon from "../assets/images/add-to-cart-icon.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import BASE_PATH from '../serviceurls';
import handleAddToCart from '../utils/cartUtils';
import handleAddToWishlist from '../utils/wishlistUtils';
import handleClick from '../components/links';
import SubCategoryProducts from "../utils/SubCategoryProducts";
import TokenPage from "../utils/TokenPage";
import { DataContext } from "../utils/ApiContext";
import Loader from '../components/Loader';
import GetAllCategories from "../utils/GetAllCategory";
import CategoryComponent from "./CategoryComponent";
import GuestLogin from "../GustLogin/GuestLogin";
import DUMMY from "../assets/images/noimage.jpg";

import { useLanguage } from '../redux/LanguageContext';
const OurproductScreen = (category) => {
  const [passcategoryName, setpasscategoryName] = useState("");
  const [title, settitle] = useState("");
  useEffect(() => { handleClick() }, [handleClick])
  const [wishlistProduct, setwishlistProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [getToken, setGetToken] = useState(localStorage.getItem('token'));
  const [loaderFirst, setLoader] = useState(true)
  const [loading, setLoading] = useState(true);
  const [activeWishlistProducts, setActiveWishlistProducts] = useState([]);
  const [activeCartProducts, setActiveCartProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 6;
  const [filteredProductCount, setFilteredProductCount] = useState(0);
  // const totalPages = Math.ceil(filteredProductCount / productsPerPage);
  const offset = currentPage * productsPerPage;
  const [mainSubCategories, setSubCategoryProducts] = useState([]);
  const UserID = localStorage.getItem('UserID');
  const tokenlogin = localStorage.getItem('loginToken');
  const [isWishlist, setIsWishlist] = useState(false);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [CartProduct, setCartProduct] = useState([]);
  const token = localStorage.getItem('token');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState([]);
  const { language } = useLanguage();
  useEffect(() => {

    if (!token) {
      console.error('Token not found.');
      return;
    }

    const fetchProducts = async () => {
      setLoading(true)

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
        setLoading(false)
        setLoader(false)
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [token, setProducts]);
  const [isActive, setIsActive] = useState(false);
  const { data, setData } = useContext(DataContext);
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
        // console.log('cartData',cartData);
        
        setData(cartData.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const updateData = async () => {
      if (!UserID) {
        const products = JSON.parse(localStorage.getItem("guestProduct")) || [];
        setData(products.length);
        // console.log(products.length);
        return;
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
        // console.log("cartData2", cartData);
        setData(cartData.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    updateData();
  }, []);



  useEffect(() => {
    const loadCartData = async () => {
      const CartData = await fetchUserOrdersAndCheckQuantity();
      // console.log(CartData);
      if (CartData) {

        setCartProduct(CartData.map(item => item.OrderId));
        const CartproductId = CartData.map(item => item.ProductId);
        // console.log(CartproductId);

        setActiveCartProducts(CartproductId);
      }
    };

    loadCartData();
  }, []);
  useEffect(() => {
    const loadWishlistData = async () => {
      const wishlistData = await fetchWishlistData();

      if (wishlistData) {

        setwishlistProduct(wishlistData.map(item => item.WishlistId));
        const wishlistProductIds = wishlistData.map(item => item.ProductId);

        setActiveWishlistProducts(wishlistProductIds);
      }
    };

    loadWishlistData();

  }, []);



  const quantitya = "1";
  const navigate = useNavigate();

  const categoriesShow = () => {
    setIsActive(!isActive);
  };

  const fetchUserOrdersAndCheckQuantity = async () => {
    const apiUrl = `${BASE_PATH}Order/GetAllUserOrdersInCartByUserId?userId=${UserID}`;
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
      return data; // Return the wishlist data

    } catch (error) {
      // console.error('Error fetching wishlist data:', error);
    }

  };
  useEffect(() => { fetchUserOrdersAndCheckQuantity(); }, [])

  useEffect(() => {
    if (showRedirectMessage) {

      const timeoutId = setTimeout(() => {
        setShowRedirectMessage(false);
      }, 3000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [showRedirectMessage]);
  useEffect(() => {
    // Calculate the count of filtered products
    const count = products.filter(
      (product) =>
        selectedSubCategoryIds.length === 0 ||
        (selectedCategoryId === product.CategoryId &&
          selectedSubCategoryIds.includes(product.SubCategoryId))
    ).length;

    setFilteredProductCount(count);
    setTotalPages(Math.ceil(count / productsPerPage));
    // if(count===0){
    //   setFilteredProducts(products);
    // }

  }, [products, selectedSubCategoryIds, selectedCategoryId]);

  const [categoryChangeCooldown, setCategoryChangeCooldown] = useState(false);
  const handlePageChange = ({ selected }) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // console.log(currentPage);
    setCurrentPage(selected);

  }

  const importProductImage = (ProductId, format = 'PNG') => {
    const basePath = `${BASE_PATH}Images/Product/images/products/`;

    const imageUrl = `${basePath}${ProductId}/1.${format.toLowerCase()}`; // Assuming format is provided without a leading 

    return imageUrl;
  };

  const importProductImageWrapper = (ProductId, format) => {
    try {
      return importProductImage(ProductId, format);
    } catch (error) {

    }
  };

  const fetchWishlistData = async () => {

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
  //dfgdfhjk
  const handleCategoryChange = (category, allowToggle = true) => {
    if (!categoryChangeCooldown) {
      const newCategoryId = allowToggle
        ? (category.CategoryId === selectedCategoryId ? null : category.CategoryId)
        : selectedCategoryId;
  
      // Set selected category id only if toggling is allowed
      if (allowToggle) {
        setSelectedCategoryId(newCategoryId);
      }
  
      // Set title based on language
      if (newCategoryId) {
        settitle(language === "en" ? category.CategoryTitleE : category.CategoryTitleA);
      } else {
        settitle("");
      }
  
      // Set category description based on language
      if (newCategoryId) {
        setpasscategoryName(language === "en" ? category.CategoryDescriptionE : category.CategoryDescriptionA);
      } else {
        setpasscategoryName("");
      }
  
      // Filter subcategories based on the new category id
      const filtered = mainSubCategories
        .filter((subCategory) => subCategory.CategoryId === newCategoryId)
        .map((subCategory) => subCategory.SubCategoryId);
  
      setSelectedSubCategoryIds(filtered);
  
      // Reset to the first page
      setCurrentPage(0);
  
      // Set cooldown to prevent rapid changes
      setCategoryChangeCooldown(true);
      setTimeout(() => setCategoryChangeCooldown(false), 10);
    }
  };
  
  // Example usage in JSX:
  // onClick={() => handleCategoryChange(category)}


  useEffect(() => {
    if (category && category.CategoryId) {
      const allSubCategoryIds = mainSubCategories
        .filter((subCategory) => subCategory.CategoryId === category.CategoryId)
        .map((subCategory) => subCategory.SubCategoryId);
      setSelectedSubCategoryIds(allSubCategoryIds);
    }
  }, [category, mainSubCategories]);

  // console.log(allCategory);
  const [totalPages, setTotalPages] = useState(0);
  const handleSubCategoryChange = (subCategoryId) => {
    const isSubCategorySelected = selectedSubCategoryIds.includes(subCategoryId);

    if (isSubCategorySelected) {
      const updatedSelectedSubCategoryIds = selectedSubCategoryIds.filter(
        (id) => id !== subCategoryId
      );
      setSelectedSubCategoryIds(updatedSelectedSubCategoryIds);

      const filtered = products.filter(
        (product) =>
          updatedSelectedSubCategoryIds.length === 0 ||
          updatedSelectedSubCategoryIds.includes(product.SubCategoryId)
      );

      setFilteredProducts(filtered);
      setFilteredProductCount(filtered.length);
      // setTotalPages(Math.ceil(count / productsPerPage));
    } else {
      const updatedSelectedSubCategoryIds = [
        ...selectedSubCategoryIds,
        subCategoryId,
      ];
      setSelectedSubCategoryIds(updatedSelectedSubCategoryIds);

      const filtered = products.filter(
        (product) =>
          updatedSelectedSubCategoryIds.includes(product.SubCategoryId) &&
          (!selectedCategoryId || product.CategoryId === selectedCategoryId)
      );

      setFilteredProducts(filtered);
      setFilteredProductCount(filtered.length);
    }
    setCurrentPage(0); // Reset to first page
  };
  const [imagePaths, setImagePaths]=useState([]);
  useEffect(() => {
    if (products.length > 0) {
      const newImagePaths = {};
      products.forEach(product => {
        const productColors = JSON.parse(product.ProductSizeList[0].ProductColors || '[]');
        newImagePaths[product.ProductId] = productColors.map(color => {
          const productImages = JSON.parse(color.ProductImagePath || '[]');
          const srNo1Image = productImages.find(image => image.SrNo === 1);
          return srNo1Image ? srNo1Image.ImagePath : null;
        }).filter(Boolean); // Filter out null values
      });
      setImagePaths(newImagePaths);
    }
  }, [products]);
  // useEffect(() => {
  //   if (products.length > 0) {
  //     const defaultImagePath = "https://api.alghadeeruaecrafts.ae/Images/Product/default/noimage.jpg";
  //     const newImagePaths = {};
  
  //     products.forEach(product => {
  //       const productColors = JSON.parse(product.ProductSizeList[0].ProductColors || '[]');
  //       newImagePaths[product.ProductId] = productColors.map(color => {
  //         const productImages = JSON.parse(color.ProductImagePath || '[]');
  //         const srNo1Image = productImages.find(image => image.SrNo === 1);
  //         return srNo1Image ? srNo1Image.ImagePath : defaultImagePath;
  //       });
  //     });
  
  //     setImagePaths(newImagePaths);
  //   }
  // }, [products]);
  
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        selectedSubCategoryIds.length === 0 ||
        selectedSubCategoryIds.includes(product.SubCategoryId)
    );
    setFilteredProducts(filtered);
    setFilteredProductCount(filtered.length);
    setTotalPages(Math.ceil(filtered.length / productsPerPage));
    setCurrentPage(0); // Reset to first page
  }, [selectedSubCategoryIds, selectedCategoryId, products]);

  const formatUrlSegment = (str) => {
    return str.toLowerCase().replace(/\s+/g, '-');
  };

  return (

    <div>
      <TokenPage setGetToken={setGetToken} />

      {/* <GetProducts setProducts={setProducts} /> */}
      <SubCategoryProducts setSubCategoryProducts={setSubCategoryProducts} />
      <>{loaderFirst ?

        <div id="hola">
          <div id="preloader">
            <div className="loader-logo mx-auto mrg-b-30">
            </div>

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
          <div className="topBanner_sec">
            <div>
              {/* <TokenPage setGetToken={setGetToken} /> */}

              {/* <GetProducts setProducts={setProducts} /> */}
              <SubCategoryProducts setSubCategoryProducts={setSubCategoryProducts} />
              <GetAllCategories setAllCategory={setAllCategory} />

            </div>

            <ToastContainer />
            <div className="home_section_two secBg pt-100">
              <div className="full-container container">
                <div className="row justify-content-center">
                  <div className="col-md-8 mrg-b-30">
                    <div className="secTitle_wrap text-center mrg-b-30">
                      <div
                        className="sec_subTitle font-Lyon f-s-20"
                        data-aos="fade-up"
                        data-aos-delay={300}
                      >

                        {language === "en"
                          ? "Our Best Sellers"
                          : "الأكثر مبيعاً لدينا  "}

                      </div>
                      <div
                        className="sec_subTitle font-Lyon f-s-20"
                        data-aos="fade-up"
                        data-aos-delay={300}
                      >

                        {title || (language === "en" ? "Shop our Products" : "تسوق منتجاتنا ")}

                      </div>




                      <p
                        data-aos="fade-up"
                        data-aos-delay={600}
                      >


                        {passcategoryName}

                      </p>

                    </div>
                  </div>
                </div>
                <div>

                </div>
                {showRedirectMessage && (
                  <div className="redirect-message">
                    {language === "en"
                      ? "   User is not logged in Redirecting to login page"
                      : "لم يتم تسجيل دخول المستخدم. إعادة التوجيه إلى صفحة تسجيل الدخول"}

                  </div>
                )}
                <div className="row">
                  <div className="col-md-4 col-lg-4 col-xl-3">
                    <div className={isActive ? 'filterBx filter-mobWrp categoery-show' : 'filterBx filter-mobWrp'}>
                      {/* <div className="filterBtn text-end mb-3 d-md-none">
                        <button className="btn categoCta close-cta" onClick={categoriesShow}>X</button>
                      </div> */}

                      <CategoryComponent
                        language={language}
                        allCategory={allCategory}
                        selectedCategoryId={selectedCategoryId}
                        handleCategoryChange={handleCategoryChange}
                        mainSubCategories={mainSubCategories}
                        selectedSubCategoryIds={selectedSubCategoryIds}
                        handleSubCategoryChange={handleSubCategoryChange}
                      />
                    </div>
                    <div className="filterBtn text-center mb-3 d-md-none">

                      <button className="btn categoCta" id="categories" onClick={categoriesShow}>Categories</button>
                    </div>
                  </div>

                  <div className="col-md-8 col-lg-8 col-xl-9">
                    <div className="row">
                      {/* <div className="categoeryTitle">
                      {language === "en" ? "Products" : "منتجات"}
                    </div> */}
                      {filteredProducts.slice(offset, offset + productsPerPage).map((product) => (

                        <div
                          className="col-sm-6 col-md-6 col-lg-4"
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

                                  <Link
                                    to={`/OurProduct/${formatUrlSegment(product.CategoryNameE)}/${formatUrlSegment(product.ProductNameE)}/${product.ProductId}`}

                                  >
                                    <img
                                      decoding="async"
                                      alt={product.ProductId}
                                      src={imagePaths[product.ProductId] ? imagePaths[product.ProductId][0] : DUMMY}
                                      className="w-100 objCvr mobImg"
                                      loading="lazy"
                                      // onLoad={() =>
                                      // console.log(`Image loaded for ProductId: ${product.ProductId}`)}
                                      onError={(e) => {
                                        console.error(`Error loading image for ProductId: ${product.ProductId}`, e);
                                        e.target.src = `${BASE_PATH}Images/Product/images/products/default.png`;
                                      }}
                                    />
                                  </Link>

                                </picture>
                              </div>

                            </div>
                            <div className="productTitle_wrp text-center mrg-b-20">
                              <div className="productTitle font-Lyon">

                                <Link
                                  to={`/OurProduct/${formatUrlSegment(product.CategoryNameE)}/${formatUrlSegment(product.ProductNameE)}/${product.ProductId}`}
                                  className=""
                                >
                                  {language === "en" ? product.ProductNameE : product.ProductNameA}

                                </Link>




                              </div>

                              <div className="productTitle">
                                AED {product.ProductSizeList[0].ProductPrice}
                              </div>
                            </div>

                            <div className="productWrap_btns text-center">

                              <ul className="productWrap_btns_list mb-0">

                                <li className="list-inline-item">

                                  <Link
                                    to={`/OurProduct/${formatUrlSegment(product.CategoryNameE)}/${formatUrlSegment(product.ProductNameE)}/${product.ProductId}`}

                                    className="learnMore_btn"
                                  >

                                    {language === "en" ? "   Learn More" : "  تعرف على المزيد   "}

                                  </Link>

                                </li>
                                <li className="list-inline-item">
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip >    {language === "en"
                                      ? "Add to Wishlist"
                                      : "أضف إلى قائمة الأمنيات"}  </Tooltip>}
                                  >

                                    <Link
                                      className={`addTo-wishlist ${activeWishlistProducts.includes(product.ProductId) ? "active_wishlist" : ""}`}

                                      onClick={() => handleAddToWishlist(product.ProductId, product.SubCategoryId, product.CategoryId, UserID, tokenlogin, language, navigate, toast, setActiveWishlistProducts, setIsWishlist)}
                                    >
                                      <picture className="w-100 d-block">
                                        <source
                                          srcSet={add_to_wishlist_icon}
                                          media="(min-width: 768px)"
                                          className="w-100 objCvr deskImg"

                                        />
                                        <img
                                          decoding="async"
                                          src={add_to_wishlist_icon}
                                          className="w-100 objCvr mobImg"
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

                                      <Tooltip >
                                        {language === "en"
                                          ? "Add to Cart "
                                          : "أضف إلى السلة"}
                                      </Tooltip>
                                    }
                                  >


                                    <Link to={`/OurProduct/${formatUrlSegment(product.CategoryNameE)}/${formatUrlSegment(product.ProductNameE)}/${product.ProductId}`}
                                      className="addTo-cart"

                                    >
                                      <picture className="w-100 d-block">

                                        <img
                                          decoding="async"
                                          src={add_to_icon}
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

                    {filteredProducts.length > 0 && (
                      <>
                        <ReactPaginate
                          previousLabel={"<"}
                          nextLabel={">"}
                          breakLabel={"..."}
                          pageCount={totalPages}
                          pageRangeDisplayed={4}
                          marginPagesDisplayed={2}
                          onPageChange={handlePageChange}
                          containerClassName={"pagination"}
                          activeClassName={"active"}
                          forcePage={currentPage} // Ensures the current page is correctly set
                          disabledLinkClassName="disablepagination"
                          previousClassName={currentPage === 0 ? "disablepagination" : ""}
                          previousLinkClassName={currentPage === 0 ? "disablepagination" : ""}
                          nextClassName={currentPage === totalPages - 1 ? "disablepagination" : ""}
                          nextLinkClassName={currentPage === totalPages - 1 ? "disablepagination" : ""}
                        />
                      </>

                    )}

                    {filteredProducts.length === 0 && (
                      <div>

                        {language === "en"
                          ? " No Products Found "
                          : "لم يتم العثور على أي منتجات  "}
                      </div>
                    )}


                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </div>

  );
};

export default OurproductScreen;