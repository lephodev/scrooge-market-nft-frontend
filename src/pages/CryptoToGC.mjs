/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect } from "react";
import { AcceptHosted } from "react-acceptjs";
import { Button, Form, Card, Dropdown, Spinner } from "react-bootstrap";
import Layout from "./Layout.mjs";
import { Helmet } from "react-helmet";

import LoadingPoker from "../images/scroogeHatLogo.png";
import coin4 from "../images/4.png";
import coin3 from "../images/3.png";
import coin2 from "../images/2.png";
import coin1 from "../images/1.png";
import sweep from "../images/token.png";
import { useSearchParams } from "react-router-dom";
import AuthContext from "../context/authContext.ts";
import { useCookies } from "react-cookie";

import {
  useAddress,
  useContract,
  useNetworkMismatch,
  useSDK,
} from "@thirdweb-dev/react";
import { marketPlaceInstance, authInstance } from "../config/axios.js";
import { toast } from "react-toastify";
import { useReward } from "react-rewards";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";
import { BUSD_ADDRESS } from "../config/keys.js";
import { ethers } from "ethers";
import axios from "axios";
import AuthorizeSucessModel from "./models/authrizeSucessModel.mjs";
let promoCode;
let goldcoinAmount;

export default function CryptoToGC() {
  const sdk = useSDK();
  const { user, setUser, setSpendedAmount, spendedAmount } =
    useContext(AuthContext);
  const [prizesLoading, setPrizesLoading] = useState(true);
  const [allPrizes, setAllPrizes] = useState([]);
  const [buyLoading, setBuyLoading] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState("Scrooge");
  const [selectedTypeDropdown, setSelectedTypeDropdown] =
    useState("Credit Card");
  const [promocode, setPromoCode] = useState("");
  const [promoLoader, setPromoLoader] = useState(false);
  const [promoDetails, setPromoDetails] = useState({});
  const [key] = useState("cryptoToGc");
  const isMismatched = useNetworkMismatch();
  const [errors, setErrors] = useState("");
  const [dailyGCPurchaseLimit, setDailyGCPurchaseLimit] = useState(0);
  const [isMegaBuyShow, setIsMegaBuyShow] = useState(true);

  const { reward } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });
  const [cookies] = useCookies(["token"]);
  const address = useAddress();
  const { contract } = useContract(process.env.REACT_APP_NATIVE_TOKEN_ADDRESS);
  const { contract: scroogeContract } = useContract(
    process.env.REACT_APP_OGCONTRACT_ADDRESS
  );
  const { contract: bnbContract } = useContract(
    process.env.REACT_APP_BNBCONTRACT_ADDRESS
  );
  const { contract: usdcContract } = useContract(
    process.env.REACT_APP_USDCCONTRACT_ADDRESS
  );
  const { contract: usdtContract } = useContract(
    process.env.REACT_APP_USDTCONTRACT_ADDRESS
  );

  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("");

  useEffect(() => {
    const params = searchParams.get("status");
    if (params) {
      if (params === "success") {
        setStatus("inprogress");
      }

      setTimeout(() => {
        setStatus(params);
      }, 20000);
    }
  }, [searchParams]);
  const getUserDataInstant = async () => {
    let access_token = cookies.token;
    (await authInstance())
      .get("/auth", {
        // headers: {
        //   Authorization: `Bearer ${access_token}`,
        //   "Permissions-Policy": "geolocation=*",
        // },
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

  const handlePromoReject = () => {
    setPromoDetails({});
    setPromoCode("");
    promoCode = "";
    goldcoinAmount = "";
  };
  // Create a new WebSocket provider connected to BSC mainnet
  const provider = sdk.getProvider();

  // getGCPackages
  async function getGCPackages() {
    setPrizesLoading(true);
    try {
      const res = await (await marketPlaceInstance()).get(`/getGCPackages`);
      if (res.data) {
        const sortedAsc = res.data.sort(
          (a, b) => parseInt(a.priceInBUSD) - parseInt(b.priceInBUSD)
        );

        setPrizesLoading(false);
        setAllPrizes(sortedAsc || []);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function getGCPurcahseLimitPerDay() {
    try {
      const res = await (
        await marketPlaceInstance()
      ).get(`/getGCPurcahseLimitPerDay`);
      const { findTransactionIfExist } = res?.data;

      setDailyGCPurchaseLimit(findTransactionIfExist);
    } catch (e) {
      console.log(e);
    }
  }

  async function getMegaBuyPurcahseLimitPerDay() {
    try {
      const res = await (
        await marketPlaceInstance()
      ).get(`/getMegaBuyPurcahseLimitPerDay`);
      console.log("resres----", res);
      const { code, toShowBuyMega } = res.data;
      if (code === 200) {
        setIsMegaBuyShow(toShowBuyMega);
      }

      // const { findTransactionIfExist } = res?.data;
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getGCPackages();
    getGCPurcahseLimitPerDay();
    getMegaBuyPurcahseLimitPerDay();
  }, []);

  const convert = async (usd, gc) => {
    console.log("usd", usd);
    if (user?.isBlockWallet) {
      return toast.error(`Your wallet blocked by admin`, { toastId: "A" });
    }
    goldcoinAmount = gc;
    if (
      spendedAmount.spended_today + parseFloat(usd) >
      user.dailyGoldCoinSpendingLimit
    ) {
      console.log();
      return toast.error(
        "Your daily limits are exceeded, visit your profile under spending limits to set your desired controls.",
        { toastId: "A" }
      );
    }

    if (
      spendedAmount.spened_this_week + parseFloat(usd) >
      user.weeklyGoldCoinSpendingLimit
    ) {
      return toast.error(
        "Your weekly limits are exceeded, visit your profile under spending limits to set your desired controls.",
        { toastId: "B" }
      );
    }

    if (
      spendedAmount.spneded_this_month + parseFloat(usd) >
      user.monthlyGoldCoinSpendingLimit
    ) {
      return toast.error(
        "Your monthly limits are exceeded, visit your profile under spending limits to set your desired controls.",
        { toastId: "C" }
      );
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

      if (selectedDropdown === "BUSD") {
        contract.events.addEventListener("Transfer", async (event) => {
          if (
            event?.data?.from?.toLowerCase() === address.toLowerCase() &&
            ((["USDC", "USDT", "BNB", "BUSD"].includes(selectedDropdown) &&
              event.data.to.toLowerCase() === BUSD_ADDRESS.toLowerCase()) ||
              (selectedDropdown === "Scrooge" &&
                event.data.to.toLowerCase() ===
                  process.env.REACT_APP_OGCONTRACT_ADDRESS.toLowerCase()))
          ) {
            if (event.transaction.transactionHash) {
              const { transactionHash } = event.transaction || {};
              await (
                await marketPlaceInstance()
              )
                .get(`convertCryptoToGoldCoin/${address}/${transactionHash}`, {
                  params: { promoCode, usd },
                })
                .then((response) => {
                  setBuyLoading(false);
                  if (response.data.success) {
                    setUser(response?.data?.user);
                    toast.success(
                      `Successfully Purchased ${goldcoinAmount} goldCoin`,
                      { toastId: "A" }
                    );

                    getGCPackages();
                    handlePromoReject();
                    reward();
                    getUserDataInstant();
                  } else {
                    getGCPackages();
                    setBuyLoading(false);
                    toast.error("Failed to buy", { toastId: "B" });
                    setPromoCode("");
                    setPromoDetails({});
                  }
                  contract.events.removeEventListener("Transfer");
                })
                .catch((error) => {
                  getGCPackages();
                  setBuyLoading(false);
                  toast.error("Token Buy Failed", { toastId: "C" });
                  promoCode = "";
                  goldcoinAmount = "";
                  setPromoCode("");
                  setPromoDetails({});

                  console.log(error);
                  contract.events.removeEventListener("Transfer");
                });
            }
          }
        });
      } else if (selectedDropdown === "Scrooge") {
        scroogeContract.events.addEventListener("Transfer", async (event) => {
          if (
            event?.data?.from?.toLowerCase() === address.toLowerCase() &&
            ((["USDC", "USDT", "BNB", "BUSD"].includes(selectedDropdown) &&
              event.data.to.toLowerCase() === BUSD_ADDRESS.toLowerCase()) ||
              (selectedDropdown === "Scrooge" &&
                event.data.to.toLowerCase() ===
                  process.env.REACT_APP_OG_WALLET_ADDRESS.toLowerCase()))
          ) {
            if (event.transaction.transactionHash) {
              const { transactionHash } = event.transaction || {};
              (await marketPlaceInstance())
                .get(`convertCryptoToGoldCoin/${address}/${transactionHash}`, {
                  params: { promoCode, usd },
                })
                .then((response) => {
                  setBuyLoading(false);
                  if (response.data.success) {
                    setUser(response?.data?.user);
                    toast.success(
                      `Successfully Purchased ${goldcoinAmount} goldCoin`,
                      { toastId: "A" }
                    );
                    getGCPackages();
                    setPromoCode("");
                    handlePromoReject();
                    reward();
                    getUserDataInstant();
                  } else {
                    getGCPackages();
                    setBuyLoading(false);
                    toast.error("Failed to buy", { toastId: "B" });
                    handlePromoReject();
                  }
                  scroogeContract.events.removeAllListeners();
                })
                .catch((error) => {
                  getGCPackages();
                  setBuyLoading(false);
                  toast.error("Token Buy Failed", { toastId: "C" });
                  handlePromoReject();

                  console.log(error);
                  scroogeContract.events.removeAllListeners();
                });
            }
          }
        });
      } else if (selectedDropdown === "BNB") {
        provider.on("block", async (blockNumber) => {
          const block = await provider.getBlockWithTransactions(blockNumber);
          for await (const transaction of block.transactions) {
            if (
              transaction?.from?.toLowerCase() === address.toLowerCase() &&
              ["USDC", "USDT", "BNB", "BUSD"].includes(selectedDropdown) &&
              transaction?.to?.toLowerCase() === BUSD_ADDRESS.toLowerCase()
            ) {
              if (transaction.hash) {
                try {
                  const res = await (
                    await marketPlaceInstance()
                  ).get(
                    `convertCryptoToGoldCoin/${address}/${transaction.hash}`,
                    {
                      params: { promoCode, usd },
                    }
                  );

                  if (res.data.success) {
                    setUser(res?.data?.user);
                    toast.success(
                      `Successfully Purchased ${goldcoinAmount} goldCoin`,
                      { toastId: "A" }
                    );
                    setBuyLoading(false);
                    getGCPackages();
                    handlePromoReject();
                    reward();
                    getUserDataInstant();
                  } else {
                    getGCPackages();
                    setBuyLoading(false);
                    toast.error("Failed to buy", { toastId: "B" });
                    handlePromoReject();
                  }
                  provider.off("block");
                  return;
                } catch (err) {
                  getGCPackages();
                  setBuyLoading(false);
                  toast.error("Token Buy Failed", { toastId: "B" });
                  handlePromoReject();
                  console.log(err);
                  bnbContract.events.removeAllListeners();
                  provider.off("block");
                  return;
                }
              }
            }
          }
        });
      } else if (selectedDropdown === "USDT") {
        usdtContract.events.addEventListener("Transfer", async (event) => {
          //  console.log("eventusdt-", event.data.from, event.data.to);
          if (
            event?.data?.from?.toLowerCase() === address.toLowerCase() &&
            ((["USDC", "USDT", "BNB", "BUSD"].includes(selectedDropdown) &&
              event.data.to.toLowerCase() === BUSD_ADDRESS.toLowerCase()) ||
              (selectedDropdown === "Scrooge" &&
                event.data.to.toLowerCase() ===
                  process.env.REACT_APP_OGCONTRACT_ADDRESS.toLowerCase()))
          ) {
            if (event.transaction.transactionHash) {
              const { transactionHash } = event.transaction || {};
              (await marketPlaceInstance())
                .get(`convertCryptoToGoldCoin/${address}/${transactionHash}`, {
                  params: { promoCode, usd },
                })
                .then((response) => {
                  setBuyLoading(false);
                  if (response.data.success) {
                    setUser(response?.data?.user);
                    toast.success(
                      `Successfully Purchased ${goldcoinAmount} goldCoin`,
                      { toastId: "A" }
                    );
                    getGCPackages();
                    handlePromoReject();

                    reward();
                    getUserDataInstant();
                  } else {
                    getGCPackages();

                    setBuyLoading(false);
                    toast.error("Failed to buy", { toastId: "B" });
                    handlePromoReject();
                  }
                  usdtContract.events.removeAllListeners();
                })
                .catch((error) => {
                  getGCPackages();
                  setBuyLoading(false);
                  toast.error("Token Buy Failed", { toastId: "C" });
                  handlePromoReject();
                  console.log(error);
                  usdtContract.events.removeAllListeners();
                });
            }
          }
        });
      } else if (selectedDropdown === "USDC") {
        usdcContract.events.addEventListener("Transfer", async (event) => {
          if (
            event?.data?.from?.toLowerCase() === address.toLowerCase() &&
            ((["USDC", "USDT", "BNB", "BUSD"].includes(selectedDropdown) &&
              event.data.to.toLowerCase() === BUSD_ADDRESS.toLowerCase()) ||
              (selectedDropdown === "Scrooge" &&
                event.data.to.toLowerCase() ===
                  process.env.REACT_APP_OGCONTRACT_ADDRESS.toLowerCase()))
          ) {
            if (event.transaction.transactionHash) {
              const { transactionHash } = event.transaction || {};
              (await marketPlaceInstance())
                .get(`convertCryptoToGoldCoin/${address}/${transactionHash}`, {
                  params: { promoCode, usd },
                })
                .then((response) => {
                  setBuyLoading(false);
                  if (response.data.success) {
                    setUser(response?.data?.user);
                    toast.success(
                      `Successfully Purchased ${goldcoinAmount} goldCoin`,
                      { toastId: "A" }
                    );
                    getGCPackages();
                    handlePromoReject();

                    reward();
                    getUserDataInstant();
                  } else {
                    setBuyLoading(false);
                    toast.error("Failed to buy", { toastId: "B" });
                    setPromoCode("");
                    getGCPackages();
                    setPromoDetails({});
                  }
                  usdcContract.events.removeAllListeners();
                })
                .catch((error) => {
                  setBuyLoading(false);
                  toast.error("Token Buy Failed", { toastId: "C" });
                  handlePromoReject();
                  getGCPackages();
                  console.log(error);
                  usdcContract.events.removeAllListeners();
                });
            }
          }
        });
      }

      if (selectedDropdown === "BUSD") {
        let amt = (usd * Math.pow(10, 18)).toString();
        setTimeout(async () => {
          try {
            txResult = await contract.call("transfer", [BUSD_ADDRESS, amt], {
              gasLimit: 1000000,
              gasPrice: ethers.utils.parseUnits("5", "gwei"),
            });
          } catch (error) {
            setBuyLoading(false);
            if (
              error
                .toString()
                .includes(
                  "transfer amount exceeds balance" ||
                    error?.data?.message?.includes("insufficient funds")
                )
            ) {
              toast.error("Transfer amount exceeds balance");
            } else if (error.toString().includes("user rejected transaction")) {
              toast.error("You rejected the transaction request.", {
                toastId: "D",
              });
            } else
              toast.error(
                "Gold Coin Buy Fail, try with increasing the gas fee",
                { toastId: "D" }
              );
            contract.events.removeEventListener("Transfer");
          }
        }, 3000);

        return;
      } else {
        if (selectedDropdown === "Scrooge") {
          contractAddresss = process.env.REACT_APP_OGCONTRACT_ADDRESS;
          walletAddress = process.env.REACT_APP_OG_WALLET_ADDRESS;
        } else if (selectedDropdown === "BNB") {
          contractAddresss = process.env.REACT_APP_BNBCONTRACT_ADDRESS;
          walletAddress = BUSD_ADDRESS;
        } else if (selectedDropdown === "USDC") {
          contractAddresss = process.env.REACT_APP_USDCCONTRACT_ADDRESS;
          walletAddress = BUSD_ADDRESS;
        } else if (selectedDropdown === "USDT") {
          contractAddresss = process.env.REACT_APP_USDTCONTRACT_ADDRESS;
          walletAddress = BUSD_ADDRESS;
        }
        if (selectedDropdown === "Scrooge") {
          await fetch(`https://api.coinbrain.com/public/coin-info`, {
            method: "post",
            body: JSON.stringify({
              56: [process.env.REACT_APP_OGCONTRACT_ADDRESS],
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              current_price = data[0].priceUsd;
            })
            .catch((e) => {
              console.log(e);
              return false;
            });
        } else {
          const res = await fetch(
            `https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${contractAddresss}`
          );
          const data = await res.json();
          current_price = data.market_data.current_price.usd;
        }
        if (["USDC", "USDT", "BNB"].includes(selectedDropdown)) {
          if (["USDC", "USDT"].includes(selectedDropdown)) {
            cryptoAmount = parseFloat(usd);
          } else {
            cryptoAmount = parseFloat(usd) / current_price;
          }
        } else {
          cryptoAmount =
            (parseFloat(usd) + parseFloat(usd) * 0.16) /
            parseFloat(current_price);
        }
        if (selectedDropdown === "BNB") {
          console.log("cryptoAmount", cryptoAmount);
          txResult = await sdk.wallet.transfer(walletAddress, cryptoAmount);
        } else {
          txResult = await sdk.wallet.transfer(
            walletAddress,
            cryptoAmount,
            contractAddresss
          );
        }
      }
    } catch (error) {
      console.log("error", error);
      setBuyLoading(false);
      if (
        error.toString().includes("transfer amount exceeds balance") ||
        error?.data?.message.includes("insufficient funds")
      ) {
        toast.error("Transfer amount exceeds balance", { toastId: "D" });
      } else if (error.toString().includes("user rejected transaction")) {
        toast.error("You rejected the transaction request.", { toastId: "D" });
      } else
        toast.error("Gold Coin Buy Fail, try with increasing the gas fee", {
          toastId: "D",
        });
      console.log("errordata", error);
      bnbContract.events.removeEventListener("Transfer");
      usdtContract.events.removeEventListener("Transfer");
      usdcContract.events.removeEventListener("Transfer");
      contract.events.removeEventListener("Transfer");
      scroogeContract.events.removeEventListener("Transfer");
      provider.off("block");
    }
  };

  const handleChange = (value) => {
    setSelectedDropdown(value);
  };
  const handlePaymentTypeChange = (value) => {
    setSelectedTypeDropdown(value);
  };

  const handleChangePromo = (e) => {
    const { value } = e.target;
    setPromoCode(value.trim());
    if (value.trim().length) {
      setErrors("");
    }
    promoCode = value;
  };

  const handlePromoApply = async () => {
    setPromoLoader(true);
    try {
      if (promocode === "") {
        setErrors("Please enter promo code.");
        return;
      }
      const payload = {
        promocode,
      };
      const res = await (
        await marketPlaceInstance()
      ).post("/applyPromoCode", payload);
      const { code, message, getPromo } = res.data;
      setPromoDetails(getPromo);
      if (code === 200) {
        toast.success(message, { toastId: "A" });
      } else if (code === 404) {
        toast.error(message, { toastId: "B" });
      }
      setPromoLoader(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response) {
        if (error?.response?.status !== 200) {
          toast.error(error?.response?.data?.message, { toastId: "login" });
        }
      }
      setPromoLoader(false);
    }
  };

  const getExactPrice = (price) => {
    return price;
  };

  const getExactGC = (Gc, promo) => {
    const { coupanType, discountInPercent } = promo || {};
    let discount = 0;
    if (coupanType === "Percent") {
      discount = (Gc * discountInPercent) / 100;
    } else if (coupanType === "2X") {
      discount = parseInt(Gc);
    }
    return parseInt(Gc) + discount;
  };

  const getExactToken = (Token, promo) => {
    const { coupanType, discountInPercent } = promo || {};
    let discount = 0;
    if (coupanType === "Percent") {
      discount = (Token * discountInPercent) / 100;
    }
    if (coupanType === "2X") {
      discount = parseInt(Token);
    }
    return parseInt(Token) + discount;
  };

  const handleOk = async (event) => {
    try {
      console.log("handleOk");
      getGCPurcahseLimitPerDay();
      setStatus("");
      window.location.href = "/crypto-to-gc";
    } catch (error) {
      console.log("error", error);
    }
  };

  let arr = [9.99, 19.99, 24.99];

  const handleShowMegaBuys = (price) => {
    let filteredArr = arr.filter((item) => !user.megaOffer.includes(item));
    if (parseFloat(price?.priceInBUSD) === parseFloat(filteredArr[0])) {
      return true;
    }
  };
  return (
    <>
      <Helmet>
        <html className='crypto-to-gc' lang='en' />
        <script
          async
          src='https://www.googletagmanager.com/gtag/js?id=AW-11280008930'></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag("js", new Date());
            gtag("config", "AW-11280008930");
          `}
        </script>
        <script
          async
          custom-element='amp-analytics'
          src='https://cdn.ampproject.org/v0/amp-analytics-0.1.js'></script>
        <amp-analytics type='gtag' data-credentials='include'>
          <script type='application/json'>
            {`
          "vars": {
            "gtag_id": "AW-11280008930",
            "config": { "AW-11280008930": { "groups": "default" } }
          },
          "triggers": {}
        `}
          </script>
        </amp-analytics>
      </Helmet>
      {(status === "success" || status === "inprogress") && (
        <AuthorizeSucessModel show={true} status={status} handleOk={handleOk} />
      )}

      {prizesLoading ? (
        <div className='loading'>
          <div className='loading-img-div'>
            <img src={LoadingPoker} alt='game' className='imageAnimation' />
          </div>
        </div>
      ) : (
        <Layout>
          <main className='main redeem-prizes-page'>
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
                      <div className='loading-txt pulse'>
                        PURCHASING TOKENS...
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className='scrooge-main-heading'>
                    <div className='pageTitle'>
                      <h1 className='title'>Top up your Gold Coins</h1>
                    </div>
                    <div className='asterisk-desc cryptoTotoken'>
                      <p className='title-memo'>
                        All Sweep Tokens have a one time play through
                        requirement. In the event of a bonus buy, only the Bonus
                        ST portion may be tied to a higher play through which
                        will be indicated on the package details.
                      </p>
                      <ul>
                        Disclaimer :
                        <li>
                          +16% Will be added to Scrooge payment method to cover
                          blockchain fees and contract taxes!
                        </li>
                        <li>
                          All sales are final. SCROOGE LLC has a zero refund
                          policy.
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className='purchase-select'>
                    <div className='purchaseSelect-Box'>
                      <h4>Purchase with</h4>
                      <Dropdown>
                        <Dropdown.Toggle variant='success' id='dropdown-basic'>
                          {!selectedTypeDropdown
                            ? "Credit Card"
                            : selectedTypeDropdown}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() =>
                              handlePaymentTypeChange("Credit Card")
                            }>
                            Credit Card
                          </Dropdown.Item>

                          <Dropdown.Item
                            onClick={() => handlePaymentTypeChange("Crypto")}>
                            Crypto
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className='enter-promo'>
                      <Form.Group className='form-group'>
                        <Form.Control
                          type='text'
                          name='Promocode'
                          value={promocode}
                          placeholder='Enter promo code'
                          onChange={(e) => handleChangePromo(e)}
                        />

                        {errors ? <p className='error-text'>{errors}</p> : null}
                      </Form.Group>
                      {Object.keys(promoDetails).length ? (
                        <Button
                          type='button'
                          className='reject-btn'
                          onClick={handlePromoReject}>
                          Reject
                        </Button>
                      ) : (
                        <Button
                          type='button'
                          className='apply-btn'
                          onClick={handlePromoApply}
                          disabled={!promocode || promoLoader}>
                          {promoLoader ? (
                            <Spinner animation='border' />
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className='buy-chips-content'>
                    <div className='purchase-select'>
                      {selectedTypeDropdown === "Crypto" && (
                        <div className='purchaseSelect-Box'>
                          <h4>Purchase with</h4>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant='success'
                              id='dropdown-basic'>
                              {!selectedDropdown ? "BUSD" : selectedDropdown}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => handleChange("Scrooge")}>
                                Scrooge
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleChange("BNB")}>
                                BNB
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleChange("USDC")}>
                                USDC
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleChange("USDT")}>
                                USDT
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      )}
                    </div>
                    <div className='buy-chips-grid cryptoToGC'>
                      {selectedTypeDropdown === "Credit Card" ? (
                        <div className='asterisk-desc cryptoTotoken abc'>
                          <ul>
                            <span style={{ color: "red" }}>Please note: </span>
                            <span style={{ fontSize: "16px" }}>
                              Credit card transactions are limited to four
                              purchases per day.
                            </span>{" "}
                          </ul>
                        </div>
                      ) : isMismatched && address ? (
                        <div style={{ marginTop: "20px" }}>
                          <SwitchNetworkBSC />
                        </div>
                      ) : (
                        ""
                      )}

                      {isMegaBuyShow && user.megaOffer.length !== 3 && (
                        <div className='special-offer-grid'>
                          <h5>Special Offer</h5>
                          <div className='purchasemodal-cards'>
                            {allPrizes.map((prize, i) => (
                              <>
                                {isMegaBuyShow &&
                                  prize.offerType === "MegaOffer" && (
                                    <>
                                      {handleShowMegaBuys(prize) ? (
                                        <Card key={prize._id}>
                                          <h3 className='mega-text pulses'>
                                            Mega Offer
                                          </h3>
                                          <Card.Img variant='top' src={coin3} />
                                          <Card.Body>
                                            <Card.Title>
                                              GC {prize?.gcAmount}
                                            </Card.Title>

                                            {selectedTypeDropdown ===
                                            "Crypto" ? (
                                              getExactPrice(
                                                prize?.priceInBUSD
                                              ) > 0 && (
                                                <Button
                                                  variant='primary'
                                                  onClick={() =>
                                                    convert(
                                                      getExactPrice(
                                                        prize?.priceInBUSD
                                                      ),
                                                      getExactGC(
                                                        prize?.gcAmount
                                                      ),
                                                      prize?._id,
                                                      prize?.priceInBUSD
                                                    )
                                                  }>
                                                  <p>Buy </p>{" "}
                                                  <span>
                                                    $
                                                    {getExactPrice(
                                                      prize?.priceInBUSD
                                                    )}
                                                  </span>
                                                </Button>
                                              )
                                            ) : selectedTypeDropdown ===
                                              "Credit Card" ? (
                                              getExactPrice(
                                                prize?.priceInBUSD
                                              ) > 0 && (
                                                <PayWithCard
                                                  spendedAmount={spendedAmount}
                                                  prize={prize}
                                                  getExactPrice={getExactPrice}
                                                  getExactGC={getExactGC}
                                                  getExactToken={getExactToken}
                                                  promoDetails={promoDetails}
                                                  index={i}
                                                  setBuyLoading={setBuyLoading}
                                                  selectedTypeDropdown={
                                                    selectedTypeDropdown
                                                  }
                                                  dailyGCPurchaseLimit={
                                                    dailyGCPurchaseLimit
                                                  }
                                                  user={user}
                                                />
                                              )
                                            ) : (
                                              <>
                                                {" "}
                                                <Button variant='primary'>
                                                  <p>Buy with Cash App </p>{" "}
                                                  <span>
                                                    $
                                                    {getExactPrice(
                                                      prize?.priceInBUSD
                                                    )}
                                                  </span>
                                                </Button>
                                              </>
                                            )}
                                          </Card.Body>
                                          <div className='goldPurchase-offers'>
                                            Free ST:{" "}
                                            <img
                                              src={sweep}
                                              alt='sweep token'
                                            />{" "}
                                            {prize?.freeTokenAmount}
                                          </div>
                                        </Card>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  )}
                              </>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className='purchasemodal-cards'>
                        {allPrizes.map((prize, i) => (
                          <>
                            {prize.offerType !== "MegaOffer" && (
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
                                  <Card.Title>
                                    GC{" "}
                                    {getExactGC(prize?.gcAmount, promoDetails)}
                                  </Card.Title>
                                  {promoDetails?.couponCode && (
                                    <Card.Title className='cross-text'>
                                      GC {getExactGC(prize?.gcAmount, {})}
                                    </Card.Title>
                                  )}
                                  {selectedTypeDropdown === "Crypto" ? (
                                    getExactPrice(
                                      prize?.priceInBUSD,
                                      promoDetails
                                    ) > 0 && (
                                      <Button
                                        variant='primary'
                                        onClick={() =>
                                          convert(
                                            getExactPrice(
                                              prize?.priceInBUSD,
                                              promoDetails
                                            ),
                                            getExactGC(
                                              prize?.gcAmount,
                                              promoDetails
                                            ),
                                            prize?._id,
                                            prize?.priceInBUSD
                                          )
                                        }>
                                        <p>Buy </p>{" "}
                                        <span>
                                          $
                                          {getExactPrice(
                                            prize?.priceInBUSD,
                                            promoDetails
                                          )}
                                        </span>
                                      </Button>
                                    )
                                  ) : selectedTypeDropdown === "Credit Card" ? (
                                    getExactPrice(
                                      prize?.priceInBUSD,
                                      promoDetails
                                    ) > 0 && (
                                      <PayWithCard
                                        spendedAmount={spendedAmount}
                                        prize={prize}
                                        getExactPrice={getExactPrice}
                                        getExactGC={getExactGC}
                                        getExactToken={getExactToken}
                                        promoDetails={promoDetails}
                                        index={i}
                                        setBuyLoading={setBuyLoading}
                                        selectedTypeDropdown={
                                          selectedTypeDropdown
                                        }
                                        dailyGCPurchaseLimit={
                                          dailyGCPurchaseLimit
                                        }
                                        user={user}
                                      />
                                    )
                                  ) : (
                                    <>
                                      {" "}
                                      <Button variant='primary'>
                                        <p>Buy with Cash App </p>{" "}
                                        <span>
                                          $
                                          {getExactPrice(
                                            prize?.priceInBUSD,
                                            promoDetails
                                          )}
                                        </span>
                                      </Button>
                                    </>
                                  )}
                                </Card.Body>
                                <div className='goldPurchase-offers'>
                                  Free ST: <img src={sweep} alt='sweep token' />{" "}
                                  {promoDetails?.couponCode && (
                                    <span className='cross-text'>
                                      {getExactToken(
                                        prize?.freeTokenAmount,
                                        {}
                                      )}
                                    </span>
                                  )}{" "}
                                  {getExactToken(
                                    prize?.freeTokenAmount,
                                    promoDetails
                                  )}
                                </div>
                              </Card>
                            )}
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='container'>
                <div className='buy-chips-content'>
                  <div className='prizes-chip-count'>
                    {user ? (
                      <>
                        <h3>USD Equivelant value: {user?.wallet.toFixed(2)}</h3>
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
                </div>
              </div>
            )}
          </main>
        </Layout>
      )}
    </>
  );
}

const PayWithCard = ({
  prize,
  getExactPrice,
  promoDetails,
  dailyGCPurchaseLimit,
  spendedAmount,
  user,
}) => {
  const [liveFormToken, setFormToken] = useState(null);
  const [loader, setLoading] = useState(false);

  const handleCLick = async (gc, usd) => {
    console.log(
      "spendedAmount.spended_today + usd",
      spendedAmount.spended_today,
      usd,
      user.dailyGoldCoinSpendingLimit
    );
    try {
      goldcoinAmount = gc;
      if (spendedAmount.spended_today + usd > user.dailyGoldCoinSpendingLimit) {
        return toast.error(
          "Your daily limits are exceeded, visit your profile under spending limits to set your desired controls.",
          { toastId: "A" }
        );
      }

      if (
        spendedAmount.spened_this_week + usd >
        user.weeklyGoldCoinSpendingLimit
      ) {
        return toast.error(
          "Your weekly limits are exceeded, visit your profile under spending limits to set your desired controls.",
          { toastId: "B" }
        );
      }

      if (
        spendedAmount.spneded_this_month + usd >
        user.monthlyGoldCoinSpendingLimit
      ) {
        return toast.error(
          "Your monthly limits are exceeded, visit your profile under spending limits to set your desired controls.",
          { toastId: "C" }
        );
      }
      setLoading(true);
      const res = await (
        await marketPlaceInstance()
      ).post(
        `/getFormToken`,
        {
          amount: prize?.priceInBUSD,
          promoCode: promoCode ? promoCode : "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          credentials: "include",
        }
      );
      const responseData = res?.data?.response;
      setFormToken(responseData?.token);
    } catch (error) {
      console.error("Error fetching form token:", error);
    }
  };

  useEffect(() => {
    if (liveFormToken) {
      setTimeout(() => {
        document.getElementsByTagName("form")[0][1].click();
      }, 1000);
    }
  }, [liveFormToken]);

  return (
    <>
      {liveFormToken ? (
        <button id='payRedirection'>
          <AcceptHosted
            formToken={liveFormToken}
            environment='PRODUCTION'
            integration='redirect'>
            <Spinner animation='border' />
          </AcceptHosted>
        </button>
      ) : (
        <button
          onClick={() =>
            handleCLick(prize?.gcAmount, parseFloat(prize?.priceInBUSD))
          }>
          {" "}
          {!liveFormToken ? (
            !loader ? (
              `Buy With Card ${getExactPrice(prize?.priceInBUSD, promoDetails)}`
            ) : (
              <Spinner animation='border' />
            )
          ) : (
            ""
          )}
        </button>
      )}
    </>
  );
};
