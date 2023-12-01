import { Form, Spinner } from "react-bootstrap";
//import Select from "react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";

import { fastWithdraw } from "../../utils/validationSchema.mjs";
import AuthContext from "../../context/authContext.ts";
import { toast } from "react-toastify";
import { marketPlaceInstance } from "../../config/axios.js";
import "../../styles/globals.css";
import { useAddress } from "@thirdweb-dev/react";

// const customStyles = {
//   container: (provided) => ({
//     ...provided,
//     width: "100%",
//   }),
//   option: (provided) => ({
//     ...provided,
//     background: "#000",
//     color: "#ddd",
//     fontWeight: "400",
//     fontSize: "16px",
//     padding: "5px 10px",
//     lineHeight: "16px",
//     cursor: "pointer",
//     borderRadius: "4px",
//     borderBottom: "1px solid #141414",
//     ":hover": {
//       background: "#141414",
//       borderRadius: "4px",
//     },
//   }),
//   menu: (provided) => ({
//     ...provided,
//     background: "#000",
//     borderRadius: "30px",
//     padding: "10px 20px",
//     border: "2px solid transparent",
//   }),
//   control: () => ({
//     background: "#000",
//     border: "1px solid #141414",
//     borderRadius: "30px",
//     color: "#fff",
//     display: "flex",
//     alignItem: "center",
//     height: "41",
//     margin: "2px 0",
//     boxShadow: "0px 20px 20px #00000091",
//     cursor: "pointer",
//     ":hover": {
//       background: "#141414",
//       // border: "2px solid #306CFE",
//     },
//   }),
//   singleValue: (provided) => ({
//     ...provided,
//     color: "#fff",
//     fontWeight: "400",
//     fontSize: "14px",
//     lineHeight: "16px",
//   }),
//   indicatorSeparator: (provided) => ({
//     ...provided,
//     display: "none",
//   }),
//   placeholder: (provided) => ({
//     ...provided,
//     fontWeight: "400",
//     fontSize: "14px",
//     lineHeight: "19px",
//     color: "#858585c7",
//   }),
//   input: (provided) => ({
//     ...provided,
//     // height: "38px",
//     color: "fff",
//   }),
//   valueContainer: (provided) => ({
//     ...provided,
//     padding: "2px 20px",
//   }),
//   indicatorsContainer: (provided) => ({
//     ...provided,
//     paddingRight: "20px",
//     color: "#858585c7",
//   }),
//   svg: (provided) => ({
//     ...provided,
//     fill: "#858585c7 !important",
//     ":hover": {
//       fill: "#858585c7 !important",
//     },
//   }),
// };
// const options = [
//   // { value: "Cashapp", label: "Cashapp" },
//   { value: "Paypal", label: "Paypal" },
// ];

// const paymentoptions = [
//   { value: 50, label: "$50" },
//   { value: 100, label: "$100" },
//   { value: 500, label: "$500" },
// ];

const FastWithdrawPopup = ({
  show,
  setShow,
  handleCloseFiat,
  getUserDataInstant,
}) => {
  const { user } = useContext(AuthContext);
  const address = useAddress();
  // const [paymentType, setPaymentType] = useState();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(fastWithdraw),
  });

  // const WithdrawRequest = async (values) => {
  //   try {
  //     console.log("values-----------", values);
  //     if (!user)
  //       return toast.error("Please login first", { containerId: "login" });
  //     if (user?.isBlockWallet) {
  //       return toast.error(`Your wallet blocked by admin`, { toastId: "A" });
  //     }
  //     if (!values.redeemPrize) {
  //       setError("amount", {
  //         message: "Please Select amount",
  //       });
  //       return;
  //     }

  //     if (!values.paymentType) {
  //       setError("paymentType", {
  //         message: "Please Select paymentType",
  //       });
  //       return;
  //     }
  //     setLoading(true);
  //     marketPlaceInstance()
  //       .post(`/WithdrawRequestWithFiat`, values)
  //       .then((data) => {
  //         console.log("redeemdata", data);
  //         if (!data.data.success) {
  //           toast.error("ERROR! - " + data.data.message, {
  //             containerId: "error",
  //           });
  //           setLoading(false);

  //           handleCloseFiat();
  //         } else {
  //           toast.success(data?.data?.message);
  //           setLoading(false);
  //           handleCloseFiat();
  //           reset();
  //           getUserDataInstant();
  //         }
  //       });
  //   } catch (e) {
  //     console.log("eee", e);
  //   }
  // };
  const WithdrawRequest = (values) => {
    try {
      console.log("values--->", values);
      if (!user)
        return toast.error("Please login first", { containerId: "login" });
      if (user?.isBlockWallet) {
        return toast.error(`Your wallet blocked by admin`, { toastId: "A" });
      }
      if (!address)
        return toast.error("Please connect wallet first", {
          containerId: "connect-wallet",
        });
      setLoading(true);
      marketPlaceInstance()
        .get(`/FastWithdrawRequest/${address}/${values?.amount}`)
        .then((data) => {
          console.log("redeemdata", data);
          const prize = data?.data?.prize?.price;
          console.log("prize", prize);
          if (!data.data.success) {
            toast.error("ERROR! - " + data.data.message, {
              containerId: "error",
            });
            setLoading(true);
          } else {
            reset();
            toast.success(data?.data?.message);
            getUserDataInstant();
          }
        });
    } catch (error) {
      console.log("errrr", error);
    }
  };
  // const handleChnagePayout = (selectedOptions) => {
  //   setValue("paymentType", selectedOptions?.value);
  //   setValue("email", "");
  //   setValue("cashAppid", "");
  //   setPaymentType(selectedOptions);
  // };

  // const handleChnagePrice = (selectedOptions) => {
  //   console.log("selectedOptions", selectedOptions);
  //   setValue("redeemPrize", selectedOptions?.value);
  // };

  console.log("errors", errors);

  return (
    <div className="fiat-modal">
      <Form onSubmit={handleSubmit(WithdrawRequest)}>
        <div className="fiat-content">
          <Form.Group className="fiat-group">
            <Form.Label>Withdraw Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              placeholder="Enter Amount"
              {...register("amount")}
            />
            {errors?.amount && (
              <p className="error-msg">{errors?.amount?.message}</p>
            )}
          </Form.Group>
          {/* 
          <h6 className='deducted-heading'>
            10% of the amount will be deducted from your redemption amount
          </h6> */}
        </div>
        <div className="popupBtn">
          <button className="greyBtn" onClick={() => setShow(false)}>
            Cancel
          </button>
          <button className="yellowBtn" variant="primary" type="submit">
            {!loading ? "Confirm" : <Spinner animation="border" />}{" "}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default FastWithdrawPopup;
