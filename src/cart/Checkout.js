import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { JSEncrypt } from 'jsencrypt';
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import { DataContext } from "../utils/ApiContext";
import BASE_PATH, { ERC_ReCAPTCHA } from "../serviceurls";
import axios from "axios";
import Loader from "../components/Loader"; // Import your Loader component
import { useLanguage } from "../redux/LanguageContext";
import BeforePayment from "./BeforePayment";
import ReCAPTCHA from "react-google-recaptcha";
import CancellPayment from "./CancellPayment";
import SamsungPay from "./samsung";
import applePayLogo from "../assets/images/apple128.png";
import pngegg from "../assets/images/pngegg.png";

import "./ApplePayButton.css";
import { decryptData, encryptData } from "../utils/crypto";
/* global ApplePaySession */
const cors = require("cors")({ orgin: true });
const Checkout = () => {
  const { language } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [email, setEmail] = useState("");
  const [loaderFirst, setLoader] = useState(true);
  const [isApplePay, setIsApplePay] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [mobile, setMobile] = useState("");
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [userproductNamesA, setUserproductNamesA] = useState([]);
  const [userproductNamesE, setUserproductNamesE] = useState([]);
  const [calQuantityWeight, setQuantityWeight] = useState([]);

  const [showOrderButton, setShowOrderButton] = useState(true);

  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  
  const tokenlogin = localStorage.getItem("loginToken");
  const bearerToken = localStorage.getItem("bearerToken");
 const UserID = localStorage.getItem("UserID");
  useEffect(() => {
    window.scrollTo(0, 300);
  }, []);
  useEffect(() => {
    const UserID = localStorage.getItem("UserID");
    if (!UserID) {
      navigate("/login");
      return;
    }
    const apiUrlUser = `${BASE_PATH}Security/GetUserById?id=${UserID}`;

    fetch(apiUrlUser, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenlogin}`,
      },
    })
      .then((response) => response.json())
      .then((userData) => {
        // console.log("User details:", userData);
        setUserDetails(userData);
        setEmail(userData.EmailId || "");
        setFirstName(userData.FirstName || "");
        setLastName(userData.LastName || "");
        setMobile(userData.Mobile || "");
      })
      .catch((error) => {
        // localStorage.removeItem("loginToken");
        // localStorage.removeItem("UserID");
        navigate("/login");
      });
  }, [UserID, tokenlogin]);

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

      // console.log();
      setData(cartData.length); // Assuming setData is defined elsewhere
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [showReCAPTCHA, setShowReCAPTCHA] = useState(false);
  function onChangerecaptcha(value) {
    // console.log('display');

    // console.log("Captcha value:", value);
    handlePlaceOrder();
    authenticateAndProcessPayment();
  }
  const handlePlaceOrderClick = (event) => {
    const buttonType = event.currentTarget.getAttribute("data-type");

    if (buttonType === "placeOrder") {
      // console.log("Place Order button clicked");
      setIsApplePay(false);
      modaldataforcheck();
    } else if (buttonType === "applePay") {
      // console.log("Apple Pay button clicked");
      setIsApplePay(true);
      modaldataforcheck();
    }

    // setShowReCAPTCHA(true); // Show ReCAPTCHA when the button is clicked
  };

  const [totalAmount, setTotalAmount] = useState(0); // State to store the total amount
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [shippingData, setShippingData] = useState(null);
  const [error, setError] = useState(null);
  const [orderIdsCSV, setOrderIdsCSV] = useState();
  const [caltotalWeight, setTotalWeight] = useState();
  const [TotalAmountesatamtied, setTotalAmountesatamtied] = useState();
  const [showModalp, setshowModalp] = useState(false);
  const handleCloseModal = () => setshowModalp(false);

  const modaldataforcheck = () => {
    if (
      !mobile ||
      !/^[0-9]{6,}$/.test(mobile) ||
      (shippingAddresses && shippingAddresses.length <= 0) ||
      (billingAddresses && billingAddresses.length <= 0)
    ) {
      setshowModalp(true);

      setTimeout(() => {
        setshowModalp(false);
      }, 5000);
    } else {
      setShowReCAPTCHA(true);
    }
  };
  useEffect(() => {
    fetchRateDetails();
    // console.log('shippingAddresses',shippingAddresses);
    // console.log('caltotalWeight',caltotalWeight);
  }, [shippingAddresses, caltotalWeight]);
  const addressen = () => {
    navigate("/address");
  };

  const contacten = () => {
    navigate("/accountdetails");
  };

  const [mco, setMco] = useState(null);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const initiateMastercardPayment = async (mco) => {
    setLoader(false);

    // console.log("Initiating Mastercard payment...");

    const billingAddress =
      billingAddresses.find((address) => address.IsDefault) || null;
    const shippingAddress =
      shippingAddresses.find((address) => address.IsDefault) || null;

    // console.log("billingAddress",billingAddress);
    // console.log("shippingAddress",shippingAddress);

    if (
      !billingAddress ||
      !shippingAddress ||
      !userDetails.FirstName ||
      !userDetails.LastName ||
      !userDetails.EmailId ||
      !userDetails.Mobile
    ) {
      console.error("Required data for payment not found.");
      return;
    }

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
          returnUrl: `https://www.alghadeeruaecrafts.ae/paymentcallback`,
          displayControl: {
            billingAddress: "READ_ONLY",
          },
          timeout: 1800,
          timeoutUrl: `https://www.alghadeeruaecrafts.ae/checkout`,
          cancelUrl: `https://www.alghadeeruaecrafts.ae/checkout`,
          style: {
            accentColor: "#9F926D",
          },
        },
        order: {
          currency: "AED",
          amount: calculateTotal().toFixed(2),
          id: mco,
          description: "ERC CRAFTS",
        },
        customer: {
          email: userDetails.EmailId,
          firstName: userDetails.FirstName,
          lastName: userDetails.LastName,
          mobilePhone: userDetails.Mobile,
        },
        billing: {
          address: {
            city: billingAddress.City,
            country: billingAddress.Country,
            postcodeZip: billingAddress.PostCode,
            stateProvince: billingAddress.State,
            street: billingAddress.AddressLine1,
            street2: billingAddress.AddressLine2,
          },
        },
      },
    };

    // console.log("Mastercard API request data:", data);
  const encrypted = encryptData(data);

    const payload = {
      EncryptedData: encrypted
    };
    try {
      const response = await axios.post(
        `${BASE_PATH}Security/GetSessionIdFromMasterCard`,
        payload,
        {
          headers: {
            // Authorization: `Bearer ${tokenlogin}`,
            "Content-Type": "application/json-patch+json",
          },
        }
      );

    const encryptedResponse = response.data;
    const decrypted = decryptData(encryptedResponse); 

    const sessionId = decrypted?.SessionId;

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

          window.Checkout.showPaymentPage();
        } else {
          console.error("Mastercard Checkout script is not loaded properly.");
          alert("Failed to proceed with the checkout. Please try again later.");
        }
      } else {
        console.error("No session ID returned from the API.");
        alert("Failed to proceed with the checkout. Please try again later.");
      }
      // if (isApplePay,sessionId) {
      //   alert("Apple Pay logic executed...",sessionId);
      //   initiateApplePay();
      // } else {
      //   if (sessionId) {
      //     if (
      //       window.isMastercardScriptLoaded &&
      //       window.Checkout &&
      //       typeof window.Checkout.configure === "function" &&
      //       typeof window.Checkout.showPaymentPage === "function"
      //     ) {
      //       window.Checkout.configure({
      //         session: {
      //           id: sessionId,
      //         },
      //       });

      //       window.Checkout.showPaymentPage();
      //     } else {
      //       console.error("Mastercard Checkout script is not loaded properly.");
      //       alert(
      //         "Failed to proceed with the checkout. Please try again later."
      //       );
      //     }
      //   } else {
      //     console.error("No session ID returned from the API.");
      //     alert("Failed to proceed with the checkout. Please try again later.");
      //   }
      // }
    } catch (error) {
      console.error("Error sending request to Mastercard API:", error);
      alert("Failed to proceed with the checkout. Please try again later.");
    }
  };
  /* global ApplePaySession */
  const initiateApplePay = () => {
    if (!window.ApplePaySession) {
      console.error("Apple Pay is not supported on this device or browser.");
      alert("Apple Pay is not supported on this device or browser.");
      return;
    }

    const request = {
      countryCode: "US",
      currencyCode: "USD",
      supportedNetworks: ["visa", "masterCard", "amex"],
      merchantCapabilities: ["supports3DS"],
      total: {
        label: "ERC CRAFTS",
        // amount: calculateTotal(),
        amount: "10",
      },
    };

    if (!ApplePaySession.canMakePayments()) {
      console.error("Apple Pay is not available on this device.");
      alert("Apple Pay is not available on this device.");
      return;
    }

    const session = new ApplePaySession(3, request);

    session.onvalidatemerchant = async (event) => {
      // console.log("Validate merchant event:", event.validationURL);

      try {
        const merchantSession = await fetchMerchantValidation(
          event.validationURL
        );
        session.completeMerchantValidation(merchantSession);
      } catch (error) {
        console.error("Merchant validation failed:", error);
        session.abort();
      }
    };

    session.onpaymentauthorized = (event) => {
      // console.log("Payment authorized event:", event.payment);

      const isSuccess = processPayment(event.payment);

      session.completePayment(
        isSuccess
          ? ApplePaySession.STATUS_SUCCESS
          : ApplePaySession.STATUS_FAILURE
      );
    };

    // Session canceled
    session.oncancel = () => {
      // console.log("Payment session canceled by user.");
    };

    // Start the session
    session.begin();
  };
  const fetchMerchantValidation = async (validationURL) => {
    // console.log("Fetching merchant validation...");
    // Replace with your server endpoint
    const response = await fetch("/apple-pay/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ validationURL }),
    });

    if (!response.ok) {
      throw new Error("Failed to validate merchant.");
    }

    return response.json();
  };

  // Simulated payment processing
  const processPayment = (payment) => {
    // console.log("Processing payment:", payment);
    // Simulate success or failure
    return true; // Return true for success, false for failure
  };
  const [userOrders, setUserOrders] = useState([]);
  const calculateSubtotal = () => {
    const subtotal = userOrders.reduce(
      (subtotal, order) => order.TotalAmount,
      0
    );
    return subtotal;
  };
  const calculateEstimatedShipping = () => {
    // console.log("Shipping charges Data:", shippingData);

    const shippingAddress = shippingAddresses.find(
      (address) => address.IsDefault
    ); // Find the default shipping addressS
    // console.log("Shipping chnage Address:", shippingAddress);

    if (!shippingData) {
      return 0;
    }

    if (!shippingAddress || !shippingAddress.Country) {
      return 0;
    }

    const shippingCharges = shippingData.find(
      (item) => item.Country === shippingAddress.Country
    );
    return shippingCharges ? shippingCharges.Charges : 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = TotalAmountesatamtied;
    return subtotal + shipping;
  };
  const fetchUserOrders = async () => {
    setLoader(true);

    const apiUrl = `${BASE_PATH}Order/GetAllUserOrdersInCartByUserId?userId=${UserID}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenlogin}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserOrders(data);
        // console.log(data);

        const total = data.reduce((acc, order) => acc + order.TotalAmount, 0);
        setTotalAmount(total);
        // console.log(total);
        // setLoader(false);
        const idsCSV = data.map((order) => order.OrderId).join(",");
        setOrderIdsCSV(idsCSV);
        const totalWeight = data.reduce(
          (acc, order) =>
            acc + (order.Weight || 0) * (order.OrderQuantity || 1),
          0
        );
        setTotalWeight(totalWeight);
        // console.log("Total Weight:", totalWeight);

        const totalQuantity = data.reduce(
          (acc, order) => acc + (order.OrderQuantity || 0),
          0
        );
        setQuantityWeight(totalQuantity);
        // console.log("Total Quantity:", totalQuantity);

        const productNames = data.map((order) => ({
          productNameA: order.ProductNameA,
          productNameE: order.ProductNameE,
        }));

        // Separate arrays for product names in Arabic and English
        const productNamesA = productNames
          .map((item) => item.productNameA)
          .join(",           ");
        const productNamesE = productNames
          .map((item) => item.productNameE)
          .join(",           ");
        setUserproductNamesE(productNamesE);
        setUserproductNamesA(productNamesA);

        GetAllUserAddressesByUserId();
      })
      .catch((error) => {
        console.error("Error fetching user orders:", error);
        // localStorage.removeItem("loginToken");
        // localStorage.removeItem("UserID");
        navigate("/login");
      });
  };

  const fetchShippingData = () => {
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
        console.error("Error fetching shipping data:", error);
        setError(error);
        // localStorage.removeItem("loginToken");
        // localStorage.removeItem("UserID");
        // navigate("/login");
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);

        await fetchUserOrders();

        // setLoader(false);
      } catch (error) {
        console.error("Error in fetching data:", error);
      }
    };

    fetchData();
  }, [UserID, tokenlogin]);

  useEffect(() => {
    fetchShippingData();
  }, [UserID, tokenlogin, navigate, language]);

  const GetAllUserAddressesByUserId = async () => {
    try {
      const response = await fetch(
        `${BASE_PATH}Security/GetAllUserAddressesByUserId?userId=${UserID}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${tokenlogin}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const dataadd = await response.json();

      // console.log("Fetched addresses:", dataadd);

      const billingAddresses = dataadd.filter(
        (address) => address.AddressTypeId === 1
      );
      const shippingAddresses = dataadd.filter(
        (address) => address.AddressTypeId === 2
      );

      // console.log('Billing Addresses:', billingAddresses);
      // console.log('Shipping Addresses:', shippingAddresses);

      setBillingAddresses(billingAddresses);
      setShippingAddresses(shippingAddresses);
      await fetchRateDetails();
      // console.log("GetAllUserAddressesByUserId", dataadd);
    } catch (error) {
      // console.error("GetAllUserAddressesByUserId", error);
    }
  };

  const setAddressAsDefault = async (addressId) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_PATH}Security/SetAddressAsDefault?addressId=${addressId}`,
        {
          method: "PUT",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${tokenlogin}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      // console.log("SetAddressAsDefault response:", responseData);
      GetAllUserAddressesByUserId();
      // fetchRateDetails();
      fetchRateDetails();
      setLoading(false);
      setShowReCAPTCHA(false);
      // Handle success response here if needed
    } catch (error) {
      console.error("SetAddressAsDefault", error);
    } finally {
      // fetchRateDetails()
    }
  };
  const setAddressAsDefault2 = async (addressId) => {
    setLoading2(true);
    try {
      const response = await fetch(
        `${BASE_PATH}Security/SetAddressAsDefault?addressId=${addressId}`,
        {
          method: "PUT",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${tokenlogin}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      // console.log("SetAddressAsDefault response:", responseData);
      GetAllUserAddressesByUserId();
      setLoading2(false);
      setShowReCAPTCHA(false);
      // Handle success response here if needed
    } catch (error) {
      console.error("SetAddressAsDefault", error);
    }
  };

  const authenticateAndProcessPayment = async () => {
    setLoader(true);
    try {
      const bearerToken = await authenticate();
      if (bearerToken) {
        const mco = await initializePayment(bearerToken);
        if (mco) {
          const success = await initiateMastercardPayment(mco);
          setIsPaymentSuccessful(success);
        }
      }
    } catch (error) {
      console.error("Error during payment process:", error);
    }
  };

  const authenticate = async () => {
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

      // console.log("Authentication successful. Bearer token:", bearerToken);
      return bearerToken;
    } catch (error) {
      console.error("Error authenticating:", error);
      return null;
    }
  };

  const initializePayment = async (bearerToken) => {
    // const storedMco = localStorage.getItem("mco");

    // if (storedMco) {
    //   console.log("MCO already exists. Using stored MCO:", storedMco);
    //   setMco(storedMco);
    //   return storedMco;
    // }

    const paymentData = [
      {
        amount: calculateTotal().toString(),
        name: `${userDetails.FirstName} ${userDetails.LastName}`,
        mobile: userDetails.Mobile,
        email: userDetails.EmailId,
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
      // console.log("Payment initialized. MCO:", mco);
      return mco;
    } catch (error) {
      // console.error("Error initializing payment:", error);
      return null;
    }
  };
  // console.log(mco);
  const [shouldShowCancelPayment, setShouldShowCancelPayment] = useState(false);
  useEffect(() => {
    const paymentStatus = localStorage.getItem("paymentStatus");
    if (paymentStatus === "order_placed") {
      localStorage.setItem("paymentStatus", "Incomplete_Payment");
      setShouldShowCancelPayment(true);
    }
  }, []);
  const handlePlaceOrder = () => {
    localStorage.setItem("paymentStatus", "order_placed");
  };

  const [rateDetails, setRateDetails] = useState(null);

  const fetchRateDetails = async () => {
    // console.log('function called');

    const shippingAddress =
      shippingAddresses.find((address) => address.IsDefault) || null;
    setLoading(true);
    // console.log('shippingAddress',shippingAddress);

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
        Line1: shippingAddress.AddressLine1,
        Line2: null,
        Line3: null,
        City: shippingAddress.City,
        StateOrProvinceCode: null,
        PostCode: shippingAddress.PostCode,
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
          Value: parseFloat(caltotalWeight.toFixed(3)),
        },
        ChargeableWeight: {
          Unit: "KG",
          Value: parseFloat(caltotalWeight.toFixed(3)),
        },
        DescriptionOfGoods: null,
        GoodsOriginCountry: null,
        NumberOfPieces: calQuantityWeight,
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

    try {
  const encrypted = encryptData(requestData);

    const payload = {
      EncryptedData: encrypted
    };
    const response = await axios.post(apiUrl, payload, {
  headers: {
    "Content-Type": "application/json-patch+json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});

      const encryptedResponse = await response.data; 
      const result = decryptData(encryptedResponse);   
      if (result.HasErrors) {
        console.error("API Error:", result);
        setError("An error occurred while calculating the rate.");
      } else {
        const totalValue = result.TotalAmount.Value;
        setTotalAmountesatamtied(totalValue);
        setLoader(false);
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

  //APPLE PAY

  // const [sdkLoaded, setSdkLoaded] = useState(false);
  // const [errorText, setErrorText] = useState("");
  // const [transactionId, setTransactionId] = useState("");

  // const [paymentRequestActive, setPaymentRequestActive] = useState(false);

  // useEffect(() => {
  //   const verifyApplePaySdk = () => {
  //     if (window.ApplePaySession) {
  //       setSdkLoaded(true);
  //       console.log("Apple Pay SDK loaded successfully.");
  //     } else {
  //       setSdkLoaded(false);
  //       setErrorText(
  //         "Apple Pay SDK is not available on this device or browser."
  //       );
  //       console.error("Apple Pay SDK not loaded.");
  //     }
  //   };

  //   const sdkTimeout = setTimeout(verifyApplePaySdk, 2000);

  //   return () => clearTimeout(sdkTimeout);
  // }, []);

  // const authenticateAndProcessPaymentApplePay = async () => {
  //   try {
  //     const token = await getAuthenticationToken();
  //     if (token) {
  //       const transactionId = await initializeApplePayPayment(token);
  //       if (transactionId) {
  //         const paymentSuccess = await processApplePayClick();
  //         // setPaymentStatus(paymentSuccess);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error during payment processing:", error);
  //   }
  // };

  // const processApplePayClick = async () => {
  //   const paymentDetails = {
  //     countryCode: "US",
  //     currencyCode: "USD",
  //     total: {
  //       label: "ERC",
  //       amount: calculateTotal(),
  //     },
  //     supportedNetworks: ["visa", "masterCard", "amex", "discover"],
  //     merchantCapabilities: ["supports3DS"],
  //   };

  //   console.log("Initiating Apple Pay with details:", paymentDetails);

  //   if (window.ApplePaySession) {
  //     try {
  //       const applePaySession = new window.ApplePaySession(1, paymentDetails);

  //       applePaySession.onvalidatemerchant = async (event) => {
  //         console.log("Merchant validation initiated:", event);
  //         try {
  //           const merchantSession = {
  //             merchantIdentifier: "merchant.uat.alghadeeruaecrafts.ae",
  //           };
  //           applePaySession.completeMerchantValidation(merchantSession);
  //           console.log("Merchant validated successfully.");
  //         } catch (error) {
  //           console.error("Error during merchant validation:", error);
  //           applePaySession.abort();
  //         }
  //       };

  //       applePaySession.onpaymentauthorized = async (event) => {
  //         console.log("Payment authorized:", event.payment);
  //         try {
  //           applePaySession.completePayment(
  //             window.ApplePaySession.STATUS_SUCCESS
  //           );
  //           console.log("Payment processed successfully.");
  //         } catch (error) {
  //           console.error("Error during payment processing:", error);
  //           applePaySession.completePayment(
  //             window.ApplePaySession.STATUS_FAILURE
  //           );
  //         }
  //       };

  //       applePaySession.begin();
  //       setPaymentRequestActive(true);
  //     } catch (error) {
  //       console.error("Error initiating Apple Pay session:", error);
  //     }
  //   } else {
  //     console.error(
  //       "Apple Pay is not available. Fallback to alternative payment methods."
  //     );
  //     handleMasterCardPayment(transactionId);
  //   }
  // };

  // const initializeApplePayPayment = async (token) => {
  //   const authToken = localStorage.getItem("authToken");

  //   const paymentData = [
  //     {
  //       amount: calculateTotal().toString(),
  //       name: `${userDetails.FirstName} ${userDetails.LastName}`,
  //       mobile: userDetails.Mobile,
  //       email: userDetails.EmailId,
  //     },
  //   ];

  //   try {
  //     const paymentResponse = await axios.post(
  //       "https://portal.rcuae.ae/api/Ghadeer/InitializePayment",
  //       paymentData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${authToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     const transactionId = paymentResponse.data.mco;
  //     localStorage.setItem("transactionId", transactionId);
  //     setLoader();
  //     setTransactionId(transactionId);
  //     console.log("Payment initialized. Transaction ID:", transactionId);
  //     return transactionId;
  //   } catch (error) {
  //     console.error("Error initializing payment:", error);
  //     return null;
  //   }
  // };

  // const getAuthenticationToken = async () => {
  //   setLoader(true);
  //   try {
  //     const authResponse = await axios.post(
  //       "https://portal.rcuae.ae/api/Token",
  //       {
  //         username: "GHADEER",
  //         password: "GHADEER@123",
  //       }
  //     );
  //     const token = authResponse.data.access_token;
  //     localStorage.setItem("authToken", token);

  //     console.log("Authentication successful. Token:", token);
  //     return token;
  //   } catch (error) {
  //     console.error("Error during authentication:", error);
  //     return null;
  //   }
  // };
  // const handleMasterCardPayment = async (transactionId) => {
  //   const paymentData = {
  //     MastercardOrderId: transactionId,
  //     TransactionId: Math.floor(Math.random() * 1000000),
  //     TotalAmount: calculateTotal().toString(),
  //     PaymentProvider: "APPLE_PAY",
  //     CardNumber: "2223000000000007", // Static value
  //     CardExpireMonth: "01", // Static value
  //     CardExpireYear: "39", // Static value
  //   };

  //   try {
  //     const response = await axios.put(
  //       `${BASE_PATH}Security/PutMasterCardPayment`,
  //       paymentData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${tokenlogin}`,
  //           "Content-Type": "application/json-patch+json",
  //         },
  //       }
  //     );
  //     console.log("MasterCard payment processed successfully:", response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error processing MasterCard payment:", error);
  //     return null;
  //   }
  // };

  // useEffect(() => {
  //   const checkAndLoadSamsungPayButton = () => {
  //     if (window.SamsungPay && window.SamsungPay.PaymentClient) {
  //       const samsungPayClient = new window.SamsungPay.PaymentClient({
  //         environment: "STAGE", // Replace with "PRODUCTION" in production
  //       });

  //       // Check if the button already exists to prevent duplication
  //       const existingButton = document.getElementById("samsungpay-button");
  //       if (existingButton) return;

  //       const samsungPayButton = samsungPayClient.createButton({
  //         onClick: () => onSamsungPayButtonClicked(samsungPayClient),
  //         buttonStyle: "black",
  //         type: "buy",
  //       });

  //       // Assign an ID to the button to identify it later
  //       samsungPayButton.id = "samsungpay-button";

  //       const container = document.getElementById("samsungpay-container");
  //       if (container) {
  //         container.appendChild(samsungPayButton);
  //       }
  //     } else {
  //       console.error("Samsung Pay SDK not loaded.");
  //       alert("Samsung Pay SDK not loaded.");
  //     }
  //   };

  //   if (document.readyState === "complete") {
  //     checkAndLoadSamsungPayButton();
  //   } else {
  //     window.addEventListener("load", checkAndLoadSamsungPayButton);
  //   }

  //   return () => {
  //     window.removeEventListener("load", checkAndLoadSamsungPayButton);
  //   };
  // }, []);

  // const authenticateAndProcessPaymentSamsungPay = async () => {
  //   // setLoader(true);
  //   try {
  //     const token = await getAuthenticationsSamsungToken();
  //     if (token) {
  //       const transactionId = await initializeSamsungPayPayment(token);
  //       if (transactionId) {
  //         const samsungPayClient = new window.SamsungPay.PaymentClient({
  //           environment: "STAGE",
  //         });
  //         await onSamsungPayButtonClickedPay(samsungPayClient);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error during payment processing:", error);
  //   } finally {
  //     // setLoader(false);
  //   }
  // };

  // const getAuthenticationsSamsungToken = async () => {
  //   try {
  //     const authResponse = await axios.post(
  //       "https://portal.rcuae.ae/api/Token",
  //       {
  //         username: "GHADEER",
  //         password: "GHADEER@123",
  //       }
  //     );
  //     const token = authResponse.data.access_token;
  //     localStorage.setItem("authToken", token);

  //     console.log("Authentication successful. Token:", token);
  //     return token;
  //   } catch (error) {
  //     console.error("Error during authentication:", error);
  //     return null;
  //   }
  // };

  // const initializeSamsungPayPayment = async (token) => {
  //   const paymentData = [
  //     {
  //       amount: calculateTotal().toString(),
  //       name: `${userDetails.FirstName} ${userDetails.LastName}`,
  //       mobile: userDetails.Mobile,
  //       email: userDetails.EmailId,
  //     },
  //   ];

  //   try {
  //     const paymentResponse = await axios.post(
  //       "https://portal.rcuae.ae/api/Ghadeer/InitializePayment",
  //       paymentData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     const transactionId = paymentResponse.data.mco;
  //     localStorage.setItem("transactionId", transactionId);

  //     setTransactionId(transactionId);
  //     console.log("Payment initialized. Transaction ID:", transactionId);
  //     return transactionId;
  //   } catch (error) {
  //     console.error("Error initializing payment:", error);
  //     return null;
  //   }
  // };

  // const onSamsungPayButtonClickedPay = async (samsungPayClient) => {
  //   const paymentMethods = {
  //     version: "2",
  //     serviceId: "7530ca8cc6624e029bf7a6",
  //     protocol: "PROTOCOL_3DS",
  //     allowedBrands: ["visa", "mastercard"],
  //   };

  //   try {
  //     const isReady = await samsungPayClient.isReadyToPay(paymentMethods);
  //     if (isReady.result) {
  //       console.log("Samsung Pay is ready.");
  //       onSamsungPayButtonClicked(samsungPayClient);
  //     } else {
  //       console.warn("Samsung Pay is not ready to pay.");
  //     }
  //   } catch (err) {
  //     console.error("Error checking Samsung Pay readiness:", err);
  //   }
  // };

  // const onSamsungPayButtonClicked = async (samsungPayClient) => {
  //   const transactionDetail = {
  //     orderNumber: transactionId,
  //     merchant: {
  //       name: "ERC",
  //       url: "https://www.alghadeeruaecrafts.ae/",
  //       id: "merchant.7008334",
  //     },
  //     amount: {
  //       option: "FORMAT_TOTAL_ESTIMATED_AMOUNT",
  //       currency: "USD",
  //       total: calculateTotal(),
  //     },
  //   };

  //   const paymentMethods = {
  //     version: "2",
  //     serviceId: "7530ca8cc6624e029bf7a6",
  //     protocol: "PROTOCOL_3DS",
  //     allowedBrands: ["visa", "mastercard"],
  //   };

  //   try {
  //     const result = await samsungPayClient.loadPaymentSheet(
  //       paymentMethods,
  //       transactionDetail
  //     );
  //     console.log("Payment Credential:", result);

  //     const paymentResult = {
  //       status: "CHARGED",
  //       provider: "Samsung Pay",
  //     };

  //     samsungPayClient.notify(paymentResult);
  //     handleMasterCardPaymentforSamsung(transactionId);
  //   } catch (error) {
  //     console.error("Error during payment process:", error);
  //   }
  // };

  // const handleMasterCardPaymentforSamsung = async (transactionId) => {
  //   const paymentData = {
  //     MastercardOrderId: transactionId,
  //     TransactionId: Math.floor(Math.random() * 1000000),
  //     TotalAmount: calculateTotal().toString(),
  //     PaymentProvider: "SAMSUNG_PAY",
  //     CardNumber: "2223000000000007",
  //     CardExpireMonth: "01",
  //     CardExpireYear: "39",
  //   };

  //   try {
  //     const response = await axios.put(
  //       `${BASE_PATH}Security/PutMasterCardPayment`,
  //       paymentData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${tokenlogin}`,
  //           "Content-Type": "application/json-patch+json",
  //         },
  //       }
  //     );
  //     console.log("MasterCard payment processed successfully:", response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error processing MasterCard payment:", error);
  //     return null;
  //   }
  // };

  // useEffect(() => {
  //   console.log("Checking if Apple Pay is available...");
  //   if (window.ApplePaySession) {
  //     setIsApplePayAvailable(ApplePaySession.canMakePayments());
  //     console.log("Apple Pay is available.");
  //   } else {
  //     console.log("Apple Pay is NOT available.");
  //   }
  // }, []);

  useEffect(() => {
    // console.log(calculateTotal());

    if (window.ApplePaySession) {
      ApplePaySession.canMakePaymentsWithActiveCard(
        "merchant.ae.emiratesrc.applepay"
      )
        .then((canPay) => {
          if (canPay) {
            setIsApplePayAvailable(true);
          }
        })
        .catch((error) => {
          console.error("Apple Pay availability check failed:", error);
        });
    }
  }, []);

  const onApplePayButtonClicked = async () => {
    // console.log(calculateTotal());

    if (!window.ApplePaySession) {
      console.error("Apple Pay is not supported in this browser.");
      return;
    }
    // console.log(calculateTotal());

    const request = {
      countryCode: "AE",
      currencyCode: "AED",
      merchantCapabilities: ["supports3DS", "supportsCredit", "supportsDebit"],
      supportedNetworks: ["visa", "masterCard", "amex", "discover"],
      total: {
        label: "Emirates Red Crescent",
        type: "final",
        amount: calculateTotal(),
      },
    };

    const session = new ApplePaySession(3, request);

    session.onvalidatemerchant = async (event) => {
      try {
        const merchantSession = await validateMerchant(event.validationURL);
        session.completeMerchantValidation(merchantSession);
      } catch (error) {
        console.error("Merchant validation failed:", error);
        session.abort();
      }
    };

    session.onpaymentauthorized = async (event) => {
      try {
        const bearerToken = await authenticate();
        if (!bearerToken) {
          console.error("Authentication failed.");
          // session.completePayment(ApplePaySession.STATUS_FAILURE);
          return;
        }

        const mco = await initializePayment(bearerToken);
        if (!mco) {
          console.error("MCO not generated.");
          // session.completePayment(ApplePaySession.STATUS_FAILURE);
          return;
        }

        const masterToken = event.payment.token.paymentData;
        // console.log("Master Token:", masterToken);
        // console.log(
        //   "Apple Pay Payment Token:",
        //   JSON.stringify(masterToken, null, 2)
        // );

        const response = await sendPaymentDataToBackend(
          masterToken,
          calculateTotal(),
          mco,
          session
        );
        if (response.success) {
          session.completePayment(ApplePaySession.STATUS_SUCCESS);
        } else {
          session.completePayment(ApplePaySession.STATUS_FAILURE);
        }
      } catch (error) {
        console.error("Payment failed:", error);
        session.completePayment(ApplePaySession.STATUS_FAILURE);
      }
    };

    session.oncancel = () => {
      // console.log("Apple Pay session canceled");
    };

    session.begin(); // Must be triggered directly by a user gesture
  };

  const validateMerchant = async (validationURL) => {
    try {
      // console.log("Validating merchant with URL:", validationURL);

      const requestBody = new URLSearchParams({
        ValidationURL: validationURL,
      }).toString();
      // console.log("Request Body:", requestBody);

      const response = await fetch(
        `${BASE_PATH}Security/Validate/applepay/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json-patch+json",
            Authorization: `Bearer ${tokenlogin}`,
            Accept: "*/*",
          },
          body: JSON.stringify({ ValidationUrl: validationURL }),
        }
      );

      // console.log("Response Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Merchant validation failed. Error:", errorText);
        throw new Error(`Merchant validation failed: ${errorText}`);
      }

      const responseData = await response.json();
      // console.log("Merchant Validation Response Data:", responseData);

      return responseData;
    } catch (error) {
      console.error("Merchant validation error:", error);
      throw error;
    }
  };

  const sendPaymentDataToBackend = async (
    paymentToken,
    amount,
    mco,
    session
  ) => {
    initiateMastercardPaymentBeforeApple(mco);
    try {
      // console.log("Initiating payment with details:");
      // console.log("PaymentToken:", paymentToken);
      // console.log("Amount:", amount);
      // console.log("MCO:", mco);

      const TransactionIddumy = Math.floor(
        10000000 + Math.random() * 90000000
      ).toString();
      const requestData = {
        PaymentToken: JSON.stringify(paymentToken),
          TotalAmount: Number(amount).toFixed(2),
        MastercardOrderId: mco,
        TransactionId: TransactionIddumy,
      };

      // console.log("Request Body:", requestData);
      // console.log("JSON DATA", JSON.stringify(requestData));

      const response = await fetch(
        `${BASE_PATH}Security/PutAppleMasterCardPayment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json-patch+json",
            Authorization: `Bearer ${tokenlogin}`,
            Accept: "*/*",
          },
          body: JSON.stringify(requestData),
        }
      );

      // console.log("Response Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Payment failed. Error:", errorText);
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
      }

      const responseData = await response.json();
      // console.log("Payment Response Data:", responseData);

      if (responseData.Order?.Status === "CAPTURED") {
        setLoading(true);
        // console.log("Payment Successful!");

        const receiptNumber = responseData.Transaction?.Receipt; // Extract receipt number

        if (receiptNumber) {
          // console.log("receiptNumber", receiptNumber);

          initiateMastercardPaymentAppple(receiptNumber, mco); // Pass receipt number
        } else {
          console.warn("Receipt number is missing!");
        }
        // navigate(`/orderlist`);
        session.completePayment(ApplePaySession.STATUS_SUCCESS);
        return "Success";
      } else {
        initiateMastercardPaymentCancelApple(mco);
        // console.log("Payment Failed or Pending:", responseData.Order?.Status);
        session.completePayment(ApplePaySession.STATUS_FAILURE);
        return responseData;
      }
    } catch (error) {
      console.error("Error sending payment data to backend:", error);
      session.completePayment(ApplePaySession.STATUS_FAILURE);
      throw error;
    }
  };

  const initiateMastercardPaymentAppple = (receiptNumber, mco) => {
    // retrieveOrderDetails();
    setLoading(false);
    setShowModal(true);

    const billingAddress =
      billingAddresses.find((address) => address.IsDefault) || null;
    const shippingAddress =
      shippingAddresses.find((address) => address.IsDefault) || null;

    const payload = {
      TransactionId: receiptNumber,
      UserId: UserID,
      ContactEmail: userDetails.EmailId,
      ContactMobile: userDetails.Mobile,
      BillingAddress: {
        Line1: billingAddress.AddressLine1,
        Line2: billingAddress.AddressLine2,
        City: billingAddress.City,
        StateOrProvinceCode: billingAddress.State,
        PostCode: billingAddress.PostCode,
        CountryCode: billingAddress.Country,
      },
      ShippingAddress: {
        Line1: shippingAddress.AddressLine1,
        Line2: shippingAddress.AddressLine2,
        City: shippingAddress.City,
        StateOrProvinceCode: shippingAddress.State,
        PostCode: shippingAddress.PostCode,
        CountryCode: shippingAddress.Country,
      },
      // BillingAddress: `${billingAddressLine1},${billingAddressLine2}, ${billingCity},${billingState},${billingPostcode},${billingCountry}`,
      // ShippingAddress: `${shippingAddressLine1},${shippingAddressLine2}, ${shippingCity}, ${shippingState},${shippingPostcode},${billingCountry}`,
      TotalAmount: calculateTotal(),
      OrderIdsCSV: orderIdsCSV,
      Status: "Payment_Completed",
      isPaymentIncompleteOrCancelled: "false",
      MastercardOrderId: mco,
    };

    // console.log(payload);
    fetch(`${BASE_PATH}Order/CreateOrderInvoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenlogin}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        markPaymentAsSuccessful(mco);
        setTimeout(() => {
          setShowModal(false);
          navigate(`/orderlist`);
        }, 2000);
      })
      .catch((error) => {
        console.error(
          "Error sending request to CreateOrderInvoice API:",
          error
        );
        toast.error(
          language === "en"
            ? "Failed to proceed with the checkout. Please try again later."
            : "فشل في الدفع، يرجى المحاولة في وقت لاحق"
        );
      });
  };

  const initiateMastercardPaymentCancelApple = (mco) => {
    const billingAddress =
      billingAddresses.find((address) => address.IsDefault) || null;
    const shippingAddress =
      shippingAddresses.find((address) => address.IsDefault) || null;

    const payload = {
      // TransactionId: "T-0001" + Math.floor(100000 + Math.random() * 900000),

      TransactionId: "T-",
      UserId: UserID,
      ContactEmail: userDetails.EmailId,
      ContactMobile: userDetails.Mobile,
      BillingAddress: {
        Line1: billingAddress.AddressLine1,
        Line2: billingAddress.AddressLine2,
        City: billingAddress.City,
        StateOrProvinceCode: billingAddress.State,
        PostCode: billingAddress.PostCode,
        CountryCode: billingAddress.Country,
      },
      ShippingAddress: {
        Line1: shippingAddress.AddressLine1,
        Line2: shippingAddress.AddressLine2,
        City: shippingAddress.City,
        StateOrProvinceCode: shippingAddress.State,
        PostCode: shippingAddress.PostCode,
        CountryCode: shippingAddress.Country,
      },
      // BillingAddress: `${billingAddressLine1},${billingAddressLine2}, ${billingCity},${billingState},${billingPostcode},${billingCountry}`,
      // ShippingAddress: `${shippingAddressLine1},${shippingAddressLine2}, ${shippingCity}, ${shippingState},${shippingPostcode},${billingCountry}`,
      TotalAmount: calculateTotal(),
      OrderIdsCSV: orderIdsCSV,
      Status: "Incomplete_Payment",
      isPaymentIncompleteOrCancelled: "true",

      MastercardOrderId: mco,
    };
    // console.log(payload);

    fetch(`${BASE_PATH}Order/CreateOrderInvoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenlogin}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        localStorage.removeItem("paymentStatus");
        localStorage.removeItem("mco");
        localStorage.removeItem("bearerToken");
      })
      .catch((error) => {
        console.error(
          "Error sending request to CreateOrderInvoice API:",
          error
        );
        // toast.error(language === "en" ? "Failed to proceed with the checkout. Please try again later." : "  فشل في الدفع، يرجى المحاولة في وقت لاحق   ");
      });
  };

  const markPaymentAsSuccessful = async (mco) => {
    const isPaymentConfirmed = true; // This should be determined by your payment gateway
    // console.log("mco", mco);
    if (isPaymentConfirmed) {
      try {
        const updatePaymentResponse = await axios.post(
          "https://portal.rcuae.ae/api/Ghadeer/UpdatePaymentSuccessful",
          {
            mco: mco,
          },
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(
        //   "Payment marked as successful:",
        //   updatePaymentResponse.status
        // );
        localStorage.removeItem("mco");
        localStorage.removeItem("bearerToken");
        localStorage.removeItem("paymentStatus");
        setMco();
        return true;
      } catch (error) {
        console.error("Error marking payment as successful:", error);
        return false;
      }
    }
    return false;
  };

  const initiateMastercardPaymentBeforeApple = (mco) => {
    const billingAddress =
      billingAddresses.find((address) => address.IsDefault) || null;
    const shippingAddress =
      shippingAddresses.find((address) => address.IsDefault) || null;
    // console.log("billingAddress", billingAddress);
    // console.log("Shpping ADD", shippingAddress);
    const payload = {
      // TransactionId: "T-0001" + Math.floor(100000 + Math.random() * 900000),

      TransactionId: "T-",
      UserId: UserID,
      ContactEmail: userDetails.EmailId,
      ContactMobile: userDetails.Mobile,
      BillingAddress: {
        Line1: billingAddress.AddressLine1,
        Line2: billingAddress.AddressLine2,
        City: billingAddress.City,
        StateOrProvinceCode: billingAddress.State,
        PostCode: billingAddress.PostCode,
        CountryCode: billingAddress.Country,
      },
      ShippingAddress: {
        Line1: shippingAddress.AddressLine1,
        Line2: shippingAddress.AddressLine2,
        City: shippingAddress.City,
        StateOrProvinceCode: shippingAddress.State,
        PostCode: shippingAddress.PostCode,
        CountryCode: shippingAddress.Country,
      },
      // BillingAddress: `${billingAddressLine1},${billingAddressLine2}, ${billingCity},${billingState},${billingPostcode},${billingCountry}`,
      // ShippingAddress: `${shippingAddressLine1},${shippingAddressLine2}, ${shippingCity}, ${shippingState},${shippingPostcode},${billingCountry}`,
      TotalAmount: calculateTotal(),
      OrderIdsCSV: orderIdsCSV,
      Status: "Procced_Payment",
      MastercardOrderId: mco,
      isPaymentIncompleteOrCancelled: "true",
    };

    fetch(`${BASE_PATH}Order/CreateOrderInvoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenlogin}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // setShowModal(false);
        // setTimeout(() => {
        //     navigate(`/orderlist`);
        // }, 2000);
      })
      .catch((error) => {
        console.error(
          "Error sending request to CreateOrderInvoice API:",
          error
        );
        // toast.error(language === "en" ? "Failed to proceed with the checkout. Please try again later." : "  فشل في الدفع، يرجى المحاولة في وقت لاحق   ");
      });
  };

  return (
    <>
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
      {shouldShowCancelPayment && <CancellPayment total={calculateTotal()} />}

      {mco && <BeforePayment mco={mco} total={calculateTotal()} />}

      <div>
        <ToastContainer />
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
                      ? "Contact information"
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
                  <div className="shiping-adBox mrg-b-20">
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

                    {shippingAddresses && shippingAddresses.length > 0 ? (
                      shippingAddresses.map((address) => (
                        <div className="" key={address.AddressId}>
                          <div className=" d-flex gap-2">
                            <div className="redio-item">
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

                              <label className="checkLable" for="checkBox">
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
                  <div className="shiping-adBox mrg-b-20">
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
                            <div className="redio-item">
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

                              <label className="checkLable" for="checkBox">
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
                    {!showModalp && (
                      <>
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
                              <strong>{`AED ${
                                TotalAmountesatamtied || "..."
                              }`}</strong>
                            </h5>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h3>{language === "en" ? "Total" : "المجموع"}</h3>
                          </td>
                          <td className="text-right">
                            <h5>
                              <strong>{`AED ${
                                calculateTotal().toFixed(2) || "..."
                              }`}</strong>
                            </h5>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
                {/* <div>
                  {error ? (
                    <></>
                  ) : rateDetails ? (
                    <div>
                      <h3>Rate Details</h3>
                      <p>
                        <strong>Total Amount:</strong>{" "}
                        {rateDetails.TotalAmount.Value}{" "}
                        {rateDetails.TotalAmount.CurrencyCode}
                      </p>
                      <h4>Rate Breakdown</h4>
                      <p>
                        <strong>Amount Before Tax:</strong>{" "}
                        {rateDetails.RateDetails.TotalAmountBeforeTax}
                      </p>
                      <p>
                        <strong>Tax Amount:</strong>{" "}
                        {rateDetails.RateDetails.TaxAmount}
                      </p>
                      <p>
                        <strong>Total Amount:</strong>{" "}
                        {rateDetails.RateDetails.Amount +
                          rateDetails.RateDetails.TaxAmount}
                      </p>
                    </div>
                  ) : (
                    <p>Loading rate details...</p>
                  )}
                </div> */}
                <div>
                  {showOrderButton && (
                    <div className="form-group compact-form-group">
                      {showReCAPTCHA ? (
                        <ReCAPTCHA
                            sitekey={ERC_ReCAPTCHA}
                          onChange={onChangerecaptcha}
                        />
                      ) : (
                        <>
                          <button
                            className="submitBtn compact-submitBtn"
                            data-type="placeOrder"
                            onClick={handlePlaceOrderClick}
                          >
                            {language === "en" ? "Place Order" : "مكان الطلب"}
                          </button>
                          <br />
                          <br />
                          {/* <button
                            data-type="applePay"
                            style={applePayButtonStyle}
                            onClick={initiateApplePay}
                            // onClick={handlePlaceOrderClick}
                          >
                            Pay with Apple Pay
                          </button> */}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  {/* <ApplePayButton calculateTotal={calculateTotal()} /> */}
                  {/* <div style={{ textAlign: "center", marginTop: "50px" }}>
                    {sdkLoaded ? (
                      <div> */}
                  {/* <apple-pay-button  onClick={authenticateAndProcessPaymentApplePay}buttonstyle="black" type="plain" locale="en-US"></apple-pay-button>  */}

                  {/* <button style={applePayButtonStyle} onClick={authenticateAndProcessPaymentApplePay}>
               Apple Pay
            </button> */}

                  {/* <div className="apple-pay-button-with-text apple-pay-button-black-with-text" onClick={authenticateAndProcessPaymentApplePay}>
      <span className="text">Buy with</span>
      <span className="logo"></span> 
    </div> */}
                  {/* </div>
                    ) : (
                      <div style={errorStyle}>{errorText}</div>
                    )}
                  </div> */}
                  {/* <div
                    onClick={authenticateAndProcessPaymentSamsungPay}
                    id="samsungpay-container"
                  ></div>  */}
                  <div>
                    {/* <SamsungPay /> */}

                  </div>

                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <button
                      id="apple-pay-btn"
                      onClick={onApplePayButtonClicked}
                      style={applePayButtonStyle}
                    >
                      <span>Buy With </span>
                      <img
                        src={applePayLogo}
                        alt="Apple Pay Logo"
                        style={{
                          width: "12px",
                          height: "auto",
                          lineHeight: "1",
                        }} // Adjust logo size
                      />
                      <span>Pay</span>
                    </button>

                    {/* <button
                    id="a-pay-btn"
                    onClick={authenticateAndProcessPaymentSamsungPay}

                    style={applePayButtonStyle}
                  >
                    <img
                      src={pngegg}
                      alt="Apple Pay Logo"
                      style={{ width: "15px", height: "auto" }} // Adjust logo size
                    />{" "}
                    <span>Pay</span>
                  </button> */}
                  </div>

                  {/* <div
                    onClick={authenticateAndProcessPaymentSamsungPay}
                    id="samsungpay-container"
                  ></div>  */}

                  {/* <SamsungPay
                    calculateTotal={calculateTotal()}
                    userDetails={userDetails}
                    /> */}
                  {/* <apple-pay-button buttonstyle="black" type="plain" locale="en-US"></apple-pay-button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            navigate(`/orderlist`);
          }}
          centered
          backdrop="static"
        >
          <Modal.Header className="p-0 border-0" closeButton></Modal.Header>

          <Modal.Body className="text-center">
            <Modal.Title className="mb-2">
              {language === "en"
                ? "Thank You For Your Order"
                : "Thank You For Your Order"}
            </Modal.Title>
            {language === "en"
              ? " AlGhadeer Emirati Crafts thanks you for your order. We appreciate your support! "
              : "AlGhadeer Emirati Crafts thanks you for your order. We appreciate your support!"}
          </Modal.Body>
          {/* <Modal.Footer></Modal.Footer> */}
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
      </div>
    </>
  );
};

export default Checkout;
const applePayButtonStyle = {
  backgroundColor: "black",
  color: "white",
  padding: "3px 40px",
  borderRadius: "5px",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "3px",
};
const errorStyle = {
  fontSize: "18px",
  color: "red",
  marginTop: "20px",
};
