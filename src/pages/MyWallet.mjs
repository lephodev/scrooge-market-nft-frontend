/* eslint-disable react-hooks/exhaustive-deps */
import {
  ConnectWallet,
  useNetworkMismatch,
  useAddress,
  ChainId,
  useSigner,
  useSDK,
} from "@thirdweb-dev/react";
import { useEffect, useState, useContext } from "react";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";
import ChainContext from "../context/Chain.ts";
import Token from "../images/token.png";
import GoldCoin from "../images/goldCoin.png";
import Ticket from "../images/ticket.png";
import ScroogeHatLogo from "../images/scroogeHatLogo.png";
import scroogejr from "../images/scroogejr.jpeg";
import ClaimOGPending from "../components/claimOGPending.mjs";
import ClaimJRPending from "../components/claimJRPending.mjs";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../context/authContext.ts";
import Layout from "./Layout.mjs";
import { marketPlaceInstance } from "../config/axios.js";
import profile from "../images/profile.png";
// import { responsivePropType } from "react-bootstrap/esm/createUtilityClasses.js";
export default function MyWallet() {
  const [OGBalance, setOGBalance] = useState("Loading...");
  const [JRBalance, setJRBalance] = useState("Loading...");
  const [JRValue, setJRValue] = useState("Loading...");
  const [OGValue, setOGValue] = useState("Loading...");
  const [/* currentPriceOG */, setCurrentPriceOG] = useState("Loading...");
  const [/* currentPriceJR */, setCurrentPriceJR] = useState("Loading...");
  const { user } = useContext(AuthContext);
  const [userRedeemed, setUserRedeemed] = useState([]);
  const [showMerchRedeemed, setShowMerchRedeemed] = useState(false);
  const [showCasinoNFTs, setShowCasinoNFTs] = useState(true);
  const [showCrypto, setShowCrypto] = useState(true);
  const sdk = useSDK();
  const address = useAddress();
  const signer = useSigner();

  async function checkToken() {
    try {
      marketPlaceInstance()
        .get(`/getUserRedeemed/${user.id}`)
        .then((data) => {
          //console.log('data: ', data);
          setUserRedeemed(data.data);
        });
    } catch (err) {
      console.error(err);
    }
  }

  async function getCoinGeckoDataOG(bal) {
    await fetch(
      `https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${process.env.REACT_APP_OGCONTRACT_ADDRESS}`
    )
      .then((response) => response.json())
      .then((data) => {
        const current_price = data.market_data.current_price.usd;
        setCurrentPriceOG(current_price);
        setOGValue((bal * current_price).toFixed(2));
        return current_price;
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  }

  async function getCoinGeckoDataJR(bal) {
    await fetch(
      `https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/0x2e9F79aF51dD1bb56Bbb1627FBe4Cc90aa8985Dd`
    )
      .then((response) => response.json())
      .then((data) => {
        const current_price = data.market_data.current_price.usd;
        setCurrentPriceJR(current_price);
        setJRValue((bal * current_price).toFixed(2));
        return current_price;
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  }

  const handleMarkRedeemed = (trans_id) => {
    marketPlaceInstance()
      .get(`/markMerchCouponRedeemed/${trans_id}/${user.id}`)
      .then((res) => {
        //console.log('handle: ', res);
        getUserRedeemed();
      });
  };

  const getUserRedeemed = () => {
    //console.log('user: ', user[0]);
    marketPlaceInstance()
      .get(`/getUserRedeemed/${user.id}`)
      .then((data) => {
        //console.log('post get data: ', data);
        setUserRedeemed(data.data);
        //console.log('useRed: ',userRedeemed);
      });
  };

  const getOG = async () => {
    const rawBal = await sdk.wallet.balance(
      "0xfA1BA18067aC6884fB26e329e60273488a247FC3"
    );
    setOGBalance(parseInt(rawBal.value / 10 ** 18));
    getCoinGeckoDataOG(parseInt(rawBal.value / 10 ** 18));
  };

  const getJR = async () => {
    const rawBal = await sdk.wallet.balance(
      "0x2e9F79aF51dD1bb56Bbb1627FBe4Cc90aa8985Dd"
    );
    setJRBalance(parseInt(rawBal.value / 10 ** 18));
    getCoinGeckoDataJR(parseInt(rawBal.value / 10 ** 18));
  };

  const { selectedChain, setSelectedChain } = useContext(ChainContext);
  const isMismatched = useNetworkMismatch();

  useEffect(() => {
    if (selectedChain === ChainId.Mainnet) {
      setSelectedChain(ChainId.BinanceSmartChainMainnet);
    }
    if (user) {
      checkToken();
    }
    if (
      address &&
      !isMismatched &&
      selectedChain === ChainId.BinanceSmartChainMainnet
    ) {
      getOG();
      getJR();
    }
  }, [user, isMismatched, address, signer]);

  return (
    <Layout>
      <div className='container'>
        <main className='main my-wallet-page'>
          <h1 className='title'>{user?.username}'s SCROOGE CASINO WALLET</h1>

          {!showMerchRedeemed || !showCasinoNFTs || !showCrypto ? (
            <>
              <div className='min-menu-div'>
                {!showMerchRedeemed ? (
                  <>
                    {/* <div className='new-btn'>
                      <button
                        // className='min-menu-btn'
                        onClick={() => {
                          setShowMerchRedeemed(true);
                        }}
                      >
                        MERCH CODES
                      </button>
                    </div> */}
                  </>
                ) : (
                  <></>
                )}
                {!showCasinoNFTs ? (
                  <>
                    <div className='new-btn'>
                      <button
                        // className='min-menu-btn'
                        onClick={() => {
                          setShowCasinoNFTs(true);
                        }}
                      >
                        CASINO NFTS
                      </button>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {!showCrypto ? (
                  <>
                    <div className='new-btn'>
                      <button
                        // className='min-menu-btn'
                        onClick={() => {
                          setShowCrypto(true);
                        }}
                      >
                        CRYPTO
                      </button>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </>
          ) : (
            <></>
          )}

          {user ? (
            <div className='wallet-casino-profile-div'>
              <div className='wallet-casino-top'>
                <div className='wallet-casino-profile-img-div'>
                  <img
                    className='wallet-casino-profile-img'
                    src={
                      user?.profile && user?.profile !== ""
                        ? user?.profile
                        : profile
                    }
                    alt='Scrooge Casino profile'
                  />
                </div>
                <div className='wallet-casino-profile-details'>
                  <div className=''>
                    <span className='wallet-casino-profile-username'>
                      {user?.username}
                    </span>
                    <br></br>
                    <span className='wallet-user-name'>
                      {user?.firstName} {user?.lastName}
                    </span>
                    <br></br>
                  </div>
                  <div className='balance-column'>
                    <div className='token-ticket-row'>
                      <img
                        className='token-small'
                        src={Token}
                        alt='Scrooge Casino balances'
                      />
                      TOKENS: {user?.wallet?.toLocaleString("en-US")}
                    </div>
                    <div className='token-ticket-row'>
                      <img
                        className='ticket-small'
                        src={Ticket}
                        alt='Scrooge Casino balances'
                      />
                      TICKETS: {user?.ticket?.toLocaleString("en-US")}
                    </div>
                    <div className='token-ticket-row'>
                      <img
                        className='token-small'
                        src={GoldCoin}
                        alt='Scrooge Casino balances'
                      />
                      GOLD COIN: {user?.goldCoin?.toLocaleString("en-US")}
                    </div>
                  </div>
                </div>
              </div>

              {address ? (
                <>
                  <div className='crypto-card-grid'>
                    <div className='crypto-balance-div'>
                      <div className='width-100'>
                        <div className='crypto-balance-header'>
                          CRYPTO BALANCE
                        </div>
                        <div className='crypto-balance-row-new'>
                          <div className='crypto-balance-row-img'>
                            <img
                              className='token-logo'
                              src={ScroogeHatLogo}
                              alt='Scrooge Casino balances'
                            />
                          </div>

                          <div className='crypto-balance-row-text'>
                            <p>SCROOGE COIN: {OGBalance}</p>
                            <p> VALUE: ${OGValue.toLocaleString("en-US")}</p>
                          </div>
                        </div>
                        <div className='claim-pending-div'>
                          <ClaimOGPending />
                        </div>
                      </div>
                    </div>
                    <div className='crypto-balance-div'>
                      <div className='width-100'>
                        <div className='crypto-balance-header'>JR BALANCE</div>

                        <div className='crypto-balance-row-new'>
                          <div className='crypto-balance-row-img'>
                            <img
                              className='token-logo'
                              src={scroogejr}
                              alt='Scrooge Casino balances'
                            />
                          </div>
                          <div className='crypto-balance-row-text'>
                            <p>SCROOGE COIN: {JRBalance}</p>
                            <p> VALUE: ${JRValue.toLocaleString("en-US")}</p>
                          </div>
                        </div>
                        <div className='claim-pending-div'>
                          <ClaimJRPending />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className='connect-wallet-div'>
                  <ConnectWallet />
                </div>
              )}
            </div>
          ) : (
            <></>
          )}

          {userRedeemed.length > 0 && showMerchRedeemed ? (
            <div className='transaction-div'>
              <div className='close-btn-round-div wallet-close'>
                <div
                  className='close-btn-round'
                  onClick={() => setShowMerchRedeemed(false)}
                >
                  X
                </div>
              </div>
              <div className='transaction-div-title text-animate'>
                <h1> Your Merch Coupon Codes</h1>
              </div>

              <div className='transaction-card-grid'>
                {userRedeemed.map((red) => (
                  <>
                    {red.prize_details.map((deet) => (
                      <>
                        {deet.category === "Merch" ? (
                          <div
                            className={
                              red.markRedeemed
                                ? "disabled transaction-card"
                                : "transaction-card"
                            }
                            key={red._id}
                          >
                            <div key={deet._id}>
                              {deet.name}
                              <br></br>
                              <p>COUPON CODE:</p>
                              <div className='transaction-card-coupon-code'>
                                {red.coupon_code}
                              </div>
                              <br></br>
                              Received Date:{" "}
                              {red.timestamp.substring(
                                0,
                                red.timestamp.indexOf("T")
                              )}
                              <br></br>
                              <br />
                              {red.markRedeemed ? (
                                <div className='green bold'>Redeemed</div>
                              ) : (
                                <div className='new-btn'>
                                  <button
                                    // className='claim-btn'
                                    onClick={() => handleMarkRedeemed(red._id)}
                                  >
                                    Mark as Redeemed
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ))}
                  </>
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}

          {isMismatched && address ? (
            <div>
              <SwitchNetworkBSC />
            </div>
          ) : (
            <span></span>
          )}

          {!address ? (
            <div>
              <p className='description yellow'>
                Get started by connecting your wallet.
              </p>

              <div className='connect-wallet-div'>
                <ConnectWallet />
              </div>
            </div>
          ) : (
            <span></span>
          )}

          {/* {!isMismatched && address && showCasinoNFTs ? (
            <div className='bottom-margin-100'>
              <div
                className='close-btn-round-div'
                // style={{ width: "45px", marginTop: "0" }}
              >
                <div
                  className='close-btn-round'
                  onClick={() => setShowCasinoNFTs(false)}
                >
                  X
                </div>
              </div>
              <GetWalletCasinoNFTs />
            </div>
          ) : (
            <span></span>
          )} */}

          <ShowBottomNavCards />
        </main>
      </div>
    </Layout>
  );
}
