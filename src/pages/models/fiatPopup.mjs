/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Spinner } from "react-bootstrap";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";

import {
  purchaseWithCashApp,
  purchaseWithPaypal,
} from "../../utils/validationSchema.mjs";
import AuthContext from "../../context/authContext.ts";
import { toast } from "react-toastify";
import { marketPlaceInstance } from "../../config/axios.js";
import "../../styles/globals.css";
import SuccessModal from "./SuccessModal.mjs";
import encryptPayload from "../../utils/eencryptPayload.js";

const customStyles = {
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
  option: (provided, { data }) => ({
    ...provided,
    background: "#1F2332",
    color: "#ddd",
    fontWeight: "400",
    fontSize: "16px",
    padding: "5px 10px",
    lineHeight: "16px",
    cursor: data.isDisabled ? "not-allowed" : "pointer",
    opacity: data.isDisabled ? "0.5" : "1",
    borderRadius: "4px",
    borderBottom: "1px solid #141414",
    ":hover": {
      background: "#141414",
      borderRadius: "4px",
    },
  }),
  menu: (provided) => ({
    ...provided,
    background: "#1F2332",
    borderRadius: "30px",
    padding: "10px 20px",
    border: "2px solid transparent",
  }),
  control: () => ({
    // borderRadius: "30px",
    color: "#fff",
    display: "flex",
    alignItem: "center",
    // background: "#080808",
    // border: "1px solid #25282e",
    height: "43px",
    margin: "2px 0",
    // boxShadow: "0px 20px 20px #00000091",
    borderRadius: "10px",
    border: "1px solid  #FFC700",
    background: "#1F2332",
    cursor: "pointer",
    ":hover": {
      background: "#1F2332",
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

// const paymentoptions = [
//   // { value: 50, label: "$50" },
//   { value: 100, label: "$100" },
//   { value: 500, label: "$500" },
// ];

const FiatPopup = ({
  handleCloseFiat,
  getUserDataInstant,
  fiatActiveInActive,
}) => {
  const { user } = useContext(AuthContext);

  const [paymentType, setPaymentType] = useState({
    value: "Paypal"
  });
  const [loading, setLoading] = useState(false);
  const [successShow, setSuccessShow] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState();
  let [options, setOptions] = useState([]);

  const {
    handleSubmit,
    formState: { errors },
    register,
    setError,
    reset,
    setValue,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(
      paymentType?.value === "Paypal" ? purchaseWithPaypal : purchaseWithCashApp
    ),
  });
  
  const WithdrawRequest = async (values) => {
    try {
      setPurchaseAmount(values?.amount);
      console.log("values-----------", values);
      if (!user)
        return toast.error("Please login first", { containerId: "login" });
      if (user?.isBlockWallet) {
        return toast.error(`Your wallet blocked by admin`, { toastId: "A" });
      }

      if (!values.paymentType) {
        setError("paymentType", {
          message: "Please Select paymentType",
        });
        return;
      }
      setLoading(true);
      (await marketPlaceInstance())
        .post(`/WithdrawRequestWithFiat`, encryptPayload(values))
        .then((data) => {
          console.log("redeemdata", data);
          if (!data.data.success) {
            toast.error("ERROR! - " + data.data.message, {
              containerId: "error",
            });
            setLoading(false);

            handleCloseFiat();
          } else {
            // toast.success(data?.data?.message);
            setLoading(false);
            setSuccessShow(true);
            handleCloseFiat();
            reset();
            getUserDataInstant();
          }
        });
    } catch (e) {
      console.log("eee", e);
    }
  };

  const handleChnagePayout = (selectedOptions) => {
    console.log("selectedOptions", selectedOptions);
    setPaymentType(selectedOptions);
    setValue("paymentType", selectedOptions?.value);
    setValue("email", "");
    setValue("cashAppid", "");
    setPaymentType(selectedOptions);
  };

  useEffect(()=>{
    setValue("paymentType", "Paypal");
  })

  // const handleChnagePrice = (selectedOptions) => {
  //   console.log("selectedOptions", selectedOptions);
  //   setValue("redeemPrize", selectedOptions?.value);
  // };

  const handleSuccessModal = () => {
    setSuccessShow(!successShow);
  };

  useEffect(() => {
    const cashappDisabled = !fiatActiveInActive.Cashapp;
    const paypalDisabled = !fiatActiveInActive.Paypal;
    console.log("cashappDisabled", cashappDisabled);

    setOptions([
      // { value: "Cashapp", label: "Cashapp", isDisabled: cashappDisabled },
      { value: "Paypal", label: "Paypal", isDisabled: paypalDisabled },
    ]);
  }, [fiatActiveInActive]);

  console.log("paymentType===>", paymentType?.value, options);

  return (
    <div className="fiat-data updated_cryto_form" id="fiat-form">
      <div className="updated_cryto_form_data">
        {!fiatActiveInActive?.Cashapp && !fiatActiveInActive?.Paypal ? (
          "Cash Prize is Temporarily Unavailable"
        ) : (
          <Form onSubmit={handleSubmit(WithdrawRequest)}>
            <div className="form_top">
              <Form.Label className="form_heading">Withdraw to</Form.Label>
              {/* {!fiatActiveInActive.Cashapp && (
                <Form.Text>
                  Paypal availability is subject to the apps
                  sending limits. When limits are reached, the option is
                  disabled temporarily.
                </Form.Text>
              )} */}
              {/* {!fiatActiveInActive.Paypal && (
                <Form.Text>
                  <span style={{fontWeight: "800"}}>Note:</span> <span style={{fontStyle: "italic"}}>Paypal availability is subject to the apps sending limits.
                  When limits are reached, the option is disabled temporarily.</span>
                </Form.Text>
              )} */}
            </div>
            <div className="fiat-content withdraw_content">
              <Form.Group
                className={` ${
                  paymentType?.value === undefined ? "fiat-group_first" : ""
                } fiat-group`}
              >
                <Select
                  options={options}
                  onChange={handleChnagePayout}
                  styles={customStyles}
                  value={options[0]}
                />
                {errors?.paymentType && (
                  <p className="error-msg">{errors?.paymentType?.message}</p>
                )}
              </Form.Group>

              {paymentType && paymentType.value === "Paypal" ? (
                <Form.Group className="fiat-group">
                  {/* <Form.Label>Email</Form.Label> */}
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    {...register("email")}
                    className="form_updated_input"
                  />
                  {errors?.email && (
                    <p className="error-msg">{errors?.email?.message}</p>
                  )}
                </Form.Group>
              ) : paymentType && paymentType.value === "Cashapp" ? (
                <Form.Group className="fiat-group">
                  {/* <Form.Label>$Cashtag </Form.Label> */}
                  <Form.Control
                    type="text"
                    name="cashAppid"
                    //   defaultValue={singleTournament?.name}
                    placeholder="Enter $Cashtag"
                    {...register("cashAppid")}
                    className="form_updated_input"
                  />
                  {errors?.cashAppid && (
                    <p className="error-msg">{errors?.cashAppid?.message}</p>
                  )}
                </Form.Group>
              ) : (
                ""
              )}
              {paymentType && paymentType.value && (
                <Form.Group className="fiat-group">
                  <Form.Label>
                    Minimum 10000 ST($100) required for Fiat withdrawals.
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    placeholder="Enter Withdraw Amount"
                    {...register("amount")}
                    className="form_updated_input"
                  />
                  {errors?.amount && (
                    <p className="error-msg">{errors?.amount?.message}</p>
                  )}
                </Form.Group>
              )}
              <SuccessModal
                successShow={successShow}
                handleSuccessModal={handleSuccessModal}
                purchaseAmount={purchaseAmount}
              />
              {/* <h6 className="deducted-heading">
            10% of the amount will be deducted from your redemption amount
          </h6> */}
            </div>
            <div className="popupBtn">
              <button
                className="yellowBtn updated_bg_btn new_btn_wd"
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {!loading ? "Confirm" : <Spinner animation="border" />}{" "}
              </button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default FiatPopup;
