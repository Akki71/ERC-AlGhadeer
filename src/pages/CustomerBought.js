import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BASE_PATH} from "../serviceurls";
import handleAddToWishlist from '../utils/wishlistUtils';
import Loader from '../components/Loader';
import { useLanguage } from '../redux/LanguageContext';
import add_to_wishlist_icon from "../assets/images/add-to-wishlist-icon.png";
import add_to_icon from "../assets/images/add-to-cart-icon.png";
import DUMMY from "../assets/images/noimage.jpg";

const CustomerBought = (categoryNameE, id) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeWishlistProducts, setActiveWishlistProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState(4);
    const { language } = useLanguage();
    const token = localStorage.getItem('token');
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
                // console.log(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [token]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    const [imagePaths, setImagePaths]=useState([]);

    useEffect(() => {
        // console.log(categoryNameE.categoryNameE);
        // console.log(products);
        const filtered = products.filter((product) => {
            const formattedCategoryNameE = product.CategoryNameE.toLowerCase().replace(/\s+/g, '-');
            return formattedCategoryNameE === categoryNameE.categoryNameE;
        });
        // console.log("filtered", filtered);
        setFilteredProducts(filtered)
    }, [products])

    const importProductImage = (ProductId, format = 'PNG') => {
        const basePath = `${BASE_PATH}Images/Product/images/products/`;
        const imageUrl = `${basePath}${ProductId}/1.${format.toLowerCase()}`;
        return imageUrl;
    };

    const formatUrlSegment = (str) => {
        return str.toLowerCase().replace(/\s+/g, '-');
    };

    return (
        <div>
            {/* <ToastContainer /> */}
            {loading ? (
                <div id="hola">
                    <div id="preloader">
                        <div className="loader-logo mx-auto mrg-b-30"></div>
                        <div className="loadingTxt text-center">
                            <div className="txtSummary f-s-20">
                                <Loader />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="topBanner_sec">
                    <div className="home_section_two secBg pt-100">
                        <div className="full-container container">
                            <div className="row justify-content-center">
                                <div className="col-md-8 mrg-b-30">
                                    <div className="secTitle_wrap text-center mrg-b-30">
                                        <div className="sec_subTitle font-Lyon f-s-20" data-aos="fade-up" data-aos-delay={300}>
                                            {language === "en" ? "CUSTOMERS ALSO BOUGHT" :"المتسوقون اشتروا أيضاً"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {filteredProducts.length > 0 && (
                                <div className="row">
                                    <div className="col-md-8 col-lg-8 col-xl-12">
                                        <div className="row">


                                            {filteredProducts.filter(product => product.ProductId.toString() !== id)
                                                .slice(0, visibleProducts)
                                                .map((product) => (
                                                    <div className="col-sm-6 col-md-6 col-lg-3" key={product.ProductId}>
                                                        <div className="productBx mrg-b-30" data-aos="fade-up" data-aos-delay={100}>
                                                            <div className="product-img position-relative">
                                                                <div className="product-imgInn">
                                                                    <picture className="w-100 d-block">
                                                                        <Link to={`/OurProduct/${formatUrlSegment(product.CategoryNameE)}/${formatUrlSegment(product.ProductNameE)}/${product.ProductId}`}>
                                                                            <img
                                                                                decoding="async"
                                                                                alt={product.ProductId}
                                                                                src={imagePaths[product.ProductId] ? imagePaths[product.ProductId][0] : DUMMY}

                                                                                className="w-100 objCvr mobImg"
                                                                                loading="lazy"
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
                                                                    <Link to={`/OurProduct/${formatUrlSegment(product.CategoryNameE)}/${formatUrlSegment(product.ProductNameE)}/${product.ProductId}`} className="">
                                                                        {language === "en" ? product.ProductNameE : product.ProductNameA}
                                                                    </Link>
                                                                </div>
                                                                <div className="productTitle">AED {product.ProductSizeList[0].ProductPrice}</div>
                                                            </div>
                                                            <div className="productWrap_btns text-center">
                                                                <ul className="productWrap_btns_list mb-0">
                                                                    <li className="list-inline-item">
                                                                        <Link to={`/OurProduct/${formatUrlSegment(product.CategoryNameE)}/${formatUrlSegment(product.ProductNameE)}/${product.ProductId}`} className="learnMore_btn">
                                                                            {language === "en" ? "Learn More" : "التعرف على المزيد"}
                                                                        </Link>
                                                                    </li>
                                                                    <li className="list-inline-item">
                                                                        <OverlayTrigger placement="top" overlay={<Tooltip>{language === "en" ? "Add to Wishlist" : "أضف إلى قائمة الأمنيات"}</Tooltip>}>
                                                                            <Link
                                                                                className={`addTo-wishlist ${activeWishlistProducts.includes(product.ProductId) ? "active_wishlist" : ""}`}
                                                                            >
                                                                                <picture className="w-100 d-block">
                                                                                    <source srcSet={add_to_wishlist_icon} media="(min-width: 768px)" className="w-100 objCvr deskImg" />
                                                                                    <img decoding="async" src={add_to_wishlist_icon} className="w-100 objCvr mobImg" loading="lazy" />
                                                                                </picture>
                                                                            </Link>
                                                                        </OverlayTrigger>
                                                                    </li>
                                                                    <li className="list-inline-item">
                                                                        <OverlayTrigger placement="top" overlay={<Tooltip>{language === "en" ? "Add to Cart" : "أضف إلى السلة"}</Tooltip>}>
                                                                            <Link to={`/OurProduct/${formatUrlSegment(product.CategoryNameE)}/${formatUrlSegment(product.ProductNameE)}/${product.ProductId}`} className="addTo-cart">
                                                                                <img decoding="async" src={add_to_icon} className="w-100 objCvr mobImg" loading="lazy" />
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

                                    <div className=" text-center" >
                                        {visibleProducts !== 8 && (
                                            <button className="loadmore-button " onClick={() => setVisibleProducts(8)}>Load More</button>
                                        )}
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomerBought;
