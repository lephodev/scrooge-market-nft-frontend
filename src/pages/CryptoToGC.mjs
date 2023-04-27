/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from "react";
import Layout from "./Layout.mjs";
import LoadingPoker from "../images/scroogeHatLogo.png";
import coin4 from "../images/4.png";
import coin3 from "../images/3.png";
import coin2 from "../images/2.png";
import coin1 from "../images/1.png";
import sweep from "../images/token.png";
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
import { Button, Card, Dropdown } from "react-bootstrap";
import { BUSD_ADDRESS } from "../config/keys.js";

export default function CryptoToGC() {
  const sdk = useSDK();
  const { user, setUser } = useContext(AuthContext);
  const [prizesLoading, setPrizesLoading] = useState([]);
  const [allPrizes, setAllPrizes] = useState([]);
  const [buyLoading, setBuyLoading] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState("BUSD");
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

  const convert = async (usd, gc, pid,type) => {
    setBuyLoading(true);
    if (!address) {
      setBuyLoading(false);
      return toast.error("Please Connect Your Metamask Wallet");
    }
    try {
      let contractAddresss,walletAddress, txResult,cryptoAmount;
      if(selectedDropdown === "BUSD"){
       txResult = await contract.call("transfer", [
        BUSD_ADDRESS,
        parseInt(usd),
      ]);
    } else{
     if (selectedDropdown === "Scrooge") {
      contractAddresss = process.env.REACT_APP_OGCONTRACT_ADDRESS;
      walletAddress = process.env.REACT_APP_OG_WALLET_ADDRESS;
      console.log("walletAddress",walletAddress);
    } else if (selectedDropdown === "Scrooge Jr") {
      contractAddresss = process.env.REACT_APP_JRCONTRACT_ADDRESS;
      walletAddress = process.env.REACT_APP_JR_WALLET_ADDRESS;
    }
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${contractAddresss}`
      );
      const data = await res.json();
      const current_price = data.market_data.current_price.usd;
      cryptoAmount = (parseInt(usd) + parseInt(usd) * 0.16) / current_price;
    txResult = await sdk.wallet
        .transfer(walletAddress, cryptoAmount, contractAddresss)
      }
      if (txResult.receipt) {
        const { transactionHash } = txResult?.receipt || {};
        marketPlaceInstance()
          .get(
            `convertCryptoToGoldCoin/${user?.id}/${address}/${transactionHash}/${pid}`
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
  return (
    <Layout>
      <main className="main redeem-prizes-page">
        <div className="container">
          {buyLoading ? (
            <div className="pageImgContainer">
              <img src={LoadingPoker} alt="game" className="imageAnimation" />
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
              Disclaimer : +16% will be added for Scrooge or JR payment method
              to cover blockchain fees and contract taxes!
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
                      <Dropdown.Item onClick={() => handleChange("Scrooge")}>
                        Scrooge
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleChange("BUSD")}>
                        BUSD
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleChange("Scrooge Jr")}>
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
                            : 10 < prize.priceInBUSD && prize.priceInBUSD <= 50
                            ? coin2
                            : 50 < prize.priceInBUSD && prize.priceInBUSD <= 100
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
                        Free ST: <img src={sweep} alt="sweep token" /> {prize?.freeTokenAmount}
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
      </main>
    </Layout>
  );
}
