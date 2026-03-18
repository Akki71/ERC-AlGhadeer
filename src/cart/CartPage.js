import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import minus_icon from "../assets/images/minus-icon.png";
import plus_icon from "../assets/images/plus-icon.png";
import { Trash } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { DataContext } from "../utils/ApiContext";
import Loader from "../components/Loader";
import BASE_PATH from "../serviceurls";
import { useLanguage } from "../redux/LanguageContext";
function CartPage() {
  const navigate = useNavigate();
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [con, setcon] = useState(false);
  const [loaderFirst, setLoader] = useState(true);
  const [Active, setActive] = useState(false);
  const UserID = localStorage.getItem("UserID");
  const tokenlogin = localStorage.getItem("loginToken");
  const dispatch = useDispatch();
  const { language } = useLanguage();
  const { data, setData } = useContext(DataContext);

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
      // console.log("cartData", cartData);

      setData(cartData.length); // Assuming setData is defined elsewhere
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    updateData();
    const UserID = localStorage.getItem("UserID");
    const tokenlogin = localStorage.getItem("loginToken");

    // Check if UserID and tokenlogin exist
    const apiUrl = `${BASE_PATH}Order/GetAllUserOrdersInCartByUserId?userId=${UserID}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenlogin}`,
      },
    })
      .then((response) => {
        setLoader(false);
        // console.log(response);
        if (response.status === 401) {
          localStorage.removeItem("loginToken");
          localStorage.removeItem("UserID");
          // Unauthorized or Bad Request - Redirect to login page or handle the error accordingly
          // setTimeout(() => {
          //   language === "en"
          //     ? navigate("/login/en")
          //     : navigate("/login/ar");
          // }, 100);
        } else if (!response.ok) {
          // Handle other error cases
          // throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setLoader(false);
        // console.log("User orders:", data);
        setUserOrders(data);
        const isActive = data.some((item) => item.IsProductActive === false);
        // console.log("isActive", isActive);
        setActive(isActive);
        const quantities = data.map((item) => item.ProductAvailableQuantity);
        if (quantities.some((value) => value < 1)) {
          // console.log("There is at least one value less than 1 in the cart.");
          setProductQuantity(true);
        } else {
          // console.log("All values in the cart are greater than or equal to 1.");
        }
      })
      .catch((error) => {
        setLoader(false);

        if (error.message !== "Unauthorized") {
          console.error("Error fetching user orders:", error);
        }
      });
  }, []);

  const handleRemoveProduct = () => {
    const updatedUserOrders = userOrders.filter(
      (order) => order.OrderId !== valueforp
    );
    setUserOrders(updatedUserOrders);
    const isActive = updatedUserOrders.some(
      (item) => item.IsProductActive === false
    );
    setActive(isActive);
    setShow(false);

    setcon(true);
    const apiUrl = `${BASE_PATH}Order/RemoveOrderFromCart?orderId=${valueforp}`;

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
        setUserOrders(updatedUserOrders);
        const isActive = updatedUserOrders.some(
          (item) => item.IsProductActive === false
        );
        // console.log("isActive", isActive);
        setActive(isActive);
        setTimeout(() => {
          fetchUserOrdersAndCheckQuantity();
          setcon(false);
        }, 1000); // Set the timeout duration in milliseconds
      })
      .catch((error) => {
        // console.error("Error removing order:", error);
      });
  };
  const fetchUserOrdersAndCheckQuantity = () => {
      if (!UserID) {
      return
    }
    // Fetch user orders...
    const UserID = localStorage.getItem("UserID");
    const tokenlogin = localStorage.getItem("loginToken");

    // Check if UserID and tokenlogin exist

    const apiUrl = `${BASE_PATH}Order/GetAllUserOrdersInCartByUserId?userId=${UserID}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenlogin}`,
      },
    })
      .then((response) => {
        if (response.status === 401 || response.status === 400) {
          // Unauthorized, redirect to login
          // localStorage.removeItem("loginToken");
          // localStorage.removeItem("UserID");
          // language === "en" ?
          //   navigate("/login/en") :
          //   navigate("/login/ar");
          throw new Error("Unauthorized");
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log("User orders:", data);
        setUserOrders(data);
        setcon(false);
        const quantities = data.map((item) => item.ProductAvailableQuantity);

        if (quantities.some((value) => value < 1)) {
          // console.log("There is at least one value less than 1 in the array.");
          setProductQuantity(true);
        } else {
          // // console.log(
          //   "All values in the array are greater than or equal to 1."
          // );
          setProductQuantity(false);
        }
      })
      .catch((error) => {
        if (error.message !== "Unauthorized") {
          console.error("Error fetching user orders:", error);
        }
      });

    // After fetching user orders, check if any product is out of stock
  };

  const [showModalforQuantity, setshowModalforQuantity] = useState(false);
  const [ProductQuantity, setProductQuantity] = useState(false);

  const handleCloseforQuantity = () => setshowModalforQuantity(false);
  const handleShowforQuantity = () => {
    setshowModalforQuantity(true);
    setTimeout(() => {
      setshowModalforQuantity(false);
    }, 2000);
  };

  const handleUpdateQuantity = (
    orderId,
    newQuantity,
    ProductAvailableQuantity
  ) => {
    if (newQuantity < 1) {
      return;
    }

    if (ProductAvailableQuantity >= newQuantity) {
      const updatedUserOrders = userOrders.map((order) =>
        order.OrderId === orderId
          ? { ...order, OrderQuantity: newQuantity }
          : order
      );
      setUserOrders(updatedUserOrders);

      const updatedOrder = userOrders.find(
        (order) => order.OrderId === orderId
      );

      const apiUrl = `${BASE_PATH}Order/UpdateOrderInCart`;
      fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json-patch+json",
          Authorization: `Bearer ${tokenlogin}`,
        },
        body: JSON.stringify({
          OrderId: updatedOrder.OrderId,
          ProductId: updatedOrder.ProductId,
          CategoryId: updatedOrder.CategoryId,
          SubCategoryId: updatedOrder.SubCategoryId,
          UserId: UserID,
          ProductSizeId: updatedOrder.ProductSizeId,
          ProductColorOrdered: updatedOrder.ProductColorOrdered,

          OrderPrice: updatedOrder.OrderPrice,
          OrderQuantity: newQuantity,
          TotalAmount: updatedOrder.TotalAmount,
          Status: "InCart",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log("Order updated:", data);
        })
        .catch((error) => {
          // console.error("Error updating order:", error);
        });
    } else {
      handleShowforQuantity();
    }
  };

  const handleUpdateQuantityminus = (
    orderId,
    newQuantity,
    ProductAvailableQuantity
  ) => {
    if (newQuantity < 1) {
      return;
    }
    // console.log(ProductAvailableQuantity);
    // console.log(newQuantity);

    // console.log(ProductAvailableQuantity >= newQuantity);

    const updatedUserOrders = userOrders.map((order) =>
      order.OrderId === orderId
        ? { ...order, OrderQuantity: newQuantity }
        : order
    );
    setUserOrders(updatedUserOrders);

    const updatedOrder = userOrders.find((order) => order.OrderId === orderId);

    const apiUrl = `${BASE_PATH}Order/UpdateOrderInCart`;
    fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json-patch+json",
        Authorization: `Bearer ${tokenlogin}`,
      },
      body: JSON.stringify({
        OrderId: updatedOrder.OrderId,
        ProductId: updatedOrder.ProductId,
        CategoryId: updatedOrder.CategoryId,
        SubCategoryId: updatedOrder.SubCategoryId,
        UserId: UserID,
        ProductSizeId: updatedOrder.ProductSizeId,
        ProductColorOrdered: updatedOrder.ProductColorOrdered,
        OrderPrice: updatedOrder.OrderPrice,
        OrderQuantity: newQuantity,
        TotalAmount: updatedOrder.TotalAmount,
        Status: "InCart",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("Order updated:", data);
      })
      .catch((error) => {
        // console.error("Error updating order:", error);
      });
  };

  // const calculatesubTotal = () => {
  //   return userOrders.reduce(
  //     (total, order) => total + order.OrderQuantity * order.OrderPrice,
  //     0
  //   );
  // };

  const calculateTotal = () => {
    const subtotal = userOrders.reduce(
      (total, order) => total + order.OrderQuantity * order.ProductCurrentPrice,
      0
    );

    const shipping = calculateEstimatedShipping(); // Assuming calculateEstimatedShipping() is defined elsewhere

    return subtotal + shipping;
  };

  const guestcheckout = () => {
    navigate("/checkoutGuest");
  };

  const handleProceedToCheckout = async () => {
    if (!UserID) {
      navigate("/login");

      return;
    }

    try {
      for (const order of userOrders) {
        const updateApiUrl = `${BASE_PATH}Order/UpdateOrderInCart`;
        const response = await fetch(updateApiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json-patch+json",
            Authorization: `Bearer ${tokenlogin}`,
          },

          body: JSON.stringify({
            ProductSizeId: order.ProductSizeId,
            ProductColorOrdered: order.ProductColorOrdered,
            OrderId: order.OrderId,
            ProductId: order.ProductId,
            CategoryId: order.CategoryId,
            ProductSizeId: order.ProductSizeId,
            SubCategoryId: order.SubCategoryId,
            UserId: UserID,
            OrderPrice: order.OrderPrice,
            OrderQuantity: order.OrderQuantity,
            TotalAmount: calculateTotal(),
            Status: "InCart",
          }),
        });
        const data = await response.json();
        // console.log("Order updated for Proceeding to Checkout:", data);
      }
      navigate("/checkout", { state: userOrders });
      // language === "en"
      //   ? navigate("/checkout/en", { state: userOrders })
      //   : navigate("/checkout/ar", { state: userOrders });
    } catch (error) {
      // console.error("Error updating orders:", error);
      // Handle error as needed
      //  navigate('/destination', { state: stateToPass });
    }
  };

  const importProductImage = (productID, format = "PNG") => {
    const basePath = `${BASE_PATH}Images/Product/images/products/`;

    const imageUrl = `${basePath}${productID}/1.${format.toLowerCase()}`; // Assuming format is provided without a leading dot
    return imageUrl;
  };

  const importProductImageWrapper = (productID, format) => {
    try {
      return importProductImage(productID, format);
    } catch (error) {
      // console.error(`Error loading image for product ${productID}:`, error);
      return `${BASE_PATH}Images/Product/images/products/default.${format.toLowerCase()}`;
    }
  };

  const [shippingData, setShippingData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!UserID) {
      return
    }
    const apiUrl = `${BASE_PATH}Security/GetAllShippingCost`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenlogin}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch shipping data");
        }
        return response.json();
      })
      .then((data) => {
        // console.log("Shipping costs data:", data);
        setShippingData(data);
      })
      .catch((error) => {
        // console.error("Error fetching shipping data:", error);
        setError(error);
        // localStorage.removeItem("loginToken");
        // localStorage.removeItem("UserID");
        // navigate("/login")
      });
  }, [UserID, tokenlogin, navigate, language]);

  const calculateEstimatedShipping = () => {
    return shippingData ? 0 : 0;
  };
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Close popup after 5 seconds
  useEffect(() => {
    let closeTimer;
    if (showPopup) {
      closeTimer = setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    }

    return () => clearTimeout(closeTimer);
  }, [showPopup]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const [show, setShow] = useState(false);
  const [valueforp, setvalueforp] = useState();
  const [GuestProductID, setGuestProductID] = useState();

  const handleopene = () => setShow(false);
  const handleClose = () => setShow(false);
  const handleShow = (OrderId, ProductSizeId) => {
    setShow(true);
    setGuestProductID(ProductSizeId);
    setvalueforp(OrderId);
  };

  useEffect(() => {
    window.scrollTo(0, 700);
  }, []);

  //----------------------------------------------------------------------------------

  useEffect(() => {
    let products = JSON.parse(localStorage.getItem("guestProduct")) || [];

    // console.log(products);
    if (!UserID) {
      setUserOrders(products);
    }
    const quantities = products.map((item) => item.ProductAvailableQuantity);
    if (quantities.some((value) => value < 1)) {
      setProductQuantity(true);
    }
  }, []);

  const removeGuestProduct = () => {
    // console.log(GuestProductID);
    let products = JSON.parse(localStorage.getItem("guestProduct")) || [];
    products = products.filter(
      (product) => product.ProductSizeId !== GuestProductID
    );
    localStorage.setItem("guestProduct", JSON.stringify(products));
    setUserOrders(products);
    const quantities = products.map((item) => item.ProductAvailableQuantity);
    updateData();
    if (quantities.some((value) => value < 1)) {
      setProductQuantity(true);
    } else {
      setProductQuantity(false);
    }
    setShow(false);
  };

  ///-----------------------------------------------------------------

  const handleUpdateQuantityforGuestLogin = (ProductId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    let productData = JSON.parse(localStorage.getItem("guestProduct")) || [];

    let product = productData.find(
      (product) => product.ProductId === ProductId
    );

    if (product.ProductAvailableQuantity >= newQuantity) {
      product.OrderQuantity = newQuantity;
      localStorage.setItem("guestProduct", JSON.stringify(productData));

      setUserOrders(productData);
    } else {
      handleShowforQuantity();
    }
  };
  const formatUrlSegment = (str) => {
    return str.toLowerCase().replace(/\s+/g, "-");
  };
  return (
    <>
      {loaderFirst ? (
        <div id="hola">
          <div id="preloader">
            <Loader />
          </div>
        </div>
      ) : loading ? (
        <div id="hola">
          <div id="preloader">
            <div className="loader-logo mx-auto mrg-b-30"></div>
            <div className="loadingTxt text-center">

              <Loader />

            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="topBanner_sec">
            <div className="topBanner_inn">
              <img
                src={`${BASE_PATH}Images/Product/images/dashboard-bg.jpg`}
                className="w-100"
                alt=""
              />
            </div>
          </div>
          <div className="section_dashboard secBg">
            {showRedirectMessage && (
              <div className="f-s-20 d-flex h-100 align-items-center justify-content-center">
                {language === "en"
                  ? " User is not logged in. Redirecting to login page   "
                  : "لم يتم تسجيل دخول المستخدم. إعادة التوجيه إلى صفحة تسجيل الدخول"}
              </div>
            )}
            <>
              {con ? (
                <Loader />
              ) : (
                <>
                  <div className="full-container container">
                    <div className="row">
                      <div className="col-lg-8">
                        {userOrders.length > 0 ? (
                          <div className="table-responsive ">
                            <table className="table cstTable cartTable f-s-16 w-100 w-md-90 cartTable">
                              <thead>
                                <tr>
                                  <th width="20%">
                                    {language === "en"
                                      ? "Product"
                                      : "حاصل الضرب"}
                                  </th>
                                  <th width="30%" className="text-center"></th>
                                  <th width="5%" className="text-center">
                                    {language === "en" ? "Quantity" : "كم"}
                                  </th>
                                  <th width="15%" className="text-center">
                                    {language === "en"
                                      ? "Product size"
                                      : "حجم المنتج"}
                                  </th>
                                  <th width="15%" className="text-center">
                                    {language === "en" ? "Price" : "ثمن"}
                                  </th>
                                  <th width="10%" className="text-center">
                                    {language === "en"
                                      ? "  Product color   "
                                      : " لون المنتج    "}
                                  </th>
                                  <th width="10%"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {userOrders
                                  .slice()
                                  .sort((a, b) => b.OrderId - a.OrderId)
                                  .map((order) => (
                                    <tr key={order.OrderId}>
                                      <td data-label="">
                                        <Link
                                          to={`/OurProduct/${formatUrlSegment(
                                            order.CategoryNameE
                                          )}/${formatUrlSegment(
                                            order.ProductNameE
                                          )}/${order.ProductId}`}
                                        >
                                          <img
                                            decoding="async"
                                            alt={order.ProductId}
                                            src={importProductImageWrapper(
                                              order.ProductId
                                            )}
                                            className="w-100 objCvr mobImg"
                                            loading="lazy"
                                            onError={(e) => {
                                              e.target.src = `${BASE_PATH}Images/Product/images/products/default.png`;
                                            }}
                                          />
                                        </Link>
                                      </td>
                                      <td data-label="">
                                        <div className="productTitle font-Lyon">
                                          <Link
                                            to={`/OurProduct/${formatUrlSegment(
                                              order.CategoryNameE
                                            )}/${formatUrlSegment(
                                              order.ProductNameE
                                            )}/${order.ProductId}`}
                                            className=""
                                          >
                                            {language === "en"
                                              ? order.ProductNameE
                                              : order.ProductNameA}
                                          </Link>

                                          <br />
                                          {language === "en"
                                            ? order.SubCategoryNameE
                                            : order.SubCategoryNameA}
                                        </div>
                                        {order.ProductAvailableQuantity <
                                          order.OrderQuantity ? (
                                          <h6 className="error-message">
                                            {language === "en"
                                              ? "Out of Stock"
                                              : "غير متاح"}
                                          </h6>
                                        ) : order.IsProductActive === false ? (
                                          <h6 className="error-message">
                                            {language === "en"
                                              ? "Product not available"
                                              : "  المنتجات غير متوفرة "}
                                          </h6>
                                        ) : null}
                                      </td>
                                      <td className="text-center" data-label="">
                                        <div className="qty-container d-flex">
                                          <button
                                            className="btn p-0 qty-btn-minus"
                                            type="button"
                                            // disabled={(order.Quantity < 2) ? "disabled" : ""}

                                            onClick={() => {
                                              if (UserID) {
                                                handleUpdateQuantityminus(
                                                  order.OrderId,
                                                  order.OrderQuantity - 1,
                                                  order.ProductAvailableQuantity
                                                );
                                              } else {
                                                handleUpdateQuantityforGuestLogin(
                                                  order.ProductId,
                                                  parseInt(
                                                    order.OrderQuantity
                                                  ) - 1
                                                );
                                              }
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
                                            value={order.OrderQuantity}
                                            className="input-qty"
                                          />
                                          <button
                                            className="btn p-0 qty-btn-plus"
                                            type="button"
                                            onMouseOver={() => (
                                              "in cartordeer check", order
                                            )}
                                            // disabled={
                                            //   order.ProductAvailableQuantity <=
                                            //     order.OrderQuantity
                                            //     ? "disabled"
                                            //     : ""
                                            // }
                                            onClick={() => {
                                              if (UserID) {
                                                handleUpdateQuantity(
                                                  order.OrderId,
                                                  order.OrderQuantity + 1,
                                                  order.ProductAvailableQuantity
                                                );
                                              } else {
                                                handleUpdateQuantityforGuestLogin(
                                                  order.ProductId,
                                                  parseInt(
                                                    order.OrderQuantity
                                                  ) + 1
                                                );
                                              }
                                            }}
                                          >
                                            <img
                                              src={plus_icon}
                                              className="w-100"
                                              alt="Plus"
                                            />
                                          </button>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-center">
                                          <div className="product-sizeBx m-auto">
                                            {" "}
                                            {language === "en"
                                              ? order.ProductSizeNameE
                                              : order.ProductSizeNameA}
                                          </div>
                                        </div>
                                      </td>
                                      <td
                                        className="text-center text-nowrap"
                                        data-label=""
                                      >
                                        <strong>
                                          AED {order.ProductCurrentPrice}
                                        </strong>
                                      </td>
                                      {/* <td className="text-center" data-label="">
                                        {JSON.parse(order.ProductColorOrdered) === null ? " " : (
                                          <div className='circle mx-auto'>
                                            <img
                                              src={JSON.parse(order.ProductColorOrdered).ImagePath}
                                              alt={JSON.parse(order.ProductColorOrdered).ProductColorNameE}
                                              style={{ width: '100%', height: '100%', }}
                                            />
                                          </div>
                                        )}
                                      </td> */}
                                      <td className="text-center" data-label="">
                                        {order.ProductColorOrdered
                                          ? (() => {
                                            try {
                                              const colorOrdered = JSON.parse(
                                                order.ProductColorOrdered
                                              );
                                              if (
                                                colorOrdered &&
                                                colorOrdered.ImagePath
                                              ) {
                                                // Replace old URL with the new URL
                                                const updatedImagePath =
                                                  colorOrdered.ImagePath.replace(
                                                    "http://192.168.17.172:81/",
                                                    BASE_PATH
                                                  );
                                                return (
                                                  <div className="circle mx-auto">
                                                    <img
                                                      src={updatedImagePath}
                                                      alt={
                                                        colorOrdered.ProductColorNameE
                                                      }
                                                      style={{
                                                        width: "100%",
                                                        height: "100%",
                                                      }}
                                                    />
                                                  </div>
                                                );
                                              } else {
                                                return " ";
                                              }
                                            } catch (error) {
                                              console.error(
                                                "Error parsing ProductColorOrdered:",
                                                error
                                              );
                                              return " ";
                                            }
                                          })()
                                          : " "}
                                      </td>

                                      <td
                                        className="text-center "
                                        data-label=""
                                      >
                                        <button
                                          type="button"
                                          className="btn btn-addCart font-Lyon line_H_1"
                                          onClick={() => {
                                            handleShow(
                                              order.OrderId,
                                              order.ProductSizeId
                                            );
                                          }}
                                        >
                                          <Trash />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}

                                <Modal
                                  show={showModalforQuantity}
                                  onHide={handleCloseforQuantity}
                                  centered
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>
                                      {language === "en"
                                        ? "Maximum quantity"
                                        : "الكمية القصوى"}
                                    </Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    {language === "en"
                                      ? " You have reached the maximum quantity allowed for the product."
                                      : "تم الوصول للحد الأقصى للشراء لهذا المنتج "}
                                  </Modal.Body>
                                </Modal>

                                <Modal
                                  show={show}
                                  onHide={handleClose}
                                  backdrop="static"
                                  keyboard={false}
                                  centered
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>
                                      {language === "en"
                                        ? "You are about to remove a product  "
                                        : " انت على وشك ازالة منتج     "}
                                    </Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    {language === "en"
                                      ? "  This will remove the product from your cart."
                                      : "        سيتم ازالة المنتج من سلة التسوق     "}
                                    <br />{" "}
                                    {language === "en"
                                      ? "Are you sure? "
                                      : " هل أنت متأكد؟"}
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <button
                                      className="submitBtn"
                                      //onClick={() => { handleRemoveProduct(order.OrderId); handleClick2(); }}

                                      onClick={() => {
                                        if (UserID) {
                                          handleRemoveProduct();
                                          setTimeout(() => {
                                            updateData();
                                          }, 1000);
                                        } else {
                                          removeGuestProduct();
                                          updateData();
                                        }
                                      }}
                                    >
                                      {language === "en" ? "Yes" : " نعم "}
                                    </button>
                                    <button
                                      className="submitBtn"
                                      onClick={handleClose}
                                    >
                                      {language === "en" ? "No" : " لا "}
                                    </button>
                                  </Modal.Footer>
                                </Modal>
                              </tbody>
                            </table>

                            {ProductQuantity || Active ? (
                              <p className="text-center error-message">
                                {language === "en"
                                  ? " One or more items in your cart are currently out of stock or not available. Please remove them to proceed."
                                  : "     هناك منتج واحد أو أكثر في سلة التسوق الخاصة بك غير متوفر حاليًا. يرجى إزالته للمتابعة."}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          <div className="f-s-20 d-flex h-100 align-items-center justify-content-center">
                            <p>
                              {language === "en"
                                ? "No products in the cart."
                                : " لا توجد منتجات في سلة التسوق. أضف منتجات إلى سلة التسوق الخاصة بك."}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="col-lg-4">
                        <table>
                          <tbody>
                            {userOrders.length > 0 ? (
                              <tr>
                                <td>
                                  <h3>
                                    {language === "en"
                                      ? "Subtotal"
                                      : "المجموع الفرعي"}
                                  </h3>
                                </td>
                                <td className="text-right">
                                  <h3>
                                    <strong>{`AED ${calculateTotal()}`}</strong>
                                  </h3>
                                </td>
                              </tr>
                            ) : (
                              <></>
                            )}
                          </tbody>
                        </table>

                        {userOrders.length > 0 ? (
                          <>
                            <div className="form-group">
                              <button
                                className="submitBtn"
                                onClick={handleProceedToCheckout}
                                disabled={
                                  ProductQuantity || Active ? "disabled" : ""
                                }
                              >
                                {language === "en"
                                  ? "Proceed to Checkout"
                                  : "انتقل إلى الخروج"}
                              </button>
                            </div>

                            <>
                              {!UserID && (
                                <div className="form-group">
                                  <button
                                    className="submitBtn"
                                    onClick={guestcheckout}
                                    disabled={
                                      ProductQuantity || Active
                                        ? "disabled"
                                        : ""
                                    }
                                  >
                                    {language === "en"
                                      ? "Checkout As A Guest"
                                      : "Checkout As A Guest"}
                                  </button>
                                </div>
                              )}
                            </>
                          </>
                        ) : (
                          <div>
                            <div>
                              <div className="form-group">
                                <Link
                                  to="/ourproductlisting"
                                  className="submitBtn"
                                >
                                  {language === "en"
                                    ? "     Add Products"
                                    : "     أضف منتج"}{" "}
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          </div>
        </div>
      )}
    </>
  );
}

export default CartPage;
