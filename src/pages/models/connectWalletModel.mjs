import { ConnectWallet } from "@thirdweb-dev/react";
import { Modal } from "react-bootstrap";

const ConnectWalletModel = ({ show, handleConnectWallet }) => {
  console.log("showSigner", show);

  return (
    <div>
      {" "}
      <Modal
        centered
        animation={false}
        show={show}
        onHide={handleConnectWallet}>
        <Modal.Body className='popupBody'>
          <div>
            Preferred contract address: Binance Smart Chain. Supported apps: 1.
            Trust Wallet 2. MetaMask 3. SafePal
          </div>
          <div className='popupBtn d-flex flex-column'>
            <div>
              <ConnectWallet />

              {/* <button onClick={handleAuthenticate} className='greyBtn mx-2'>
                Authenticate
              </button> */}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ConnectWalletModel;
