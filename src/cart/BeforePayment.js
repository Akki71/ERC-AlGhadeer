import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/Loader";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useLanguage } from "../redux/LanguageContext";
import { BASE_PATH} from "../serviceurls";
const BeforePayment = ({mcoid,total}) => {
    // console.log("Total Amount:", total);
    const { language } = useLanguage();
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobile, setMobile] = useState("");
    const [billingAddresses, setBillingAddresses] = useState([]);
    const [shippingAddresses, setShippingAddresses] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [shippingData, setShippingData] = useState(null);
    const [error, setError] = useState(null);
    const [orderIdsCSV, setOrderIdsCSV] = useState();
    const [userDetails, setUserDetails] = useState({});
    const [billingAddressLine1, setBillingAddressLine1] = useState("");
    const [billingCity, setBillingCity] = useState("");
    const [billingCountry, setBillingCountry] = useState("");
    const [shippingAddressLine1, setShippingAddressLine1] = useState("");
    const [shippingCity, setShippingCity] = useState("");
    const [shippingCountry, setShippingCountry] = useState("");
    const [userOrders, setUserOrders] = useState([]);


    const [billingPostcode, setBillingPostcode] = useState("");
    const [billingAddressLine2, setBillingAddressLine2] = useState("");
    const [billingState, setBillingState] = useState("");

    const [shippingPostcode, setShippingPostcode] = useState("");
    const [shippingAddressLine2, setShippingAddressLine2] = useState("");
    const [shippingState, setShippingState] = useState("");



    const UserID = localStorage.getItem("UserID");
    const tokenlogin = localStorage.getItem("loginToken");
    const location = useLocation();
    const navigate = useNavigate();
    const mco = localStorage.getItem('mco');
    const bearerToken = localStorage.getItem('bearerToken');




    useEffect(() => {
        if (!UserID) {
            navigate("/login")
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
                setUserDetails(userData);
                setEmail(userData.EmailId || "");
                setFirstName(userData.FirstName || "");
                setLastName(userData.LastName || "");
                setMobile(userData.Mobile || "");
            })
            .catch((error) => {
                navigate("/login")
            });
    }, [UserID, tokenlogin, language, navigate]);

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
        ); // Find the default shipping address
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
        const shipping = calculateEstimatedShipping();
        return subtotal + shipping;
    };

    const fetchUserOrders = () => {
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
                // console.log(data);
                setUserOrders(data);
                const total = data.reduce((acc, order) => acc + order.TotalAmount, 0);
                setTotalAmount(total);

                const idsCSV = data.map((order) => order.OrderId).join(",");
                setOrderIdsCSV(idsCSV);
                // console.log(idsCSV);
            })
            .catch((error) => {
                navigate("/login")
            });
    };
    useEffect(() => {
        fetchUserOrders();
    }, [UserID, tokenlogin]);

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
                setShippingData(data);
            })
            .catch((error) => {
                setError(error);
                // navigate("/login")
            });
    };

    useEffect(() => {
        fetchShippingData();
    }, [UserID, tokenlogin, navigate, language]);

    useEffect(() => {
        GetAllUserAddressesByUserId();
    }, []);

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

            const billingAddresses = dataadd.filter(
                (address) => address.AddressTypeId === 1
            );
            const shippingAddresses = dataadd.filter(
                (address) => address.AddressTypeId === 2
            );
            const billingAddress =
                billingAddresses.length > 0 ? billingAddresses[0] : null;
            const shippingAddress =
                shippingAddresses.length > 0 ? shippingAddresses[0] : null;

            const billingAddressLine1 = billingAddress?.AddressLine1;
            const billingCity = billingAddress?.City;
            const billingCountry = billingAddress?.Country;
            const shippingAddressLine1 = shippingAddress?.AddressLine1;
            const shippingCity = shippingAddress?.City;
            const shippingCountry = shippingAddress?.Country;


            const billingPostcode = billingAddress?.PostCode;
            const billingAddressLine2 = billingAddress?.AddressLine2;
            const billingState = billingAddress?.State

            const shippingPostcode = shippingAddress?.PostCode;
            const shippingAddressLine2 = shippingAddress?.AddressLine2;
            const shippingState = shippingAddress?.State


            setBillingPostcode(billingPostcode|| "");
            setBillingAddressLine2(billingAddressLine2|| "");
            setBillingState(billingState|| "");


            setShippingPostcode(shippingPostcode|| "");
            setShippingAddressLine2(shippingAddressLine2|| "");
            setShippingState(shippingState|| "");





            setBillingAddresses(billingAddresses);
            setShippingAddresses(shippingAddresses);
            setBillingAddressLine1(billingAddressLine1 || "");
            setBillingCity(billingCity || "");
            setBillingCountry(billingCountry || "");
            setShippingAddressLine1(shippingAddressLine1 || "");
            setShippingCity(shippingCity || "");
            setShippingCountry(shippingCountry || "");

            if (
                billingAddressLine1 &&
                billingCity &&
                billingCountry &&
                shippingAddressLine1 &&
                shippingCity &&
                shippingCountry
            ) {
                // initiateMastercardPayment();
            }
        } catch (error) {
            console.error("GetAllUserAddressesByUserId", error);
        }
    };
    useEffect(() => {
        if (
            billingAddressLine1 &&
            billingCity &&
            billingCountry &&
            shippingAddressLine1 &&
            shippingCity &&
            shippingCountry
        ) {
            const intervalId = setInterval(() => {
                if (orderIdsCSV) {
                    initiateMastercardPayment();
                    // console.log("Order IDs CSV:", orderIdsCSV);
                    clearInterval(intervalId);
                } else {
                    // console.log("Waiting for orderIdsCSV to be set...");
                }
            }, 1000); // Check every second

            return () => clearInterval(intervalId);
            // setTimeout(() => {

            //     initiateMastercardPayment();
            // }, 8000);
        }
    }, [
        orderIdsCSV,
        billingAddressLine1,
        billingCity,
        billingCountry,
        shippingAddressLine1,
        shippingCity,
        shippingCountry,
        total,
        mcoid

    ]);
    // console.log(mcoid);
    const paymentStatus = localStorage.getItem('paymentStatus');
    const initiateMastercardPayment = () => {
        setLoading(false);
        setShowModal(true);
        if (total === null || total === undefined || isNaN(total)) {
            console.warn("Total is not available yet. Payment initiation aborted.");
            return;
          }
        const payload = {
            // TransactionId: "T-0001" + Math.floor(100000 + Math.random() * 900000),

            TransactionId: "T-",
            UserId: UserID,
            ContactEmail: userDetails.EmailId,
            ContactMobile: userDetails.Mobile,
            BillingAddress: {
                Line1: billingAddressLine1,
                Line2: billingAddressLine2,
                City: billingCity,
                StateOrProvinceCode: billingState,
                PostCode: billingPostcode,
                CountryCode: billingCountry,
              },
              ShippingAddress: {
                Line1: shippingAddressLine1,
                Line2: shippingAddressLine2,
                City: shippingCity,
                StateOrProvinceCode: shippingState,
                PostCode: shippingPostcode,
                CountryCode: billingCountry,
              },
            // BillingAddress: `${billingAddressLine1},${billingAddressLine2}, ${billingCity},${billingState},${billingPostcode},${billingCountry}`,
            // ShippingAddress: `${shippingAddressLine1},${shippingAddressLine2}, ${shippingCity}, ${shippingState},${shippingPostcode},${billingCountry}`,
            TotalAmount: total,
            OrderIdsCSV: orderIdsCSV,
            Status: 'Procced_Payment',
            MastercardOrderId: mco,
            isPaymentIncompleteOrCancelled:'true'

        };
        // console.log(payload);
        // console.log(mcoid);

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
                console.error("Error sending request to CreateOrderInvoice API:", error);
                // toast.error(language === "en" ? "Failed to proceed with the checkout. Please try again later." : "  فشل في الدفع، يرجى المحاولة في وقت لاحق   ");
            });
    };

    // useEffect(() => {
    //     if (orderIdsCSV) {
    //         initiateMastercardPayment();

    //         console.log('Order IDs CSV:', orderIdsCSV);
    //     }
    // }, [orderIdsCSV]);





    return (
        <>

        </>
    );
};

export default BeforePayment;
