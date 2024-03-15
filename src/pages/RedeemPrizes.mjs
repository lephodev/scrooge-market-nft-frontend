/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import scroogeHat from "../images/scroogeHatLogo.png";
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
import Pdf from "../images/RedemptionManual.pdf";
// import { validateToken } from "../utils/dateUtils.mjs";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";
import {
  useNetworkMismatch,
  useAddress,
  ChainId,
  useSigner,
} from "@thirdweb-dev/react";
import ChainContext from "../context/Chain.ts";
import CryptoWithdrawPopup from "./models/cryptoWithdrawPopup.mjs";
import binanceIcon from "../images/redemption/binance-icon.svg";
import cashAppIcon from "../images/redemption/cashapp-icon.svg";
import payPalIcon from "../images/redemption/paypal-icon.svg";
import { scroogeClient } from "../config/keys.js";
import PageLoader from "../components/pageLoader/loader.mjs";

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
  const [showFastWithdraw, setShowFastWithdraw] = useState(false);
  const { selectedChain, setSelectedChain } = useContext(ChainContext);

  const address = useAddress();
  const signer = useSigner();

  const isMismatched = useNetworkMismatch();
  useEffect(() => {
    if (selectedChain === ChainId.Mainnet) {
      setSelectedChain(ChainId.BinanceSmartChainMainnet);
    }

    if (
      address &&
      !isMismatched &&
      selectedChain === ChainId.BinanceSmartChainMainnet
    ) {
    }
  }, [user, isMismatched, address, signer]);

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

  const getUserDataInstant = async () => {
    // const basicAuthToken = validateToken();
    (await authInstance())
      .get("/auth/check-auth", {
        // headers: {
        //   Authorization: basicAuthToken,
        // },
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
    // setShowFastWithdraw(true);

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

  useEffect(() => {
    handleScroll();
  }, [showFastWithdraw, buyWithFiat]);

  if (redemptionUnderMaintainance) {
    return <UnderMaintenanceContent />;
  }

  const handleCloseFiat = () => {
    setShowFiat(false);
  };

  const handleScroll = () => {
    const element1 =
      document.getElementById("crypto-form") ||
      document.getElementById("fiat-form");
    if (element1) {
      element1.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
    console.log("element1", element1);
  };

  return (
    <Layout>
      <main className="main redeem-prizes-page redeem-page">
        <div className="container">
          {globalLoader && <PageLoader />}
          <div className="bordered-section">
            {redeemSuccess ? (
              <div className="pageImgContainer">
                <div className="loading-txt">
                  REDEEMED SUCCESSFULLY<br></br>
                  <button
                    className="page-nav-header-btn"
                    onClick={() => {
                      setRedeemSuccess(false);
                      reward();
                    }}
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
            {!globalLoader && (
              <>
                <div className="scrooge-main-heading">
                  <div className="pageTitle">
                    <h1 className="title">Sweepstakes Redemption</h1>
                  </div>
                  {/* <div className="page-sub-title">
                    <h2>
                      Ready to cash in on your big wins? Take a look through our
                      selection of prize options and pick what suits you best!
                      Sweep Tokens are redeemed at a 100:1 USD ratio!
                    </h2>
                  </div> */}
                </div>
                <div className="prizes-chip-count m-0">
                  {user ? (
                    <>
                      <h3>
                        Redeemable ST Balance :{" "}
                        <span>
                          {" "}
                          {(user?.wallet - user?.nonWithdrawableAmt).toFixed(2)}
                        </span>
                      </h3>
                      <h3>
                        USD Value :{" "}
                        <span>
                          ${" "}
                          {(
                            user?.wallet / 100 -
                            user?.nonWithdrawableAmt / 100
                          ).toFixed(2)}
                        </span>
                      </h3>
                    </>
                  ) : (
                    <img
                      src={scroogeHat}
                      alt="game"
                      className="imageAnimation"
                      width={100}
                      height={100}
                    />
                  )}
                </div>
                <div className="page-nav-header-btns-row">
                  <div
                    className={`redeem-method-box ${
                      showFastWithdraw ? "box-active" : ""
                    }`}
                    onClick={() => filterPrizes("fast_withdraw")}
                  >
                    <div className="redeem-method-title">
                      <h4>Crypto Prize</h4>
                    </div>
                    <div className="redeem-icon-grid">
                      <img
                        src={binanceIcon}
                        alt="binanceIcon"
                        width={64}
                        height={64}
                      />
                      <img
                        src={scroogeHat}
                        alt="scroogeHat"
                        width={64}
                        height={64}
                      />
                    </div>
                    <div className="redeem-info-grid">
                      <h5>
                        <span>Get ScroogeCoin</span> Sent To Your Defi Wallet
                      </h5>
                      <h6>Minimum 5,000 ST Required</h6>
                    </div>
                  </div>

                  <div
                    className={`redeem-method-box ${
                      buyWithFiat ? "box-active" : ""
                    }`}
                    onClick={() => filterPrizes("Fiat")}
                  >
                    <div className="redeem-method-title">
                      <h4> Cash Prize</h4>
                    </div>
                    <div className="redeem-icon-grid">
                      <img
                        src={cashAppIcon}
                        alt="cashAppIcon"
                        width={64}
                        height={64}
                      />
                      <img
                        src={payPalIcon}
                        alt="payPalIcon"
                        width={64}
                        height={64}
                      />
                    </div>
                    <div className="redeem-info-grid">
                      <h5>
                        <span>Redeemable To</span> Cashapp or Paypal
                      </h5>
                      <h6> 10,000 ST Minimum</h6>
                    </div>
                  </div>
                </div>
                {isMismatched && address ? (
                  <>
                    {showFastWithdraw && (
                      <div style={{ marginTop: "20px" }}>
                        <SwitchNetworkBSC />
                      </div>
                    )}
                  </>
                ) : (
                  <span></span>
                )}
                {buyWithFiat && (
                  <FiatPopup
                    show={showFiat}
                    handleCloseFiat={handleCloseFiat}
                    getUserDataInstant={getUserDataInstant}
                  />
                )}
                {!isMismatched && showFastWithdraw && (
                  <CryptoWithdrawPopup
                    show={showFastWithdraw}
                    setShow={setShowFastWithdraw}
                    handleCloseFiat={handleCloseFiat}
                    getUserDataInstant={getUserDataInstant}
                  />
                )}
                <div className="redemption-history">
                  <a
                    href={`${scroogeClient}/profile?active=redemption`}
                    target="_blank"
                    className="pdf-down"
                    rel="noreferrer"
                  >
                    Click Here to View Redemption History
                  </a>
                </div>
                <div className="download-pdf-grid">
                  <a href={Pdf} target="blank" className="pdf-down">
                    {" "}
                    How it works! Click here to download pdf.
                  </a>
                </div>
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
    <div className="scrooge-under-content">
      <img src={scroogelogo} alt="scrooge" />
      <h4>Under Maintainance</h4>
    </div>
  );
};

export default RedeemPrizes;
