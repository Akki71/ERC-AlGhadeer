// import React, { useEffect } from "react";

// const ApplePayButton = () => {

// //   const username = "merchant.7008334";
// //   const password = "33d4c1d914a840ae7f67d42b2ffc239b";

// //   // Encode the credentials as Base64
// //   const encodedCredentials = btoa(`${username}:${password}`);

// //   // Set the headers
// //   const headers = {
// //     "Content-Type": "application/json",
// //     Authorization: `Basic ${encodedCredentials}`,
// //   };
//   useEffect(() => {
//     const loadSamsungPay = () => {
//       if (window.SamsungPay) {
//         const samsungPayClient = new window.SamsungPay.PaymentClient({
//           environment: "STAGE",
//         });

//         const paymentMethods = {
//           version: "2",
//           serviceId: "7530ca8cc6624e029bf7a6",
//           protocol: "PROTOCOL_3DS",
//           allowedBrands: ["visa", "mastercard"],
//         };

//         samsungPayClient
//           .isReadyToPay(paymentMethods)
//           .then((response) => {
//             if (response.result) {
//               createAndAddButton(samsungPayClient);
//             }
//           })
//           .catch((err) => console.error(err));
//       } else {
//         console.error("Samsung Pay SDK not loaded");
//       }
//     };

//     const createAndAddButton = (samsungPayClient) => {
//       const samsungPayButton = samsungPayClient.createButton({
//         // onClick: onSamsungPayButtonClicked,
//         buttonStyle: "black",
//         type: "buy",
//       });

//       const container = document.getElementById("samsungpay-container");
//       if (container) {
//         container.appendChild(samsungPayButton);
//       }
//     };

//     // const onSamsungPayButtonClicked = async () => {
//     //   const paymentDetails = {
//     //     apiOperation: "AUTHORIZE",
//     //     order: {
//     //       amount: "1500",
//     //       currency: "JPY",
//     //       walletProvider: "SAMSUNG_PAY",
//     //     },
//     //     sourceOfFunds: {
//     //       provided: {
//     //         card: {
//     //           number: "5123450000000008",
//     //           expiry: { month: "01", year: "39" },
//     //           devicePayment: {
//     //             cryptogramFormat: "3DSECURE",
//     //             onlinePaymentCryptogram:
//     //               "AAAAAAAALJI6DbfqRzUcwAC6gAAGhgEDoLABAAhAgAABAAAAMlkUxA==",
//     //             eciIndicator: "20",
//     //           },
//     //         },
//     //       },
//     //       type: "CARD",
//     //     },
//     //     transaction: { source: "INTERNET" },
//     //   };

//     //   try {
//     //     const response = await fetch(
//     //       "https://eu-gateway.mastercard.com/api/rest/version/71/merchant/7008334/order/21344/transaction/1",
//     //       {
//     //         method: "PUT",
//     //         headers: {
//     //           "Content-Type": "application/json",
//     //           Authorization: `Basic ${encodedCredentials}`,
//     //         },
//     //         body: JSON.stringify(paymentDetails),
//     //       }
//     //     );
//     //     const result = await response.json();
//     //     console.log("Samsung Pay transaction result:", result);
//     //   } catch (error) {
//     //     console.error("Samsung Pay API error:", error);
//     //   }
//     // };

//     loadSamsungPay();
//   }, []);

// //   useEffect(() => {
// //     if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
// //       const applePayButton = document.getElementById("apple-pay-button");
// //       applePayButton.style.display = "inline-block";

// //       applePayButton.addEventListener("click", onApplePayButtonClicked);
// //     }
// //   }, []);

// //   const onApplePayButtonClicked = async () => {
// //     const paymentRequest = {
// //       countryCode: "US",
// //       currencyCode: "AED",
// //       total: { label: "Your Label", amount: "100.00" },
// //       supportedNetworks: ["visa", "masterCard", "amex"],
// //       merchantCapabilities: ["supports3DS"],
// //     };

// //     const session = new window.ApplePaySession(3, paymentRequest);

// //     session.onvalidatemerchant = async (event) => {
// //       try {
// //         const merchantSession = await performMerchantValidation(
// //           event.validationURL
// //         );
// //         session.completeMerchantValidation(merchantSession);
// //       } catch (error) {
// //         console.error("Merchant validation failed:", error);
// //       }
// //     };

