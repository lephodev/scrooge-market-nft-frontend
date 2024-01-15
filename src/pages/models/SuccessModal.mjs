import { Modal } from "react-bootstrap";
import redemption from "../../images/succes/redemption.webp";

const SuccessModal = ({ handleSuccess50Modal }) => {
  return (
    <Modal
      centered
      show={false}
      onHide={handleSuccess50Modal}
      size="lg"
      className="success-modal"
    >
      <Modal.Body>
        <div className="success-modal-content">
          <img src={redemption} alt="redemption" className="img-fluid" />
          <p>$5000</p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SuccessModal;
