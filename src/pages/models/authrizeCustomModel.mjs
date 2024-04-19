import { Button, Modal, Spinner, Form } from "react-bootstrap";
import { marketPlaceInstance } from "../../config/axios.js";
import { toast } from "react-toastify";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getDDC } from "../../utils/dateUtils.mjs";

const AuthrizeCustomModel = ({
  showAuthForm,
  handleClosePayForm,
  amount,
  promoCode,
  prize,
}) => {
  const { handleSubmit, register } = useForm({
    mode: "onBlur",
  });

  const [loader, setLoader] = useState(false);

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
      if (res.data.success) {
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
      className="free-st-popup"
    >
      <Modal.Body>
        <Modal.Header>Payment Form</Modal.Header>
        <Form onSubmit={handleSubmit(pay)}>
          <div className="select-banner-option">
            <Form.Group className="form-group">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="number"
                name="cardNumber"
                placeholder="Enter Your Card Number"
                autoComplete="off"
                {...register("cardNumber")}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Exp. Date</Form.Label>
              <Form.Control
                type="text"
                name="expDate"
                placeholder="Enter exp date"
                autoComplete="off"
                {...register("expDate")}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Card Code</Form.Label>
              <Form.Control
                type="text"
                name="cardCode"
                placeholder="Enter Card Code"
                autoComplete="off"
                {...register("cardCode")}
              />
            </Form.Group>
          </div>
          <Modal.Header>Billing Address</Modal.Header>
          <div className="select-banner-option">
            <Form.Group className="form-group">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                placeholder="Enter Your First Name"
                autoComplete="off"
                {...register("firstName")}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Enter Your Last Name"
                autoComplete="off"
                {...register("lastName")}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                placeholder="Enter Your Country"
                autoComplete="off"
                {...register("country")}
              />
            </Form.Group>
          </div>
          <div className="select-banner-option">
            <Form.Group className="form-group">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                type="text"
                name="zipCode"
                placeholder="Enter Your Zip Code"
                autoComplete="off"
                {...register("zipCode")}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Street Address</Form.Label>
              <Form.Control
                type="text"
                name="streetAddress"
                placeholder="Enter Street Address"
                autoComplete="off"
                {...register("streetAddress")}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                placeholder="Enter Your City"
                autoComplete="off"
                {...register("city")}
              />
            </Form.Group>
          </div>
          <div className="select-banner-option">
            <Form.Group className="form-group">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                name="state"
                placeholder="Enter Your State"
                autoComplete="off"
                {...register("state")}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="number"
                name="phoneNumber"
                placeholder="Enter Phone Number"
                autoComplete="off"
                {...register("phoneNumber")}
              />
            </Form.Group>
          </div>
          <div className="popupBtn">
            <button className="yellowBtn" variant="primary" type="submit">
              {loader ? <Spinner animation="border" /> : "Pay"}
            </button>
            <Button
              className="yellowBtn"
              variant="primary"
              onClick={() => handleClosePayForm()}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AuthrizeCustomModel;
