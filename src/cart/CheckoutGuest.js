import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Modal";
import { DataContext } from "../utils/ApiContext";
import BASE_PATH from "../serviceurls";
import axios from "axios";
import Loader from "../components/Loader"; // Import your Loader component
import { useLanguage } from "../redux/LanguageContext";
import BeforePayment from "./BeforePayment";
import ReCAPTCHA from "react-google-recaptcha";
import { useLocation } from "react-router-dom";
const cors = require("cors")({ orgin: true });

const CheckoutGuest = () => {
  const [cartData, setCartData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [showReCAPTCHA, setShowReCAPTCHA] = useState(false);
  const [mco, setMco] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const bearerToken = localStorage.getItem('bearerToken');
  const [showModal, setShowModal] = useState(false);
  const [showCloseModal, setShowModalModal] = useState(false);


  const [calQuantityWeight, setQuantityWeight] = useState([]);
  const [caltotalWeight, setTotalWeight] = useState();
  const [TotalAmountesatamtied, setTotalAmountesatamtied] = useState();
  const [rateDetails, setRateDetails] = useState(null);
  const [shippingAddresses, setshippingAddresses] = useState(null);
  const [OrderQuantity, SetOrderQuantity] = useState(null);
  const [Weight, setWeight] = useState(null);
  const [alltotalweight, setalltotalweight] = useState(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    const guestProducts = JSON.parse(localStorage.getItem("guestProduct")) || [];
    console.log("guestProducts", guestProducts);

    const totalWeight = guestProducts.reduce(
      (acc, product) => acc + (product.Weight || 0) * (product.OrderQuantity || 1),
      0
    );

    const totalOrderQuantity = guestProducts.reduce(
      (acc, product) => acc + (product.OrderQuantity || 0),
      0
    );

    setalltotalweight(totalWeight);
    console.log("Total Weight:", totalWeight);

    SetOrderQuantity(totalOrderQuantity);
    console.log("Total Order Quantity:", totalOrderQuantity);
  }, []);



  const fetchRateDetails = async () => {

    console.log('function called');

    // const shippingAddress =
    //   shippingAddresses.find((address) => address.IsDefault) || null;
    // setLoading(true);
    // console.log('shippingAddress', shippingAddress);

    // ShippingAddress: `${userDetails.shippingaddressLine1}, ${userDetails.shippingaddressLine2}, ${userDetails.shippingcity}, ${userDetails.shippingstate}, ${userDetails.shippingpinCode}, ${userDetails.shippingcountry}`,
    const token = localStorage.getItem("token");
    const apiUrl = `${BASE_PATH}Shipment/CalculateRate`;

    const requestData = {
      OriginAddress: {
        Line1: "Zayed Sports City",
        Line2: null,
        Line3: null,
        City: "Abu Dhabi",
        StateOrProvinceCode: null,
        PostCode: 633111,
        CountryCode: "AE",
        Longitude: 0,
        Latitude: 0,
        BuildingNumber: null,
        BuildingName: "Emirates Red Crescent",
        Floor: null,
        Apartment: null,
        POBox: null,
        Description: null,
      },
      DestinationAddress: {
        Line1: userDetails.shippingaddressLine1,
        Line2: userDetails.shippingaddressLine2,
        Line3: null,
        City: userDetails.shippingcity,
        StateOrProvinceCode: null,
        PostCode: userDetails.shippingpinCode,
        CountryCode: "AE",
        Longitude: 0,
        Latitude: 0,
        BuildingNumber: null,
        BuildingName: null,
        Floor: null,
        Apartment: null,
        POBox: null,
        Description: null,
      },
      ShipmentDetails: {
        Dimensions: null,
        ActualWeight: {
          Unit: "KG",
          //  Value: caltotalWeight,
          Value: alltotalweight
          ,

        },
        ChargeableWeight: {
          Unit: "KG",
          Value: alltotalweight,
        },
        DescriptionOfGoods: null,
        GoodsOriginCountry: null,
        NumberOfPieces: OrderQuantity,
        ProductGroup: "DOM",
        ProductType: "ONP",
        PaymentType: "P",
        PaymentOptions: null,
        CustomsValueAmount: null,
        CashOnDeliveryAmount: null,
        InsuranceAmount: null,
        CashAdditionalAmount: null,
        CashAdditionalAmountDescription: null,
        CollectAmount: null,
        Services: "",
        Items: null,
        DeliveryInstructions: null,
        AdditionalProperties: null,
        ContainsDangerousGoods: false,
      },
      PreferredCurrencyCode: "AED",
      ClientInfo: {
         UserName: "marhaba@alghadeeruaecrafts.ae",
         Password: "Ff$123456",
         Version: "v1.0",
         AccountNumber: "130354",
         AccountPin: "554654",
         AccountEntity: "AUH",
         AccountCountryCode: "AE",
         Source: 24,
         PreferredLanguageCode: null,
      },
      Transaction: null,
    };
    console.log(requestData);
    // const totalValue = 200;
    // setTotalAmountesatamtied(totalValue);
    // setShowModalModal(true);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json-patch+json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      console.log("Response Status:", response.status);

      const result = await response.json();
      console.log("Response JSON:", result);

      if (result.HasErrors) {
        alert("Add correct address!");
        setShowReCAPTCHA(false);
        console.error("API Error:", result);
        setError("An error occurred while calculating the rate.");
      } else {
        const totalValue = result.TotalAmount.Value;
        setTotalAmountesatamtied(totalValue);
        setShowModalModal(true);
        console.log("Total Amount (Value):", totalValue);
        console.log("Rate Details:", result);
        setRateDetails({
          totalAmount: result.TotalAmount,
          rateDetails: result.RateDetails,
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {

    const searchParams = new URLSearchParams(location.search);
    const resultIndicator = searchParams.get("resultIndicator");

    if (resultIndicator) {
      setLoading(true);


      CreateGuestOrderInvoice(); 

    } else {
      console.log("LOG");

    }

  }, [location.search]);



  useEffect(() => {
    window.scrollTo(0, 300);
  }, []);

  useEffect(() => {
    // Retrieve cart data from localStorage
    const storedData = JSON.parse(localStorage.getItem("guestProduct")) || [];
    setCartData(storedData);
    console.log(storedData);

    // Calculate grand total and shipping cost
    const subtotal = storedData.reduce(
      (sum, product) => sum + product.OrderPrice * product.OrderQuantity,
      0
    );
    const estimatedShipping = subtotal > 0 ? 0 : 0; // Example: flat shipping fee of AED 50
    setShippingCost(estimatedShipping);
    setGrandTotal(subtotal + estimatedShipping);
  }, []);

  const { language } = useLanguage();

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    shippingcountry: "",
    shippingaddressLine1: "",
    shippingaddressLine2: "",
    shippingcity: "",
    shippingstate: "",
    shippingpinCode: "",
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
 
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
 
    setErrorMessages((prevErrors) => {
      const newErrors = { ...prevErrors };
 
      if (name === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        newErrors.email = !value
          ? (language === "en" ? "Email is required" : "عنوان البريد الإلكتروني مطلوب")
          : !emailRegex.test(value)
          ? (language === "en" ? "Invalid email format" : "تنسيق البريد الإلكتروني غير صالح")
          : "";
      }
 
      if (name === "phone") {
        const phoneRegex = /^[0-9]{10}$/;
        newErrors.phone = !value
          ? (language === "en" ? "Phone number is required" : "رقم الهاتف مطلوب")
          : !phoneRegex.test(value)
          ? (language === "en" ? "Invalid phone number" : "رقم الهاتف غير صالح")
          : "";
      }
 
      if (name !== "email" && name !== "phone") {
        newErrors[name] = value
          ? ""
          : (language === "en" ? `${name} is required` : `${name} مطلوب`);
      }
 
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate first name
    if (!userDetails.firstName) {
      newErrors.firstName = language === "en" ? "First name is required" : "الاسم الأول مطلوب";
    }

    // Validate last name
    if (!userDetails.lastName) {
      newErrors.lastName = language === "en" ? "Last name is required" : "الاسم الأخير مطلوب";
    }

    // Validate email
    if (!userDetails.email) {
      newErrors.email = language === "en" ? "Email is required" : "عنوان البريد الإلكتروني";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userDetails.email)) {
        newErrors.email = language === "en" ? "Invalid email format" : "Invalid email format (translated)";
      }
    }

    // Validate phone
    if (!userDetails.phone) {
      newErrors.phone = language === "en" ? "Phone number is required" : "رقم الهاتف مطلوب";
    }

    // Validate address fields
    if (!userDetails.addressLine1) {
      newErrors.addressLine1 = language === "en" ? "Address line 1 is required" : "Billing address line 1 is required (translated)";
    }
    if (!userDetails.city) {
      newErrors.city = language === "en" ? "City is required" : "City is required (translated)";
    }
    if (!userDetails.state) {
      newErrors.state = language === "en" ? "State is required" : "State is required (translated)";
    }
    if (!userDetails.pinCode) {
      newErrors.pinCode = language === "en" ? "Pin code is required" : "Pin code is required (translated)";
    }
    if (!userDetails.country) {
      newErrors.country = language === "en" ? "Country is required" : "Country is required (translated)";
    }
    if (!userDetails.shippingcountry) {
      newErrors.shippingcountry = language === "en" ? "Country is required" : "Country is required (translated)";
    }
    // Validate shipping fields
    if (!userDetails.shippingaddressLine1) {
      newErrors.shippingaddressLine1 = language === "en" ? "Address line 1 is required" : "Shipping address line 1 is required (translated)";
    }
    if (!userDetails.shippingcity) {
      newErrors.shippingcity = language === "en" ? "City is required" : "Shipping city is required (translated)";
    }
    if (!userDetails.shippingstate) {
      newErrors.shippingstate = language === "en" ? "State is required" : "Shipping state is required (translated)";
    }
    if (!userDetails.shippingpinCode) {
      newErrors.shippingpinCode = language === "en" ? "Pin code is required" : "Shipping pin code is required (translated)";
    }

    return newErrors;
  };

  const handlePlaceOrderClick = (event) => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrorMessages(newErrors); // Set errors for display
    } else {
      setErrorMessages({}); // Clear errors if no validation issues
      modaldataforcheck(); // Proceed to modal data for reCAPTCHA
    }
  };


  const modaldataforcheck = () => {
    setShowReCAPTCHA(true);
  };


  function onChangerecaptcha(value) {
    console.log("display");
    console.log("Captcha value:", value);
    fetchRateDetails();
    // authenticateAndProcessPayment();
  }

  const authenticateAndProcessPayment = async () => {
    // setLoader(true);
    try {
      const bearerToken = await authenticate();
      if (bearerToken) {
        const mco = await initializePayment(bearerToken);
        if (mco) {
          const success = await initiateMastercardPayment(mco);
          setIsPaymentSuccessful(success);
          // const paymentResponse = await initiateMastercardPayment(mco);
          // const {  ShippingAddress } = success;
          // console.log("ShippingAddress", ShippingAddress);
          // setshippingAddresses(ShippingAddress);
        }
      }
    } catch (error) {
      console.error("Error during payment process:", error);
    }
  };

  const authenticate = async () => {
    setLoading(true);
    try {
      const authResponse = await axios.post(
        "https://portal.rcuae.ae/api/Token",
        {
          username: "GHADEER",
          password: "GHADEER@123",
        }
      );
      const bearerToken = authResponse.data.access_token;
      localStorage.setItem("bearerToken", bearerToken);

      console.log("Authentication successful. Bearer token:", bearerToken);
      return bearerToken;
    } catch (error) {
      console.error("Error authenticating:", error);
      return null;
    }
  };

  const initializePayment = async (bearerToken) => {

    const paymentData = [
      {
        amount: 100,
        name: `${userDetails.firstName} ${userDetails.lastName}`,
        mobile: userDetails.phone,
        email: userDetails.email,
      },
    ];

    try {
      const initPaymentResponse = await axios.post(
        "https://portal.rcuae.ae/api/Ghadeer/InitializePayment",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const mco = initPaymentResponse.data.mco;
      localStorage.setItem("mco", mco);

      setMco(mco);
      console.log("Payment initialized. MCO:", mco);
      return mco;
    } catch (error) {
      console.error("Error initializing payment:", error);
      return null;
    }
  };

  const CreateGuestOrderInvoice = () => {
    const token = localStorage.getItem("token");

    // const payload = {
    //   TransactionId: "T-", // Generate or retrieve an actual transaction ID
    //   MastercardOrderId: mco,
    //   Status: "Payment_Completed",
    //   FirstName: userDetails.firstName,
    //   LastName: userDetails.lastName,
    //   ContactEmail: userDetails.email,
    //   ContactMobile: userDetails.phone,
    //   BillingAddress: `${userDetails.addressLine1}, ${userDetails.addressLine2}, ${userDetails.city}, ${userDetails.state}, ${userDetails.pinCode}, ${userDetails.country}`,
    //   ShippingAddress: `${userDetails.shippingaddressLine1}, ${userDetails.shippingaddressLine2}, ${userDetails.shippingcity}, ${userDetails.shippingstate}, ${userDetails.shippingpinCode}, ${userDetails.shippingcountry}`,
    //   TotalAmount: grandTotal,
    //   isPaymentIncompleteOrCancelled: false,
    //   Orders: storedData.map(order => ({
    //     ProductId: order.ProductId,
    //     CategoryId: order.CategoryId,
    //     SubCategoryId: order.SubCategoryId,
    //     ProductSizeId: order.ProductSizeId,
    //     OrderPrice: order.OrderPrice,
    //     OrderQuantity: order.OrderQuantity,
    //     TotalAmount: order.TotalAmount ,
    //     ProductColorOrdered: order.ProductColorOrdered 
    //     ? (typeof order.ProductColorOrdered === "string" 
    //         ? order.ProductColorOrdered 
    //         : JSON.stringify(order.ProductColorOrdered))
    //     : null,

    //   })),
    // };
    // initiateMastercardPayment(mco);

    const storedPayload = JSON.parse(localStorage.getItem("orderPayload"));

    if (!storedPayload || !storedPayload.Orders) {
      console.error("Invalid order payload or orders missing.");
      return;
    }

    const sortedOrders = [...storedPayload.Orders].sort((a, b) =>
      a.ProductId.localeCompare(b.ProductId)
    );
    const payload = { ...storedPayload, Orders: sortedOrders };

    console.log("Payload sent to API:", payload);

    fetch(`${BASE_PATH}Order/CreateGuestOrderInvoice`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json-patch+json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(storedPayload),
    })
      .then(response => response.json())
      .then(data => {
        console.log("API Response:", data);
        localStorage.removeItem("orderPayload");
        markPaymentAsSuccessful();

        // setLoading(false);
      })
      .catch(error => {
        console.error("Error:", error);
      });


  };
  const markPaymentAsSuccessful = async () => {
    const mco = await localStorage.getItem("mco"); 

    if (!mco) {
      console.error("MCO value is null or undefined.");
      return false;
    }

    const isPaymentConfirmed = true; // This should be determined by your payment gateway

    if (isPaymentConfirmed) {
      try {
        const bearerToken = localStorage.getItem("bearerToken");

        if (!bearerToken) {
          console.error("Bearer token is missing.");
          return false;
        }

        const updatePaymentResponse = await axios.post(
          "https://portal.rcuae.ae/api/Ghadeer/UpdatePaymentSuccessful",
          { mco },
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Payment marked as successful:", updatePaymentResponse.status);

        // Remove mco and other items from localStorage after success
        localStorage.removeItem("mco");
        localStorage.removeItem("guestProduct");
        localStorage.removeItem("bearerToken");
        setLoading(false);
        setShowModal(true);
        return true;
      } catch (error) {
        console.error("Error marking payment as successful:", error);
        return false;
      }
    }

    return false;
  };

  const handlePlaceOrder = () => {
    localStorage.setItem("paymentStatus", "order_placed");
  };

  const initiateMastercardPayment = async (mco) => {
    // const token = localStorage.getItem("token");

    const storedData = JSON.parse(localStorage.getItem("guestProduct")) || [];

    const BillingAddress = {
      Line1: userDetails.addressLine1,
      Line2: userDetails.addressLine2,
      City: userDetails.city,
      StateOrProvinceCode: userDetails.state,
      CountryCode: userDetails.country,
      PostCode: userDetails.pinCode,
    }

    const ShippingAddress = {
      Line1: userDetails.shippingaddressLine1,
      Line2: userDetails.shippingaddressLine2,
      City: userDetails.shippingcity,
      StateOrProvinceCode: userDetails.shippingstate,
      PostCode: userDetails.shippingpinCode,
      CountryCode: userDetails.shippingcountry,
    }
    const payload = {
      TransactionId: "T-", // Generate or retrieve an actual transaction ID
      MastercardOrderId: mco,
      Status: "Payment_Completed",
      FirstName: userDetails.firstName,
      LastName: userDetails.lastName,
      ContactEmail: userDetails.email,
      ContactMobile: userDetails.phone,
      BillingAddress: BillingAddress,
      ShippingAddress: ShippingAddress,
      TotalAmount: grandTotal + TotalAmountesatamtied,
      isPaymentIncompleteOrCancelled: false,
      Orders: storedData.map((order) => ({
        ProductId: order.ProductId,
        CategoryId: order.CategoryId,
        SubCategoryId: order.SubCategoryId,
        ProductSizeId: order.ProductSizeId,
        OrderPrice: order.OrderPrice,
        OrderQuantity: order.OrderQuantity,
        TotalAmount: order.TotalAmount,
        ProductColorOrdered: order.ProductColorOrdered
          ? typeof order.ProductColorOrdered === "string"
            ? order.ProductColorOrdered
            : JSON.stringify(order.ProductColorOrdered)
          : null,
      })),
    };


    console.log('payload new', payload);



    localStorage.setItem("orderPayload", JSON.stringify(payload));


    console.log("Initiating Mastercard payment...");
    const tokenlogin = localStorage.getItem("loginToken");


    // if (
    //   !userDetails.firstName ||
    //   !userDetails.lastName ||
    //   !userDetails.email ||
    //   !userDetails.phone ||
    //   !userDetails.country ||
    //   !userDetails.addressLine1 ||
    //   !userDetails.addressLine2 ||
    //   !userDetails.city ||
    //   !userDetails.state ||
    //   !userDetails.pinCode ||
    //   !userDetails.shippingcountry ||
    //   !userDetails.shippingaddressLine1 ||
    //   !userDetails.shippingaddressLine2 ||
    //   !userDetails.shippingcity ||
    //   !userDetails.shippingstate ||
    //   !userDetails.shippingpinCode
    // ) {
    //   console.error("Required data for payment not found.");
    //   return;
    // }


    const data = {
      UserId: "merchant.7008334",
      Password: "33d4c1d914a840ae7f67d42b2ffc239b",
      JsonData: {
        apiOperation: "INITIATE_CHECKOUT",
        checkoutMode: "WEBSITE",
        interaction: {
          operation: "PURCHASE",
          merchant: {
            name: "AlGhadeer Emirati Crafts",
            logo: "https://api.alghadeeruaecrafts.ae/Images/Product/images/AL-Ghadeer-logo.png",
            url: `https://www.alghadeeruaecrafts.ae`,
          },
          returnUrl: `https://www.alghadeeruaecrafts.ae/checkoutGuest`,
          displayControl: {
            billingAddress: "READ_ONLY",
          },
          timeout: 1800,
          timeoutUrl: `https://www.alghadeeruaecrafts.ae/checkoutGuest`,
          cancelUrl: `https://www.alghadeeruaecrafts.ae/checkoutGuest`,
          style: {
            accentColor: "#9F926D",
          },
        },
        order: {
          currency: "AED",
          amount: grandTotal + TotalAmountesatamtied,
          id: mco,
          description: "ERC CRAFTS",
        },
        customer: {
          email: userDetails.email,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          mobilePhone: userDetails.phone,
        },
        billing: {
          address: {
            city: userDetails.city,
            country: userDetails.country,
            postcodeZip: userDetails.pinCode,
            stateProvince: userDetails.state,
            street: userDetails.addressLine1,
            street2: userDetails.addressLine2
          },
        },
      },
    };

    console.log("Mastercard API request data:", data);

    try {
      const response = await axios.post(
        `${BASE_PATH}Security/GetSessionIdFromMasterCard`,
        data,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json-patch+json",
          },
        }
      );

      const sessionId = response.data.SessionId;
      if (sessionId) {
        if (
          window.isMastercardScriptLoaded &&
          window.Checkout &&
          typeof window.Checkout.configure === "function" &&
          typeof window.Checkout.showPaymentPage === "function"
        ) {
          window.Checkout.configure({
            session: {
              id: sessionId,
            },
          });
          setLoading(false);
          window.Checkout.showPaymentPage();
        } else {
          console.error("Mastercard Checkout script is not loaded properly.");
          alert("Failed to proceed with the checkout. Please try again later.");
        }
      } else {
        console.error("No session ID returned from the API.");
        alert("Failed to proceed with the checkout. Please try again later.");
      }
    }
    catch (error) {
      console.error("Error sending request to Mastercard API:", error);
      alert("Failed to proceed with the checkout. Please try again later.");
    }
    // return { success: true, BillingAddress: payload.BillingAddress, ShippingAddress: payload.ShippingAddress };

  };



  console.log(mco);
  // const [shouldShowCancelPayment, setShouldShowCancelPayment] = useState(false);
  // useEffect(() => {
  //   const paymentStatus = localStorage.getItem("paymentStatus");
  //   if (paymentStatus === "order_placed") {
  //     localStorage.setItem("paymentStatus", "Incomplete_Payment");
  //     setShouldShowCancelPayment(true);
  //   }
  // }, []);
  const handleClose = () => {
    setShowModal(false); // Close the modal
    navigate("/ourproductlisting"); // Redirect to /ourproductlisting
  };
  const handleCloseModal = () => {
    setShowModalModal(false); // Close the modal
    setShowReCAPTCHA(false);

  };
  return (
    <>
      {loading ? (
        <div id="hola">
          <div id="preloader">
            <Loader />
          </div>
        </div>
      ) : (

        <>
          <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {language === "en" ? "Order Placed" : "تم الطلب"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {language === "en"
                ? "Your order has been placed. You will receive an invoice via email. Thank you for your order."
                : "تم تقديم طلبك. ستتلقى الفاتورة عبر البريد الإلكتروني. شكرًا لتقديم طلبك."}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                {language === "en" ? "Close" : "إغلاق"}
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={showCloseModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {language === "en" ? "Order Summary" : "Order Summary"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>

              {cartData.map((item, index) => (
                <div key={index} className="col-md-12 mb-4">
                  <div className="orderSummary">
                    <div className="card-body">
                      <h5 className="card-title">

                        {language === "en" ? item.ProductNameE : item.ProductNameA}
                      </h5>
                      <p className="card-text d-flex gap-2">
                        <strong>

                          {language === "en" ? "Quantity:" : " العدد"}


                        </strong> {item.OrderQuantity}{"  "}

                        <strong>

                          {language === "en" ? "Price (AED):" : " السعر AED"}


                        </strong> {item.OrderPrice}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="checckoutTitle f-s-20 f-w-SB txt-black mrg-b-10">
                {language === "en" ? "User Details:" : "تفاصيل المستخدم:"}
              </div>
              <div className="user-details-box">
                <p>
                  {" "}
                  {userDetails.firstName}

                  {" "}
                  {userDetails.lastName}
                  <br />
                  {" "}
                  {userDetails.email}
                  {" "}
                  <br />
                  {userDetails.phone}
                </p>
              </div>
              <div className="checckoutTitle f-s-20 f-w-SB txt-black mrg-b-10">


                {language === "en" ? "Billing Address:" : "عنوان وصول الفواتير:"}

              </div>
              <p>
                {userDetails.addressLine1}, {userDetails.addressLine2}, {userDetails.city},{" "}
                {userDetails.state}, {userDetails.pinCode}, {userDetails.country}
              </p>
              <div className="checckoutTitle f-s-20 f-w-SB txt-black mrg-b-10">

                {language === "en" ? " Shipping Address:" : "عنوان الشحن"}


              </div>
              <p>
                {userDetails.shippingaddressLine1}, {userDetails.shippingaddressLine2},{" "}
                {userDetails.shippingcity}, {userDetails.shippingstate},{" "}
                {userDetails.shippingpinCode}, {userDetails.shippingcountry}
              </p>
              <table className="table orderSummary mrg-t-40">
                <tbody>
                  <tr>
                    <td>
                      <h5>

                        {language === "en" ? "Subtotal" : "المجموع الفرعي"}

                      </h5>
                    </td>
                    <td className="text-right">
                      <h5>
                        <strong>AED {grandTotal}</strong>
                      </h5>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h5>

                        {language === "en" ? "Estimated shipping" : "تكلفة الشحن المقدرة "}

                      </h5>
                    </td>
                    <td className="text-right">
                      <h5>
                        <strong>AED {TotalAmountesatamtied}</strong>
                      </h5>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3>

                        {language === "en" ? "Total" : "المجموع"}

                      </h3>
                    </td>
                    <td className="text-right">
                      <h3>
                        <strong>AED {grandTotal + TotalAmountesatamtied}</strong>
                      </h3>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                className="submitBtn compact-submitBtn"
                data-type="placeOrder"
                onClick={authenticateAndProcessPayment}
              >
                {language === "en" ? "Place Order" : "مكان الطلب"}
              </button>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleCloseModal}>
                {language === "en" ? "Close" : "إغلاق"}
              </Button>
            </Modal.Footer>
          </Modal>

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
              <div className="full-container container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="secTitle_wrap text-center mrg-b-30">
                      <div className="secTitle f-s-30 font-Lyon ">
                        {" "}


                        {language === "en" ? "Checkout As Guest" : "Checkout As Guest"}

                      </div>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <div className="checckoutTitle f-s-20 f-w-SB txt-black mrg-b-10">


                      {language === "en" ? "Contact information" : "معلومات التواصل"}

                    </div>
                    <div className="row row-vw">
                      <div className="col-md-6">
                        <div className="formGroup mrg-b-30">
                          <input
                            type="text"
                            placeholder={language === "en" ? "First Name*" : "الاسم الأول* "}
                            name="firstName"
                            className="cstInput"
                            value={userDetails.firstName}
                            onChange={handleInputChange}
                          />
                          {errorMessages.firstName && <p style={{ color: "red" }}>{errorMessages.firstName}</p>}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="formGroup mrg-b-30">
                          <input
                            type="text"
                            placeholder={language === "en" ? "Last Name*" : "اسم العائلة*"}
                            name="lastName"
                            className="cstInput"
                            value={userDetails.lastName}
                            onChange={handleInputChange}
                          />
                          {errorMessages.lastName && <p style={{ color: "red" }}>{errorMessages.lastName}</p>}
                        </div>
                      </div>

                    </div>
                    <div className="row row-vw">
                      <div className="col-md-6">
                        <div className="formGroup mrg-b-30">
                          <input
                            type="text"
                            placeholder={
                              language === "en" ? "Email" : "أدخل بريدك الإلكتروني"
                            }
                            name="email"
                            className="cstInput"
                            value={userDetails.email}
                            onChange={handleInputChange}
                          />
                          {errorMessages.email && <p style={{ color: "red" }}>{errorMessages.email}</p>}
                        </div>

                      </div>
                      <div className="col-md-6">
                        <div className="formGroup mrg-b-30">
                          <input
                            type="text"
                            placeholder={
                              language === "en" ? "Phone Number" : "أدخل رقم هاتفك"
                            }
                            name="phone"
                            className="cstInput"
                            value={userDetails.phone}
                            onChange={handleInputChange}
                          />
                          {errorMessages.phone && <p style={{ color: "red" }}>{errorMessages.phone}</p>}
                        </div>

                      </div>
                    </div>
                    <div className="checckoutTitle f-s-20 f-w-SB txt-black mrg-b-10">


                      {language === "en" ? "Billing address" : "عنوان وصول الفواتير"}

                    </div>
                    <div className="row row-vw">
                      <div className="col-md-12">
                        <div className="formGroup mrg-b-30">
                          <select
                            className="cstInput"
                            name="country"
                            value={userDetails.country} // Convert value to lowercase
                            onChange={(e) => {
                              const updatedValue = e.target.value; // Ensure value is passed in lowercase
                              handleInputChange({ target: { name: e.target.name, value: updatedValue } });
                            }}
                          >
                            <option value="">  {language === "en"
                              ? "Select Country"
                              : "اختر الدولة"}</option>
                         
                            <option value="ARE">ARE</option>

                            {/* <option value="UAE">UAE</option> */}
                            {/* Add more countries as needed */}
                          </select>
                          {errorMessages.country && <p style={{ color: "red" }}>{errorMessages.country}</p>}
                        </div>

                      </div>
                      <div className="col-md-12">
                        <div className="formGroup mrg-b-30">
                          <input
                            type="text"
                            placeholder={
                              language === "en" ? "Address line 1" : "العنوان 1"
                            }
                            name="addressLine1"
                            className="cstInput"
                            value={userDetails.addressLine1}
                            onChange={handleInputChange}
                          />
                          {errorMessages.addressLine1 && <p style={{ color: "red" }}>{errorMessages.addressLine1}</p>}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="formGroup mrg-b-30">
                          <input
                            type="text"
                            placeholder={
                              language === "en" ? "Address line 2" : "العنوان 2"
                            }
                            name="addressLine2"
                            className="cstInput"
                            value={userDetails.addressLine2}
                            onChange={handleInputChange}
                          />

                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="formGroup mrg-b-30">
                          <input
                            type="text"
                            placeholder={language === "en" ? "City" : "المدينة"}
                            name="city"
                            className="cstInput"
                            value={userDetails.city}
                            onChange={handleInputChange}
                          />
                          {errorMessages.city && <p style={{ color: "red" }}>{errorMessages.city}</p>}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="formGroup mrg-b-30">
                          <input
                            type="text"
                            placeholder={
                              language === "en" ? "Enter State" : "ادخل الدولة"
                            }
                            name="state"
                            className="cstInput"
                            value={userDetails.state}
                            onChange={handleInputChange}
                          />
                          {errorMessages.state && <p style={{ color: "red" }}>{errorMessages.state}</p>}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="formGroup mrg-b-30">
                          <input
                            type="text"
                            placeholder={
                              language === "en" ? "Post Code" : "رمز البريد"
                            }
                            name="pinCode"
                            className="cstInput"
                            value={userDetails.pinCode}
                            onChange={handleInputChange}
                          />
                          {errorMessages.pinCode && <p style={{ color: "red" }}>{errorMessages.pinCode}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="checckoutTitle f-s-20 f-w-SB txt-black mrg-b-10">


                      {language === "en" ? "Shipping address" : "عنوان الشحن"}

                    </div>
                    <div className="row row-vw">
                      <div className="col-md-12">
                        <div className="formGroup mrg-b-30">
                          <select
                            className="cstInput"
                            name="shippingcountry"
                            value={userDetails.shippingcountry} // Convert value to lowercase
                            onChange={(e) => {
                              const updatedValue = e.target.value; // Ensure value is passed in lowercase
                              handleInputChange({ target: { name: e.target.name, value: updatedValue } });
                            }}
                          >
                            <option value="">  {language === "en"
                              ? "Select Country"
                              : "اختر الدولة"}</option>
                           
                           
                            <option value="ARE">ARE</option>

                            {/* <option value="UAE">UAE</option> */}
                            {/* Add more countries as needed */}
                          </select>
                          {errorMessages.shippingcountry && <p style={{ color: "red" }}>{errorMessages.shippingcountry}</p>}
                        </div>

                      </div>
                      <div className="col-md-12">
                        <div className="formGroup mrg-b-30">
                          <input
                            type="text"
                            placeholder={
                              language === "en" ? "Address line 1" : "العنوان 1"
                            }
                            name="shippingaddressLine1"
                            className="cstInput"
                            value={userDetails.shippingaddressLine1}
                            onChange={handleInputChange}
                          />
                          {errorMessages.shippingaddressLine1 && <p style={{ color: "red" }}>{errorMessages.shippingaddressLine1}</p>}

                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="formGroup mrg-b-30">
                          <input
                            type="text"
                            placeholder={
                              language === "en" ? "Address line 2" : "العنوان 2"
                            }
                            name="shippingaddressLine2"
                            className="cstInput"
                            value={userDetails.shippingaddressLine2}
                            onChange={handleInputChange}
                          />


                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="formGroup mrg-b-30">
                          <input
                            type="text"
                            placeholder={language === "en" ? "City" : "المدينة"}
                            name="shippingcity"
                            className="cstInput"
                            value={userDetails.shippingcity}
                            onChange={handleInputChange}
                          />
                          {errorMessages.shippingcity && <p style={{ color: "red" }}>{errorMessages.shippingcity}</p>}

                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="formGroup mrg-b-30">
                          <input
                            type="text"
                            placeholder={
                              language === "en" ? "Enter State" : "ادخل الدولة"
                            }
                            name="shippingstate"
                            className="cstInput"
                            value={userDetails.shippingstate}
                            onChange={handleInputChange}
                          />
                          {errorMessages.shippingstate && <p style={{ color: "red" }}>{errorMessages.shippingstate}</p>}

                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="formGroup mrg-b-30">
                          <input
                            type="text"
                            placeholder={
                              language === "en" ? "Post Code" : "رمز البريد"
                            }
                            name="shippingpinCode"
                            className="cstInput"
                            value={userDetails.shippingpinCode}
                            onChange={handleInputChange}
                          />
                          {errorMessages.shippingpinCode && <p style={{ color: "red" }}>{errorMessages.shippingpinCode}</p>}

                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="row">
                      {cartData.map((item, index) => (
                        <div key={index} className="col-md-12 mb-4">
                          <div className="orderSummary">
                            <div className="card-body">
                              <h5 className="card-title">                      {language === "en" ? item.ProductNameE : item.ProductNameA}
                              </h5>
                              <p className="card-text">
                                <strong>

                                  {language === "en" ? "Quantity:" : " العدد"}
                                </strong> {item.OrderQuantity}
                              </p>
                              <p className="card-text">
                                {language === "en" ? "Price (AED):" : " السعر AED"}
                                {item.OrderPrice}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <table className="table orderSummary mrg-t-40">
                      <tbody>
                        <tr>
                          <td>
                            <h5>

                              {language === "en" ? "Subtotal" : "المجموع الفرعي"}

                            </h5>
                          </td>
                          <td className="text-right">
                            <h5>
                              <strong>AED {grandTotal}</strong>
                            </h5>
                          </td>
                        </tr>
                        {/* <tr>
                          <td>
                            <h5>Estimated shipping</h5>
                          </td>
                          <td className="text-right">
                            <h5>
                              <strong>AED {shippingCost}</strong>
                            </h5>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h3>Total</h3>
                          </td>
                          <td className="text-right">
                            <h3>
                              <strong>AED {grandTotal}</strong>
                            </h3>
                          </td>
                        </tr> */}
                      </tbody>
                    </table>
                    <div>
                      <div>
                        <div className="form-group compact-form-group">
                          {showReCAPTCHA ? (
                            <ReCAPTCHA
                              sitekey="6Lfd6D0rAAAAAB2sJs7KnDr1pYnIcU9YAYeqtvCG"
                              onChange={onChangerecaptcha}
                            />
                          ) : (
                            <>
                              <button
                                className="submitBtn compact-submitBtn"
                                data-type="placeOrder"
                                onClick={handlePlaceOrderClick}
                              >
                                {language === "en" ? "Submit" : " تقديم"}
                              </button>
                              <br />
                              <br />
                            </>
                          )}
                        </div>
                        {/* <button
                            className="submitBtn compact-submitBtn"
                            data-type="placeOrder"
                            
                          >
                            {language === "en" ? "Place Order" : "مكان الطلب"}
                          </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>

      )}
    </>
  );
};

export default CheckoutGuest;

{
  /* <div id="hola">
        <div id="preloader">
          <div className="loader-logo mx-auto mrg-b-30"></div>
          <div className="loadingTxt text-center">
            <div className="txtSummary f-s-20">
           
            </div>
          </div>
        </div>
      </div>

    
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
      <div className="col-md-8"></div>
      <div className="section_dashboard secBg">
        <div className="full-container container">
          <div className="row">
            <div className="col-md-12">
              <div className="secTitle_wrap text-center mrg-b-30">
                <div className="secTitle f-s-30 font-Lyon ">
                  {language === "en" ? "Checkout " : " الدفع"}
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="mrg-b-20 shiping-adBox">
                <div className="checckoutTitle f-s-20 f-W-B txt-black mrg-b-10">
                  {language === "en"
                    ? "   Contact information"
                    : "البيانات الشخصية "}
                </div>

                <div>
                  {userDetails && Object.keys(userDetails).length > 0 ? (
                    <div className="row row-vw">
                      <div className="col-md-6">
                        <div className="formGroup mrg-b-10">
                          <label>
                            {language === "en"
                              ? "Contact Name"
                              : "اسم المتصل"}
                            :
                          </label>
                          <span>
                            {userDetails.FirstName || ""}
                            {userDetails.LastName || ""}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="formGroup mrg-b-10">
                          <label>
                            {language === "en" ? "Email ID:  " : "  الإيميل"}
                          </label>
                          <span> {userDetails.EmailId || ""}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="formGroup mrg-b-10">
                          <label>
                            {language === "en"
                              ? "Mobile No:"
                              : " رقم الهاتف:"}
                          </label>
                          <span>{userDetails.Mobile || ""}</span>
                          <br />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <a className="editTxt" onClick={contacten}>
                        {language === "en"
                          ? "  Add Contact Information    "
                          : "    اضف البيانات الشخصية "}
                      </a>
                    </>
                  )}
                </div>
                <>
                  <a className="editTxt" onClick={contacten}>
                    {language === "en"
                      ? "    Edit Contact Information    "
                      : "تعديل معلومات الاتصال"}
                  </a>
                </>
              </div>

              <div className="col-md-12">
                <div class="shiping-adBox mrg-b-20">
                  <div className="mrg-b-20">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="billtingTitle f-W-B">
                        {language === "en"
                          ? "  Shipping Address    "
                          : " عنوان الشحن:"}
                      </div>

                      <div className="select-default-address"></div>
                    </div>
                  </div>
                  {loading && <Loader />}
                  {shippingAddresses && shippingAddresses.length > 0 ? (
                    shippingAddresses.map((address) => (
                      <div className="" key={address.AddressId}>
                        <div className=" d-flex gap-2">
                          <div class="redio-item">
                            <input
                              type="radio"
                              name="defaultAddress"
                              className="cstRedio"
                              id="checkBox"
                              checked={address.IsDefault}
                              onChange={() =>
                                setAddressAsDefault(address.AddressId)
                              }
                            />

                            <label class="checkLable" for="checkBox">
                              <div>
                                {address.AddressLine1},{address.AddressLine2},
                                <br />
                                {address.City}, {address.State},
                                {address.Country}, {address.PostCode} 
                              </div>
                            </label>
                          </div>
                        </div>  
                      </div>
                    ))
                  ) : (
                    <>
                      <a className="editTxt" onClick={addressen}>
                        {language === "en"
                          ? "Add Shipping Address"
                          : "أضف عنوان الشحن"}
                      </a>
                    </>
                  )}
                  {shippingAddresses && shippingAddresses.length > 0 && (
                    <a className="editTxt" onClick={addressen}>
                      {language === "en"
                        ? "Edit Shipping address"
                        : "تعديل عنوان الشحن"}
                    </a>
                  )}
                </div>
              </div>

              <div className="col-md-12">
                <div class="shiping-adBox mrg-b-20">
                  <div className="mrg-b-20">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="billtingTitle f-W-B">
                        {language === "en"
                          ? " Billing Address    "
                          : "عنوان وصول الفواتير"}
                      </div>

                      <div className="select-default-address"></div>
                    </div>
                  </div>
                  {loading2 && <Loader />}
                  {billingAddresses && billingAddresses.length > 0 ? (
                    billingAddresses.map((address) => (
                      <div className="" key={address.AddressId}>
                        <div className=" d-flex gap-2">
                          <div class="redio-item">
                            <input
                              type="radio"
                              name="defaultBillingAddressytfuydfy"
                              className="cstRedio"
                              id="checkBox"
                              checked={address.IsDefault}
                              // checked={true}

                              onChange={() =>
                                setAddressAsDefault2(address.AddressId)
                              }
                            />

                            <label class="checkLable" for="checkBox">
                              <div>
                                {address.AddressLine1},{address.AddressLine2},
                                <br />
                                {address.City}, {address.State},
                                {address.Country}, {address.PostCode}
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <a className="editTxt" onClick={addressen}>
                        {language === "en"
                          ? "Add Billing Address "
                          : "إضافة عنوان الفواتير "}
                      </a>  
                    </>
                  )}

                  {billingAddresses && billingAddresses.length > 0 && (
                    <a className="editTxt" onClick={addressen}>
                      {language === "en"
                        ? "Edit Billing address"
                        : "تعديل عنوان الفواتير"}
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <table className="table orderSummary mrg-t-40">
                <tbody>
                  <tr>
                    <td>
                      <h5>
                        {language === "en" ? "Subtotal" : "المجموع الفرعي"}
                      </h5>
                    </td>
                    <td className="text-right">
                      <h5>
                        <strong>{`AED ${calculateSubtotal()}`}</strong>
                      </h5>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h5>
                        {language === "en"
                          ? "Estimated shipping"
                          : "تكلفة الشحن المقدرة"}
                      </h5>
                    </td>
                    <td className="text-right">
                      <h5>
                        <strong>{`AED ${calculateEstimatedShipping()}`}</strong>
                      </h5>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3>{language === "en" ? "Total" : "المجموع"}</h3>
                    </td>
                    <td className="text-right">
                      <h5>
                        <strong>{`AED ${calculateTotal()}`}</strong>
                      </h5>
                    </td>
                  </tr>
                </tbody>
              </table>
             

              <div>
                {showOrderButton && (
                  <div className="form-group compact-form-group">
                    {showReCAPTCHA ? (
                      <ReCAPTCHA
                        sitekey="6Lfd6D0rAAAAAB2sJs7KnDr1pYnIcU9YAYeqtvCG"
                        onChange={onChangerecaptcha}

                      />
                    ) : (
                      
                          <button
                        className="submitBtn compact-submitBtn"
                        onClick={handlePlaceOrderClick}
                      >
                        {language === "en" ? "Place Order" : "مكان الطلب"}
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {language === "en" ? " Order Placed " : "تم الطلب "}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {language === "en" ? " Your Order Placed" : " تم تقديم طلبك"}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <Modal
        show={showModalp}
        onHide={handleCloseModal}
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {language === "en" ? "Misssing Information  " : "معلومات ناقصة "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {language === "en"
            ? "  Add Missing Information "
            : "اضف البيانات الناقصة"}
          <br />
          <span>
            {shippingAddresses && shippingAddresses.length <= 0
              ? language === "en"
                ? "Shipping Address  "
                : "عنوان الشحن "
              : ""}
          </span>
          <br />
          <span>
            {billingAddresses && billingAddresses.length <= 0
              ? language === "en"
                ? "Billing  Address  "
                : "عنوان وصول الفواتير "
              : ""}
          </span>
          <br />
          <span>
            {!mobile || !/^[0-9]{6,}$/.test(mobile)
              ? language === "en"
                ? "Contact Information  "
                : " البيانات الشخصية "
              : ""}
          </span>
          <br />
        </Modal.Body>
      </Modal>
    </div> */
}
