/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import LoadingPoker from "../images/scroogeHatLogo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useReward } from "react-rewards";

import { userKycDetails } from "../utils/api.mjs";
import AuthContext from "../context/authContext.ts";
import Layout from "./Layout.mjs";
import { authInstance } from "../config/axios.js";
import scroogelogo from "../images/scroogeCasinoLogo.png";
import FiatPopup from "./models/fiatPopup.mjs";
import SuccessModal from "./models/SuccessModal.mjs";
import Pdf from "../images/Manual.pdf";
import FastWithdrawPopup from "./models/fastWithdrawPopup.mjs";
import { validateToken } from "../utils/dateUtils.mjs";
function RedeemPrizes() {
  const navigate = useNavigate();
  const { reward } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });
  let prizesReceived = 0;
  const { user, loading, setUser } = useContext(AuthContext);
  console.log(loading);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [globalLoader, setglobalLoader] = useState(true);
  const [buyWithFiat, setBuyWithFiat] = useState(false);
  const [showFiat, setShowFiat] = useState(false);
  const [success50Show, setSuccess50Show] = useState(false);
  const [success100Show, setSuccess100Show] = useState(false);
  const [success500Show, setSuccess500Show] = useState(false);
  const [showFastWithdraw, setShowFastWithdraw] = useState(false);

  const redemptionUnderMaintainance = false;

  async function startFetching() {
    if (prizesReceived === 0) {
    }
    prizesReceived = 1;
  }

  const filterPrizes = (filterOn) => {
    if (filterOn === "Fiat") {
      setBuyWithFiat(true);
      setShowFastWithdraw(false);
    } else if (filterOn === "fast_withdraw") {
      setShowFastWithdraw(true);
      setBuyWithFiat(false);
    }
  };

  const getUserDataInstant = () => {
    const basicAuthToken = validateToken();
    authInstance()
      .get("/auth/check-auth", {
        headers: {
          Authorization: basicAuthToken,
        },
      })
      .then((res) => {
        if (res.data.user) {
          setUser({
            ...res.data.user,
          });
        }
      })
      .catch((err) => {
        console.log("error ", err);
      });
  };

  useEffect(() => {
    setShowFastWithdraw(true);

    async function checkKYCStatus() {
      const response = await userKycDetails();
      if (response?.code === 200) {
        if (response.message !== "accept") {
          setglobalLoader(false);
          navigate("/kyc");
        } else {
          setglobalLoader(false);
          startFetching();
        }
      } else {
        setglobalLoader(false);
        toast.error(response.message, {
          toastId: "error-fetching-kyc-details",
        });
        navigate("/");
      }
    }
    checkKYCStatus();
  }, []);

  const handleSuccess50Modal = () => {
    setSuccess50Show(!success50Show);
  };

  const handleSuccess100Modal = () => {
    setSuccess100Show(!success100Show);
  };

  const handleSuccess500Modal = () => {
    setSuccess500Show(!success500Show);
  };

  if (redemptionUnderMaintainance) {
    return <UnderMaintenanceContent />;
  }

  const handleCloseFiat = () => {
    setShowFiat(false);
  };

  return (
    <Layout>
      <SuccessModal
        success50Show={success50Show}
        success100Show={success100Show}
        success500Show={success500Show}
        handleSuccess50Modal={handleSuccess50Modal}
        handleSuccess100Modal={handleSuccess100Modal}
        handleSuccess500Modal={handleSuccess500Modal}
      />
      <main className='main redeem-prizes-page redeem-page'>
        <div className='container'>
          {globalLoader && (
            <div className='loading'>
              <div className='loading-img-div'>
                <img src={LoadingPoker} alt='game' className='imageAnimation' />
              </div>
            </div>
          )}
          <div className='bordered-section'>
            {redeemSuccess ? (
              <div className='pageImgContainer'>
                <div className='loading-txt'>
                  REDEEMED SUCCESSFULLY<br></br>
                  <button
                    className='page-nav-header-btn'
                    onClick={() => {
                      setRedeemSuccess(false);
                      reward();
                    }}>
                    CLOSE
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
            {!globalLoader && (
              <>
                <div className='scrooge-main-heading'>
                  <div className='pageTitle'>
                    <h1 className='title'>Redeem for Prizes</h1>
                  </div>
                  <div className='feature-overview-div'>
                    Ready to cash in on your big wins? Take a look through our
                    selection of prize options and pick what suits you best!
                    Sweep Tokens are redeemed at a 100:1 USD ratio!
                  </div>
                </div>

                <div className='prizes-chip-count'>
                  {user ? (
                    <>
                      <h3>
                        Redeemable Balance:{" "}
                        {(user?.wallet - user?.nonWithdrawableAmt).toFixed(2)}
                      </h3>
                      <a href={Pdf} target='blank' className='pdf-down'>
                        {" "}
                        How it works! Click here to download pdf.
                      </a>
                    </>
                  ) : (
                    <>
                      <img
                        src={LoadingPoker}
                        alt='game'
                        className='imageAnimation'
                        width={100}
                        height={100}
                      />
                    </>
                  )}
                </div>
                <div className='page-nav-header-btns-row'>
                  <div className='new-btn'>
                    <button onClick={() => filterPrizes("fast_withdraw")}>
                      Crypto
                    </button>
                  </div>

                  <div className='new-btn'>
                    <button onClick={() => filterPrizes("Fiat")}>Fiat</button>
                  </div>
                </div>

                {buyWithFiat && (
                  <FiatPopup
                    show={showFiat}
                    handleCloseFiat={handleCloseFiat}
                    getUserDataInstant={getUserDataInstant}
                  />
                )}

                {showFastWithdraw && (
                  <FastWithdrawPopup
                    show={showFastWithdraw}
                    setShow={setShowFastWithdraw}
                    handleCloseFiat={handleCloseFiat}
                    getUserDataInstant={getUserDataInstant}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}

const UnderMaintenanceContent = () => {
  return (
    <div className='scrooge-under-content'>
      <img src={scroogelogo} alt='scrooge' />
      <h4>Under Maintainance</h4>
    </div>
  );
};

export default RedeemPrizes;
