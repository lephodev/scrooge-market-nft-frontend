/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect } from "react";
import { AcceptHosted } from "react-acceptjs";
import {
  Button,
  Form,
  Card,
  Dropdown,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Layout from "./Layout.mjs";
import { Helmet } from "react-helmet";
import LoadingPoker from "../images/scroogeHatLogo.png";
import coin4 from "../images/4.png";
import coin3 from "../images/3.png";
import coin2 from "../images/2.png";
import coin1 from "../images/1.png";
import sweep from "../images/token.png";
import freeSpin from "../images/Store-Card-promo.jpg";
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
import PageLoader from "../components/pageLoader/loader.mjs";
import FreeSTModel from "./models/FreeSTModel.mjs";
import AuthrizeCustomModel from "./models/authrizeCustomModel.mjs";
import PaypalModel from "./models/paypalModel.mjs";
import { userKycDetails } from "../utils/api.mjs";
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
  const [isMegaBuyShow, setIsMegaBuyShow] = useState(false);
  const [showFreeST, setShowFreeST] = useState(false);
  const [freeSTDetail, setFreeSTDetails] = useState({});
  const [avgValue, setAvgValue] = useState(0);
  const [showPromoPackageData, setShowPromoPackageData] = useState({});

  const { reward } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });
  const [cookies] = useCookies(["token"]);
  const [showPaypal, setShowPyapal] = useState(false);
  const [paypalAmount, setPaypalAmount] = useState();
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

  const getPromoPackagaeBanner = async () => {
    try {
      const res = await (
        await authInstance()
      ).get("/users/getPromoPurchaseBanner", {
        withCredentials: true,
        credentials: "include",
      });
      const { data } = res.data;
      setShowPromoPackageData(data);
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    getPromoPackagaeBanner();
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

  let handler2 = true;

  useEffect(() => {
    // console.log("window",window.prize)
    if (handler2) {
      window.requestHandler = async (response) => {
        if (response.messages.resultCode === "Error") {
          var i = 0;
          while (i < response.messages.message.length) {
            // console.log(
            //   response.messages.message[i].code +
            //     ": " +
            //     response.messages.message[i].text
            // );
            i = i + 1;
          }
        } else {
          setBuyLoading(true);
          try {
            // console.log("window prize",window.prize)
            if (user?.isBlockWallet) {
              setBuyLoading(false);
              return toast.error(`Your wallet blocked by admin`, {
                toastId: "A",
              });
            }
            const res = await (
              await marketPlaceInstance()
            ).post(
              `/accept-deceptor`,
              {
                dataDescriptor: response.opaqueData.dataDescriptor,
                dataValue: response.opaqueData.dataValue,
                item: {
                  id: window.prize.priceInBUSD,
                  description: `Purchase GC ${window.prize.gcAmount} and get ${window.prize.freeTokenAmount} ST free`,
                  price: window.prize.priceInBUSD,
                  name: window.prize.gcAmount,
                  actualAmount: window.prize.actualAmount,
                  promoCode: window.prize.promoCode,
                },
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
                credentials: "include",
              }
            );

            setBuyLoading(false);
            if (res.data.success) {
              toast.success(res.data.data, { id: "buy-sucess" });
              handlePromoReject();
            } else {
              toast.error(res.data.error, { id: "buy-failed" });
              handlePromoReject();
            }
          } catch (e) {
            setBuyLoading(false);
            handlePromoReject();
            console.log("ee55", e.response);
            // console.log("ee55", JSON.parse(e));
            if (axios.isAxiosError(e) && e?.response) {
              if (e?.response?.status !== 200) {
                toast.error(
                  e?.response?.data?.error || e?.response?.data?.message,
                  {
                    toastId: "login",
                  }
                );
              }
            }
          }
        }
      };
      handler2 = false;
    } else {
      handler2 = true;
    }
  }, []);

  // getGCPackages
  async function getGCPackages() {
    setPrizesLoading(true);
    try {
      const res = await (await marketPlaceInstance()).get(`/getGCPackages`);
      setAvgValue(res?.data?.averageValue);
      if (res?.data?.allPackages) {
        const sortedAsc = res.data.allPackages.sort(
          (a, b) => parseInt(a.priceInBUSD) - parseInt(b.priceInBUSD)
        );

        setPrizesLoading(false);
        setAllPrizes(sortedAsc || []);
        // setFreeSpinValue()
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
    // console.log("hello");
    if (selectedTypeDropdown === "Credit Card" && allPrizes.length) {
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://js.authorize.net/v3/AcceptUI.js";
      script.charset = "utf-8";
      script.id = "accept";
      document.body.appendChild(script);
    } else {
      let s = document.getElementById("accept");
      if (s) {
        s.remove();
      }
    }

    return () => {
      let s = document.getElementById("accept");
      if (s) {
        s.remove();
      }
    };
  }, [selectedTypeDropdown, allPrizes]);

  useEffect(() => {
    getGCPackages();
    getGCPurcahseLimitPerDay();
    getMegaBuyPurcahseLimitPerDay();
  }, []);

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
      console.log("getPromo", getPromo);
      if (getPromo?.coupanType === "Free ST") {
        setShowFreeST(true);
        setFreeSTDetails(getPromo);
      } else {
        setPromoDetails(getPromo);
      }
      if (code === 200) {
        toast.success(message, { toastId: "A" });
      } else if (code === 404) {
        setPromoDetails({});
        setPromoCode("");
        promoCode = "";
        goldcoinAmount = "";
        toast.error(message, { toastId: "B" });
      }
      setPromoLoader(false);
    } catch (error) {
      setPromoDetails({});
      setPromoCode("");
      promoCode = "";
      goldcoinAmount = "";

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
    if (Gc === "25000000") {
      return Gc;
    }
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
    if (Token === "25000") {
      return Token;
    }
    console.log("Token", Token, "promo", promo);
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
      window.location.href = "/copy-crypto-to-gc";
    } catch (error) {
      console.log("error", error);
    }
  };

  let arrc = [4.99, 14.99, 49.99, 99.99];
  console.log("avsgggs", avgValue);
  let greaterThanValue = arrc.filter((value) => value > avgValue);
  console.log("greaterThanValue", greaterThanValue);

  let arr = [9.99, 19.99, 24.99];
  arrc = greaterThanValue.concat(arr);

  const handleShowMegaBuys = (price) => {
    let filteredArr = arrc.filter((item) => !user.megaOffer.includes(item));
    if (parseFloat(price?.priceInBUSD) === parseFloat(filteredArr[0])) {
      return true;
    }
    if (user.megaOffer.includes(99.99)) {
      if (parseFloat(price?.priceInBUSD) === parseFloat(arrc[0])) return true;
    }
  };

  const handleShowFreeSpin = (price) => {
    console.log("price----------------", price);
    let filteredArr = user.freeSpin.includes(Number(price?.priceInBUSD));
    if (parseFloat(price?.priceInBUSD) !== parseFloat(filteredArr[0])) {
      return true;
    }
  };

  const handleCloseFreeST = () => {
    setShowFreeST(false);
  };

  const handleShowPaypalModel = (amount, gc) => {
    if (dailyGCPurchaseLimit >= 4) {
      return toast.error("Credit card daily purchase limit are reached");
    }
    goldcoinAmount = gc;
    if (
      spendedAmount.spended_today + amount >
      user.dailyGoldCoinSpendingLimit
    ) {
      return toast.error(
        "Your daily limits are exceeded, visit your profile under spending limits to set your desired controls.",
        { toastId: "A" }
      );
    }

    if (
      spendedAmount.spened_this_week + amount >
      user.weeklyGoldCoinSpendingLimit
    ) {
      return toast.error(
        "Your weekly limits are exceeded, visit your profile under spending limits to set your desired controls.",
        { toastId: "B" }
      );
    }

    if (
      spendedAmount.spneded_this_month + amount >
      user.monthlyGoldCoinSpendingLimit
    ) {
      return toast.error(
        "Your monthly limits are exceeded, visit your profile under spending limits to set your desired controls.",
        { toastId: "C" }
      );
    }
    setShowPyapal(!showPaypal);
    setPaypalAmount(amount);
  };
  return (
    <>
      <Helmet>
        <html className="crypto-to-gc" lang="en" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-11280008930"
        ></script>
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
          custom-element="amp-analytics"
          src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
        ></script>
        <amp-analytics type="gtag" data-credentials="include">
          <script type="application/json">
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

      <FreeSTModel
        showFreeST={showFreeST}
        handleCloseFreeST={handleCloseFreeST}
        freeSTDetail={freeSTDetail}
        setPromoCode={setPromoCode}
      />
      {(status === "success" || status === "inprogress") && (
        <AuthorizeSucessModel show={true} status={status} handleOk={handleOk} />
      )}

      {prizesLoading ? (
        <PageLoader />
      ) : (
        <Layout>
          <main className="main redeem-prizes-page cryptoToGc">
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
                      <div className="loading-txt pulse">
                        PURCHASING TOKENS...
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="scrooge-main-heading">
                    <div className="pageTitle updatePageTitle">
                      {/* <h1 className="title updated_text_color">Get Gold Coins</h1> */}
                      <h1 className="title updated_text_color">
                        Purchase Gold Coins
                      </h1>
                    </div>
                  </div>
                  <div className="purchase-select purchase-select_alignment">
                    <div className="purchase-with-content">
                      {/* <h4>Purchase with: </h4> */}
                      {/* <div className="purchase-with-grid purchase-with-grid_update">
                        <span
                          onClick={() => handlePaymentTypeChange("Credit Card")}
                          className={
                            selectedTypeDropdown === "Credit Card"
                              ? "active-method"
                              : ""
                          }
                        >
                          Credit Card{" "}
                        </span>
                        
                      </div> */}
                    </div>

                    <div className="enter-promo new_enter_promo">
                      <Form.Group className="form-group">
                        <Form.Control
                          type="text"
                          name="Promocode"
                          value={promocode}
                          placeholder="Enter promo code"
                          onChange={(e) => handleChangePromo(e)}
                        />

                        {errors ? <p className="error-text">{errors}</p> : null}
                      </Form.Group>
                      {Object.keys(promoDetails).length ? (
                        <Button
                          type="button"
                          className="reject-btn "
                          onClick={handlePromoReject}
                        >
                          Reject
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          className="apply-btn active_btn"
                          onClick={handlePromoApply}
                          disabled={!promocode || promoLoader}
                        >
                          {promoLoader ? (
                            <Spinner animation="border" />
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {selectedTypeDropdown === "Credit Card" ? (
                    <div className="asterisk-desc cryptoTotoken abc first-grid">
                      <ul>
                        <li>
                          <span>Please note:</span> Credit card transactions are
                          limited to four purchases per day.
                        </li>
                      </ul>
                    </div>
                  ) : isMismatched && address ? (
                    <div style={{ marginTop: "20px" }}>
                      <SwitchNetworkBSC />
                    </div>
                  ) : (
                    ""
                  )}
                  {promocode && (
                    <div className="asterisk-desc cryptoTotoken playthrough ">
                      <ul>
                        <li>$25 is 3x playthrough on bonus value only</li>
                        <li>$50 is 6x playthrough on bonus value only</li>
                        <li>$100 is 10x playthrough on bonus value only</li>
                      </ul>
                    </div>
                  )}

                  <div className="buy-chips-content">
                    <div className="buy-chips-grid cryptoToGC buy-chips-grid_update">
                      <div
                        style={{
                          height: "100%",
                          width: "60vh",
                          margin: "auto",
                          cursor: "pointer",
                        }}
                        className="special-offer-grid"
                      >
                        {/* allPromoPackage[0] &&
                        !user?.freeSpin.includes(Number(allPromoPackage[0]?.priceInBUSD)) */}
                        {showPromoPackageData[0] &&
                          !user?.freeSpin.includes(
                            Number(showPromoPackageData[0]?.priceInBUSD)
                          ) &&
                          showPromoPackageData &&
                          Object.keys(showPromoPackageData).length > 0 && (
                            <div className="special-offer-grid payCardoffer">
                              <div className="">
                                {allPrizes.map((prize, i) => (
                                  <>
                                    {user?._id === "657e4326d37d83e2ae2e9d23" ||
                                      (user?.id ===
                                        "657e4326d37d83e2ae2e9d23" &&
                                        prize.offerType === "freeSpin" && (
                                          <>
                                            {handleShowFreeSpin(prize) ? (
                                              <h3 className="">
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
                                                  getGCPackages={getGCPackages}
                                                />
                                              </h3>
                                            ) : (
                                              ""
                                            )}
                                          </>
                                        ))}
                                  </>
                                ))}
                              </div>
                            </div>
                          )}
                        {isMegaBuyShow /* && user.megaOffer.length !== 3 */ && (
                          <div className="purchasemodal-cards">
                            {allPrizes.map((prize, i) => (
                              <>
                                {isMegaBuyShow &&
                                  prize.offerType === "MegaOffer" && (
                                    <>
                                      {handleShowMegaBuys(prize) ? (
                                        <Card key={prize._id}>
                                          <h3 className="mega-text pulses">
                                            Mega Offer
                                          </h3>
                                          <div className="goldPurchase-offers">
                                            Free ST:{" "}
                                            <img
                                              src={sweep}
                                              alt="sweep token"
                                            />{" "}
                                            {prize?.freeTokenAmount}
                                          </div>
                                          <Card.Img variant="top" src={coin3} />
                                          <Card.Body>
                                            <Card.Title className="goldPurchase_heading">
                                              ${parseFloat(prize?.priceInBUSD)}
                                            </Card.Title>
                                            <Card.Title>
                                              GC {prize?.gcAmount}
                                            </Card.Title>

                                            {selectedTypeDropdown ===
                                            "Paypal" ? (
                                              getExactPrice(
                                                prize?.priceInBUSD
                                              ) > 0 && (
                                                <Button
                                                  variant="primary"
                                                  onClick={() =>
                                                    handleShowPaypalModel(
                                                      parseFloat(
                                                        prize?.priceInBUSD
                                                      ),
                                                      prize.gcAmount
                                                    )
                                                  }
                                                >
                                                  <p>Buy With Paypal</p>{" "}
                                                  <span>
                                                    $
                                                    {getExactPrice(
                                                      prize?.priceInBUSD,
                                                      promoDetails
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
                                                  getGCPackages={getGCPackages}
                                                />
                                              )
                                            ) : (
                                              <>
                                                {" "}
                                                <Button variant="primary">
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
                                        </Card>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  )}
                              </>
                            ))}
                          </div>
                        )}
                      </div>

                      {console.log("user.freeSpinuser.freeSpin", user)}
                      <div className="purchasemodal-cards">
                        {allPrizes.map((prize, i) => (
                          <>
                            {prize.offerType !== "MegaOffer" &&
                              prize.offerType !== "freeSpin" && (
                                <Card key={prize._id}>
                                  <div className="goldPurchase-offers">
                                    Free ST:{" "}
                                    <img src={sweep} alt="sweep token" />{" "}
                                    {promoDetails?.couponCode && (
                                      <>
                                        {prize.freeTokenAmount !== "25000" && (
                                          <span className="cross-text">
                                            {getExactToken(
                                              prize?.freeTokenAmount,
                                              {}
                                            )}
                                          </span>
                                        )}
                                      </>
                                    )}{" "}
                                    {getExactToken(
                                      prize?.freeTokenAmount,
                                      promoDetails
                                    )}
                                  </div>
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
                                    <Card.Title className="goldPurchase_heading">
                                      ${parseFloat(prize?.priceInBUSD)}
                                    </Card.Title>
                                    <Card.Title>
                                      GC{" "}
                                      {getExactGC(
                                        prize?.gcAmount,
                                        promoDetails
                                      )}
                                    </Card.Title>
                                    {promoDetails?.couponCode && (
                                      <>
                                        {prize.freeTokenAmount !== "25000" && (
                                          <Card.Title className="cross-text">
                                            GC {getExactGC(prize?.gcAmount, {})}
                                          </Card.Title>
                                        )}
                                      </>
                                    )}
                                    {selectedTypeDropdown === "Paypal" ? (
                                      getExactPrice(
                                        prize?.priceInBUSD,
                                        promoDetails
                                      ) > 0 && (
                                        <Button
                                          variant="primary"
                                          onClick={() =>
                                            handleShowPaypalModel(
                                              parseFloat(prize?.priceInBUSD),
                                              prize?.gcAmount
                                            )
                                          }
                                        >
                                          <p>Buy With Paypal</p>{" "}
                                          <span>
                                            $
                                            {getExactPrice(
                                              prize?.priceInBUSD,
                                              promoDetails
                                            )}
                                          </span>
                                        </Button>
                                      )
                                    ) : selectedTypeDropdown ===
                                      "Credit Card" ? (
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
                                        <Button variant="primary">
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
                                </Card>
                              )}
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="asterisk-desc cryptoTotoken">
                    <p className="title-memo updated_text_color">
                      All Sweep Tokens have a one time play through requirement.
                      In the event of a bonus buy, only the Bonus ST portion may
                      be tied to a higher play through which will be indicated
                      on the package details.
                    </p>
                    <ul>
                      Disclaimer :
                      {/* <li>
                        +16% Will be added to Scroogecoin Crypto payment method
                        to cover blockchain fees and contract taxes!
                      </li> */}
                      <li>
                        All sales are final. SCROOGE LLC has a zero refund
                        policy.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="container">
                <div className="buy-chips-content">
                  <div className="prizes-chip-count">
                    {user ? (
                      <>
                        <h3>SWEEP TOKEN BALANCE: {user?.wallet.toFixed(2)}</h3>
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
                </div>
              </div>
            )}
          </main>
          <PaypalModel
            showPaypal={showPaypal}
            handleShowPaypalModel={handleShowPaypalModel}
            amount={paypalAmount}
            promoCode={promoCode}
          />
        </Layout>
      )}
    </>
  );
}

const PayWithCard = ({
  prize,
  getExactPrice,
  promoDetails,
  getExactToken,
  getExactGC,
  dailyGCPurchaseLimit,
  spendedAmount,
  user,
}) => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const kycStatus = async () => {
    const response = await userKycDetails();

    if (response?.code === 200) {
      return response.message;
    }
  };
  const handleCLick = async (gc, usd) => {
    setLoader(true);
    if (dailyGCPurchaseLimit >= 4) {
      setLoader(false);
      return toast.error("Credit card daily purchase limit are reached");
    }
    goldcoinAmount = gc;
    if (spendedAmount.spended_today + usd > user.dailyGoldCoinSpendingLimit) {
      setLoader(false);
      return toast.error(
        "Your daily limits are exceeded, visit your profile under spending limits to set your desired controls.",
        { toastId: "A" }
      );
    }

    if (
      spendedAmount.spened_this_week + usd >
      user.weeklyGoldCoinSpendingLimit
    ) {
      setLoader(false);
      return toast.error(
        "Your weekly limits are exceeded, visit your profile under spending limits to set your desired controls.",
        { toastId: "B" }
      );
    }

    if (
      spendedAmount.spneded_this_month + usd >
      user.monthlyGoldCoinSpendingLimit
    ) {
      setLoader(false);
      return toast.error(
        "Your monthly limits are exceeded, visit your profile under spending limits to set your desired controls.",
        { toastId: "C" }
      );
    }
    console.log("usd", usd);
    let status = await kycStatus();
    console.log("status", status);
    if (usd >= 50 && status !== "accept") {
      setLoader(false);

      return toast.error(
        "KYC must be approved to access full purchase center.",
        { toastId: "D" }
      );
    }
    setLoader(false);
    setShowAuthForm(true);

    let payload = {
      freeTokenAmount: getExactToken(prize.freeTokenAmount, promoDetails),
      gcAmount: getExactGC(prize.gcAmount, promoDetails),
      priceInBUSD: getExactPrice(prize?.priceInBUSD, promoDetails).toString(),
      _id: prize._id,
      actualAmount: prize?.priceInBUSD,
      promoCode: promoCode,
    };
    window.prize = payload;
    document.getElementById("paycard").click();
  };

  console.log("prize", prize);

  const tooltip = <Tooltip id="tooltip">{prize?.toolTipMsg}</Tooltip>;

  return (
    <>
      {prize?.offerType !== "freeSpin" && (
        <button
          onClick={() =>
            handleCLick(prize?.gcAmount, parseFloat(prize?.priceInBUSD))
          }
        >
          {" "}
          {loader ? (
            <Spinner animation="border" />
          ) : (
            `Buy With Card ${getExactPrice(prize?.priceInBUSD, promoDetails)}`
          )}
        </button>
      )}
      {prize?.offerType === "freeSpin" && (
        <>
          <img
            onClick={() =>
              handleCLick(prize?.gcAmount, parseFloat(prize?.priceInBUSD))
            }
            src={prize?.purcahseBannerImage}
            style={{
              height: "100%",
              width: "100%",
              border: "2px solid #ffc700",
              borderRadius: "15px",
            }}
          />
          {/* <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">
  Tooltip on top
</button> */}
          <div className="tooltipCardOuter">
            <OverlayTrigger placement="top" overlay={tooltip}>
              <div bsStyle="default" className="tooltipCard">
                <InfoIcon />
              </div>
            </OverlayTrigger>
          </div>
        </>
      )}
      <AuthrizeCustomModel
        showAuthForm={showAuthForm}
        setShowAuthForm={setShowAuthForm}
        amount={prize?.priceInBUSD}
        promoCode={promoCode}
        prize={prize}
      />
    </>
  );
};

const InfoIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-info-lg"
      viewBox="0 0 16 16"
    >
      <path d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0" />
    </svg>
  );
};
