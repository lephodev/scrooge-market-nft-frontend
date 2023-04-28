/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from "react";
import Layout from "./Layout.mjs";
import LoadingPoker from "../images/scroogeHatLogo.png";
import coin4 from "../images/4.png";
import coin3 from "../images/3.png";
import coin2 from "../images/2.png";
import coin1 from "../images/1.png";
import sweep from "../images/token.png";
import ticket from "../images/ticket.png";
import { Button, Modal, Card, Dropdown } from "react-bootstrap";
// import gold from "../images/gold.png";
import AuthContext from "../context/authContext.ts";
import { useCookies } from "react-cookie";

import {
  useAddress,
  ConnectWallet,
  useContractWrite,
  useContract,
  useNetworkMismatch,
  useSDK,
} from "@thirdweb-dev/react";
import { marketPlaceInstance, authInstance } from "../config/axios.js";
import { toast } from "react-toastify";
import { useReward } from "react-rewards";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";
import { Form } from "react-router-dom";
import { BUSD_ADDRESS } from "../config/keys.js";
import { ethers } from "ethers";

export default function CryptoToGC() {
  const sdk = useSDK();
  const { user, setUser } = useContext(AuthContext);
  const [prizesLoading, setPrizesLoading] = useState([]);
  const [allPrizes, setAllPrizes] = useState([]);
  const [buyLoading, setBuyLoading] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState("BUSD");
  const [tickets, setTickets] = useState("");
  const [show, setShow] = useState(false);
  const [ticketPrizes, setTicketPrizes] = useState([]);
  const [disable, setDisable] = useState(false);
  const [tokens, setTokens] = useState("");
  const [key, setKey] = useState("cryptoToGc");
  const isMismatched = useNetworkMismatch();
  const { reward } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });
  const [cookies] = useCookies(["token"]);
  const address = useAddress();
  const { contract } = useContract(process.env.REACT_APP_NATIVE_TOKEN_ADDRESS);
  const getUserDataInstant = () => {
    let access_token = cookies.token;
    authInstance()
      .get("/auth/check-auth", {
        headers: {
          Authorization: `Bearer ${access_token}`,
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
  const handleClose = () => setShow(false);

  // getGCPackages
  async function getGCPackages() {
    setPrizesLoading(true);
    try {
      const res = await marketPlaceInstance().get(`/getGCPackages`);
      if (res.data) {
        setPrizesLoading(false);
        setAllPrizes(res.data || []);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const convert = async (usd, gc, pid) => {
    console.log("usd, gc, pid",usd, gc, pid,address);
    setBuyLoading(true);
    if (!address) {
      setBuyLoading(false);
      return toast.error("Please Connect Your Metamask Wallet");
    }
    let tx = {};
    try {
      console.log("called");
      let contractAddresss,walletAddress,cryptoAmount;
      if(selectedDropdown === "BUSD"){
        console.log("BUSD Block");
        walletAddress = BUSD_ADDRESS;
         tx = {
          from: address,
          gasPrice: ethers.utils.parseUnits('1', 'gwei'),
          gasLimit: 1000000,
          data: ethers.utils.toUtf8Bytes(JSON.stringify({pid: pid, time: new Date() })),
          value: usd.toString(),
          to: BUSD_ADDRESS
        }
        console.log("BUSD Block End");
       
      } else{
     if (selectedDropdown === "Scrooge") {
      console.log("OG Block");
      contractAddresss = process.env.REACT_APP_OGCONTRACT_ADDRESS;
      walletAddress = process.env.REACT_APP_OG_WALLET_ADDRESS;
       tx = {
        from: address,
        gasPrice: ethers.utils.parseUnits('1', 'gwei'),
        gasLimit: 1000000,
        data: ethers.utils.toUtf8Bytes(JSON.stringify({pid: pid, time: new Date() })),
        value: usd.toString(),
        to: contractAddresss,
        chainId: 4
      }
    
  }
     else if (selectedDropdown === "Scrooge Jr") {
      console.log("JR Block");
      contractAddresss = process.env.REACT_APP_JRCONTRACT_ADDRESS;
      walletAddress = process.env.REACT_APP_JR_WALLET_ADDRESS;
       tx = {
        from: address,  
        gasPrice: ethers.utils.parseUnits('1', 'gwei'),
        gasLimit: 1000000,
        data: ethers.utils.toUtf8Bytes(JSON.stringify({pid: pid, time: new Date() })),
        value: usd.toString(),
        to: contractAddresss,
      }
    }
  console.log("contractAddresss",contractAddresss);
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${contractAddresss}`
      );
      const data = await res.json();
      console.log("data",data);
      const current_price = data.market_data.current_price.usd;
      
      cryptoAmount = (parseInt(usd) + parseInt(usd) * 0.16) / current_price;
      console.log("current_price,cryptoAmount",current_price,cryptoAmount);
      tx.value = parseInt(cryptoAmount)
    // txResult = await sdk.wallet
    //     .transfer(walletAddress, cryptoAmount, contractAddresss)
    //   }
      }
      // contract.erc20.transfer()
      // sdk.wallet.transfer()
    const txResult = await sdk.wallet.sendRawTransaction(tx)
    console.log("txResult",txResult);
      if (txResult.receipt) {
        const { transactionHash } = txResult?.receipt || {};
        marketPlaceInstance()
          .get(
            `convertCryptoToGoldCoin/${address}/${transactionHash}`
          )
          .then((response) => {
            setBuyLoading(false);
            if (response.data.success) {
              setUser(response?.data?.user);
              toast.success(`Successfully Purchased ${gc} Tokens`);
              reward();
              getUserDataInstant();
            } else {
              setBuyLoading(false);
              toast.error("Failed to buy");
            }
          })
          .catch((error) => {
            setBuyLoading(false);
            toast.error("Token Buy Failed");
            console.log(error);
          });
        }
      
    } catch (error) {
      setBuyLoading(false);
      toast.error("Gold Coin Buy Fail");
      console.log("errordata", error);
    }
  };

  useEffect(() => {
    getGCPackages();
  }, []);
  const handleChange = (value) => {
    setSelectedDropdown(value);
  };

  const handleShow = (ticket, token, prizeid) => {
    setTickets(ticket);
    setTokens(token);
    setShow(true);
  };

  async function getTicketToTokenPrizes() {
    setPrizesLoading(true);
    
      try {
        const res = await marketPlaceInstance().get(`/getTicketToToken`);
        if (res.data) {
          // console.log("res.data",res.data);
            setPrizesLoading(false);
            setTicketPrizes(res.data || []);
        }
      } catch (e) {
        console.log(e);
      }
    
  }
  useEffect(() => {
    getTicketToTokenPrizes();
  }, []);

  const confirmBuy = async () => {
    setDisable(true);
    try {
      if (tickets !== "" && tokens !== "") {
        try {
          if (parseInt(tickets) > 0) {
            if (user?.ticket >= parseInt(tickets)) {
              const res = await marketPlaceInstance().get(
                `/coverttickettotoken/${tickets}`
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
      }
    } catch (error) {
      console.log(error);
    }
    setDisable(false);
    handleClose();
  };
  return (
    <Layout>
      <main className="main redeem-prizes-page">
        <div className="tab-btn">
          <Button
            className={`${key === "cryptoToGc" ? "active-btn" : ""}`}
            onClick={() => setKey("cryptoToGc")}
          >
            {" "}
            Convert Crypto to GC
          </Button>
          <Button
            className={`${key === "ticketToToken" ? "active-btn" : ""}`}
            onClick={() => setKey("ticketToToken")}
          >
            {" "}
            Convert ticket to token
          </Button>
        </div>
        {key === "cryptoToGc" ? (
          <div className="tab-claims">
            <div className="container">
              {buyLoading ? (
                <div className="pageImgContainer">
                  <img
                    src={LoadingPoker}
                    alt="game"
                    className="imageAnimation"
                  />
                  <div className="loading-txt pulse">PURCHASING TOKENS...</div>
                </div>
              ) : (
                <></>
              )}
              <div className="scrooge-main-heading">
                <div className="pageTitle">
                  <h1 className="title">Top up your Gold Coins</h1>
                </div>
                {/* <div className="feature-overview-div"></div> */}
                <div className="asterisk-desc cryptoTotoken">
                  Disclaimer : +16% will be added for Scrooge or JR payment
                  method to cover blockchain fees and contract taxes!
                </div>
              </div>
              {isMismatched ? (
                <SwitchNetworkBSC />
              ) : address ? (
                <div className="buy-chips-content">
                  <div className="purchase-select">
                    <div className="purchaseSelect-Box">
                      <h4>Purchase with</h4>
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          {!selectedDropdown ? "BUSD" : selectedDropdown}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => handleChange("Scrooge")}
                          >
                            Scrooge
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleChange("BUSD")}>
                            BUSD
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleChange("Scrooge Jr")}
                          >
                            Scrooge Jr
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="buy-chips-grid cryptoToGC">
                    <div className="purchasemodal-cards">
                      {allPrizes.map((prize) => (
                        <Card>
                          {console.log("prize", prize)}
                          <Card.Img
                            variant="top"
                            src={
                              prize.priceInBUSD <= 10
                                ? coin1
                                : 10 < prize.priceInBUSD &&
                                  prize.priceInBUSD <= 50
                                ? coin2
                                : 50 < prize.priceInBUSD &&
                                  prize.priceInBUSD <= 100
                                ? coin3
                                : 100 < prize.priceInBUSD
                                ? coin4
                                : ""
                            }
                          />
                          <Card.Body>
                            <Card.Title>GC {prize?.gcAmount}</Card.Title>
                            {/* <Card.Text>$10</Card.Text> */}
                            <Button
                              variant="primary"
                              onClick={() =>
                                convert(
                                  prize?.priceInBUSD,
                                  prize?.gcAmount,
                                  prize?._id
                                )
                              }
                            >
                              <p>Buy </p> <span>${prize?.priceInBUSD}</span>
                            </Button>
                          </Card.Body>
                          <div className="goldPurchase-offers">
                            Free ST: <img src={sweep} alt="sweep token" />{" "}
                            {prize?.freeTokenAmount}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="description yellow">
                    Get started by connecting your wallet.
                  </p>
                  <div className="connect-wallet-div">
                    <ConnectWallet />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="buy-chips-content">
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
        )}

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
      </main>
    </Layout>
  );
}
