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
  const { user, setUser, setSpendedAmount, spendedAmount } =
    useContext(AuthContext);
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
  const { contract:  scroogeContract} = useContract(process.env.REACT_APP_OGCONTRACT_ADDRESS);
  console.log("scroogeContract",scroogeContract);
  const { contract: bnbContract} = useContract(process.env.REACT_APP_BNBCONTRACT_ADDRESS);
  const { contract: usdcContract} = useContract(process.env.REACT_APP_USDCCONTRACT_ADDRESS);
  const { contract: usdtContract} = useContract(process.env.REACT_APP_USDTCONTRACT_ADDRESS);
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
          setSpendedAmount(res.data.spended);
        }
      })
      .catch((err) => {
        console.log("error ", err);
      });
  };
  const handleClose = () => setShow(false);
// Create a new WebSocket provider connected to BSC mainnet
const provider = sdk.getProvider()

useEffect(() => {
  const getBalance = async () => {
    console.log("adre", address);
    const bal = await sdk.wallet.balance();
    console.log("bl",bal )
  }
  if(address){
   getBalance()
  }
},[address, sdk])


  // getGCPackages
  async function getGCPackages() {
    setPrizesLoading(true);
    try {
      const res = await marketPlaceInstance().get(`/getGCPackages`);
      if (res.data) {
        const sortedAsc = res.data.sort((a, b) => parseInt(a.priceInBUSD) - parseInt(b.priceInBUSD));

        setPrizesLoading(false);
        setAllPrizes(sortedAsc || []);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const convert = async (usd, gc, pid) => {
    console.log("usd, gc, pid", usd, gc, pid, address);

    if (spendedAmount.spended_today + usd > user.dailyGoldCoinSpendingLimit) {
      return toast.error("Your daily limit is exceeding");
    }

    if (
      spendedAmount.spened_this_week + usd >
      user.weeklyGoldCoinSpendingLimit
    ) {
      return toast.error("Your weekly limit is exceeding");
    }

    if (
      spendedAmount.spneded_this_month + usd >
      user.monthlyGoldCoinSpendingLimit
    ) {
      return toast.error("Your monthly limit is exceeding");
    }
    setBuyLoading(true);

    if (!address) {
      setBuyLoading(false);
      return toast.error("Please Connect Your Metamask Wallet");
    }

    try {
      let contractAddresss,
        walletAddress,
        txResult,
        cryptoAmount,
        current_price;
        let contactSDk;

        if(selectedDropdown === "BUSD"){
          contract.events.addEventListener("Transfer", (event) => {
            console.log("event busd", event.data.from, event.data.to);
              if (
              event?.data?.from?.toLowerCase() === address.toLowerCase() &&
              ((["USDC", "USDT", "BNB", "BUSD"].includes(selectedDropdown) && event.data.to.toLowerCase() === BUSD_ADDRESS.toLowerCase())
              || (selectedDropdown === "Scrooge" && event.data.to.toLowerCase() === process.env.REACT_APP_OGCONTRACT_ADDRESS.toLowerCase())
              )
            ) {
              console.log("transaction", event.transaction);
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
                    contract.events.removeEventListener("Transfer")
                  })
                  .catch((error) => {
                    setBuyLoading(false);
                    toast.error("Token Buy Failed");
                    console.log(error);
                    contract.events.removeEventListener("Transfer")
                  });
              }
            }
          });
          contactSDk = contract;
        }else if(selectedDropdown === "Scrooge"){
          
          scroogeContract.events.addEventListener("Transfer", (event) => {
            
              if (
              event?.data?.from?.toLowerCase() === address.toLowerCase() &&
              ((["USDC", "USDT", "BNB", "BUSD"].includes(selectedDropdown) && event.data.to.toLowerCase() === BUSD_ADDRESS.toLowerCase())
              || (selectedDropdown === "Scrooge" && event.data.to.toLowerCase() === process.env.REACT_APP_OGCONTRACT_ADDRESS.toLowerCase())
              )
            ) {
              console.log("transaction", event.transaction);
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
                    scroogeContract.events.removeAllListeners();
                  })
                  .catch((error) => {
                    setBuyLoading(false);
                    toast.error("Token Buy Failed");
                    console.log(error);
                    scroogeContract.events.removeAllListeners()
                  });
              }
            }
          });
        }else if(selectedDropdown === "BNB"){
          provider.on("block", async(blockNumber) => {
            // Emitted on every block change
            const block = await provider.getBlockWithTransactions(blockNumber)
            for await(const transaction of block.transactions){
               
                   
                        if (
                        transaction?.from?.toLowerCase() === address.toLowerCase() &&
                        ((["USDC", "USDT", "BNB", "BUSD"].includes(selectedDropdown) && transaction?.to?.toLowerCase() === BUSD_ADDRESS.toLowerCase()))
                      ) {
                        console.log("transaction", transaction);
                        if (transaction.hash) {
                          try{
                            const res = await marketPlaceInstance()
                            .get(`convertCryptoToGoldCoin/${address}/${transaction.hash}`)
                           
                              if (res.data.success) {
                                setUser(res?.data?.user);
                                toast.success(`Successfully Purchased ${gc} goldCoin`);
                                reward();
                                getUserDataInstant();
                              } else {
                                setBuyLoading(false);
                                toast.error("Failed to buy");
                              }
                              provider.off("block")
                            return;
                          }catch(err){
                            setBuyLoading(false);
                            toast.error("Token Buy Failed");
                            console.log(err);
                            bnbContract.events.removeAllListeners()
                            provider.off("block")
                            return;
                          }  
                  
                        }
                      }
                    
            }
            console.log("block", block)
           
          })
          // bnbContract.events.addEventListener("Transfer", (event) => {
          // console.log("eventbnb -", event, event.data,event.transaction.transactionHash)
          //     if (
          //     event?.data?.src?.toLowerCase() === address.toLowerCase() &&
          //     ((["USDC", "USDT", "BNB", "BUSD"].includes(selectedDropdown) && event.data.dst.toLowerCase() === BUSD_ADDRESS.toLowerCase())
          //     || (selectedDropdown === "Scrooge" && event.data.dst.toLowerCase() === process.env.REACT_APP_OGCONTRACT_ADDRESS.toLowerCase())
          //     )
          //   ) {
          //     console.log("transaction", event.transaction);
          //     if (event.transaction.transactionHash) {
          //       const { transactionHash } = event.transaction || {};
          //       marketPlaceInstance()
          //         .get(`convertCryptoToGoldCoin/${address}/${transactionHash}`)
          //         .then((response) => {
          //           setBuyLoading(false);
          //           if (response.data.success) {
          //             setUser(response?.data?.user);
          //             toast.success(`Successfully Purchased ${gc} goldCoin`);
          //             reward();
          //             getUserDataInstant();
          //           } else {
          //             setBuyLoading(false);
          //             toast.error("Failed to buy");
          //           }
          //           bnbContract.events.removeAllListeners()
          //         })
          //         .catch((error) => {
          //           setBuyLoading(false);
          //           toast.error("Token Buy Failed");
          //           console.log(error);
          //           bnbContract.events.removeAllListeners()
          //         });
          //     }
          //   }
          // });
        }else if(selectedDropdown === "USDT"){
          
          usdtContract.events.addEventListener("Transfer", (event) => {
           console.log("eventusdt-", event.data.from, event.data.to);
              if (
              event?.data?.from?.toLowerCase() === address.toLowerCase() &&
              ((["USDC", "USDT", "BNB", "BUSD"].includes(selectedDropdown) && event.data.to.toLowerCase() === BUSD_ADDRESS.toLowerCase())
              || (selectedDropdown === "Scrooge" && event.data.to.toLowerCase() === process.env.REACT_APP_OGCONTRACT_ADDRESS.toLowerCase())
              )
            ) {
              console.log("transaction", event.transaction);
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
                    usdtContract.events.removeAllListeners()
                  })
                  .catch((error) => {
                    setBuyLoading(false);
                    toast.error("Token Buy Failed");
                    console.log(error);
                    usdtContract.events.removeAllListeners()
                  });
              }
            }
          });
        }else if(selectedDropdown === "USDC"){
          
          usdcContract.events.addEventListener("Transfer", (event) => {
            console.log("eventusdc-", event.data.from, event.data.to);
              if (
              event?.data?.from?.toLowerCase() === address.toLowerCase() &&
              ((["USDC", "USDT", "BNB", "BUSD"].includes(selectedDropdown) && event.data.to.toLowerCase() === BUSD_ADDRESS.toLowerCase())
              || (selectedDropdown === "Scrooge" && event.data.to.toLowerCase() === process.env.REACT_APP_OGCONTRACT_ADDRESS.toLowerCase())
              )
            ) {
              console.log("transaction", event.transaction);
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
                    usdcContract.events.removeAllListeners()
                  })
                  .catch((error) => {
                    setBuyLoading(false);
                    toast.error("Token Buy Failed");
                    console.log(error);
                    usdcContract.events.removeAllListeners()
                  });
              }
            }
          });
        }
        
      if (selectedDropdown === "BUSD") {
        let amt = (usd * Math.pow(10, 18)).toString();
        console.log("BUSDamt",amt);
        setTimeout(async () => {
          try {
          txResult = await contract.call("transfer", [BUSD_ADDRESS, amt], {
            gasLimit: 1000000,
            gasPrice: ethers.utils.parseUnits("5", "gwei"),
          });
        } catch (error) {
          setBuyLoading(false);
          if(error.toString().includes("transfer amount exceeds balance" || error?.data?.message?.includes("insufficient funds"))){
            toast.error("Transfer amount exceeds balance");
          }else if(error.toString().includes("user rejected transaction")){
          toast.error("You rejected the transaction request.");
          }
          else
          toast.error("Gold Coin Buy Fail, try with increasing the gas fee");
          contract.events.removeEventListener("Transfer")
        }
        }, 3000);

        return;
      } else {
        if (selectedDropdown === "Scrooge") {
          contractAddresss = process.env.REACT_APP_OGCONTRACT_ADDRESS;
          walletAddress = process.env.REACT_APP_OG_WALLET_ADDRESS;
        }  else if (selectedDropdown === "BNB") {
          contractAddresss = process.env.REACT_APP_BNBCONTRACT_ADDRESS;
          walletAddress = BUSD_ADDRESS;
          
        } else if (selectedDropdown === "USDC") {
          contractAddresss = process.env.REACT_APP_USDCCONTRACT_ADDRESS;
          walletAddress = BUSD_ADDRESS;
        } else if (selectedDropdown === "USDT") {
          contractAddresss = process.env.REACT_APP_USDTCONTRACT_ADDRESS;
          walletAddress = BUSD_ADDRESS;
        }
        if(selectedDropdown==="Scrooge"){
          await fetch(
            `https://api.coinbrain.com/public/coin-info`,{
              method: "post",
            body:JSON.stringify({
              "56":[process.env.REACT_APP_OGCONTRACT_ADDRESS]
            })})
            .then((response) => response.json())
            .then((data) => {
              current_price = data[0].priceUsd;
            })
            .catch((e) => {
              console.log(e);
              return false;
            });
        }
        else {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${contractAddresss}`
        );
        const data = await res.json();
        current_price = data.market_data.current_price.usd;
        }
        if (["USDC", "USDT", "BNB"].includes(selectedDropdown)) {
          if (["USDC", "USDT"].includes(selectedDropdown)) {
            cryptoAmount = parseInt(usd);
          } else {
            cryptoAmount = parseInt(usd) / current_price;
          }
        } else {
          console.log("(parseInt(usd) + parseInt(usd) * 0.16) ",(current_price));
          cryptoAmount = (parseInt(usd) + (parseInt(usd) * 0.16)) / parseFloat(current_price);
          console.log("cryptoAmountcryptoAmount",cryptoAmount);
        }
        console.log(selectedDropdown, cryptoAmount,usd);
        if (selectedDropdown === "BNB") {
          txResult = await sdk.wallet.transfer(walletAddress, cryptoAmount);
        } else {
          txResult = await sdk.wallet.transfer(
            walletAddress,
            cryptoAmount,
            contractAddresss
          );
        }
      }
      // if (txResult.receipt) {
      //   const { transactionHash } = txResult?.receipt || {};
      //   marketPlaceInstance()
      //     .get(`convertCryptoToGoldCoin/${address}/${transactionHash}`)
      //     .then((response) => {
      //       setBuyLoading(false);
      //       if (response.data.success) {
      //         setUser(response?.data?.user);
      //         toast.success(`Successfully Purchased ${gc} goldCoin`);
      //         reward();
      //         getUserDataInstant();
      //       } else {
      //         setBuyLoading(false);
      //         toast.error("Failed to buy");
      //       }
      //     })
      //     .catch((error) => {
      //       setBuyLoading(false);
      //       toast.error("Token Buy Failed");
      //       console.log(error);
      //     });
      // }
    } catch (error) {
      setBuyLoading(false);
      if(error.toString().includes("transfer amount exceeds balance") || error?.data?.message.includes("insufficient funds")){
        toast.error("Transfer amount exceeds balance");
      }else if(error.toString().includes("user rejected transaction")){
      toast.error("You rejected the transaction request.");
    }
      else
      toast.error("Gold Coin Buy Fail, try with increasing the gas fee");
      console.log("errordata", error);
      bnbContract.events.removeEventListener("Transfer")
      usdtContract.events.removeEventListener("Transfer")
      usdcContract.events.removeEventListener("Transfer")
      contract.events.removeEventListener("Transfer")
      scroogeContract.events.removeEventListener("Transfer")
      provider.off("block")
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
      <main className='main redeem-prizes-page'>
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
          <div className='tab-claims'>
            <div className='container'>
              {buyLoading ? (
                <div className='pageImgContainer'>
                  <img
                    src={LoadingPoker}
                    alt='game'
                    className='imageAnimation'
                  />
                  <div className='loading-txt pulse'>PURCHASING TOKENS...</div>
                </div>
              ) : (
                <></>
              )}
              <div className='scrooge-main-heading'>
                <div className='pageTitle'>
                  <h1 className='title'>Top up your Gold Coins</h1>
                </div>
                {/* <div className="feature-overview-div"></div> */}
                <div className='asterisk-desc cryptoTotoken'>
                  Disclaimer : +16% Will be added to Scrooge payment method to cover blockchain fees and contract taxes!
                </div>
              </div>
              {isMismatched ? (
                <SwitchNetworkBSC />
              ) : address ? (
                <div className='buy-chips-content'>
                  <div className='purchase-select'>
                    <div className='purchaseSelect-Box'>
                      <h4>Purchase with</h4>
                      <Dropdown>
                        <Dropdown.Toggle variant='success' id='dropdown-basic'>
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
                          {/* <Dropdown.Item
                            onClick={() => handleChange("Scrooge Jr")}
                          >
                            Scrooge Jr
                          </Dropdown.Item> */}
                          {/* <Dropdown.Item onClick={() => handleChange("BNB")}>
                            BNB
                          </Dropdown.Item> */}
                          <Dropdown.Item onClick={() => handleChange("USDC")}>
                            USDC
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleChange("USDT")}>
                            USDT
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                  <div className='buy-chips-grid cryptoToGC'>
                    <div className='purchasemodal-cards'>
                      {allPrizes.map((prize) => (
                        <Card key={prize._id}>
                          <Card.Img
                            variant='top'
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
                              variant='primary'
                              onClick={() =>
                                convert(
                                  prize?.priceInBUSD,
                                  prize?.gcAmount,
                                  prize?._id
                                )
                              }>
                              <p>Buy </p> <span>${prize?.priceInBUSD}</span>
                            </Button>
                          </Card.Body>
                          <div className='goldPurchase-offers'>
                            Free ST: <img src={sweep} alt='sweep token' />{" "}
                            {prize?.freeTokenAmount}
                          </div>
                        </Card>
                      ))}
                    </div>
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
          </div>
        ) : (
          <div className='container'>
            <div className='buy-chips-content'>
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
              <div className='buy-chips-grid'>
                <div className='purchasemodal-cards'>
                  {ticketPrizes.map((prize) => (
                    <Card>
                      <Card.Img variant='top' src={sweep} />
                      <Card.Body>
                        <Card.Title>Token {prize?.token}</Card.Title>
                        <Card.Text>Buy Token</Card.Text>
                        <Button
                          variant='primary'
                          onClick={() =>
                            handleShow(prize.ticket, prize.token, "")
                          }>
                          <img src={ticket} alt='ticket' />
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
          <Modal.Body className='popupBody'>
            <div>Do You Want To Redeem?</div>
            <div className='popupBtn'>
              <button className='greyBtn' onClick={handleClose}>
                Cancel
              </button>
              <button
                className='yellowBtn'
                disabled={disable}
                onClick={confirmBuy}>
                Confirm
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </main>
    </Layout>
  );
}
