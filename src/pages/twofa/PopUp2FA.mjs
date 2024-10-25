/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";
// import { Transition } from "react-transition-group";
import { Button, Modal } from "react-bootstrap";
// import '../../components/Affiliates/re'
import "./twofa.css";

import "react-toastify/dist/ReactToastify.css";
import OTPInput from "react-otp-input";

function PopUp2FA({
  displayData,
  handleClick,
  twoFactorData,
  from,
  handleLostLine,
  handleClose,
}) {
  const [otp, setOtp] = useState("");

  const handleChange = (value) => {
    setOtp(value);
    console.log("value", value.length);
    if (value.length === 6 && from === "header") {
      console.log("called");
      handleClick(value);
    }
  };

  console.log(
    "twoFactorData?.twoFactorAuthEnabled",
    twoFactorData?.twoFactorAuthEnabled
  );

  return (
    <Modal
      className="welcomeModal twofa-popup-qr-model"
      centered
      size="lg"
      show
      // onHide={handleCloseLogin}
    >
      <Modal.Body>
        <div className="loginPopup">
          <div className="twofaPopupForm">
            {twoFactorData?.twoFactorAuthEnabled === true ? (
              <div className="twofaPopupForm-QR">
                <p className="mt-[0px] mb-[10px] remove2fa_para">
                  {displayData.title || ""}
                </p>
              </div>
            ) : (
              <div className="twofaPopupForm-QR">
                <img src={twoFactorData?.qrImage} />
                <p className="mt-[0px] mb-[10px]">
                  {twoFactorData?.tempTwoFactorSecret || ""}
                </p>
              </div>
            )}

            <div className="mb-[10px]">
              <p className="text-center text-[13px] text-[#aeafae]">
                {displayData?.desc}
              </p>
            </div>

            <div className="d-flex justify-content-center flex-column">
              <div className="otp-redeem">
                <h6 className="">{displayData?.tagLine}</h6>

                <OTPInput
                  value={otp}
                  onChange={handleChange}
                  numInputs={6}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props} />}
                />
              </div>

              {/* <div className="enable-2fabtn-second">
                {displayData?.lostline ? (
                  <Button onClick={handleLostLine}>
                    {displayData?.lostline}
                  </Button>
                ) : null}
              </div> */}

              <div className="enable-2fabtn d-flex justify-content-center mt-3">
                <Button onClick={handleClose}>
                  {displayData?.nextBtnText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default PopUp2FA;
