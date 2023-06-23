/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import LoadingPoker from "../images/scroogeHatLogo.png";
import { useAddress } from "@thirdweb-dev/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useReward } from "react-rewards";
import { useCookies } from "react-cookie";
// import coin1 from "../images/4.png";
// import coin2 from "../images/3.png";
// import coin3 from "../images/2.png";
// import coin4 from "../images/1.png";
import sweep from "../images/token.png";
import ticket  from "../images/ticket.png";
// import InputRange from "react-input-range";
import { userKycDetails } from "../utils/api.mjs";
import AuthContext from "../context/authContext.ts";
import Layout from "./Layout.mjs";
import { authInstance, marketPlaceInstance } from "../config/axios.js";
import { Button, Card, Modal } from "react-bootstrap";
import axios from "axios";
function RedeemPrizes() {
  const navigate = useNavigate();
  const { reward } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });
  let prizesReceived = 0;
  const { user, loading, setUser } = useContext(AuthContext);
  console.log(loading);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [allPrizes, setAllPrizes] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [ticketPrizes, setTicketPrizes] = useState([]);
  const [disable, setDisable] = useState(false);
  const [prizesLoading, setPrizesLoading] = useState([]);
  const [currentPriceOG, setCurrentPriceOG] = useState("Loading...");
  const [currentPriceJR, setCurrentPriceJR] = useState("Loading...");
  const [showConvert, setShowConvert] = useState(false);
  const [globalLoader, setglobalLoader] = useState(true);
  const [buyTokenTab, setBuyTokenTab] = useState(false);
  const [show, setShow] = useState(false);
  // const [sliderValue /* setSliderValue */] = useState(499);
  const [tickets, setTickets] = useState("");
  const [tokens, setTokens] = useState("");
  const [prizeId, setPrizeId] = useState("");
  const [OG1000, setOG1000] = useState();
  const [OG5000, setOG5000] = useState();
  const [OG10000, setOG10000] = useState();
  const [OG20000, setOG20000] = useState();
  const [JR1000, setJR1000] = useState();
  const [JR5000, setJR5000] = useState();
  const [JR10000, setJR10000] = useState();
  const [JR20000, setJR20000] = useState();
  const [cookies] = useCookies(["token"]);
  const address = useAddress();

  const handleClose = () => setShow(false);
  const handleShow = (ticket, token, prizeid) => {
    setTickets(ticket);
    setTokens(token);
    setPrizeId(prizeid);
    setShow(true);
  };

  const confirmBuy = async () => {
    setDisable(true);
    try {
      if (tickets !== "" && tokens !== "") {
        await convert(tickets, tokens);
      }
      if (prizeId !== "") {
        await confirmRedeem(prizeId);
      }
    } catch (error) {
      console.log(error);
    }
    setDisable(false);
    handleClose();
  };


  const confirmRedeem=(prize_id)=>{
    try {
    if (!user)
    return toast.error("Please login first", { containerId: "login" });
  if (!address)
    return toast.error("Please connect wallet first", {
      containerId: "connect-wallet",
    });
    setglobalLoader(true)
        marketPlaceInstance()
      .get(`/WithdrawRequest/${address}/${prize_id}`)
      .then((data) => {
        console.log("redeemdata", data);
        if (!data.data.success) {
          toast.error("ERROR! - " + data.data.message, {
            containerId: "error",
          });
          setglobalLoader(false)
        } else {
          toast.success(data?.data?.message);
          setglobalLoader(false)
          getUserDataInstant();
        }
      })
  } catch (error) {
      console.log("errrr",error);
  }
  }

  async function getTicketToTokenPrizes() {
    setPrizesLoading(true);
    if (prizes.length < 2) {
      try {
        const res = await marketPlaceInstance().get(`/getTicketToToken`);
        if (res.data) {
          if (prizes.length < 2) {
            setPrizesLoading(false);
            setTicketPrizes(res.data || []);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

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

  async function startFetching() {
    getCoinGeckoDataOG();
    // getCoinGeckoDataJR();
    if (prizesReceived === 0) {
      getTicketToTokenPrizes();
      getPrizes();
    }
    prizesReceived = 1;
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
        setBuyTokenTab(false);
        setPrizes([]);
        // setPrizes([...allPrizes].filter((prize) => prize.category === "NFTs"));
        //console.log('nfts: ',prizes);
      } else if (filterOn === "buy_token") {
        setBuyTokenTab(true);
        setShowConvert(false);
        setPrizes([]);
        // setPrizes([...allPrizes].filter((prize) => prize.category === "NFTs"));
        //console.log('nfts: ',prizes);
      }
    }
  };
  async function getCoinGeckoDataOG() {
    await axios.post('https://api.coinbrain.com/public/coin-info', {
        "56":[process.env.REACT_APP_OGCONTRACT_ADDRESS]
    })
    .then((response) => {
      console.log("abc",response);

      const current_price = response.data[0].priceUsd;
      console.log("current_price",current_price);
      console.log("(10 / current_price / 2).toFixed(0)",(10 / current_price / 2).toFixed(0));
      setCurrentPriceOG(current_price);
      setOG1000((10 / current_price / 2).toFixed(0));
      setOG5000((40 / current_price / 2).toFixed(0));
      setOG10000((100 / current_price / 2).toFixed(0));
      setOG20000((200 / current_price / 2).toFixed(0));
      //console.log(OG1000, OG5000, OG10000);
      return current_price;
    }, (error) => {
      console.log(error);
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
        setJR5000((40 / current_price / 2).toFixed(0));
        setJR10000((100 / current_price / 2).toFixed(0));
        setJR20000((200 / current_price / 2).toFixed(0));
        //console.log(JR1000, JR5000, JR10000);
        return current_price;
      })
      .catch((e) => {
        // console.log(e);
        return false;
      });
  }
  console.log(getCoinGeckoDataJR());

  const getUserDataInstant = () => {
    let access_token = cookies.token;
    authInstance()
      .get("/auth/check-auth", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Permissions-Policy": "geolocation=*",

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
  // const RedeemPrize = async (prize_id) => {
  //   // console.log("prize_id", prize_id);
  //   if (!user)
  //     return toast.error("Please login first", { containerId: "login" });
  //   if (!address)
  //     return toast.error("Please connect wallet first", {
  //       containerId: "connect-wallet",
  //     });
  //   // console.log("user", user, prize_id);
  //   // console.log("add", address);
  //   // console.log("user.id", user.id);
  //   // console.log("prize_id", prize_id);
  //   // console.log("address", address);
  //   setRedeemLoading(true);
  //   marketPlaceInstance()
  //     .get(`/redeemPrize/${address}/${user.id}/${prize_id}`)
  //     .then((data) => {
  //       setPrizeId("");
  //       // console.log("redeemdata", data);
  //       setRedeemLoading(false);
  //       if (!data.data.success) {
  //         toast.error("ERROR! - " + data.data.message, {
  //           containerId: "error",
  //         });
  //       } else {
  //         setRedeemSuccess(false);
  //         toast.success(data.data.message + " redeemed successfully!");
  //         getUserDataInstant();
  //       }
  //     })
  //     .catch((err) => {
  //       if (err.response.data.message) {
  //         toast.error(err.response.data.message, {
  //           containerId: "error-redeen",
  //         });
  //       }
  //     });
  // };

  const convert = async (ticketPrice, tokenPrice) => {
    // console.log("convertPrice", ticketPrice, tokenPrice);
    try {
      if (parseInt(ticketPrice) > 0) {
        if (user?.ticket >= parseInt(ticketPrice)) {
          const res = await marketPlaceInstance().get(
            `/coverttickettotoken/${ticketPrice}/${tokenPrice}/${user.id}`
          );
          const { message, code, data } = res.data;
          setTickets("");
          setTokens("");
          if (code === 200) {
            console.log("datattat", data);
            getUserDataInstant();
            toast.success(message, { id: "A" });
          } else {
            toast.error(message, { id: "A" });
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

  useEffect(() => {
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
  // console.log("convertPrice",convertPrice);
  // getTiketToTokenPackages
  // async function getTicketToTokenPackages() {
  //   try {
  //     const res = await marketPlaceInstance().get(`/getTicketToTokenPackages`);
  //     if (res.data) {
  //       // setAllPrizes(res.data || []);
  //       setCryptoToToken(res.data || []);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // useEffect(() => {
  //   getTicketToTokenPackages();
  // }, []);

  return (
    <Layout>
      <main className="main redeem-prizes-page">
        <div className="container">
          <Modal show={show} onHide={handleClose} centered animation={false}>
            <Modal.Body className="popupBody">
              <div>Do You Want To Redeem?</div>
              <div className="popupBtn">
                <button className="greyBtn" onClick={handleClose}>
                  Cancel
                </button>
                <button
                  className="yellowBtn"
                  disabled={disable}
                  onClick={confirmBuy}
                >
                  Confirm
                </button>
              </div>
            </Modal.Body>
          </Modal>
          {/* {show && (
            <div className='convertChips'>
             
            </div>
          )} */}
          {globalLoader && (
            <div className="loading">
              <div className="loading-img-div">
                <img src={LoadingPoker} alt="game" className="imageAnimation" />
              </div>
            </div>
          )}
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
                    <h1 className="title">Redeem for Prizes</h1>
                  </div>
                  <div className="feature-overview-div">
                    Ready to cash in on all of your big wins? Browse through our
                    huge list of amazing prizes and find something you just
                    can't live without. Make sure you have enough available
                    tickets for the prize you want, then click the REDEEM PRIZE
                    button!
                  </div>
                </div>

                <div className="prizes-chip-count">
                  {user ? (
                    <>
                      <h3>Your Ticket Balance: {user?.ticket.toFixed(2)}</h3>
                    </>
                  ) : (
                    <>
                      <img
                        src={LoadingPoker}
                        alt="game"
                        className="imageAnimation"
                      />
                    </>
                  )}
                </div>
                <div className="page-nav-header-btns-row">
                  {/* <div className='new-btn'>
                    <button
                      // className='page-nav-header-btn'
                      onClick={() => filterPrizes("Badges")}>
                      BADGES
                    </button>
                  </div> */}
                  <div className="new-btn">
                    <button
                      // className='page-nav-header-btn'
                      onClick={() => filterPrizes("Crypto")}
                    >
                      CRYPTO
                    </button>
                  </div>
                  {/* <div className='new-btn'>
                    <button
                      // className='page-nav-header-btn'
                      onClick={() => filterPrizes("Merch")}>
                      MERCH
                    </button>
                  </div> */}
                  <div className="new-btn">
                    <button
                      // className='page-nav-header-btn'
                      onClick={() => filterPrizes("NFTs")}
                    >
                      NFTS
                    </button>
                  </div>
                  {/* <div className="new-btn">
                    <button onClick={() => filterPrizes("convert")}>
                      Convert ticket to token
                    </button>
                  </div> */}
                  {/* <div className='new-btn'>
                    <button onClick={() => filterPrizes("buy_token")}>
                      Buy Tokens
                    </button>
                  </div> */}
                </div>

                {buyTokenTab && (
                  <div className="buyTokenTab">
                    <h2>Buy Tokens Here .. </h2>
                    <Button className="buyTokensBtn">Buy Tokens</Button>
                  </div>
                )}

                {!showConvert && (
                  <div className="page-nav-header-btns-subrow">
                    <button
                      className="page-nav-header-subbtn"
                      onClick={() => sortPrizes("priceDescending")}
                    >
                      PRICE HIGH TO LOW
                    </button>
                    <button
                      className="page-nav-header-subbtn"
                      onClick={() => sortPrizes("priceAscending")}
                    >
                      PRICE LOW TO HIGH
                    </button>
                    <button
                      className="page-nav-header-subbtn"
                      onClick={() => sortPrizes("nameDescending")}
                    >
                      NAME A-Z
                    </button>
                    <button
                      className="page-nav-header-subbtn"
                      onClick={() => sortPrizes("nameAscending")}
                    >
                      NAME Z-A
                    </button>
                    <button
                      className="page-nav-header-subbtn"
                      onClick={() => sortPrizes("categoryDescending")}
                    >
                      CATEGORY A-Z
                    </button>
                    <button
                      className="page-nav-header-subbtn"
                      onClick={() => sortPrizes("categoryAscending")}
                    >
                      CATEGORY Z-A
                    </button>
                  </div>
                )}
                <div className="prizes-container">
                  {showConvert && (
                    <>
                      
                      <div className="buy-chips-content">
                        <div className="buy-chips-grid cryptoTotoken">
                          {/* <div className='buy-chips-grid-box'>
                            <img src={coin4} alt='coin' />

                            <InputRange
                              maxValue={499}
                              minValue={10}
                              value={sliderValue}
                              onChange={(value) => setSliderValue(value)}
                            />
                            <div
                              className='gradient-btn'
                              //  onClick={() => convert(500, 510)}
                              onClick={() =>
                                handleShow(sliderValue, sliderValue, "")
                              }>
                              <span>
                                {sliderValue} tickets gets you {sliderValue}{" "}
                                tokens{" "}
                              </span>
                            </div>
                          </div> */}

                          <div className="buy-chips-grid">
                            <div className="purchasemodal-cards">
                              {ticketPrizes.map((prize) => (
                                <Card>
                                  <Card.Img
                                    variant="top"
                                    src={sweep}
                                  />
                                  <Card.Body>
                                    <Card.Title>
                                      Token {prize?.token}
                                    </Card.Title>
                                    <Card.Text>Buy Ticket</Card.Text>
                                    <Button
                                      variant="primary"
                                      onClick={() =>
                                        handleShow(prize.ticket, prize.token, "")
                                      }
                                    >
                                      <img src={ticket} alt="ticket"/>
                                      <h5>{prize?.ticket}</h5>
                                    </Button>
                                  </Card.Body>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div style={{ width: "100%", textAlign: "center" }}>
                    <div id="rewardId" style={{ margin: "0 auto" }} />
                  </div>
                  {!prizesLoading ? (
                    <>
                      <div className="prizes_container">
                      {/* <div className="prizes-card">
                  <div className="prize-name bold text-animate">
                                  <h4>Under token migeration</h4>
                                </div>
                               <img className="card-img pulse" src={"https://casino-nft-marketplace.s3.amazonaws.com/scroogeJRAvatar.png"} alt="JR" />
                               <img className="card-img pulse" src="https://casino-nft-marketplace.s3.amazonaws.com/scroogeHatPrize.png" alt="OG" />
                                <div>
                                  <p>We are migrating OG and JR into one token, Crypto redeem will be back soon</p>
                                  <p>We are sorry for inconvenience</p>
                                </div>
                  </div> */}
                        {prizes
                          .filter(
                            (f) =>
                              f.redeem_action !== "burn" &&
                              f.category !== "Merch" &&
                              f.category !== "Badges" &&
                              f.price !== 500 && f.contract_name !== "JR"
                          )
                          .map((prize) => (
                            <div className="prizes-card" key={prize._id}>
                              {/* {console.log("prize", prize._id)} */}
                              {!prize.isDynamic ? (
                                <div className="prize-name bold text-animate">
                                  <h4>{prize.name}</h4>
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "63b74c51dd789f0383a51d3b" ? (
                                <div className="prize-name bold text-animate">
                                  <h4>
                                    {" "}
                                    
                                    {prize.name.replace(
                                      "xxxValue",
                                      parseInt(OG1000).toLocaleString("en-US")
                                    )}
                                  </h4>
                                  *
                                  <h4>
                                    {(
                                      parseInt(OG1000) * currentPriceOG
                                    ).toLocaleString("en-US")}
                                    $ In Value
                                  </h4>{" "}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "63b74ce7dd789f0383a51d3c" ? (
                                <div className="prize-name bold text-animate">
                                  <h4>
                                    {" "}
                                    {prize.name.replace(
                                      "xxxValue",
                                      parseInt(JR1000).toLocaleString("en-US")
                                    )}
                                  </h4>
                                  *
                                  <h4>
                                    {(
                                      parseInt(JR1000) * currentPriceJR
                                    ).toLocaleString("en-US")}
                                    $ In Value
                                  </h4>{" "}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "63b78b42dd789f0383a51d3d" ? (
                                <div className="prize-name bold text-animate">
                                  <h4>
                                    {prize.name.replace(
                                      "xxxValue",
                                      parseInt(OG1000).toLocaleString("en-US")
                                    )}
                                  </h4>
                                  *
                                  <h4>
                                    {(
                                      parseInt(OG1000) * currentPriceOG
                                    ).toLocaleString("en-US")}
                                    $ In Value
                                  </h4>{" "}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "63b78c0edd789f0383a51d3f" ? (
                                <div className="prize-name bold text-animate">
                                  <h4>
                                    {" "}
                                    {prize.name.replace(
                                      "xxxValue",
                                      parseInt(JR1000).toLocaleString("en-US")
                                    )}
                                  </h4>
                                  *
                                  <h4>
                                    {(
                                      parseInt(JR1000) * currentPriceJR
                                    ).toLocaleString("en-US")}
                                    $ In Value
                                  </h4>{" "}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "63cedf0d1736630ad01d5f4e" ? (
                                <div className="prize-name bold text-animate">
                                  <h4>
                                    {prize.name.replace(
                                      "xxxValue",
                                      parseInt(OG5000).toLocaleString("en-US")
                                    )}
                                  </h4>
                                  *
                                  <h4>
                                    {(
                                      parseInt(OG5000) * currentPriceOG
                                    ).toLocaleString("en-US")}
                                    $ In Value
                                  </h4>{" "}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "63cedf5a1736630ad01d5f50" ? (
                                <div className="prize-name bold text-animate">
                                  <h4>
                                    {" "}
                                    {prize.name.replace(
                                      "xxxValue",
                                      parseInt(JR5000).toLocaleString("en-US")
                                    )}
                                  </h4>
                                  *
                                  <h4>
                                    {(
                                      parseInt(JR5000) * currentPriceJR
                                    ).toLocaleString("en-US")}
                                    $ In Value
                                  </h4>{" "}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "63cedf761736630ad01d5f52" ? (
                                <div className="prize-name bold text-animate">
                                  <h4>
                                    {" "}
                                    {prize.name.replace(
                                      "xxxValue",
                                      parseInt(OG5000).toLocaleString("en-US")
                                    )}
                                  </h4>
                                  *
                                  <h4>
                                    {(
                                      parseInt(OG5000) * currentPriceOG
                                    ).toLocaleString("en-US")}
                                    $ In Value
                                  </h4>{" "}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "63cedfb61736630ad01d5f55" ? (
                                <div className="prize-name bold text-animate">
                                  <h4>
                                    {prize.name.replace(
                                      "xxxValue",
                                      parseInt(JR5000).toLocaleString("en-US")
                                    )}
                                  </h4>
                                  *
                                  <h4>
                                    {(
                                      parseInt(JR5000) * currentPriceJR
                                    ).toLocaleString("en-US")}
                                    $ In Value
                                  </h4>{" "}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "63cedf301736630ad01d5f4f" ? (
                                <div className="prize-name bold text-animate">
                                  <h4>
                                    {" "}
                                    {prize.name.replace(
                                      "xxxValue",
                                      parseInt(OG10000).toLocaleString("en-US")
                                    )}
                                  </h4>
                                  *
                                  <h4>
                                    {(
                                      parseInt(OG10000) * currentPriceOG
                                    ).toLocaleString("en-US")}
                                    $ In Value
                                  </h4>{" "}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "63cedf651736630ad01d5f51" ? (
                                <div className="prize-name bold text-animate">
                                  <h4>
                                    {" "}
                                    {prize.name.replace(
                                      "xxxValue",
                                      parseInt(JR10000).toLocaleString("en-US")
                                    )}
                                  </h4>
                                  *
                                  <h4>
                                    {(
                                      parseInt(JR10000) * currentPriceJR
                                    ).toLocaleString("en-US")}
                                    $ In Value
                                  </h4>{" "}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "63cedf9d1736630ad01d5f54" ? (
                                <div className="prize-name bold text-animate">
                                  <h4>
                                    {prize.name.replace(
                                      "xxxValue",
                                      parseInt(OG10000).toLocaleString("en-US")
                                    )}
                                  </h4>
                                  *
                                  <h4>
                                    {(
                                      parseInt(OG10000) * currentPriceOG
                                    ).toLocaleString("en-US")}
                                    $ In Value
                                  </h4>{" "}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "63cedfc51736630ad01d5f56" ? (
                                <div className="prize-name bold text-animate">
                                  <h4>
                                    {prize.name.replace(
                                      "xxxValue",
                                      parseInt(JR10000).toLocaleString("en-US")
                                    )}
                                  </h4>
                                  *
                                  <h4>
                                    {(
                                      parseInt(JR10000) * currentPriceJR
                                    ).toLocaleString("en-US")}
                                    $ In Value
                                  </h4>{" "}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "6434f2f5f6bfb431f290a691" ? (
                                <div className="prize-name bold text-animate">
                                  <h4>
                                    {" "}
                                    {prize.name.replace(
                                      "xxxValue",
                                      parseInt(OG20000).toLocaleString("en-US")
                                    )}
                                  </h4>
                                  *
                                  <h4>
                                    {(
                                      parseInt(OG20000) * currentPriceOG
                                    ).toLocaleString("en-US")}
                                    $ In Value
                                  </h4>{" "}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "6434f46cf6bfb431f290a692" ? (
                                <div className="prize-name bold text-animate">
                                  <h4>
                                    {" "}
                                    {prize.name.replace(
                                      "xxxValue",
                                      parseInt(JR20000).toLocaleString("en-US")
                                    )}
                                  </h4>
                                  *
                                  <h4>
                                    {(
                                      parseInt(JR20000) * currentPriceJR
                                    ).toLocaleString("en-US")}
                                    $ In Value
                                  </h4>{" "}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              <img
                                className="card-img pulse"
                                src={prize.image_url}
                                alt={prize.name}
                              />
                              <br></br>
                              <div className="prize-cost">
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
                                <div className="">
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
                                <div className="">
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
                                <div className="">
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
                                <div className="">
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
                                <div className="">
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
                                <div className="">
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
                                <div className="">
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
                                <div className="">
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
                                <div className="">
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
                                <div className="">
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
                                <div className="">
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
                                <div className="">
                                  {prize.description.replace(
                                    "xxxValue",
                                    parseInt(JR10000).toLocaleString("en-US")
                                  )}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "6434f2f5f6bfb431f290a691" ? (
                                <div className="">
                                  {prize.description.replace(
                                    "xxxValue",
                                    parseInt(OG20000).toLocaleString("en-US")
                                  )}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize._id === "6434f46cf6bfb431f290a692" ? (
                                <div className="">
                                  {prize.description.replace(
                                    "xxxValue",
                                    parseInt(JR20000).toLocaleString("en-US")
                                  )}
                                  *
                                </div>
                              ) : (
                                <></>
                              )}
                              {prize.isDynamic ? (
                                <div className="asterisk-desc">
                                  *Amount received is calculated at time of
                                  redemption and may vary from the amount
                                  displayed.<br></br>
                                  *Value received on each item will be 1% less
                                  to cover Blockchain Fees.
                                </div>
                              ) : (
                                <></>
                              )}
                              <br />
                              <div className="redeem-btn">
                                <button
                                  // className='submit-btn'
                                  className="gradient-btn"
                                  onClick={() => handleShow("", "", prize._id)}
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
                      <div className="loader-img">
                        <img
                          src={LoadingPoker}
                          alt="game"
                          className="imageAnimation"
                        />
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default RedeemPrizes;
