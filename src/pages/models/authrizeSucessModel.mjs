import { Modal, Button } from "react-bootstrap";

const AuthorizeSucessModel = ({ show, status, handleOk }) => {
  return (
    <>
      <Modal centered show={show} size="lg" className="success-modal">
        <Modal.Body>
          <div className="payment-success-content">
            <div className="container">
              <div className="payment-success">
                <div className="payment-success-card">
                  <div className="card-check">
                    {status === "inprogress" ? (
                      <>
                        <div className="loader">
                          <span className="hour"></span>
                          <span className="min"></span>
                          <span className="circel"></span>
                        </div>
                      </>
                    ) : status === "success" ? (
                      <div class="check-container">
                        <div className="check-background">
                          <svg
                            viewBox="0 0 65 51"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7 25L27.3077 44L58.5 7"
                              stroke="white"
                              stroke-width="11"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                        <div class="check-shadow"></div>
                      </div>
                    ) : status === "failure" ?   (
                      // <div class="check-container">
                      //   <div className="check-background">
                      //     {/* <svg
                      //       viewBox="0 0 65 51"
                      //       fill="none"
                      //       xmlns="http://www.w3.org/2000/svg"
                      //     >
                      //       <path
                      //         d="M7 25L27.3077 44L58.5 7"
                      //         stroke="white"
                      //         stroke-width="11"
                      //         stroke-linecap="round"
                      //         stroke-linejoin="round"
                      //       />
                      //     </svg> */}
                      //     Payment Failed
                      //   </div>
                      //   <div class="check-shadow"></div>
                      // </div>
                      ""
                    ) : null}
                  </div>
                  {status === "success" ? (
                    <>
                      <h1>Success</h1>
                      <p>
                        Your purchase request has been received!
                        <br /> Thank you!
                      </p>
                      <Button onClick={() => handleOk()}>OK</Button>
                    </>
                  )  : status === "failure" ?    (
                    <>
                      <h1>Failed</h1>
                      <p style={{ color: "red" }}>
                        Payment Failed
                      </p>
                    </>
                  ) : <>
                  <h1>Inprogress</h1>
                  <p style={{ color: "red" }}>
                    Your payment is under Process
                    <br /> Please do not refresh the page and do not press
                    back!
                  </p>
                </>}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AuthorizeSucessModel;
