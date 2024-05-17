import { Button, Modal, Spinner } from "react-bootstrap";
import { marketPlaceInstance } from "../../config/axios.js";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";

const FreeSTModel = ({
  showFreeST,
  handleCloseFreeST,
  freeSTDetail,
  setPromoCode,
}) => {
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
        setPromoCode("");
      } else if (code === 404) {
        toast.error(message, { toastId: "B" });
        setPromoLoader(false);
      }
      setPromoLoader(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response) {
        if (error?.response?.status !== 200) {
          toast.error(error?.response?.data?.message, { toastId: "login" });
        }
      }
      setPromoLoader(false);

      console.log("error", error);
    }
  };
  return (
    <Modal
      show={showFreeST}
      onHide={handleCloseFreeST}
      centered
      backdrop={"static"}
      className="free-st-popup"
    >
      <Modal.Body>
        <div className="free-st-content">
          <h5>Congratulations! Enjoy your free ST!</h5>
          <h6>{freeSTDetail?.token}ST </h6>
          <Button variant="primary" onClick={() => handleRedeemFreeST()}>
            {!promoLoader ? "Claim" : <Spinner animation="border" />}{" "}
          </Button>{" "}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default FreeSTModel;
