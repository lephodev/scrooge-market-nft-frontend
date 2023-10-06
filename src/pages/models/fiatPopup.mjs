import { Form, Modal } from "react-bootstrap";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";
import LoadingPoker from "../../images/scroogeHatLogo.png";

import {
  purchaseWithCashApp,
  purchaseWithPaypal,
} from "../../utils/validationSchema.mjs";
import AuthContext from "../../context/authContext.ts";
import { toast } from "react-toastify";
import { marketPlaceInstance } from "../../config/axios.js";

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
const options = [
  { value: "Cashapp", label: "Cashapp" },
  { value: "Paypal", label: "Paypal" },
];

const paymentoptions = [
  { value: 50, label: "$50" },
  { value: 100, label: "$100" },
  { value: 500, label: "$500" },
];

const FiatPopup = ({ show, handleCloseFiat, getUserDataInstant }) => {
  const { user } = useContext(AuthContext);

  const [paymentType, setPaymentType] = useState();
  const [globalLoader, setglobalLoader] = useState(true);

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(
      paymentType?.value === "Paypal" ? purchaseWithPaypal : purchaseWithCashApp
    ),
  });

  const WithdrawRequest = async (values) => {
    try {
      console.log("values-----------", values);
      if (!user)
        return toast.error("Please login first", { containerId: "login" });
      if (user?.isBlockWallet) {
        return toast.error(`Your wallet blocked by admin`, { toastId: "A" });
      }
      setglobalLoader(true);
      marketPlaceInstance()
        .post(`/WithdrawRequestWithFiat`, values)
        .then((data) => {
          console.log("redeemdata", data);
          if (!data.data.success) {
            toast.error("ERROR! - " + data.data.message, {
              containerId: "error",
            });
            setglobalLoader(false);
          } else {
            toast.success(data?.data?.message);
            setglobalLoader(false);
            getUserDataInstant();
          }
        });
    } catch (e) {
      console.log("eee", e);
    }
  };

  const handleChnagePayout = (selectedOptions) => {
    setValue("paymentType", selectedOptions?.value);
    setValue("email", "");
    setValue("cashAppid", "");
    setPaymentType(selectedOptions);
  };

  const handleChnagePrice = (selectedOptions) => {
    console.log("selectedOptions", selectedOptions);
    setValue("redeemPrize", selectedOptions?.value);
  };

  console.log("errors", errors);

  return (
    <>
      {globalLoader && (
        <div className='loading'>
          <div className='loading-img-div'>
            <img src={LoadingPoker} alt='game' className='imageAnimation' />
          </div>
        </div>
      )}
      <Modal show={show} onHide={handleCloseFiat} centered animation={false}>
        <Form onSubmit={handleSubmit(WithdrawRequest)}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body className='popupBody'>
            <div className='opentable-userBy'>
              <div className='opentable-userByinput'>
                <Form.Group className='userBuy' controlId='formBasicEmail'>
                  <Form.Label>Payout</Form.Label>
                  <Select
                    options={options}
                    onChange={handleChnagePayout}
                    styles={customStyles}
                  />
                </Form.Group>
                {console.log("paymentType", paymentType)}
                {paymentType && paymentType.value === "Paypal" ? (
                  <div className='opentable-userBy'>
                    <div className='opentable-userByinput'>
                      <Form.Group className='userBuy'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type='email'
                          name='email'
                          placeholder='Enter email'
                          {...register("email")}
                        />
                        {errors?.email && (
                          <p className='error-msg'>{errors?.email?.message}</p>
                        )}
                      </Form.Group>
                    </div>
                  </div>
                ) : paymentType && paymentType.value === "Cashapp" ? (
                  <div className='opentable-userBy'>
                    <div className='opentable-userByinput'>
                      <Form.Group className='userBuy'>
                        <Form.Label>CashAppId </Form.Label>
                        <Form.Control
                          type='text'
                          name='cashAppid'
                          //   defaultValue={singleTournament?.name}
                          placeholder='Enter Cashapp Id'
                          {...register("cashAppid")}
                        />
                        {errors?.cashAppid && (
                          <p className='error-msg'>
                            {errors?.cashAppid?.message}
                          </p>
                        )}
                      </Form.Group>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {paymentType && paymentType.value && (
                  <Form.Group className='userBuy' controlId='formBasicEmail'>
                    <Form.Label>Redeem Amount</Form.Label>
                    <Select
                      options={paymentoptions}
                      onChange={handleChnagePrice}
                      styles={customStyles}
                    />
                  </Form.Group>
                )}
              </div>
            </div>
            <div className='popupBtn'>
              <button className='greyBtn' onClick={handleCloseFiat}>
                Cancel
              </button>
              <button className='yellowBtn' variant='primary' type='submit'>
                Confirm
              </button>
            </div>
          </Modal.Body>
        </Form>
      </Modal>
    </>
  );
};

export default FiatPopup;