// //     session.onpaymentauthorized = async (event) => {
// //       const paymentData = {
// //         apiOperation: "PAY",
// //         order: {
// //           amount: "100.00",
// //           currency: "AED",
// //           walletProvider: "APPLE_PAY",
// //         },
// //         sourceOfFunds: {
// //           type: "CARD",
// //           provided: {
// //             card: {
// //               number: "5123450000000008",
// //               expiry: { month: "01", year: "39" },
// //               devicePayment: {
// //                 cryptogramFormat: "3DSECURE",
// //                 onlinePaymentCryptogram: "IA/8pdiWftSsxpFT6wABoDABhgA=",
// //                 eciIndicator: "20",
// //               },
// //             },
// //           },
// //         },
// //         transaction: { source: "INTERNET" },
// //       };

// //       try {
// //         const response = await fetch(
// //           "https://eu-gateway.mastercard.com/api/rest/version/71/merchant/7008334/order/23121/transaction/1",
// //           {
// //             method: "PUT",
// //             headers: {
// //               "Content-Type": "application/json",
// //               Authorization: `Basic ${encodedCredentials}`,
// //             },
// //             body: JSON.stringify(paymentData),
// //           }
// //         );
// //         const result = await response.json();
// //         console.log("Apple Pay transaction result:", result);
// //         session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
// //       } catch (error) {
// //         console.error("Apple Pay API error:", error);
// //         session.completePayment(window.ApplePaySession.STATUS_FAILURE);
// //       }
// //     };

// //     session.begin();
// //   };

// //   const performMerchantValidation = async (validationURL) => {
// //     // Replace with actual server-side validation
// //     return {
// //       epochTimestamp: Date.now(),
// //       expiresAt: Date.now() + 600000,
// //       merchantSessionIdentifier: "mock-merchant-session-identifier",
// //       nonce: "mock-nonce",
// //       merchantIdentifier: "merchant.com.yourdomain",
// //       displayName: "Your Display Name",
// //       signature: "mock-signature",
// //       domainName: "yourdomain.com",
// //     };
// //   };

//   return (
//     <>
//       {/* <div
//         id="apple-pay-button"
//         style={{
//           display: "inline",
//           backgroundColor: "black",
//           padding: "10px",
//           borderRadius: "5px",
//           color: "white",
//           cursor: "pointer",
//         }}
//       >
//         Buy with Apple Pay
//       </div> */}
//       <div id="samsungpay-container"></div> 
//     </>
//   );
// };

// export default ApplePayButton;

// // /* global ApplePaySession */

// // import React, { useState } from 'react';
// // import axios from 'axios';

// // const ApplePayButton = () => {
// //     const [paymentProcessing, setPaymentProcessing] = useState(false);
// //     const [paymentSuccess, setPaymentSuccess] = useState(null);

// //     const handleApplePay = async () => {

// //         if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
// //             const paymentRequest = {
// //                 countryCode: 'UAE',
// //                 currencyCode: 'AED',
// //                 total: {
// //                     label: 'ERC Crafts',
// //                     amount: '30.10'
// //                 },
// //                 supportedNetworks: ['masterCard', 'visa', 'amex'],
// //                 merchantCapabilities: ['supports3DS']
// //             };

// //             try {
// //                 const session = new ApplePaySession(3, paymentRequest);

// //                 session.onvalidatemerchant = async (event) => {
// //                     // Call your server to validate the merchant
// //                     const validationData = await axios.post('https://your-server.com/validate-merchant', {
// //                         validationUrl: event.validationURL
// //                     });

// //                     session.completeMerchantValidation(validationData.data);
// //                 };

// //                 session.onpaymentauthorized = async (event) => {
// //                     // Send the payment token to your server for processing
// //                     const token = event.payment.token.paymentData;

// //                     try {
// //                         setPaymentProcessing(true);
// //                         const response = await axios.post('https://your-server.com/process-apple-pay', {
// //                             token: token
// //                         });

// //                         if (response.data.success) {
// //                             setPaymentSuccess(true);
// //                         } else {
// //                             setPaymentSuccess(false);
// //                         }
// //                     } catch (error) {
// //                         console.error('Payment failed:', error);
// //                         setPaymentSuccess(false);
// //                     } finally {
// //                         setPaymentProcessing(false);
// //                     }

// //                     session.completePayment(ApplePaySession.STATUS_SUCCESS);
// //                 };

// //                 session.begin();

