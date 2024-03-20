import { Button, Modal, Spinner } from "react-bootstrap";
import { marketPlaceInstance } from "../../config/axios.js";
import { toast } from "react-toastify";
import { useState } from "react";

const FreeSTModel = ({ showFreeST, handleCloseFreeST, freeSTDetail }) => {
  const [promoLoader, setPromoLoader] = useState(false);
  const handleRedeemFreeST = async () => {
    console.log("handleRedeemFreeST", freeSTDetail);
    try {
      setPromoLoader(true);

      const payload = {
        promocode: freeSTDetail?.couponCode,
      };
      const res = await (
        await marketPlaceInstance()
      ).post("/redeemFreePromoST", payload);
      const { code, message, getPromo } = res.data;
      console.log("getPromo", getPromo);

      if (code === 200) {
        toast.success(message, { toastId: "A" });
        handleCloseFreeST();
      } else if (code === 404) {
        toast.error(message, { toastId: "B" });
        setPromoLoader(false);
      }
      setPromoLoader(false);
    } catch (error) {
      setPromoLoader(false);

      console.log("error", error);
    }
  };
  return (
    <Modal show={showFreeST} onHide={handleCloseFreeST}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>You want to redeem {freeSTDetail?.token}ST</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleRedeemFreeST()}>
          {!promoLoader ? "Claim" : <Spinner animation="border" />}{" "}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FreeSTModel;
