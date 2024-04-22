/* eslint-disable no-useless-escape */
import { Modal, Spinner, Form } from "react-bootstrap";
import { marketPlaceInstance } from "../../config/axios.js";
import { toast } from "react-toastify";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getDDC } from "../../utils/dateUtils.mjs";
import { number } from "card-validator";
import { countries } from "../../utils/countries.mjs";
import Select from "react-select";

const AuthrizeCustomModel = ({
  showAuthForm,
  setShowAuthForm,
  amount,
  promoCode,
  prize,
}) => {
  const { handleSubmit, register, reset, setValue } = useForm({
    mode: "onBlur",
  });

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    option: (provided) => ({
      ...provided,
      background: "#000",
      color: "#ddd",
      fontWeight: "400",
      fontSize: "16px",
      padding: "10px 20px",
      lineHeight: "16px",
      cursor: "pointer",
      borderRadius: "4px",
      borderBottom: "1px solid #141414",
      ":hover": {
        background: "#141414",
        borderRadius: "4px",
      },
    }),
    menu: (provided) => ({
      ...provided,
      background: "#000",
      borderRadius: "30px",
      padding: "10px 20px",
      border: "2px solid transparent",
    }),
    control: () => ({
      background: "#000",
      border: "2px solid #000",
      borderRadius: "30px",
      color: "#fff",
      display: "flex",
      alignItem: "center",
      height: "41",
      margin: "2px 0",
      boxShadow: " 0 2px 10px #000000a5",
      cursor: "pointer",
      ":hover": {
        background: "#000",
        // border: "2px solid #306CFE",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
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
      color: "#858585c7",
    }),
    input: (provided) => ({
      ...provided,
      // height: "38px",
      color: "fff",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 20px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      paddingRight: "20px",
      color: "#858585c7",
    }),
    svg: (provided) => ({
      ...provided,
      fill: "#858585c7 !important",
      ":hover": {
        fill: "#858585c7 !important",
      },
    }),
  };

  const [loader, setLoader] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [isValid, setIsValid] = useState(true); // Assuming initial state is valid
  const [expDate, setExpDate] = useState("");
  const [cardCode, setCardCode] = useState("");
  const [country, setCountry] = useState({
    value: "USA",
    label: "USA",
  });
  const handleClosePayForm = () => {
    reset();
    setIsValid(true);
    setCardCode("");
    setCardNumber("");
    setShowAuthForm(!showAuthForm);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value && !value.match(/^[0-9]{1,19}$/)) {
      return;
    }
    setCardNumber(value);
    setIsValid(number(value).isValid);
  };
  const handleExpDateChange = (event) => {
    var code = event.keyCode;
    var allowedKeys = [8];
    if (allowedKeys.indexOf(code) !== -1) {
      return;
    }

    event.target.value = event.target.value
      .replace(
        /^([1-9]\/|[2-9])$/g,
        "0$1/" // 3 > 03/
      )
      .replace(
        /^(0[1-9]|1[0-2])$/g,
        "$1/" // 11 > 11/
      )
      .replace(
        /^([0-1])([3-9])$/g,
        "0$1/$2" // 13 > 01/3
      )
      .replace(
        /^(0?[1-9]|1[0-2])([0-9]{2})$/g,
        "$1/$2" // 141 > 01/41
      )
      .replace(
        /^([0]+)\/|[0]+$/g,
        "0" // 0/ > 0 and 00 > 0
      )
      .replace(
        /[^\d\/]|^[\/]*$/g,
        "" // To allow only digits and `/`
      )
      .replace(
        /\/\//g,
        "/" // Prevent entering more than 1 `/`
      );
    setExpDate(event.target.value); // Limit to "MM/YY"
  };

  const handleInputCardCodeChange = (event) => {
    const inputValue = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setCardCode(inputValue);
  };

  const handleCountryChange = (selectedOption) => {
    setValue("country", selectedOption?.label);
    setCountry(selectedOption);
  };

  const getPromoCode = () => {
    console.log("prizehgfghgfhfgh", prize.priceInBUSD, promoCode);
    if (prize.offerType !== "MegaOffer" && prize?.priceInBUSD !== "250") {
      return promoCode ? promoCode : "";
    } else {
      return "";
    }
  };
  const pay = async (values) => {
    setLoader(true);
    console.log("valuesvalues", values);
    try {
      const res = await (
        await marketPlaceInstance()
      ).post(
        `/auth-make-payment`,
        {
          ...values,
          cardCode,
          expDate,
          cardNumber: cardNumber.replace(/\s/g, ""),
          amount,
          sessionId: await getDDC(),
          promoCode: getPromoCode().trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          credentials: "include",
        }
      );
      setLoader(false);
      console.log("res", res);
      if (res?.data?.success) {
        handleClosePayForm();
        setCardNumber("");
        setExpDate("");
        setCardCode("");
        toast.success(res.data.message, { id: "buy-sucess" });
      } else {
        toast.error(res.data.error, { id: "buy-failed" });
      }
    } catch (e) {
      setLoader(false);
      console.log("ee55", e.response);
      // console.log("ee55", JSON.parse(e));
      if (axios.isAxiosError(e) && e?.response) {
        if (e?.response?.status !== 200) {
          toast.error(e?.response?.data?.error || e?.response?.data?.message, {
            toastId: "login",
          });
        }
      }
    }
  };

  return (
    <Modal
      show={showAuthForm}
      onHide={handleClosePayForm}
      centered
      size="lg"
      backdrop={"static"}
      className="free-st-popup payment_popup"
    >
      <Modal.Body>
        <Modal.Header className="payment-header">Payment Form</Modal.Header>
        <div className="paymentCrossIcon" onClick={() => handleClosePayForm()}>
          {" "}
          <CrossIconSVG />
        </div>
        <Form onSubmit={handleSubmit(pay)}>
          <div className="select-banner-option">
            <Form.Group controlId="cardNumber">
              <Form.Label>Card Number*</Form.Label>
              <Form.Control
                type="text"
                placeholder="1234 5678 9123 4567"
                autoComplete="off"
                value={cardNumber}
                onChange={handleChange}
                isInvalid={!isValid}
                required
              />
              {!isValid && (
                <Form.Control.Feedback type="invalid">
                  Invalid card number
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Label>Exp. Date*</Form.Label>
              <Form.Control
                type="text"
                name="expDate"
                placeholder="Ex. 07/29"
                onKeyUp={handleExpDateChange}
                maxLength={5}
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Card Code*</Form.Label>
              <Form.Control
                type="text"
                name="cardCode"
                placeholder="CVV"
                autoComplete="off"
                value={cardCode}
                onChange={handleInputCardCodeChange} // Call handleInputChange on input change
                maxLength={5} // Limit input to 4 characters
                required // Make the field required if needed
              />
            </Form.Group>
          </div>
          <Modal.Header className="payment-header">
            Billing Address
          </Modal.Header>
          <div className="select-banner-option">
            <Form.Group className="form-group">
              <Form.Label>First Name*</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                placeholder="Ex. John"
                autoComplete="off"
                onKeyPress={(e) => {
                  const regex = /^[A-Za-z]+$/;
                  if (!regex.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                {...register("firstName", { required: true })}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Last Name*</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Ex. Smith"
                autoComplete="off"
                onKeyPress={(e) => {
                  const regex = /^[A-Za-z]+$/;
                  if (!regex.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                {...register("lastName")}
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Country*</Form.Label>
              <Select
                id="country"
                value={country}
                onChange={handleCountryChange}
                options={countries}
                styles={customStyles}
              />
              {/* <Form.Control
                type="text"
                name="country"
                placeholder="Country"
                autoComplete="off"
                onKeyPress={(e) => {
                  const regex = /^[A-Za-z]+$/;
                  if (!regex.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                {...register("country")}
                required
              /> */}
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
                onKeyPress={(e) => {
                  const regex = /^[A-Za-z]+$/;
                  if (!regex.test(e.key)) {
                    e.preventDefault();
                  }
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
                  const regex = /^[A-Za-z]+$/;
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
                type="number"
                name="phoneNumber"
                placeholder="Phone Number"
                autoComplete="off"
                {...register("phoneNumber")}
              />
            </Form.Group>
          </div>
          <div className="popupBtn">
            <button
              disabled={loader}
              className="yellowBtn greenBtn"
              variant="primary"
              type="submit"
            >
              {loader ? <Spinner animation="border" /> : "Pay"}
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
      </Modal.Body>
    </Modal>
  );
};

export default AuthrizeCustomModel;
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
