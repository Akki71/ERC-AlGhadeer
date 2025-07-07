import React, { useEffect, useState,useContext} from 'react';
import DashboardNav from './DashboardNav';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import AL_Ghadeer_logo from "../assets/images/AL-Ghadeer-logo.png";
import { connect, useDispatch } from 'react-redux';
import Loader from '../components/Loader'; 
import BASE_PATH from '../serviceurls';
import { DataContext } from "../utils/ApiContext";
import { useLanguage } from '../redux/LanguageContext';
const OrderList = () => {
  // Detect selected language
  const dispatch = useDispatch()
  const [con, setcon]= useState(true)
  useEffect(() => { window.scrollTo(0, 300); }, []);
const { language} = useLanguage();
  const [orders, setOrders] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const tokenlogin = localStorage.getItem('loginToken');
  const UserID = localStorage.getItem('UserID');




  useEffect(() => {
    updateData();
    const fetchOrders = async () => {
      try {
      
        const apiUrl = `${BASE_PATH}Order/GetAllUserInvoicesByUserId?userId=${UserID}`;


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
        setOrders(data);
        setcon(false)
        // console.log("Orders", data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // localStorage.removeItem("loginToken");
        // localStorage.removeItem("UserID");
        // language === "en" ?
        //   navigate("/login/en") :
        //   navigate("/login/ar");
        setcon(false)

      }
    };
    fetchOrders();
  }, [tokenlogin, UserID]);

  // const handleView = () => {
  //   navigate("/orderdetails/en");
  // };
  const handleView = (order) => {
    const orderData = JSON.stringify(order);
    navigate(`/orderdetails/${orderData}`);
    dispatch({
      type: "CHNAGE",
    });
  };



  const importProductImage = (productID, format = 'jpg') => {
    const basePath = `${BASE_PATH}Images/Product/images/products/`;
    const imageUrl = `${basePath}${productID}/1.${format.toLowerCase()}`; // Assuming format is provided without a leading dot
    return imageUrl;
  };

  const importProductImageWrapper = (productID, format) => {
    try {
      return importProductImage(productID, format);
    } catch (error) {
      console.error(`Error loading image for product ${productID}:`, error);
      return `${BASE_PATH}Images/Product/images/products/default.${format.toLowerCase()}`;

    }
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

      setData(cartData.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="topBanner_sec">
        <div className="topBanner_inn">
         <img src={`${BASE_PATH}Images/Product/dashboard-bg.jpg`} className="w-100" alt="" />


        </div>
      </div>
      <div className="section_dashboard secBg">
        <div className="full-container container">
          <div className="row justify-content-center">
            <div className="col-md-3 col-xl-3 col-xxl-2">
              <DashboardNav />
            </div>
            <div className="col-md-9 col-xl-8 col-xxl-8">
              <div className="rightdashboard">
                <div className="row" id="no-more-tables">
                  <table className="col-md-12 table-bordered table-striped table-condensed cf">
                    <thead className="cf">
                      {orders.length > 0 ? (
                        <tr>
                          <th>{language === "en" ? "Invoice Id" : "رقم الفاتورة	"}</th>
                          <th>{language === "en" ? "Date" : "التاريخ"}</th>
                          <th className="numeric">{language === "en" ? "Status" : "الحالة"}</th>
                        
                          <th className="numeric">{language === "en" ? "Total" : "مجموع"}</th>

                          <th className="numeric">{language === "en" ? "Product" : " حاصل الضرب"}</th>
                          <th className="numeric">{language === "en" ? "Order Status" : "Order Status"}</th>
                          <th className="numeric">{language === "en" ? "Shipping Track ID" : "Shipping Track ID"}</th>

                          <th className="numeric">{language === "en" ? "Actions" : "الإجراءات"}</th>
                        </tr>
                      ) : (
                        <div>{con ? <Loader /> : <p>
                          {language === "en" ? "No Orders  " : " لا يوجد طلبات    "}
                          
                             </p>}
                           
                        </div>
                      )}
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr key={`${order.InvoiceId}-${index}`}>
                          <td data-title="Order">#{order.InvoiceId}</td>
                          <td data-title="Date">{new Date(order.CreatedDate).toLocaleString()}</td>
                          <td data-title="Status" className="numeric">{order.Status}</td>
                        
                          <td data-title="Total" className="numeric">{order.TotalAmount}</td>
                          <td data-title="Product Names" className="numeric">
                            {order.OrderList.map((product, productIndex) => (
                              <div key={`${product.OrderId}-${productIndex}`}>
                                {language === "en" ? product.ProductNameE : product.ProductNameA}
                              </div>
                            ))}
                          </td>
                          <td data-title="Status" className="numeric">
                          {order.OrderList.map((product, productIndex) => (
                              <div key={`${product.OrderId}-${productIndex}`}>
                                {language === "en" ? product.Status : product.Status}
                              </div>
                            ))}

                          </td>
                          <td data-title="Order">{order.ShippingId || 'NA'}</td>
                          <td data-title="Actions" className="numeric">
                            <ul className="list-unstyled mb-0">
                              <li className="list-inline-item">
                                <button className="viewBtn" onClick={() => handleView(order.InvoiceId)}>
                                
                                {language === "en"
                                              ? "  View   "
                                              : "  عرض"}
                                </button>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>


                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {invoiceData.OrderList ? (
        <div className={`modal fade ${isModalOpen ? 'show' : ''}`} id="edit-billing-address" style={{ display: isModalOpen ? 'block' : 'none' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)} />
              <div className="modal-body">
                {selectedOrder && (
                  <div key={selectedOrder.InvoiceId}>
                    <div className="billtingTitle f-s-30 mrg-b-30">
                      <strong>{language === "en" ? "Invoice Details" : "تفاصيل الفاتورة"}</strong>
                    </div>
                    <table className="table cstTable f-s-16 w-90">
                      <tbody>
                        <tr>
                          <td width="30%"><strong>{language === "en" ? "Invoice #:" : "رقم الفاتورة:"}</strong></td>
                          <td><strong>{invoiceData.InvoiceId}</strong></td>
                        </tr>
                        <tr>
                          <td>
                            <strong>{language === "en" ? "Transaction Id:" : "رقم المعاملة:"}</strong>
                          </td>
                          <td>
                            <strong>{invoiceData.TransactionId}</strong>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <strong>{language === "en" ? "Contact Email:" : "البريد الاكتروني:"}</strong>
                          </td>
                          <td>
                            <strong>{invoiceData.ContactEmail}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>{language === "en" ? "Contact Mobile:" : "الهاتف المحمول:"}</strong>
                          </td>
                          <td>
                            <strong>{invoiceData.ContactMobile}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>{language === "en" ? "Billing Address:" : "عنوان وصول الفواتير:"}</strong>
                          </td>
                          <td>
                            <strong>{invoiceData.BillingAddress}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>{language === "en" ? "Shipping Address:" : "عنوان الشحن:"}</strong>
                          </td>
                          <td>
                            <strong>{invoiceData.ShippingAddress}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>{language === "en" ? "Total Amount:" : "المبلغ الإجمالي:"}</strong>
                          </td>
                          <td>
                            <strong>{invoiceData.TotalAmount}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>{language === "en" ? "Created Date:" : "تاريخ الإنشاء:"}</strong>
                          </td>
                          <td>
                            <strong>{new Date(invoiceData.CreatedDate).toLocaleString()}</strong>

                          </td>
                        </tr>

                      </tbody>
                    </table>
                  

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
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

                {language === "en"
                  ? "  Loading..."
                  : " تحميل…"}
              </div>
            </div>
          </div>
        </div>
      )} */}




    </div>
  );
};


const mapStateToProps = (state) => ({
  count: state.countReducer.count
});

export default connect(mapStateToProps)(OrderList);