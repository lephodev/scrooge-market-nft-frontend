/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-escape */
import { Modal } from "react-bootstrap";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { marketPlaceInstance } from "../../config/axios.js";
import axios from "axios";
import { toast } from "react-toastify";
import { paypalClientKey } from "../../config/keys.js";
import AuthorizeSucessModel from "./authrizeSucessModel.mjs";
import { useState } from "react";

const PaypalModel = ({
  showPaypal,
  handleShowPaypalModel,
  amount,
  promoCode,
}) => {
  const [success, setSuccess] = useState(false);

  const onApprove = async (data) => {
    try {
      const payload = {
        orderID: data.orderID,
        promoCode,
      };
      const paypalres = await (
        await marketPlaceInstance()
      ).post("/capture-paypal-order", payload);
      const {
        status,
        data: { message },
      } = paypalres;
      if (status === 200) {
        handleShowPaypalModel();
        setSuccess(true);
        toast.success(message, { toastId: "login" });
      }
    } catch (error) {
      handleShowPaypalModel()();
      if (axios.isAxiosError(error) && error?.response) {
        if (error?.response?.status !== 200) {
          toast.error(error?.response?.data?.message, { toastId: "login" });
        }
      }
    }
  };
  const handleOk = async (event) => {
    try {
      setSuccess(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      {success ? (
        <AuthorizeSucessModel
          show={true}
          status={"success"}
          handleOk={handleOk}
        />
      ) : (
        <Modal
          show={showPaypal}
          onHide={handleShowPaypalModel}
          centered
          size="lg"
          backdrop="static"
          className="free-st-popup payment_popup"
        >
          <Modal.Body>
            <Modal.Header className="payment-header">Payment Form</Modal.Header>
            <div
              className="paymentCrossIcon"
              onClick={() => handleShowPaypalModel()}
            >
              {" "}
              <CrossIconSVG />
            </div>
            <PayPalScriptProvider
              options={{
                clientId: paypalClientKey,
                disableFunding: "paylater",
                enableFunding: "venmo",
              }}
            >
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: amount, // Set your payment amount here
                        },
                      },
                    ],
                  });
                }}
                onApprove={onApprove}
              />{" "}
            </PayPalScriptProvider>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default PaypalModel;
export const CrossIconSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-x"
      viewBox="0 0 16 16"
    >
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
    </svg>
  );
};
