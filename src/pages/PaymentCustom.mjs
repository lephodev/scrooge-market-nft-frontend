import React, { useEffect, useState } from "react";
import { AcceptHosted } from "react-acceptjs";

const PaymentForm = () => {
  const [liveFormToken, setFormToken] = useState(null);
  const [response, setResponse] = useState(null);

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

  useEffect(() => {
    console.log("response--------------", window);
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

  console.log("response", response);

  return (
    // <div>
    //   <h1>Payment Form</h1>
    //   {liveFormToken && (
    //     <AcceptHosted
    //       formToken={liveFormToken}
    //       integration='iframe'
    //       environment='PRODUCTION'
    //       onTransactionResponse={(response) =>
    //         setResponse(JSON.stringify(response, null, 2) + "\n")
    //       }
    //       apiEndpoint='https://api.authorize.net/xml/v1/request.api'
    //       redirectUrl='https://accept.authorize.net/payment/payment'>
    //       Continue to Redirect
    //     </AcceptHosted>
    //   )}
    // </div>
    <div>
      {liveFormToken ? (
        <AcceptHosted
          formToken={liveFormToken}
          integration='iframe'
          environment='PRODUCTION'
          onTransactionResponse={(response) => {
            console.log("Transaction Response:", response);
            // Handle the response here, e.g., update UI, show confirmation, etc.
            setResponse(JSON.stringify(response, null, 2) + "\n");
          }}>
          <AcceptHosted.Button className='btn btn-primary'>
            Continue to IFrame
          </AcceptHosted.Button>
          <AcceptHosted.IFrameBackdrop />
          <AcceptHosted.IFrameContainer>
            <AcceptHosted.IFrame />
          </AcceptHosted.IFrameContainer>
        </AcceptHosted>
      ) : (
        <div>
          You must have a form token. Have you made a call to the
          getHostedPaymentPageRequestAPI?
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
