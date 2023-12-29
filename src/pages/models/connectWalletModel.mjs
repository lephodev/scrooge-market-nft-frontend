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
                display: "flex",
                justifyContent: "center",
              }}>
              NOTE:
            </span>

            <p style={{ fontSize: "16px" }}>
              Preferred contract address:{" "}
              <span style={{ color: "white" }}>Binance Smart Chain.</span>{" "}
              <span style={{ display: "flex", justifyContent: "center" }}>
                Supported apps:
              </span>
            </p>
            <p
              style={{
                color: "white",
                fontSize: "16px",
                display: "flex",
                justifyContent: "center",
              }}>
              1.Trust Wallet
            </p>
            <p
              style={{
                color: "white",
                fontSize: "16px",
                display: "flex",
                justifyContent: "center",
              }}>
              2.MetaMask
            </p>
            <p
              style={{
                color: "white",
                fontSize: "16px",
                display: "flex",
                justifyContent: "center",
              }}>
              3.SafePal
            </p>
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
