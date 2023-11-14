import { Modal } from "react-bootstrap";
import redemption50 from "../../images/succes/redemption-50.webp";
import redemption100 from "../../images/succes/redemption-100.webp";
import redemption500 from "../../images/succes/redemption-500.webp";

const SuccessModal = ({
  success50Show,
  success100Show,
  success500Show,
  handleSuccess500Modal,
  handleSuccess50Modal,
  handleSuccess100Modal,
}) => {
  return (
    <>
      {success50Show ? (
        <Modal
          centered
          show={success50Show}
          onHide={handleSuccess50Modal}
          size='lg'
          className='success-modal'>
          <Modal.Body>
            <div className='success-modal-content'>
              <img src={redemption50} alt='redemption' className='img-fluid' />
            </div>
          </Modal.Body>
        </Modal>
      ) : success100Show ? (
        <Modal
          centered
          show={success100Show}
          onHide={handleSuccess100Modal}
          size='lg'
          className='success-modal'>
          <Modal.Body>
            <div className='success-modal-content'>
              <img src={redemption100} alt='redemption' className='img-fluid' />
            </div>
          </Modal.Body>
        </Modal>
      ) : success500Show ? (
        <Modal
          centered
          show={success500Show}
          onHide={handleSuccess500Modal}
          size='lg'
          className='success-modal'>
          <Modal.Body>
            <div className='success-modal-content'>
              <img src={redemption500} alt='redemption' className='img-fluid' />
            </div>
          </Modal.Body>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};

export default SuccessModal;
