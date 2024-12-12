/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import scroogeHat from "../images/scroogeHatLogo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useReward } from "react-rewards";
import { ConnectWallet } from "@thirdweb-dev/react";
import { userKycDetails } from "../utils/api.mjs";
import AuthContext from "../context/authContext.ts";
import Layout from "./Layout.mjs";
import { authInstance, marketPlaceInstance } from "../config/axios.js";
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
// import cashAppIcon from "../images/redemption/cashapp-icon.svg";
import payPalIcon from "../images/redemption/paypal-icon.svg";
import { scroogeClient } from "../config/keys.js";
import PageLoader from "../components/pageLoader/loader.mjs";
import { Button, Spinner } from "react-bootstrap";
import ConnectWalletModel from "./models/connectWalletModel.mjs";
import PopUp2FA from "./twofa/PopUp2FA.mjs";
import encryptPayload from "../utils/eencryptPayload.js";

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
  const [fiatActiveInActive, setFiatActiveInActive] = useState({});
  const [showConnect, setShowConnect] = useState(false);
  const [loaderaddress, setLoaderAddress] = useState(false);
  const [displayData, setDisplayData] = useState(null);
  const [twoFactorData, setTwoFactorData] = useState({});
  const [filterOn, setFilterOn] = useState();
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

  const verifyTwoFactorAuthCode = async (code) => {
    try {
      const response = await (
        await authInstance()
      ).post(
        "/users/verifyTwoFactorAuthCode",
        encryptPayload({ code }),
        {
          withCredentials: true,
          credentials: "include",
        }
      );
      if (response?.data?.code === 200) {
        setDisplayData(null);
        setTwoFactorData({
          twoFactorAuthEnabled: response?.data?.twoFactorAuthEnabled,
        });
        localStorage.setItem("scrooge2Fa", true);
        toast.success("Verified successfully", {
          toastId: "LoginSucess",
        });
        if (filterOn === "Fiat") {
          setBuyWithFiat(true);
          setShowFastWithdraw(false);
        } else if (filterOn === "fast_withdraw") {
          setShowFastWithdraw(true);
          setBuyWithFiat(false);
        }
      } else {
        toast.error(response?.data?.message || "Failed to update 2FA status.", {
          toastId: "A",
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating 2FA.", {
        toastId: "B",
      });
      console.error("Error enabling/disabling 2FA:", error);
    }
  };

  const filterPrizes = (filterOn) => {
    console.log("filterOn", filterOn);
    if (!user.twoFactorAuthEnabled) {
      toast.error("Please enable 2Fa for redemption", {
        toastId: "error-enable 2Fa",
      });
      return;
    }

    setDisplayData({
      title: "Enter 2FA Code",
      desc: "This account is protected by Two-Factor Authentication. Please enter the code below to continue.",
      tagLine: "Enter 2FA Code",
      btnIcon: "",
      btnText: "CONTINUE",
      btnColor: "#66852f",
      btnTextColor: "#ddf2b8",
      nextBtnText: "Cancel",
      lostline: "Lost access to your authenticator?",
    });

    console.log("displadattatat", displayData);
    setFilterOn(filterOn);
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

  const getAdminSettings = async () => {
    // const basicAuthToken = validateToken();
    (await marketPlaceInstance())
      .get("/getAdminSettings", {
        // headers: {
        //   Authorization: basicAuthToken,
        // },
      })
      .then((res) => {
        if (res.data.adminSettings) {
          const { redemptionActiveAndInActive } = res.data.adminSettings;
          setFiatActiveInActive(redemptionActiveAndInActive);
        }
      })
      .catch((err) => {
        console.log("error ", err);
      });
  };

  useEffect(() => {
    getAdminSettings();
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

  const handleConnect = () => {
    setLoaderAddress(true);

    setShowConnect(!showConnect);
  };

  const handleConnectWallet = () => {
    setShowConnect(!showConnect);
  };

  const handleClose = () => {
    setDisplayData(null);
  };

  return (
    <Layout>
      <main className="main redeem-prizes-page redeem-page">
        {displayData?.title && (
          <PopUp2FA
            displayData={displayData}
            handleClose={handleClose}
            handleClick={verifyTwoFactorAuthCode}
            twoFactorData={twoFactorData}
            from="header"
            // handleLostLine={handleLostLine}
          />
        )}
        <div className="container">
          {globalLoader && <PageLoader />}
          <div className="bordered-section redeem_container_gap">
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
                    <h1 className="title updated_text_color text_shadow_none text-capitalize pt-5">
                      Sweepstakes Redemption
                    </h1>
                  </div>
                  {/* <div className="page-sub-title">
                    <h2>
                      Ready to cash in on your big wins? Take a look through our
                      selection of prize options and pick what suits you best!
                      Sweep Tokens are redeemed at a 100:1 USD ratio!
                    </h2>
                  </div> */}
                </div>

                <ConnectWalletModel
                  show={showConnect}
                  handleConnectWallet={handleConnectWallet}
                  handleConnect={handleConnect}
                />
                <div className="wallet">
                  {address ? (
                    <ConnectWallet />
                  ) : (
                    <Button onClick={() => handleConnectWallet()}>
                      {!loaderaddress ? (
                        "Connect Wallet"
                      ) : (
                        <Spinner animation="border" />
                      )}
                    </Button>
                  )}

                  {/* <div className={priceColor}>${currentPriceOG}</div> */}
                </div>

                <div className="prizes-chip-count m-0 prizes-chip-count_update">
                  {user ? (
                    <>
                      <h3>
                        <span>Redeemable ST Balance : </span>{" "}
                        {(user?.wallet - user?.nonWithdrawableAmt).toFixed(2)}
                      </h3>
                      <h3>
                        <span>USD Value : </span>${" "}
                        {(
                          user?.wallet / 100 -
                          user?.nonWithdrawableAmt / 100
                        ).toFixed(2)}
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
                    className={`redeem-method-box redeem-method-box_updated box_updated_bg ${
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
                    className={`redeem-method-box redeem-method-box_updated box_updated_bg${
                      buyWithFiat ? "box-active" : ""
                    }`}
                    onClick={() => filterPrizes("Fiat")}
                  >
                    <div className="redeem-method-title">
                      <h4> Cash Prize</h4>
                    </div>
                    <div className="redeem-icon-grid">
                      {/* <img
                        src={cashAppIcon}
                        alt="cashAppIcon"
                        width={64}
                        height={64}
                      /> */}
                      <img
                        src={payPalIcon}
                        alt="payPalIcon"
                        width={64}
                        height={64}
                      />
                    </div>
                    <div className="redeem-info-grid">
                      <h5>
                        <span>Redeemable To</span> {/* Cashapp or */} Paypal
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
                    fiatActiveInActive={fiatActiveInActive}
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
                <div className="redemption-history redemption-history_updated">
                  <a
                    href={`${scroogeClient}/profile?active=redemption`}
                    target="_blank"
                    className="pdf-down updated_bg_btn"
                    rel="noreferrer"
                  >
                    Click Here to View Redemption History
                  </a>
                </div>
                <div className="download-pdf-grid">
                  <a href={Pdf} target="blank" className="pdf-down">
                    {" "}
                    How it works!{" "}
                    <sapn className="text-decoration-underline">
                      Click here to download pdf.
                    </sapn>
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
