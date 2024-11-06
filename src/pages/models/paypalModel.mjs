/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-escape */
import { Modal, Form, Spinner } from "react-bootstrap";

// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
// import { paypalClientKey } from "../../config/keys.js";
import AuthorizeSucessModel from "./authrizeSucessModel.mjs";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import AuthContext from "../../context/authContext.ts";

const PaypalModel = ({
  showPaypal,
  handleShowPaypalModel,
  amount,
  promoCode,
  billingForm,
  index,
  closePaypalModel,
}) => {
  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    option: (provided) => ({
      ...provided,
      background: "#1f2332",
      color: "#bcbcbc",
      fontWeight: "400",
      fontSize: "16px",
      padding: "10px 20px",
      lineHeight: "16px",
      cursor: "pointer",
      borderRadius: "4px",
      borderBottom: "1px solid #212529",
      ":hover": {
        background: "#191b20",
        borderRadius: "4px",
      },
    }),
    menu: (provided) => ({
      ...provided,
      background: "#1f2332",
      borderRadius: "6px",
      padding: "10px 20px",
      border: "2px solid transparent",
    }),
    control: () => ({
      display: "flex",
      alignItem: "center",
      margin: "2px 0",
      boxShadow: " 0 2px 10px #000000a5",
      cursor: "pointer",
      fontSize: "14px",
      background: "#1f2332",
      border: "1px solid #ffc700 ",
      borderRadius: "10px",
      color: "#bcbcbc",
      height: "54px",
      ":hover": {
        border: "1px solid #ffc700 ",
        borderRadius: "10px",
        color: "#bcbcbc",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#bcbcbc",
      fontWeight: "400",
      fontSize: "14px",
      lineHeight: "16px",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontWeight: "400",
      fontSize: "14px",
      lineHeight: "19px",
      background: "#1f2332",
      border: "1px solid #ffc700 ",
      borderRadius: "10px",
      color: "#bcbcbc",
    }),
    input: (provided) => ({
      ...provided,
      height: "42px",
      color: "#bcbcbc",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 20px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      paddingRight: "20px",
      color: "#bcbcbc",
    }),
    svg: (provided) => ({
      ...provided,
      fill: "#d7d7d7 !important",
      ":hover": {
        fill: "#d7d7d7 !important",
      },
    }),
  };
  const [loader] = useState(false);

  const [success, setSuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const [country, setCountry] = useState({
    value: "US",
    label: "US",
  });

  const countries = [
    { value: "US", label: "US" },
    { value: "CA", label: "CA" },
  ];

  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,

      // phone: user?.phone,
    },
    mode: "onBlur",
  }); //reset,

  const handleOk = async (event) => {
    try {
      setSuccess(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCountryChange = (selectedOption) => {
    setValue("country", selectedOption?.label);
    setCountry(selectedOption);
  };

  const handleProceedToPay = (values) => {
    console.log("values =>", values, amount);
    handleShowPaypalModel(amount, "", index, {
      ...values,
      country: country.value,
    });
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
          onHide={() => closePaypalModel()}
          centered
          size="lg"
          backdrop="static"
          className="free-st-popup payment_popup"
        >
          <Modal.Body>
            {billingForm ? (
              <>
                <Form onSubmit={handleSubmit(handleProceedToPay)}>
                  <div
                    className="paymentCrossIcon"
                    onClick={() => closePaypalModel()}
                  >
                    {" "}
                    <CrossIconSVG />
                  </div>
                  <Modal.Header className="payment-header">
                    Billing Address
                  </Modal.Header>
                  <div className="select-banner-option">
                    <Form.Group className="form-group">
                      <Form.Label>First Name*</Form.Label>
                      <Form.Control
                        type="text"
                        readOnly
                        disabled
                        name="firstName"
                        placeholder="Ex. John"
                        autoComplete="off"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^A-Za-z]/gi,
                            ""
                          ); // Remove non-alphabetical characters
                        }}
                        {...register("firstName")}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label>Last Name*</Form.Label>
                      <Form.Control
                        type="text"
                        readOnly
                        disabled
                        name="lastName"
                        placeholder="Ex. Smith"
                        autoComplete="off"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^A-Za-z]/gi,
                            ""
                          ); // Remove non-alphabetical characters
                        }}
                        {...register("lastName")}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label>Country*</Form.Label>
                      <Select
                        id="country"
                        className="country_select"
                        value={country}
                        onChange={handleCountryChange}
                        options={countries}
                        styles={customStyles}
                      />
                    </Form.Group>
                  </div>
                  <div className="select-banner-option">
                    <Form.Group className="form-group">
                      <Form.Label>Zip Code*</Form.Label>
                      <Form.Control
                        type="text"
                        name="zipCode"
                        placeholder="Ex. 898989ee"
                        autoComplete="off"
                        maxLength={20}
                        {...register("zipCode")}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label>Street Address*</Form.Label>
                      <Form.Control
                        type="text"
                        name="streetAddress"
                        placeholder="Street Address"
                        autoComplete="off"
                        {...register("streetAddress")}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label>City*</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        placeholder="City"
                        autoComplete="off"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^A-Za-z\s]/g,
                            "" // Remove non-alphabetical characters except spaces
                          );
                        }}
                        {...register("city")}
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="select-banner-option">
                    <Form.Group className="form-group">
                      <Form.Label>State*</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        placeholder="State"
                        autoComplete="off"
                        onKeyPress={(e) => {
                          const regex = /^[A-Za-z\s]+$/;
                          if (!regex.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        {...register("state")}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text" // Change type to "text" to allow non-numeric characters
                        placeholder="Phone Number"
                        {...register("phoneNumber")}
                        onChange={(e) => {
                          e.target.value = e.target.value
                            .replace(/[^0-9]/g, "")
                            .slice(0, 11); // Allow only numeric characters and limit to 11 digits
                        }}
                      />
                    </Form.Group>
                  </div>
                  {/* {error && (
                    <div style={{ color: "red", textAlign: "center" }}>
                      {error}
                    </div>
                  )} */}
                  <div className="popupBtn">
                    <button
                      disabled={loader}
                      className="yellowBtn greenBtn"
                      variant="primary"
                      type="submit"
                    >
                      {loader ? <Spinner animation="border" /> : "Submit"}
                    </button>

                    {/* <Button
        className="yellowBtn"
        variant="primary"
        onClick={() => handleClosePayForm()}
      >
        Cancel
      </Button> */}
                  </div>
                </Form>
              </>
            ) : (
              <>
                <Modal.Header className="payment-header">
                  Payment Form
                </Modal.Header>
                <div
                  className="paymentCrossIcon"
                  onClick={() => closePaypalModel()}
                >
                  {" "}
                  <CrossIconSVG />
                </div>
                <div id="checkout-form"></div>
              </>
            )}
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
