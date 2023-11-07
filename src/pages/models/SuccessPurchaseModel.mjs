import { Modal } from "react-bootstrap";
import ST500Img from "../../images/succes/ST-500.webp";
import ST1000Img from "../../images/succes/ST-1K.webp";
import ST2500Img from "../../images/succes/ST-2500.webp";
import ST5000Img from "../../images/succes/ST-5K.webp";
import ST10000Img from "../../images/succes/ST-10K.webp";
import ST25000Img from "../../images/succes/ST-25K.webp";

const SuccessPurchaseModel = ({
  ST500,
  ST1000,
  ST2500,
  ST5000,
  ST10000,
  ST25000,
  handleSuccess500Modal,
  handleSuccess1000Modal,
  handleSuccess2500Modal,
  handleSuccess5000Modal,
  handleSuccess10000Modal,
  handleSuccess25000Modal,
}) => {
  return (
    <>
      {ST500 ? (
        <Modal
          centered
          show={ST500}
          onHide={handleSuccess500Modal}
          className='success-modal'>
          <Modal.Body>
            <div className='success-modal-content'>
              <img src={ST500Img} alt='redemption' className='img-fluid' />
            </div>
          </Modal.Body>
        </Modal>
      ) : ST1000 ? (
        <Modal
          centered
          show={ST1000}
          onHide={handleSuccess1000Modal}
          className='success-modal'>
          <Modal.Body>
            <div className='success-modal-content'>
              <img src={ST1000Img} alt='redemption' className='img-fluid' />
            </div>
          </Modal.Body>
        </Modal>
      ) : ST2500 ? (
        <Modal
          centered
          show={ST2500}
          onHide={handleSuccess2500Modal}
          className='success-modal'>
          <Modal.Body>
            <div className='success-modal-content'>
              <img src={ST2500Img} alt='redemption' className='img-fluid' />
            </div>
          </Modal.Body>
        </Modal>
      ) : ST5000 ? (
        <Modal
          centered
          show={ST5000}
          onHide={handleSuccess5000Modal}
          className='success-modal'>
          <Modal.Body>
            <div className='success-modal-content'>
              <img src={ST5000Img} alt='redemption' className='img-fluid' />
            </div>
          </Modal.Body>
        </Modal>
      ) : ST10000 ? (
        <Modal
          centered
          show={ST10000}
          onHide={handleSuccess10000Modal}
          className='success-modal'>
          <Modal.Body>
            <div className='success-modal-content'>
              <img src={ST10000Img} alt='redemption' className='img-fluid' />
            </div>
          </Modal.Body>
        </Modal>
      ) : ST25000 ? (
        <Modal
          centered
          show={ST25000}
          onHide={handleSuccess25000Modal}
          className='success-modal'>
          <Modal.Body>
            <div className='success-modal-content'>
              <img src={ST25000Img} alt='redemption' className='img-fluid' />
            </div>
          </Modal.Body>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};

export default SuccessPurchaseModel;