// //             } catch (error) {
// //                 console.error('Error initiating Apple Pay:', error);
// //             }
// //         } else {
// //             alert('Apple Pay is not available on this device.');
// //         }
// //     };

// //     return (
// //         <div>
// //             <h2>Apple Pay Payment</h2>
// //             <button onClick={handleApplePay} disabled={paymentProcessing}>
// //                 {paymentProcessing ? 'Processing...' : 'Pay with Apple Pay'}
// //             </button>
// //             {paymentSuccess !== null && (
// //                 <div>
// //                     {paymentSuccess ? (
// //                         <p>Payment Successful!</p>
// //                     ) : (
// //                         <p>Payment Failed.</p>
// //                     )}
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default ApplePayButton;

// // /* global ApplePaySession */

// // import React from "react";

// // const ApplePayButton = () => {
// //     const initiateApplePay = () => {
// //         // Check if Apple Pay is supported
// //         if (!window.ApplePaySession) {
// //             console.error("Apple Pay is not supported on this device or browser.");
// //             alert("Apple Pay is not supported on this device or browser.");
// //             return;
// //         }

// //         // Define Apple Pay request
// //         const request = {
// //             countryCode: "US",
// //             currencyCode: "USD",
// //             supportedNetworks: ["visa", "masterCard", "amex"],
// //             merchantCapabilities: ["supports3DS"],
// //             total: {
// //                 label: "Your Merchant Name",
// //                 amount: "10.00",
// //             },
// //         };

// //         // Check if Apple Pay is available
// //         if (!ApplePaySession.canMakePayments()) {
// //             console.error("Apple Pay is not available on this device.");
// //             alert("Apple Pay is not available on this device.");
// //             return;
// //         }

// //         // Create a new Apple Pay session
// //         const session = new ApplePaySession(3, request);

// //         // Merchant validation
// //         session.onvalidatemerchant = async (event) => {
// //             console.log("Validate merchant event:", event.validationURL);

// //             try {
// //                 // Simulate merchant validation from your server
// //                 const merchantSession = await fetchMerchantValidation(event.validationURL);
// //                 session.completeMerchantValidation(merchantSession);
// //             } catch (error) {
// //                 console.error("Merchant validation failed:", error);
// //                 session.abort();
// //             }
// //         };

// //         // Payment authorized
// //         session.onpaymentauthorized = (event) => {
// //             console.log("Payment authorized event:", event.payment);

// //             // Simulate payment processing
// //             const isSuccess = processPayment(event.payment);

// //             // Complete the payment
// //             session.completePayment(isSuccess ? ApplePaySession.STATUS_SUCCESS : ApplePaySession.STATUS_FAILURE);
// //         };

// //         // Session canceled
// //         session.oncancel = () => {
// //             console.log("Payment session canceled by user.");
// //         };

// //         // Start the session
// //         session.begin();
// //     };

// //     // Simulated merchant validation
// //     const fetchMerchantValidation = async (validationURL) => {
// //         console.log("Fetching merchant validation...");
// //         // Replace with your server endpoint
// //         const response = await fetch("/apple-pay/validate", {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify({ validationURL }),
// //         });

// //         if (!response.ok) {
// //             throw new Error("Failed to validate merchant.");
// //         }

// //         return response.json();
// //     };

// //     // Simulated payment processing
// //     const processPayment = (payment) => {
// //         console.log("Processing payment:", payment);
// //         // Simulate success or failure
// //         return true; // Return true for success, false for failure
// //     };

// //     return (
// //         <div>
// //             <button onClick={initiateApplePay} style={applePayButtonStyle}>
// //                 Pay with Apple Pay
// //             </button>
// //         </div>
// //     );
// // };

// // // Styling for Apple Pay button
// // const applePayButtonStyle = {
// //     backgroundColor: "black",
// //     color: "white",
// //     padding: "10px 20px",
// //     borderRadius: "5px",
// //     border: "none",
// //     fontSize: "16px",
// //     cursor: "pointer",
// // };

// // export default ApplePayButton;

// // import React, { useState } from "react";
// // import axios from "axios";

// // const ApplePayButton = () => {
// //   const [amount, setAmount] = useState("");
// //   const [status, setStatus] = useState("");

// //   const initiatePayment = async () => {
// //     try {
// //       const SERVICE_KEY = "7530ca8cc6624e029bf7a6"; // DO NOT expose this in production
// //       const SAMSUNG_PAY_API = "https://api.samsungpay.com/v1/payments";

