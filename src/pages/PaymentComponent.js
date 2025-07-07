import React from 'react';

const PaymentComponent = () => {
  const SAMSUNG_PAY = 'https://spay.samsung.com';

  const onBuyClicked = async () => {
    if (!window.PaymentRequest) {
      // PaymentRequest API is not available - fallback to a legacy form
      window.location.href = '/checkout';
      return;
    }

    const supportedInstruments = [{
      supportedMethods: [SAMSUNG_PAY],
      data: {
        version: "1",
        productId: "2bc3e6da781e4e458b18bc",  // Replace with your actual Service ID
        allowedCardNetworks: ['mastercard', 'visa'],
        orderNumber: "1233123",
        merchantName: "Shop Samsung (demo)",  // Replace with your actual Merchant Name
        merchantGatewayParameter: {"userId": "acct_17irF7F6yPzJ7wOR"},
        isRecurring: false,
        billingAddressRequired: false,
        paymentProtocol: "PROTOCOL_3DS"
      }
    }];

    const details = {
      displayItems: [{
        label: 'Original donation amount',
        amount: { currency: 'USD', value: '65.00' }
      }, {
        label: 'Friends and family discount',
        amount: { currency: 'USD', value: '-10.00' }
      }],
      total: {
        label: 'Total due',
        amount: { currency: 'USD', value: '55.00' }
      }
    };

    const options = {
      requestShipping: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      requestPayerName: true
    };

    try {
      const request = new PaymentRequest(supportedInstruments, details, options);

      request.addEventListener('shippingaddresschange', e => {
        e.updateWith(new Promise((resolve) => {
          const addr = request.shippingAddress;
          const updatedDetails = { ...details };
          const shippingOption = {
            id: '',
            label: '',
            amount: { currency: 'USD', value: '0.00' }, 
            selected: true
          };

          if (addr.country === 'US') {
            shippingOption.id = 'us';
            shippingOption.label = 'Standard shipping in US';
            shippingOption.amount.value = '0.00';
            updatedDetails.total.amount.value = '55.00';
          } else if (addr.country === 'JP') {
            shippingOption.id = 'jp';
            shippingOption.label = 'International shipping';
            shippingOption.amount.value = '10.00';
            updatedDetails.total.amount.value = '65.00';
          } else {
            updatedDetails.shippingOptions = [];
            resolve(updatedDetails);
            return;
          }

          updatedDetails.shippingOptions = [shippingOption];
          resolve(updatedDetails);
        }));
      });

      request.addEventListener('shippingoptionchange', e => {
        e.updateWith(Promise.resolve(details));
      });

      const paymentResponse = await request.show();

      const paymentData = {
        method: paymentResponse.methodName,
        details: paymentResponse.details,
        shippingAddress: paymentResponse.shippingAddress,
        shippingOption: paymentResponse.shippingOption,
        payerEmail: paymentResponse.payerEmail,
        payerPhone: paymentResponse.payerPhone,
        payerName: paymentResponse.payerName
      };

      // Simulate a server call
      // console.log('Simulating server call with payment data:', paymentData);
      
      // Mock response for the payment process
      const mockServerResponse = new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1000);
      });

      const result = await mockServerResponse;

      if (result.success) {
        await paymentResponse.complete('success');
        // console.log('Payment successful!', paymentData);
      } else {
        await paymentResponse.complete('fail');
        console.error('Payment failed:', result);
      }
    } catch (err) {
      console.error('Payment error:', err.message);
    }
  };

  return (
    <button onClick={onBuyClicked}>Buy Now</button>
  );
};

export default PaymentComponent;
