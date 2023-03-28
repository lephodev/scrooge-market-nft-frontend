import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import LoadingPoker from "../images/scroogeHatLogo.png";
import { useAddress } from "@thirdweb-dev/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useReward } from "react-rewards";
import { useCookies } from "react-cookie";
import coin1 from "../images/4.png";
import coin2 from "../images/3.png";
import coin3 from "../images/2.png";
import coin4 from "../images/1.png";

import AuthContext from "../context/authContext.ts";
import Layout from "./Layout.mjs";
import { authInstance, marketPlaceInstance } from "../config/axios.js";
import { async } from "q";

function RedeemPrizes() {
  const { reward } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });
  let prizesReceived = 0;
  const { user, loading, setUser } = useContext(AuthContext);
  console.log("user", user, loading);
  useEffect(() => {
    getCoinGeckoDataOG();
    getCoinGeckoDataJR();
    if (prizesReceived === 0) {
      getPrizes();
    }
    prizesReceived = 1;
  }, []);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [allPrizes, setAllPrizes] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [prizesLoading, setPrizesLoading] = useState([]);
  const [currentPriceOG, setCurrentPriceOG] = useState("Loading...");
  const [currentPriceJR, setCurrentPriceJR] = useState("Loading...");
  const [showConvert, setShowConvert] = useState(false);
  const [convertPrice, setConvertPrice] = useState(0);

  const [OG1000, setOG1000] = useState();
  const [OG5000, setOG5000] = useState();
  const [OG10000, setOG10000] = useState();
  const [JR1000, setJR1000] = useState();
  const [JR5000, setJR5000] = useState();
  const [JR10000, setJR10000] = useState();
  const [cookies] = useCookies(["token"]);
  const address = useAddress();

  async function getPrizes() {
    setPrizesLoading(true);
    if (prizes.length < 2) {
      try {
        const res = await marketPlaceInstance().get(`/getPrizes`);
        console.log("res", res);
        if (res.data) {
          if (prizes.length < 2) {
            setPrizes(res.data || []);
            setPrizesLoading(false);
            setAllPrizes(res.data || []);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  const sortPrizes = (sortOn) => {
    if (sortOn === "priceAscending") {
      setPrizes([...prizes].sort((a, b) => a.price - b.price));
    } else if (sortOn === "priceDescending") {
      setPrizes([...prizes].sort((a, b) => b.price - a.price));
    } else if (sortOn === "nameDescending") {
      setPrizes([...prizes].sort((a, b) => (a.name > b.name ? 1 : -1)));
    } else if (sortOn === "nameAscending") {
      setPrizes([...prizes].sort((a, b) => (a.name > b.name ? -1 : 1)));
    } else if (sortOn === "categoryDescending") {
      setPrizes([...prizes].sort((a, b) => (a.category > b.category ? 1 : -1)));
    } else if (sortOn === "categoryAscending") {
      setPrizes([...prizes].sort((a, b) => (a.category > b.category ? -1 : 1)));
    }
  };

  const filterPrizes = (filterOn) => {
    if (allPrizes.length > 2) {
      if (filterOn === "Badges") {
        setPrizes(
          [...allPrizes].filter((prize) => prize.category === "Badges")
        );
        setShowConvert(false);
        //console.log('badges: ',prizes);
      } else if (filterOn === "Crypto") {
        setPrizes(
          [...allPrizes].filter((prize) => prize.category === "Crypto")
        );
        setShowConvert(false);
        //console.log('crypto: ',prizes);
      } else if (filterOn === "Merch") {
        setPrizes([...allPrizes].filter((prize) => prize.category === "Merch"));
        //console.log('merch: ',prizes);
      } else if (filterOn === "NFTs") {
        setPrizes([...allPrizes].filter((prize) => prize.category === "NFTs"));
        //console.log('nfts: ',prizes);
        setShowConvert(false);
      } else if (filterOn === "convert") {
        setShowConvert(true);
        setPrizes([]);
        // setPrizes([...allPrizes].filter((prize) => prize.category === "NFTs"));
        //console.log('nfts: ',prizes);
      }
    }
  };

  async function getCoinGeckoDataOG() {
    await fetch(
      `https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${process.env.REACT_APP_OGCONTRACT_ADDRESS}`
    )
      .then((response) => response.json())
      .then((data) => {
        const current_price = data.market_data.current_price.usd;
        setCurrentPriceOG(current_price);
        setOG1000((10 / current_price / 2).toFixed(0));
        setOG5000((50 / current_price / 2).toFixed(0));
        setOG10000((100 / current_price / 2).toFixed(0));
        //console.log(OG1000, OG5000, OG10000);
        return current_price;
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  }

  async function getCoinGeckoDataJR() {
    await fetch(
      "https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/0x2e9f79af51dd1bb56bbb1627fbe4cc90aa8985dd"
    )
      .then((response) => response.json())
      .then((data) => {
        const current_price = data.market_data.current_price.usd;
        setCurrentPriceJR(current_price);
        setJR1000((10 / current_price / 2).toFixed(0));
        setJR5000((50 / current_price / 2).toFixed(0));
        setJR10000((100 / current_price / 2).toFixed(0));
        //console.log(JR1000, JR5000, JR10000);
        return current_price;
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  }

  const getUserDataInstant = () => {
    console.log("abbababababbababa");
    let access_token = cookies.token;
    authInstance()
      .get("/auth/check-auth", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => {
        console.log("convertedData", res);
        if (res.data.user) {
          console.log("user", res.data);
          setUser({
            ...res.data.user,
          });
        }
      })
      .catch((err) => {
        console.log("error ", err);
      });
  };
  const RedeemPrize = async (prize_id) => {
    console.log("prize_id", prize_id);
    if (!user)
      return toast.error("Please login first", { containerId: "login" });
    if (!address)
      return toast.error("Please connect wallet first", {
        containerId: "connect-wallet",
      });
    console.log("user", user, prize_id);
    console.log("add", address);
    console.log("user.id", user.id);
    console.log("prize_id", prize_id);
    console.log("address", address);
    setRedeemLoading(true);
    marketPlaceInstance()
      .get(`/redeemPrize/${address}/${user.id}/${prize_id}`)
      .then((data) => {
        console.log("redeemdata", data);
        setRedeemLoading(false);
        if (!data.data.success) {
          toast.error("ERROR! - " + data.data.message, {
            containerId: "error",
          });
        } else {
          setRedeemSuccess(false);
          toast.success(data.data.message + " redeemed successfully!");
          getUserDataInstant();
        }
      })
      .catch((err) => {
        if (err.response.data.message) {
          toast.error(err.response.data.message, {
            containerId: "error-redeen",
          });
        }
      });
  };

  const convert = async () => {
    console.log("convertPrice", convertPrice);
    try {
      if (parseInt(convertPrice) > 0) {
        if (user?.ticket >= parseInt(convertPrice)) {
          const res = await marketPlaceInstance().get(
            `/coverttickettotoken/${convertPrice}/${user.id}`
          );
          const { message, code, data } = res.data;
          if (code === 200) {
            console.log("datattat", data);
            getUserDataInstant();
            setConvertPrice("");
            toast.success(message, { id: "A" });
          }
        } else {
          toast.error("Not sufficent tokens", { id: "A" });
        }
      } else {
        toast.error("Please enter token", { id: "A" });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // console.log("convertPrice",convertPrice);

  return (
    <Layout>
      <main className='main redeem-prizes-page'>
        <div className='container'>
          <div className='bordered-section'>
            {redeemLoading ? (
              <div className='pageImgContainer'>
                <img src={LoadingPoker} alt='game' className='imageAnimation' />
                <div className='loading-txt pulse'>REDEEMING...</div>
              </div>
            ) : (
              <></>
            )}

            {redeemSuccess ? (
              <div className='pageImgContainer'>
                <div className='loading-txt'>
                  REDEEMED SUCCESSFULLY<br></br>
                  <button
                    className='page-nav-header-btn'
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
            <div className='scrooge-main-heading'>
              <div className='pageTitle'>
                <h1 className='title'>Redeem for Prizes</h1>
              </div>
              <div className='feature-overview-div'>
                Ready to cash in on all of your big wins? Browse through our
                huge list of amazing prizes and find something you just can't
                live without. Make sure you have enough available tickets for
                the prize you want, then click the REDEEM PRIZE button!
              </div>
            </div>

            <div className='prizes-chip-count'>
              {user ? (
                <>
                  <h3>Your Ticket Balance: {user?.ticket.toFixed(2)}</h3>
                </>
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
            <div className='page-nav-header-btns-row'>
              <div className='new-btn'>
                <button
                  // className='page-nav-header-btn'
                  onClick={() => filterPrizes("Badges")}
                >
                  BADGES
                </button>
              </div>
              <div className='new-btn'>
                <button
                  // className='page-nav-header-btn'
                  onClick={() => filterPrizes("Crypto")}
                >
                  CRYPTO
                </button>
              </div>
              <div className='new-btn'>
                <button
                  // className='page-nav-header-btn'
                  onClick={() => filterPrizes("Merch")}
                >
                  MERCH
                </button>
              </div>
              <div className='new-btn'>
                <button
                  // className='page-nav-header-btn'
                  onClick={() => filterPrizes("NFTs")}
                >
                  NFTS
                </button>
              </div>
              <div className='new-btn'>
                <button onClick={() => filterPrizes("convert")}>
                  Convert ticket to token
                </button>
              </div>
            </div>
            <div className='page-nav-header-btns-subrow'>
              <button
                className='page-nav-header-subbtn'
                onClick={() => sortPrizes("priceDescending")}
              >
                PRICE HIGH TO LOW
              </button>
              <button
                className='page-nav-header-subbtn'
                onClick={() => sortPrizes("priceAscending")}
              >
                PRICE LOW TO HIGH
              </button>
              <button
                className='page-nav-header-subbtn'
                onClick={() => sortPrizes("nameDescending")}
              >
                NAME A-Z
              </button>
              <button
                className='page-nav-header-subbtn'
                onClick={() => sortPrizes("nameAscending")}
              >
                NAME Z-A
              </button>
              <button
                className='page-nav-header-subbtn'
                onClick={() => sortPrizes("categoryDescending")}
              >
                CATEGORY A-Z
              </button>
              <button
                className='page-nav-header-subbtn'
                onClick={() => sortPrizes("categoryAscending")}
              >
                CATEGORY Z-A
              </button>
            </div>

            <div className='prizes-container'>
              {showConvert && (
                <>
                  {/* <div className='redeem-btn'>
                    <input
                      type='Number'
                      placeholder=''
                      value={convertPrice}
                      onChange={(e) => {
                        setConvertPrice(e.target.value);
                      }}
                    ></input>
                    <div className='new-btn'>
                      <button
                        // className='submit-btn'
                        // className='gradient-btn'
                        onClick={() => convert()}
                      >
                        convert
                      </button>
                    </div>
                  </div> */}
                  <div className='buy-chips-content'>
                    <div className='buy-chips-grid'>
                      <div className='buy-chips-grid-box'>
                        <p>55000 </p>
                        <div className='chips-images'>
                          <img src={coin1} alt='coin' />
                          <img src={coin1} alt='coin' />
                        </div>

                        <div className='gradient-btn'>
                          <span>50000 - tickets</span>
                        </div>
                      </div>
                      <div className='buy-chips-grid-box'>
                        <p>25000 </p>
                        <div className='chips-images'>
                          <img src={coin2} alt='coin' />
                          <img src={coin2} alt='coin' />
                        </div>

                        <div className='gradient-btn'>
                          <span>27000 - tickets</span>
                        </div>
                      </div>
                      <div className='buy-chips-grid-box'>
                        <p>20000 </p>
                        <div className='chips-images'>
                          <img src={coin3} alt='coin' />
                          <img src={coin3} alt='coin' />
                        </div>

                        <div className='gradient-btn'>
                          <span>21400 - tickets</span>
                        </div>
                      </div>
                      <div className='buy-chips-grid-box'>
                        <p>10000 </p>
                        <div className='chips-images'>
                          <img src={coin4} alt='coin' />
                          <img src={coin3} alt='coin' />
                        </div>
                        <div className='gradient-btn'>
                          <span>10600 - tickets</span>
                        </div>
                      </div>
                      <div className='buy-chips-grid-box'>
                        <p>5000 </p>
                        <img src={coin1} alt='coin' />
                        <div className='gradient-btn'>
                          <span>5250 - tickets</span>
                        </div>
                      </div>
                      <div className='buy-chips-grid-box'>
                        <p>2500 </p>
                        <img src={coin2} alt='coin' />
                        <div className='gradient-btn'>
                          <span>2600 - tickets</span>
                        </div>
                      </div>
                      <div className='buy-chips-grid-box'>
                        <p>1000 </p>
                        <img src={coin3} alt='coin' />
                        <div className='gradient-btn'>
                          <span>1025 - tickets</span>
                        </div>
                      </div>
                      <div className='buy-chips-grid-box'>
                        <p>500 </p>
                        <img src={coin4} alt='coin' />
                        <div className='gradient-btn'>
                          <span>510 - tickets</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
             
              <div style={{ width: "100%", textAlign: "center" }}>
                <div id='rewardId' style={{ margin: "0 auto" }} />
              </div>
              {!prizesLoading ? (
                <>
                  <div className='prizes_container'>
                    {prizes.map((prize) => (
                      <div className='prizes-card' key={prize._id}>
                        {console.log("prize",prize._id)}
                        {!prize.isDynamic ? (
                          <div className='prize-name bold text-animate'>
                            <h4>{prize.name}</h4>
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63b74c51dd789f0383a51d3b" ? (
                          <div className='prize-name bold text-animate'>
                            <h4>
                              {" "}
                              {prize.name.replace(
                                "xxxValue",
                                parseInt(OG1000).toLocaleString("en-US")
                              )}
                            </h4>
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63b74ce7dd789f0383a51d3c" ? (
                          <div className='prize-name bold text-animate'>
                            <h4>
                              {" "}
                              {prize.name.replace(
                                "xxxValue",
                                parseInt(JR1000).toLocaleString("en-US")
                              )}
                            </h4>
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63b78b42dd789f0383a51d3d" ? (
                          <div className='prize-name bold text-animate'>
                            <h4>
                              {prize.name.replace(
                                "xxxValue",
                                parseInt(OG1000).toLocaleString("en-US")
                              )}
                            </h4>
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63b78c0edd789f0383a51d3f" ? (
                          <div className='prize-name bold text-animate'>
                            <h4>
                              {" "}
                              {prize.name.replace(
                                "xxxValue",
                                parseInt(JR1000).toLocaleString("en-US")
                              )}
                            </h4>
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedf0d1736630ad01d5f4e" ? (
                          <div className='prize-name bold text-animate'>
                            <h4>
                              {prize.name.replace(
                                "xxxValue",
                                parseInt(OG5000).toLocaleString("en-US")
                              )}
                            </h4>
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedf5a1736630ad01d5f50" ? (
                          <div className='prize-name bold text-animate'>
                            <h4>
                              {" "}
                              {prize.name.replace(
                                "xxxValue",
                                parseInt(JR5000).toLocaleString("en-US")
                              )}
                            </h4>
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedf761736630ad01d5f52" ? (
                          <div className='prize-name bold text-animate'>
                            <h4>
                              {" "}
                              {prize.name.replace(
                                "xxxValue",
                                parseInt(OG5000).toLocaleString("en-US")
                              )}
                            </h4>
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedfb61736630ad01d5f55" ? (
                          <div className='prize-name bold text-animate'>
                            <h4>
                              {prize.name.replace(
                                "xxxValue",
                                parseInt(JR5000).toLocaleString("en-US")
                              )}
                            </h4>
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedf301736630ad01d5f4f" ? (
                          <div className='prize-name bold text-animate'>
                            <h4>
                              {" "}
                              {prize.name.replace(
                                "xxxValue",
                                parseInt(OG10000).toLocaleString("en-US")
                              )}
                            </h4>
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedf651736630ad01d5f51" ? (
                          <div className='prize-name bold text-animate'>
                            <h4>
                              {" "}
                              {prize.name.replace(
                                "xxxValue",
                                parseInt(JR10000).toLocaleString("en-US")
                              )}
                            </h4>
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedf9d1736630ad01d5f54" ? (
                          <div className='prize-name bold text-animate'>
                            <h4>
                              {prize.name.replace(
                                "xxxValue",
                                parseInt(OG10000).toLocaleString("en-US")
                              )}
                            </h4>
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedfc51736630ad01d5f56" ? (
                          <div className='prize-name bold text-animate'>
                            <h4>
                              {prize.name.replace(
                                "xxxValue",
                                parseInt(JR10000).toLocaleString("en-US")
                              )}
                            </h4>
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        <img
                          className='card-img pulse'
                          src={prize.image_url}
                          alt={prize.name}
                        />
                        <br></br>
                        <div className='prize-cost'>
                          <p>Cost: {prize.price} Tickets</p>
                        </div>
                        <br></br>
                        <p>Category: {prize.category}</p>
                        <br></br>

                        {!prize.isDynamic ? (
                          <div>
                            <p>{prize.description}</p>
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63b74c51dd789f0383a51d3b" ? (
                          <div className=''>
                            {prize.description.replace(
                              "xxxValue",
                              parseInt(OG1000).toLocaleString("en-US")
                            )}
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63b74ce7dd789f0383a51d3c" ? (
                          <div className=''>
                            {prize.description.replace(
                              "xxxValue",
                              parseInt(JR1000).toLocaleString("en-US")
                            )}
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63b78b42dd789f0383a51d3d" ? (
                          <div className=''>
                            {prize.description.replace(
                              "xxxValue",
                              parseInt(OG1000).toLocaleString("en-US")
                            )}
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63b78c0edd789f0383a51d3f" ? (
                          <div className=''>
                            {prize.description.replace(
                              "xxxValue",
                              parseInt(JR1000).toLocaleString("en-US")
                            )}
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedf0d1736630ad01d5f4e" ? (
                          <div className=''>
                            {prize.description.replace(
                              "xxxValue",
                              parseInt(OG5000).toLocaleString("en-US")
                            )}
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedf5a1736630ad01d5f50" ? (
                          <div className=''>
                            {prize.description.replace(
                              "xxxValue",
                              parseInt(JR5000).toLocaleString("en-US")
                            )}
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedf761736630ad01d5f52" ? (
                          <div className=''>
                            {prize.description.replace(
                              "xxxValue",
                              parseInt(OG5000).toLocaleString("en-US")
                            )}
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedfb61736630ad01d5f55" ? (
                          <div className=''>
                            {prize.description.replace(
                              "xxxValue",
                              parseInt(JR5000).toLocaleString("en-US")
                            )}
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedf301736630ad01d5f4f" ? (
                          <div className=''>
                            {prize.description.replace(
                              "xxxValue",
                              parseInt(OG10000).toLocaleString("en-US")
                            )}
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedf651736630ad01d5f51" ? (
                          <div className=''>
                            {prize.description.replace(
                              "xxxValue",
                              parseInt(JR10000).toLocaleString("en-US")
                            )}
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedf9d1736630ad01d5f54" ? (
                          <div className=''>
                            {prize.description.replace(
                              "xxxValue",
                              parseInt(OG10000).toLocaleString("en-US")
                            )}
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize._id === "63cedfc51736630ad01d5f56" ? (
                          <div className=''>
                            {prize.description.replace(
                              "xxxValue",
                              parseInt(JR10000).toLocaleString("en-US")
                            )}
                            *
                          </div>
                        ) : (
                          <></>
                        )}
                        {prize.isDynamic ? (
                          <div className='asterisk-desc'>
                            *Amount received is calculated at time of redemption
                            and may vary from the amount displayed.
                          </div>
                        ) : (
                          <></>
                        )}
                        <br />
                        <div className='redeem-btn'>
                          <button
                            // className='submit-btn'
                            className='gradient-btn'
                            onClick={() => RedeemPrize(prize._id)}
                          >
                            REDEEM PRIZE
                          </button>
                        </div>

                        <br></br>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className='loader-img'>
                    <img
                      src={LoadingPoker}
                      alt='game'
                      className='imageAnimation'
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default RedeemPrizes;
