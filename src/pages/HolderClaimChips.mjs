import { useState, useEffect, useContext } from "react";
import LoadingPoker from "../images/scroogeHatLogo.png";
import {
  ConnectWallet,
  useNetworkMismatch,
  useAddress,
  useSDK,
  useSigner,
} from "@thirdweb-dev/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import ReactModal from 'react-modal';
import fetch from "node-fetch";
import Countdown from "react-countdown";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";
import { useReward } from "react-rewards";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import AuthContext from "../context/authContext.ts";
import Layout from "./Layout.mjs";
import { marketPlaceInstance } from "../config/axios.js";
import { scroogeClient } from "../config/keys.js";

function HolderClaimChips() {
  const { user } = useContext(AuthContext);
  const { reward } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });

  const [buyLoading, setBuyLoading] = useState(false);
  const [nextClaimDate, setNextClaimDate] = useState("Loading...");
  const [OGBalance, setOGBalance] = useState("Loading...");
  const [currentPrice, setCurrentPrice] = useState("Loading...");
  const [disable, setDisable] = useState(false);
  const sdk = useSDK();
  const address = useAddress();
  const signer = useSigner();

  const isMismatched = useNetworkMismatch();
  function notify(message) {
    toast.success("🎩 " + message);
  }

  async function getNextClaimDate() {
    if (user) {
      marketPlaceInstance()
        .get(`/getNextClaimDate/${address}/holder/${user.id}/0`)
        .then((data) => {
          console.log("setclam=im---", data);
          if (data.data.success) {
            setNextClaimDate(data.data.data[0].claimDate);
          } else {
            setNextClaimDate(data.data.message);
          }
          return nextClaimDate;
        });
    }
  }

  async function getCoinGeckoData() {
    await fetch(
      `https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${process.env.REACT_APP_OGCONTRACT_ADDRESS}`
    )
      .then((response) => response.json())
      .then((data) => {
        const current_price = data.market_data.current_price.usd;
        console.log("coingeckodata", current_price);
        setCurrentPrice(current_price);
        return current_price;
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  }

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const claimTokens = () => {
    setDisable(true);
    setTimeout(() => {
      setDisable(false);
    }, 4000);
    setBuyLoading(true);
    try {
      marketPlaceInstance()
        .get(
          `/claimHolderTokens/${address}/${OGBalance}/${currentPrice}/${user.id}`
        )
        .then(async (data) => {
          if (data?.data?.code === 200) {
            toast.success("Tokens Claimed: " + data?.data?.data);
          } else {
            toast.error("Tokens Claimed: " + data.data.msg);
          }
          setBuyLoading(false);
          reward();
          zzz();
          //await timeout(4200);
          //window.location.reload();
        });
    } catch (err) {
      console.error(err);
      notify("Error claiming tokens!");
      setBuyLoading(false);
    }
  };

  const sdksdk = async () => {
    const rawBal = await sdk.wallet.balance(
      "0xfA1BA18067aC6884fB26e329e60273488a247FC3"
    );
    setOGBalance(parseInt(rawBal.value / 10 ** 18));
  };

  const zzz = async () => {
    if (address && !isMismatched) {
      await getNextClaimDate().then((resu) => {
        return true;
      });
    } else {
      return false;
    }
  };

  useEffect(() => {
    getCoinGeckoData();
    console.log("address", address);
    console.log("isMismatched", !isMismatched);
    if (address && !isMismatched) {
      sdksdk();
      zzz();
    }
  }, [user, address]);

  return (
    <Layout>
      <main className='main claim-free-page'>
        <div className='container'>
          <div className='bordered-section'>
            {buyLoading ? (
              <div className='pageImgContainer'>
                <img src={LoadingPoker} alt='game' className='imageAnimation' />
                <div className='loading-txt pulse'>CLAIMING TOKENS...</div>
              </div>
            ) : (
              <></>
            )}
            <div className='scrooge-main-heading'>
              <div className='pageTitle'>
                <h1 className='title'>Claim Free Tokens</h1>
              </div>
              <div className='feature-overview-div'>
                <p>
                  Did you know that you get FREE TOKENS EVERY MONTH just for
                  holding Scrooge in your wallet? Once every 30 days, you can
                  come right to this page and claim your free{" "}
                  <a
                    href={scroogeClient}
                    target='_blank'
                    rel='noreferrer'
                    alt='claim free tokens to spend in Scrooge Casino'>
                    Scrooge Casino
                  </a>{" "}
                  tokens just by clicking the CLAIM TOKENS button.
                </p>
                <p>
                  Your claimable monthly token rate is automatically determined
                  based on the amount of Scrooge you currently hold, as well as
                  the current Scrooge price.
                </p>
              </div>
            </div>

            {isMismatched && address ? (
              <div>
                <SwitchNetworkBSC />
              </div>
            ) : (
              <span></span>
            )}
            {address ? (
              <div className='prizes_container'>
                <div className='prizes-card'>
                  {OGBalance ? (
                    <div className='holder-claim-details'>
                      <h4> Scrooge Coin Balance:</h4>
                      {OGBalance.toLocaleString("en-US")}
                    </div>
                  ) : (
                    <div className='holder-claim-details'>
                      <h4> Scrooge Coin Balance:</h4> {OGBalance}
                    </div>
                  )}

                  <div className='holder-claim-details'>
                    <h4>Scrooge Coin Price:</h4> $
                    {currentPrice > 0
                      ? parseFloat(currentPrice).toFixed(10)
                      : 0}
                  </div>

                  <div className='prizes-chip-count'>
                    <h3> Your Claimable Monthly Token Rate:</h3>
                    <div className='additional-info-div'>
                      <span>
                        Your Balance ({OGBalance.toLocaleString("en-US")})
                      </span>{" "}
                      <div>X</div>
                      <span>
                        {" "}
                        Current Scrooge Coin Price ($
                        {currentPrice > 0
                          ? parseFloat(currentPrice).toFixed(10)
                          : 0}
                        )
                      </span>{" "}
                      <div>X</div>
                      <span>EARNING RATE (10%)</span> <div>=</div>
                      {currentPrice > 0
                        ? OGBalance * parseFloat(currentPrice).toFixed(10) * 0.1
                        : 0}
                    </div>
                    <h3>
                      Claim{" "}
                      {OGBalance > 0 ? (
                        <>
                          {currentPrice > 0
                            ? (OGBalance * currentPrice * 0.1)
                                .toFixed(0)
                                .toLocaleString("en-US")
                            : 0}
                        </>
                      ) : (
                        <>0</>
                      )}{" "}
                      FREE Tokens Every 30 Days
                    </h3>
                  </div>
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <div id='rewardId' style={{ margin: "0 auto" }} />
                  </div>
                  {(new Date(nextClaimDate) <= new Date() ||
                    nextClaimDate === "No Entries Found") &&
                  OGBalance > 0 ? (
                    <Countdown date={nextClaimDate}>
                      <div className='new-btn'>
                        <button
                          disabled={disable}
                          // className='submit-btn'
                          onClick={() => claimTokens()}>
                          Claim{" "}
                          {(OGBalance * currentPrice * 0.1)
                            .toFixed(0)
                            .toLocaleString("en-US")}{" "}
                          Tokens
                        </button>
                      </div>
                    </Countdown>
                  ) : (
                    <>
                      <div className='prize-name text-animate'>
                        {nextClaimDate !== "Loading..." && OGBalance > 0 ? (
                          <>
                            <h1>Next Claim Available:</h1>

                            <Countdown date={nextClaimDate}>
                              <button
                                disabled={disable}
                                className='submit-btn'
                                onClick={() => claimTokens()}>
                                Claim{" "}
                                {currentPrice > 0
                                  ? (OGBalance * currentPrice * 0.1)
                                      .toFixed(0)
                                      .toLocaleString("en-US")
                                  : 0}{" "}
                                Tokens
                              </button>
                            </Countdown>
                          </>
                        ) : OGBalance === 0 ? (
                          "OG Balance is 0"
                        ) : (
                          <>
                            <img
                              src={LoadingPoker}
                              alt='game'
                              className='imageAnimation'
                            />
                          </>
                        )}
                      </div>
                      <br></br>
                      <br></br>
                    </>
                  )}
                  <div className='fine-print-txt'>
                    <p>
                      *Your claimed tokens will automatically be added to your
                      connected{" "}
                      <a
                        href={scroogeClient}
                        alt='Visit Scrooge Casino'
                        target='_blank'
                        rel='noreferrer'>
                        Scrooge Casino
                      </a>{" "}
                      account.
                    </p>
                  </div>
                </div>
                <div className='fine-print-txt'>
                  <p>
                    Monthly claimable token rates are calculated based on the
                    current price of the Scrooge cryptocurrency token. This
                    ensures a fair and even claimable monthly amount for all
                    holders.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className='description yellow'>
                  Get started by connecting your wallet.
                </p>
                <div className='connect-wallet-div'>
                  <ConnectWallet />
                </div>
              </div>
            )}
          </div>
          <div className='flex-row' style={{ margin: "50px auto 0px" }}>
            <ShowBottomNavCards />
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default HolderClaimChips;
