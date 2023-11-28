import React, { useEffect, useState } from "react";
import { AcceptHosted } from "react-acceptjs";

const PaymentForm = () => {
  const [liveFormToken, setFormToken] = useState(null);

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
        setFormToken(responseData?.response?.token);
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
  console.log(
    "formToken",
    `https://authorize.net/payment/payment?token=${liveFormToken}`
  );
  return (
    <div>
      <h1>Payment Form</h1>
      {liveFormToken && (
        <AcceptHosted
          formToken={liveFormToken}
          integration='redirect'
          apiEndpoint='https://api.authorize.net/xml/v1/request.api'
          redirectUrl='https://accept.authorize.net/payment/payment'>
          Continue to Redirect
        </AcceptHosted>
      )}
    </div>
  );
};

export default PaymentForm;
