import { Modal } from "react-bootstrap";
import redemption50 from "../../images/succes/redemption-50.webp";

const SuccessModal = ({ successShow, handleSuccessModal }) => {
  return (
    <Modal
      centered
      show={successShow}
      onHide={handleSuccessModal}
      size="lg"
      className="success-modal"
    >
      <Modal.Body>
        <div className="success-modal-content">
          <img src={redemption50} alt="redemption" className="img-fluid" />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SuccessModal;
