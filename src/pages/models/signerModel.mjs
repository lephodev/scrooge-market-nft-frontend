import { Modal } from "react-bootstrap";

const SignerModel = ({
  signerMessage,
  showSigner,
  handleAuthenticate,
  handleInputChange,
}) => {
  console.log("showSigner", showSigner);

  return (
    <div>
      {" "}
      <Modal centered animation={false} show={showSigner}>
        <Modal.Body className='popupBody'>
          <div>Wallet Signature Authentication</div>
          <div className='popupBtn d-flex flex-column'>
            <input
              type='text'
              placeholder='Enter your message'
              value={signerMessage}
              onChange={handleInputChange}
              className='popup_inp'
            />
            <div>
              <button className='greyBtn'>Cancel</button>
              <button onClick={handleAuthenticate} className='greyBtn mx-2'>
                Authenticate
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SignerModel;
