import React, { useEffect } from "react";
import BASE_PATH from "../serviceurls";

// Load Samsung Pay SDK
const loadSamsungPaySDK = () => {
  const script = document.createElement("script");
  script.src = "https://img.mpay.samsung.com/gsmpi/sdk/samsungpay_web_sdk.js";
  script.async = true;
  document.body.appendChild(script);
};

const SamsungPay = () => {
  useEffect(() => {
    loadSamsungPaySDK();

    let samsungPayClient;

    const initializeSamsungPay = () => {
      if (!window.SamsungPay) {
        console.error("Samsung Pay SDK not loaded");
        return;
      }

      samsungPayClient = new window.SamsungPay.PaymentClient({ environment: "STAGE" });

      const paymentMethods = {
        version: "2",
        serviceId: "7530ca8cc6624e029bf7a6",
        protocol: "PROTOCOL_3DS",
        allowedBrands: ["visa", "mastercard"],
      };

      // Check if Samsung Pay is ready to use
      samsungPayClient.isReadyToPay(paymentMethods)
        .then((response) => {
          if (response.result) {
            createAndAddButton(samsungPayClient, paymentMethods);
          } else {
            console.error("Samsung Pay is not ready to pay.");
          }
        })
        .catch((err) => console.error("Error checking Samsung Pay readiness:", err));
    };

    const createAndAddButton = (client, paymentMethods) => {
      const samsungPayButton = client.createButton({
        onClick: () => onSamsungPayButtonClicked(client, paymentMethods),
        buttonStyle: "black",
        type: "buy",
      });

      const container = document.getElementById("samsungpay-container");
      if (container) {
        container.appendChild(samsungPayButton);
      }
    };

    const onSamsungPayButtonClicked = (client, paymentMethods) => {
      const transactionDetail = {
        orderNumber: "DSTRF345789dsgTY",
        merchant: {
          name: "ERC",
          url: `${BASE_PATH}`,
          id: "merchant.7008334",
        },
        amount: {
          option: "FORMAT_TOTAL_ESTIMATED_AMOUNT",
          currency: "USD",
          total: 300,
        },
      };

      client.loadPaymentSheet(paymentMethods, transactionDetail)
        .then((paymentCredential) => {
          console.log("Payment Credential:", paymentCredential);

          const paymentResult = {
            status: "CHARGED",
            provider: "PG Name",
          };

          client.notify(paymentResult);
        })
        .catch((error) => {
          console.error("Error loading payment sheet:", error);
        });
    };

    // Wait for the Samsung Pay SDK to load before initializing
    const sdkLoadInterval = setInterval(() => {
      if (window.SamsungPay) {
        clearInterval(sdkLoadInterval);
        initializeSamsungPay();
      }
    }, 100);

    return () => clearInterval(sdkLoadInterval);
  }, []);

  return <div id="samsungpay-container"></div>;
};

export default SamsungPay;
