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

const FastWithdrawPopup = ({ getUserDataInstant }) => {
  const { user } = useContext(AuthContext);
  const address = useAddress();
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
          if (!data.data.success) {
            toast.error("ERROR! - " + data.data.message, {
              containerId: "error",
            });
            setLoading(false);
          } else {
            reset();
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

  return (
    <div className='fiat-modal fiat-data'>
      <p>Scrooge Contract to view tokens in wallet</p>
      <div className='token-box'>
        <h5
          onClick={() => {
            handleCopyURL("0x9dfee72aea65dc7e375d50ea2bd90384313a165a");
          }}>
          0x9dfee72aea65dc7e375d50ea2bd90384313a165a{" "}
        </h5>
        <img src={copyIcon} alt='icon' className='copy-icon' />
      </div>
      <Form onSubmit={handleSubmit(WithdrawRequest)}>
        <div className='fiat-content'>
          <Form.Group className='fiat-group fiat-data-label'>
            <Form.Label>Withdraw Amount</Form.Label>
            <Form.Control
              type='number'
              name='amount'
              placeholder='Enter Amount'
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
    </div>
  );
};

export default FastWithdrawPopup;
