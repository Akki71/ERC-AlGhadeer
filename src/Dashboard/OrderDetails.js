import DashboardNav from "./DashboardNav";
import AL_Ghadeer_logo from "../assets/images/collection-img-1.jpg";
import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import Loader from "../components/Loader";
import BASE_PATH from "../serviceurls";
import { DataContext } from "../utils/ApiContext";
import "font-awesome/css/font-awesome.min.css";
import "../global.css";
import { useLanguage } from "../redux/LanguageContext";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrderPDF from "./OrderPDF"; // Make sure the path is correct
const OrderDetails = () => {
  const { id } = useParams();
  // console.log("Order ID:", id);
  const [con, setcon] = useState(true);
  const [loaderFirst, setLoader] = useState(true);
  const { language } = useLanguage();
  const [invoiceData, setInvoiceData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const tokenlogin = localStorage.getItem("loginToken");
  const UserID = localStorage.getItem("UserID");
  useEffect(() => {
    window.scrollTo(0, 600);
  }, []);
  const handleViewDetails = async (id) => {
    // Changed parameter name to id
    // setSelectedOrder(order);
    // console.log(order.OrderId);
    try {
      const response = await fetch(
        `${BASE_PATH}Order/GetInvoiceDetailsByInvoiceId?invoiceId=${id}`,
        {
          // Used id parameter
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${tokenlogin}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const fetchedInvoiceData = await response.json();
      // console.log("Invoice details", fetchedInvoiceData);
      setLoader(false);

      setInvoiceData(fetchedInvoiceData); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };
  const username =
    invoiceData && invoiceData.OrderList && invoiceData.OrderList.length > 0
      ? invoiceData.OrderList[0].UserName
        ? invoiceData.OrderList[0].UserName
        : "N/A"
      : "N/A";

  // console.log("username", username);

  // console.log("username", username);

  // console.log("username", username);
  useEffect(() => {
    // Fetch invoice details when the component mounts
    handleViewDetails(id);
  }, [id]);

  const filteredOrder = invoiceData && invoiceData.OrderList;
  const importProductImage = (productID, format = "PNG") => {
    const basePath = `${BASE_PATH}Images/Product/images/products/`;

    const imageUrl = `${basePath}${productID}/1.${format.toLowerCase()}`; // Assuming format is provided without a leading dot
    return imageUrl;
  };
  useEffect(() => {
    window.scrollTo(0, 300);

    setTimeout(() => {
      setcon(false);
    }, 800);
  }, []);
  const importProductImageWrapper = (productID, format) => {
    try {
      return importProductImage(productID, format);
    } catch (error) {
      console.error(`Error loading image for product ${productID}:`, error);
      return `${BASE_PATH}Images/Product/images/products/default.${format.toLowerCase()}`;
    }
  };

  return (
    <div>
      {loaderFirst && (
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
      )}
      <>
        <div className="topBanner_sec">
          <div className="topBanner_inn">
            <img
              src={`${BASE_PATH}Images/Product/dashboard-bg.jpg`}
              className="w-100"
              alt=""
            />
          </div>
        </div>

        <div className="section_dashboard secBg">
          <div className="full-container container">
            <div className="row justify-content-center">
              <div className="col-md-3 col-xl-3 col-xxl-2">
                <DashboardNav />
              </div>

              <div className="col-md-9 col-xl-8 col-xxl-8">
                {con ? (
                  <Loader />
                ) : (
                  <div className="rightdashboard">
                    <div className="col-lg-12"></div>

                    <div className="mrg-b-20 ">
                      <div className="row">
                        <div className="col-xxl-7 ">
                          <div className="details_productMain shiping-adBox mrg-b-20">
                            <div className="billtingTitle f-s-20 mrg-b-10 line_H_1_2 erc-orderTitle">
                              <strong>
                                {language === "en"
                                  ? "Order Details"
                                  : "  تفاصيل الطلب"}{" "}
                              </strong>
                            </div>

                            {/* <table className='cstTable table mb-0 erc-orderTable'>

                                                    {invoiceData.OrderList ? (
                                                        <tbody>
                                                            {filteredOrder.map((orderItem, index) => (
                                                                <tr key={index}>
                                                                    <td width="30%">
                                                                        <img
                                                                            decoding="async"
                                                                            alt={orderItem.ProductId}
                                                                            src={importProductImageWrapper(orderItem.ProductId)}
                                                                            className="w-100 objCvr mobImg"
                                                                            loading="lazy"
                                                                            // onLoad={() => console.log(`Image loaded for productID: ${orderItem.ProductId}`)}
                                                                            onError={(e) => {
                                                                                console.error(`Error loading image for productID: ${orderItem.ProductId}`, e);
                                                                                e.target.src = 'https://api.alghadeeruaecrafts.ae/Images/Product/images/products/default.png'; // Set default image
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td width="70%">
                                                                        <div className="d-flex gap-2">
                                                                            <label> Order Id:</label>
                                                                            <div>{orderItem.OrderId}</div>
                                                                        </div>
                                                                        <div className="d-flex gap-2">
                                                                            <label> Product Name:</label>
                                                                            <div>{orderItem.ProductNameE}</div>
                                                                        </div>
                                                                     
                                                                        <div className="d-flex gap-2">
                                                                            <label>Price:</label>
                                                                            <div>{orderItem.OrderPrice} x {orderItem.OrderQuantity}</div>
                                                                        </div>
                                                                        <div className="d-flex gap-2">
                                                                            <label>Total:</label>
                                                                            <div>{orderItem.TotalAmount}</div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    ) : (
                                                        <tbody>
                                                            <tr>
                                                                <td colSpan="2">Loading...</td>
                                                            </tr>
                                                        </tbody>
                                                    )}
                                                </table> */}
                            {invoiceData.OrderList ? (
                              <div>
                                {filteredOrder.map((orderItem, index) => (
                                  <div className="orderDetails_Wrp mrg-b-20">
                                    <div
                                      className="row align-items-center"
                                      key={index}
                                    >
                                      <div className="col-md-4">
                                        <div className="orderDetails_Product">
                                          <Link
                                            to={`/OurProduct/${orderItem.CategoryNameE}/${orderItem.ProductId}`}
                                          >
                                            <img
                                              decoding="async"
                                              alt={orderItem.ProductId}
                                              src={importProductImageWrapper(
                                                orderItem.ProductId
                                              )}
                                              className="w-100 objCvr mobImg"
                                              loading="lazy"
                                              onLoad={() =>
                                                // console.log
                                                `Image loaded for productID: ${orderItem.ProductId}`
                                              }
                                              onError={(e) => {
                                                console.error(
                                                  `Error loading image for productID: ${orderItem.ProductId}`,
                                                  e
                                                );
                                                e.target.src = `${BASE_PATH}Images/Product/images/products/default.png`;
                                              }}
                                            />
                                          </Link>
                                        </div>
                                      </div>

                                      <div className="col-md-8">
                                        <div>
                                          <div className="d-flex gap-2 justify-content-between">
                                            <label>
                                              {" "}
                                              {language === "en"
                                                ? "  Order Id    "
                                                : "رقم التعريف الخاص بالطلب  "}
                                              :
                                            </label>
                                            <div className="text-end">
                                              {orderItem.OrderId}
                                            </div>
                                          </div>
                                          <div className="d-flex gap-2 justify-content-between">
                                            <label className="text-nowrap">
                                              {" "}
                                              {language === "en"
                                                ? "  Product Name   "
                                                : " اسم المنتج "}
                                              :
                                            </label>
                                            <div className="text-end">
                                              {language === "en"
                                                ? orderItem.ProductNameE
                                                : orderItem.ProductNameA}
                                            </div>
                                          </div>
                                          <div className="d-flex gap-2 justify-content-between">
                                            <label className="text-nowrap">
                                              {" "}
                                              {language === "en"
                                                ? "  Product Size   "
                                                : " حجم المنتج   "}
                                              :
                                            </label>
                                            <div className="text-end">
                                              {language === "en"
                                                ? orderItem.ProductSizeNameE
                                                : orderItem.ProductSizeNameA}
                                            </div>
                                          </div>
                                          <div className="d-flex gap-2 justify-content-between">
                                            <label>
                                              {" "}
                                              {language === "en"
                                                ? "  Price   "
                                                : "السعر  "}
                                              :
                                            </label>
                                            <div className="text-end">
                                              {language === "en"
                                                ? `${orderItem.OrderPrice} x  ${orderItem.OrderQuantity}`
                                                : `AED ${orderItem.OrderPrice} x  ${orderItem.OrderQuantity} `}

                                              {/* {`${orderItem.OrderPrice} x  ${orderItem.OrderQuantity}`} */}
                                            </div>
                                          </div>
                                          <div className="d-flex gap-2 justify-content-between">
                                            <label>
                                              {" "}
                                              {language === "en"
                                                ? "  Total   "
                                                : "المجموع  "}
                                              :
                                            </label>
                                            <div className="text-end">
                                              {orderItem.OrderQuantity *
                                                orderItem.OrderPrice}
                                            </div>

                                           
                                          </div>

                                           <div className="d-flex gap-2 justify-content-between">
                                            <label>
                                              {" "}
                                         {language === "en"
                                      ? "  Product color   "
                                      : " لون المنتج    "}
                                              :
                                            </label>
                                            <div className="text-end">
                                              
                                               {orderItem.ProductColorOrdered
                                              ? (() => {
                                                  try {
                                                    const colorOrdered =
                                                      JSON.parse(
                                                        orderItem.ProductColorOrdered
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
                                                            src={
                                                              updatedImagePath
                                                            }
                                                            alt={
                                                              colorOrdered.ProductColorNameE
                                                            }
                                                            style={{
                                                              width: "100%",
                                                              height: "100%",
                                                               border:'1px solid'
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
                                            </div>

                                           
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-xxl-5">
                          <div className="details_productMain shiping-adBox h-100 mrg-b-20">
                            <div className="billtingTitle f-s-20 mrg-b-10 line_H_1_2 erc-orderTitle">
                              <strong>
                                {language === "en"
                                  ? "User Details"
                                  : " بيانات المستخدم "}
                              </strong>
                            </div>
                            <div className="erc-selected-product align-items-center">
                              <div className="row">
                                <div className="col">
                                  <div>
                                    <label>
                                      {language === "en"
                                        ? "Contact Name  "
                                        : "اسم المتصل "}
                                      :
                                    </label>{" "}
                                    {username}
                                  </div>
                                </div>
                                <div className="d-flex gap-2">
                                  <label>
                                    {language === "en"
                                      ? "Contact Mobile "
                                      : "  الهاتف المحمول"}
                                    :
                                  </label>
                                  <div>{invoiceData.ContactMobile}</div>
                                </div>
                                <div className="d-flex gap-2">
                                  <label>
                                    {language === "en"
                                      ? "Contact Email "
                                      : " البريد الاكتروني "}
                                    :
                                  </label>
                                  <div>{invoiceData.ContactEmail}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mrg-b-20">
                      <div>
                        <div className="details_productMain shiping-adBox mrg-b-20">
                          <div className="billtingTitle f-s-20 mrg-b-10 line_H_1_2 erc-orderTitle">
                            <strong>
                              {language === "en"
                                ? "Invoice Details"
                                : "تفاصيل الفاتورة"}
                            </strong>
                          </div>
                          <table className="f-s-16">
                            <tbody>
                              <tr>
                                <td width="30%">
                                  <strong>
                                    {language === "en"
                                      ? "Invoice ID :"
                                      : "رقم الفاتورة:"}
                                  </strong>
                                </td>
                                <td>{invoiceData.InvoiceId}</td>
                              </tr>
                              <tr>
                                <td>
                                  <strong>
                                    {language === "en"
                                      ? "Transaction Id:"
                                      : "رقم المعاملة:"}
                                  </strong>
                                </td>
                                <td>{invoiceData.TransactionId}</td>
                              </tr>
                              <tr>
                                <td>
                                  <strong>
                                    {language === "en"
                                      ? "Shipping Track ID"
                                      : "Shipping Track ID"}
                                  </strong>
                                </td>
                                <td>{invoiceData?.ShippingId || "NA"}</td>
                              </tr>
                              <tr>
                                <td>
                                  <strong>
                                    {language === "en"
                                      ? "Billing Address:"
                                      : "عنوان وصول الفواتير:"}
                                  </strong>
                                </td>
                                <td>{invoiceData.BillingAddress}</td>
                              </tr>
                              <tr>
                                <td>
                                  <strong>
                                    {language === "en"
                                      ? "Shipping Address:"
                                      : "عنوان الشحن:"}
                                  </strong>
                                </td>
                                <td>{invoiceData.ShippingAddress}</td>
                              </tr>
                              <tr>
                                <td>
                                  <strong>
                                    {language === "en"
                                      ? "Total Amount:"
                                      : "المبلغ الإجمالي:"}
                                  </strong>
                                </td>
                                <td>{invoiceData.TotalAmount}</td>
                              </tr>
                              <tr>
                                <td>
                                  <strong>
                                    {language === "en"
                                      ? "Created Date:"
                                      : "تاريخ الإنشاء:"}
                                  </strong>
                                </td>
                                <td>
                                  {new Date(
                                    invoiceData.CreatedDate
                                  ).toLocaleString()}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    {/* <div className="mrg-b-20">
                                    <div className="details_productMain shiping-adBox h-100">
                                        <div className="billtingTitle f-s-20 mrg-b-10 line_H_1_2 erc-orderTitle">
                                            <strong>{language === "en" ? "Other Orders in Invoice" : "تفاصيل الفاتورة"}</strong>
                                        </div>
                                        <div className="erc-selected-product align-items-center">
                                            {invoiceData && invoiceData.OrderList
                                                ? invoiceData.OrderList.map((orderItem, index) => (
                                                    // Check if the orderItem's OrderId is not equal to the current id
                                                    orderItem.OrderId !== parseInt(id) && (
                                                        <div key={index} className="row">
                                                            <div className="col">
                                                                <img
                                                                    decoding="async"
                                                                    alt={orderItem.ProductId}
                                                                    src={importProductImageWrapper(orderItem.ProductId)}
                                                                    className="w-20 objCvr mobImg"
                                                                    loading="lazy"
                                                                    // onLoad={() => console.log(`Image loaded for productID: ${orderItem.ProductId}`)}
                                                                    onError={(e) => {
                                                                        console.error(`Error loading image for productID: ${orderItem.ProductId}`, e);
                                                                        e.target.src = '  Images/Product/images/products/default.png'; // Set default image
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="d-flex gap-2">
                                                                <label>Product Name:</label>
                                                                <div>{orderItem.ProductNameE}</div>
                                                            </div>
                                                            <div className="d-flex gap-2">
                                                                <label>Order Date:</label>
                                                                <div>{new Date(orderItem.CreatedDate).toLocaleDateString()}</div>
                                                            </div>
                                                            <div className="d-flex gap-2">
                                                                <label>Price:</label>
                                                                <div>{orderItem.OrderPrice} X  {orderItem.OrderQuantity}</div>
                                                            </div>
                                                        </div>
                                                    )
                                                ))
                                                : <div>No orders found</div>
                                            }
                                        </div>
                                    </div>



                                </div> */}
                    {/* <div class="shiping-adBox">
                    <div className="billtingTitle f-s-30 mrg-b-10">
                      <strong>{language === "en" ? "Invoice Details" : "تفاصيل الفاتورة"}</strong>
                    </div>
                    
                    <div className="billtingTitle f-s-20 mrg-b-20">
                      <strong>{language === "en" ? "Product Details" : " "}</strong>
                    </div>
                    <table className='cstTable table'>
                      <tbody>
                    
                              <tr >
                                <td width="20%">
                                  <img
                                    decoding="async"
                                    // alt={order.ProductId}
                                    src={AL_Ghadeer_logo}
                                    className="w-100 objCvr mobImg"
                                    loading="lazy"
                                   
                                  />
                                </td>
                                <td width="80%">
                                  Order #order.OrderId<br />
                                  Order Status: order.Status<br />
                                  Product Name: order.ProductNameE <br />
                                  Price and Quantity: AEDorder.OrderPrice x order.OrderQuantity<br />
                                </td>
                              </tr>
                      
                      </tbody>
                    </table>

                  </div> */}
                  </div>
                )}
                <div>
                  {invoiceData && filteredOrder && (
                    <PDFDownloadLink
                      document={
                        <OrderPDF
                          invoiceData={invoiceData}
                          filteredOrder={filteredOrder}
                          language={language}
                        />
                      }
                      fileName={`order-details-${invoiceData.InvoiceId}.pdf`}
                      className="submitBtn"
                    >
                      {({ loading }) =>
                        loading ? "Loading document..." : "Download Invoice"
                      }
                    </PDFDownloadLink>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default OrderDetails;
