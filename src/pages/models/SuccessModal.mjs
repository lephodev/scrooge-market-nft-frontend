import { Modal } from "react-bootstrap";
import redemption from "../../images/succes/redemption submitted.png";

const SuccessModal = ({ successShow, handleSuccessModal, purchaseAmount }) => {
  return (
    <Modal
      centered
      show={successShow}
      onHide={handleSuccessModal}
      size='lg'
      className='success-modal'>
      <Modal.Body>
        <div className='success-modal-content'>
          <img src={redemption} alt='redemption' className='img-fluid' />
          <p>${purchaseAmount / 100}</p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SuccessModal;
