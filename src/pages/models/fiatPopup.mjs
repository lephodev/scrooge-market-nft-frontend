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
    padding: "5px 10px",
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
    borderRadius: "30px",
    color: "#fff",
    display: "flex",
    alignItem: "center",
    background: "#080808",
    border: "1px solid #25282e",
    height: "43px",
    margin: "2px 0",
    boxShadow: "0px 20px 20px #00000091",
    cursor: "pointer",
    ":hover": {
      background: "#141414",
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

  const [paymentType, setPaymentType] = useState();
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
        .post(`/WithdrawRequestWithFiat`, values)
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
    setValue("paymentType", selectedOptions?.value);
    setValue("email", "");
    setValue("cashAppid", "");
    setPaymentType(selectedOptions);
  };

  // const handleChnagePrice = (selectedOptions) => {
  //   console.log("selectedOptions", selectedOptions);
  //   setValue("redeemPrize", selectedOptions?.value);
  // };

  const handleSuccessModal = () => {
    setSuccessShow(!successShow);
  };

  useEffect(() => {
    if (fiatActiveInActive.Cashapp && fiatActiveInActive.Paypal) {
      setOptions([
        { value: "Cashapp", label: "Cashapp" },
        { value: "Paypal", label: "Paypal" },
      ]);
    } else if (fiatActiveInActive?.Cashapp) {
      setOptions([{ value: "Cashapp", label: "Cashapp" }]);
    } else if (fiatActiveInActive?.Paypal) {
      setOptions([{ value: "Paypal", label: "Paypal" }]);
    }
  }, []);

  return (
    <div className="fiat-data" id="fiat-form">
      {!fiatActiveInActive?.Cashapp && !fiatActiveInActive?.Paypal ? (
        "Cash Prize is Temporarly Unavailable"
      ) : (
        <Form onSubmit={handleSubmit(WithdrawRequest)}>
          <div className="fiat-content">
            <Form.Group className="fiat-group">
              <Form.Label>Withdraw to</Form.Label>
              <Select
                options={options}
                onChange={handleChnagePayout}
                styles={customStyles}
              />
              {errors?.paymentType && (
                <p className="error-msg">{errors?.paymentType?.message}</p>
              )}
            </Form.Group>

            {paymentType && paymentType.value === "Paypal" ? (
              <Form.Group className="fiat-group">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  {...register("email")}
                />
                {errors?.email && (
                  <p className="error-msg">{errors?.email?.message}</p>
                )}
              </Form.Group>
            ) : paymentType && paymentType.value === "Cashapp" ? (
              <Form.Group className="fiat-group">
                <Form.Label>$Cashtag </Form.Label>
                <Form.Control
                  type="text"
                  name="cashAppid"
                  //   defaultValue={singleTournament?.name}
                  placeholder="Enter $Cashtag"
                  {...register("cashAppid")}
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
            <button className="yellowBtn" variant="primary" type="submit">
              {!loading ? "Confirm" : <Spinner animation="border" />}{" "}
            </button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default FiatPopup;
