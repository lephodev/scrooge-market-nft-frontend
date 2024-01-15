import { Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";

import { fastWithdraw } from "../../utils/validationSchema.mjs";
import AuthContext from "../../context/authContext.ts";
import { toast } from "react-toastify";
import { marketPlaceInstance } from "../../config/axios.js";
import "../../styles/globals.css";
import { useAddress } from "@thirdweb-dev/react";
import copyIcon from "../../images/copied-icon.svg";
import SuccessModal from "./SuccessModal.mjs";

const CryptoWithdrawPopup = ({ getUserDataInstant }) => {
  const { user } = useContext(AuthContext);
  const address = useAddress();
  const [loading, setLoading] = useState(false);
  const [successShow, setSuccessShow] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState();

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(fastWithdraw),
  });

  const WithdrawRequest = (values) => {
    try {
      console.log("values--->", values);
      setPurchaseAmount(values?.amount);
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
          if (!data.data.success) {
            toast.error("ERROR! - " + data.data.message, {
              containerId: "error",
            });
            setLoading(false);
          } else {
            console.log("datatta", data);
            reset();
            setSuccessShow(true);
            setLoading(false);
            toast.success(data?.data?.message);
            getUserDataInstant();
          }
        });
    } catch (error) {
      setLoading(false);
      console.log("errrr", error);
    }
  };

  function handleCopyURL(value) {
    navigator.clipboard.writeText(value);
    toast.success("Copied");
  }
  console.log("errors", errors);

  const handleSuccessModal = () => {
    setSuccessShow(!successShow);
  };
  return (
    <div className=' fiat-data'>
      <p>Scrooge Contract to view tokens in wallet</p>
      <div
        className='token-box'
        onClick={() => {
          handleCopyURL("0x9dfee72aea65dc7e375d50ea2bd90384313a165a");
        }}>
        <h5>0x9dfee72aea65dc7e375d50ea2bd903843... </h5>
        <img src={copyIcon} alt='icon' className='copy-icon' />
      </div>
      <Form onSubmit={handleSubmit(WithdrawRequest)}>
        <div className='fiat-content'>
          <Form.Group className='fiat-group'>
            <Form.Label>
              Minimum 5,000 ST($50) required for crypto withdrawals.
            </Form.Label>
            <Form.Control
              type='number'
              name='amount'
              placeholder='Enter Withdraw Amount'
              {...register("amount")}
            />
            {errors?.amount && (
              <p className='error-msg'>{errors?.amount?.message}</p>
            )}
          </Form.Group>
        </div>
        <div className='popupBtn'>
          <button className='yellowBtn' variant='primary' type='submit'>
            {!loading ? "Confirm" : <Spinner animation='border' />}{" "}
          </button>
        </div>
      </Form>
      <SuccessModal
        successShow={successShow}
        handleSuccessModal={handleSuccessModal}
        purchaseAmount={purchaseAmount}
      />
    </div>
  );
};

export default CryptoWithdrawPopup;
