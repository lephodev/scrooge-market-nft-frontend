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
          {/* <div>
            Preferred contract address: Binance Smart Chain. Supported apps: 1.
            Trust Wallet 2. MetaMask 3. SafePal
          </div> */}
          <div className='support-chain'>
            <span
              style={{
                color: "red",
                alignItems: "center",
                justifyContent: "center",
              }}>
              NOTE:
            </span>

            <p>
              Preferred contract address: Binance Smart Chain. Supported apps:
            </p>
            <p>1.Trust Wallet</p>
            <p>2.MetaMask</p>
            <p>3.SafePal</p>
            {/* <ListGroup as='ol' numbered>
              <ListGroup.Item as='li'> Trust Wallet</ListGroup.Item>
              <ListGroup.Item as='li'>MetaMask</ListGroup.Item>
              <ListGroup.Item as='li'>SafePal</ListGroup.Item>
            </ListGroup> */}
          </div>
          <div className='popupBtn d-flex flex-column'>
            <div onClick={() => handleConnectWallet()}>
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
