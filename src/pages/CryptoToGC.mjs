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
    console.log("usd, gc, pid", usd, gc, pid, address);
    setBuyLoading(true);
    if (!address) {
      setBuyLoading(false);
      return toast.error("Please Connect Your Metamask Wallet");
    }
    try {
      let contractAddresss, walletAddress, txResult, cryptoAmount, current_price;
      if (selectedDropdown === "BUSD") {
        let amt = (usd * Math.pow(10, 18)).toString();
        contract.events.addEventListener("Transfer",(event) => {
          //  console.log("event trigger", event.data.from === address, event.data.to === BUSD_ADDRESS);
          if(event.data.from.toLowerCase() === address.toLowerCase() && event.data.to.toLowerCase() === BUSD_ADDRESS.toLowerCase()){
            console.log("transaction",event.transaction)
            if (event.transaction.transactionHash) {
              const { transactionHash } = event.transaction || {};
              marketPlaceInstance()
                .get(`convertCryptoToGoldCoin/${address}/${transactionHash}`)
                .then((response) => {
                  setBuyLoading(false);
                  if (response.data.success) {
                    setUser(response?.data?.user);
                    toast.success(`Successfully Purchased ${gc} goldCoin`);
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
          }
        })
        setTimeout(async() => {
          txResult = await contract.call("transfer", [BUSD_ADDRESS, amt], {
            gasLimit: 1000000,
            gasPrice: ethers.utils.parseUnits("5", "gwei"),
          });
        },3000)
        
        return;
      } else {
        if (selectedDropdown === "Scrooge") {
          contractAddresss = process.env.REACT_APP_OGCONTRACT_ADDRESS;
          walletAddress = process.env.REACT_APP_OG_WALLET_ADDRESS;
          
        } else if (selectedDropdown === "Scrooge Jr") {
          contractAddresss = process.env.REACT_APP_JRCONTRACT_ADDRESS;
          walletAddress = process.env.REACT_APP_JR_WALLET_ADDRESS;
         
        }else if(selectedDropdown === "BNB"){
          contractAddresss = process.env.REACT_APP_BNBCONTRACT_ADDRESS;
          walletAddress = BUSD_ADDRESS;
         
        }else if(selectedDropdown === "USDC"){
          contractAddresss = process.env.REACT_APP_USDCCONTRACT_ADDRESS;
          walletAddress = BUSD_ADDRESS;
          
        }
        else if(selectedDropdown === "USDT"){
          contractAddresss = process.env.REACT_APP_USDTCONTRACT_ADDRESS;
          walletAddress = BUSD_ADDRESS;
         
        }
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${contractAddresss}`
        );
        const data = await res.json();
         current_price = data.market_data.current_price.usd;
         if(["USDC", "USDT", "BNB"].includes(selectedDropdown)){
          if(["USDC", "USDT"].includes(selectedDropdown)){
            cryptoAmount = parseInt(usd);
          }else{
            cryptoAmount = parseInt(usd)/current_price
          }
          
         }else{
          cryptoAmount = (parseInt(usd) + parseInt(usd) * 0.16) / current_price;
         }
        console.log(selectedDropdown, cryptoAmount)
        if(selectedDropdown === "BNB"){
          txResult = await sdk.wallet.transfer(
            walletAddress,
            cryptoAmount
          );
        }else{
        txResult = await sdk.wallet.transfer(
          walletAddress,
          cryptoAmount,
          contractAddresss
        );
        }
      }
      if (txResult.receipt) {
        const { transactionHash } = txResult?.receipt || {};
        marketPlaceInstance()
          .get(`convertCryptoToGoldCoin/${address}/${transactionHash}`)
          .then((response) => {
            setBuyLoading(false);
            if (response.data.success) {
              setUser(response?.data?.user);
              toast.success(`Successfully Purchased ${gc} goldCoin`);
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
      toast.error("Gold Coin Buy Fail, try with increasing the gas fee");
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
              toast.error("Not sufficient tickets", { id: "A" });
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
        {/* <div className="tab-btn">
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
        </div> */}
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
                          
                          <Dropdown.Item onClick={() => handleChange("BUSD")}>
                            BUSD
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleChange("BNB")}
                          >
                            BNB
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleChange("USDC")}
                          >
                            USDC
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleChange("USDT")}
                          >
                            USDT
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="buy-chips-grid cryptoToGC">
                    <div className="purchasemodal-cards">
                      {allPrizes.map((prize) => (
                        <Card key={prize._id}>
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
                      <Card.Img variant="top" src={sweep} />
                      <Card.Body>
                        <Card.Title>Token {prize?.token}</Card.Title>
                        <Card.Text>Buy Token</Card.Text>
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleShow(prize.ticket, prize.token, "")
                          }
                        >
                          <img src={ticket} alt="ticket" />
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
