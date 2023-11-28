import React, { useEffect, useRef, useState } from "react";

const PaymentForm = () => {
  const iframeRef = useRef(null);
  const [formToken, setFormToken] = useState(null);

  useEffect(() => {
    const fetchFormToken = async () => {
      try {
        const response = await fetch("http://localhost:4242/api/getFormToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Add any additional parameters needed for obtaining the form token
          }),
        });

        const responseData = await response.json();
        console.log("responseData", responseData.response.token);
        setFormToken(responseData.response.token);
      } catch (error) {
        console.error("Error fetching form token:", error);
      }
    };

    fetchFormToken();
  }, []);

  const handleMessage = (event) => {
    // Handle the success message from the iframe
    if (event.data === "paymentSuccess") {
      console.log("Payment successful!");
      // Perform any additional actions on payment success
    }
  };

  useEffect(() => {
    // Add event listener for postMessage
    window.addEventListener("message", handleMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  console.log("formToken", formToken);
  return (
    <div>
      <h1>Payment Form</h1>
      {formToken && (
        <iframe
          title='Authorize.Net Hosted Payment Page'
          width='600'
          height='400'
          frameBorder='0'
          ref={iframeRef}
          src={`https://test.authorize.net/payment/payment?token=${formToken}`}
        />
      )}
    </div>
  );
};

export default PaymentForm;