// //       const response = await axios.post(
// //         SAMSUNG_PAY_API,
// //         {
// //           amount: 1,
// //           currency: "AED",
// //           merchantId: "merchant.7008334",
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${SERVICE_KEY}`,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );

// //       setStatus(`Payment Successful: ${response.data.transactionId}`);
// //     } catch (error) {
// //       console.error(error);
// //       setStatus("Payment Failed");
// //     }
// //   };

// //   const initiateSamsungPay = async () => {
// //     const SAMSUNG_PAY_API = "https://api.samsungpay.com/v1/payments";
// //     const MERCHANT_ID = "merchant.7008334"; // Replace with your actual merchant ID
// //     const SERVICE_KEY = "7530ca8cc6624e029bf7a6"; // DO NOT expose this in production

// //     try {
// //       const response = await axios.post(
// //         SAMSUNG_PAY_API,
// //         {
// //           merchantId: MERCHANT_ID, // Verify if "merchant.id" is required instead
// //           amount: 100, // Example amount
// //           currency: "AED",
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${SERVICE_KEY}`,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );

// //       console.log("Payment successful:", response.data);
// //     } catch (error) {
// //       console.error("Payment failed:", error.response?.data || error.message);
// //     }
// //   };

// //   return (
// //     <div>
// //       <button style={applePayButtonStyle} onClick={initiateSamsungPay}>
// //         Pay with Samsung Pay
// //       </button>
// //       <p>{status}</p>
// //     </div>
// //   );
// // };

// // export default ApplePayButton;
// // const applePayButtonStyle = {
// //   backgroundColor: "black",
// //   color: "white",
// //   padding: "10px 20px",
// //   borderRadius: "5px",
// //   border: "none",
// //   fontSize: "16px",
// //   cursor: "pointer",
// // };


import React, { useEffect, useState } from "react";

const ApplePayButton = ({ calculateTotal }) => {
  console.log('Total calculated:', calculateTotal);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPaymentRequestOpen, setIsPaymentRequestOpen] = useState(false);

  useEffect(() => {
    // Function to check if Apple Pay SDK is loaded
    const checkApplePaySdk = () => {
      if (window.ApplePaySession) {
        setIsSdkLoaded(true);
        console.log("Apple Pay SDK loaded successfully.");
      } else {
        setIsSdkLoaded(false);
        setErrorMessage("Apple Pay SDK not loaded.");
        console.error("Apple Pay SDK not loaded.");
      }
    };

    // Check SDK after a delay to give time for the script to load
    const timeout = setTimeout(() => {
      checkApplePaySdk();
    }, 2000); // 2-second delay

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  const handleApplePayClick = () => {
    // Dummy payment request data
    const paymentRequest = {
      countryCode: "US",
      currencyCode: "USD",
      total: {
        label: "ERC",
        amount: '100',
      },
      supportedNetworks: ['visa', 'masterCard', 'amex',
        'discover'
    ],
      merchantCapabilities: ["supports3DS"],
    };

    if (window.ApplePaySession) {
      const session = new window.ApplePaySession(1, paymentRequest);

      session.onvalidatemerchant = (event) => {
        // You would call your server here to validate the merchant
        console.log("Merchant validated:", event);
        session.completeMerchantValidation({ merchantIdentifier: "dummyMerchant" });
      };

      session.onpaymentauthorized = (event) => {
        // Here, you can simulate a successful payment
        console.log("Payment authorized:", event.payment);
        session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
      };

      session.begin(); // Start the Apple Pay session
      setIsPaymentRequestOpen(true);
    } else {
      console.error("Apple Pay session cannot be started.");
    }
  };



  const messageStyle = {
    fontSize: "18px",
    color: "#333",
    marginTop: "20px",
  };

  const errorStyle = {
    fontSize: "18px",
    color: "red",
    marginTop: "20px",
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {isSdkLoaded ? (
        <div>
                  {/* <apple-pay-button  onClick={handleApplePayClick} buttonstyle="black" type="plain" locale="en-US"></apple-pay-button> */}
         
            <button style={applePayButtonStyle} onClick={handleApplePayClick}>
               Apple Pay
            </button>
        
        </div>
      ) : (
        <div style={errorStyle}>{errorMessage}</div>
      )}
    </div>
  );
};

export default ApplePayButton;
const applePayButtonStyle = {
  backgroundColor: "black",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
};
