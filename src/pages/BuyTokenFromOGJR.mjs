/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from "react";
import Layout from "./Layout.mjs";
import LoadingPoker from "../images/scroogeHatLogo.png";
// import coin1 from "../images/4.png";
import coin2 from "../images/3.png";
import coin3 from "../images/2.png";
import coin4 from "../images/1.png";
import AuthContext from "../context/authContext.ts";
import { useCookies } from "react-cookie";
import { Dropdown} from "react-bootstrap";

import { useAddress,useSDK } from "@thirdweb-dev/react";
import { marketPlaceInstance, authInstance } from "../config/axios.js";
import { toast } from "react-toastify";
import { useReward } from "react-rewards";

export default function BuyTokenFromOGJR() {
  const { user,  setUser } = useContext(AuthContext);
  const [selectedDropdown, setSelectedDropdown] = useState("");

  const [buyLoading, setBuyLoading] = useState(false);
  const { reward } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });
  const [cookies] = useCookies(["token"]);
  const sdk = useSDK();
  const address = useAddress();
  const OGWalletAddress = process.env.REACT_APP_OG_WALLET_ADDRESS
  const JRWalletAddress = process.env.REACT_APP_JR_WALLET_ADDRESS

  const getUserDataInstant = async () => {
    let access_token = cookies.token;
    (await authInstance())
      .get("/auth/check-auth", {
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
        }
      })
      .catch((err) => {
        console.log("error ", err);
      });
  };

  

  const convert = async (type, crypto, tokens) => {
    let contractAddresss, walletAddress, cryptoAmount;
    setBuyLoading(true);
    if (!address) {
      setBuyLoading(false);
      return toast.error("Please Connect Your Metamask Wallet");
    } else if (type === "OG") {
      contractAddresss = process.env.REACT_APP_OGCONTRACT_ADDRESS;
      walletAddress = OGWalletAddress;
    } else if (type === "JR") {
      contractAddresss = process.env.REACT_APP_JRCONTRACT_ADDRESS;
      walletAddress = JRWalletAddress;
    }
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${contractAddresss}`
      );
      const data = await res.json();
      const current_price = data.market_data.current_price.usd;
      cryptoAmount = (crypto + crypto * 0.16) / current_price;

      sdk.wallet
        .transfer(walletAddress, cryptoAmount, contractAddresss,)
        .then( async (txResult) => {
          const {transactionHash}=txResult?.receipt||{}
          (await marketPlaceInstance()).get(`convertCryptoToToken/${user?.id}/${address}/${tokens}/${transactionHash}`)
            .then((response) => {
              setBuyLoading(false);
              if (response.data.success) {
                setUser(response?.data?.user)
                toast.success(`Successfully Purchased ${tokens} Tokens`);
                reward();
                getUserDataInstant();
              } else {
                toast.error(response?.data?.message);
              }
            })
            .catch((error) => {
              setBuyLoading(false);
              toast.error("Token Buy Failed");
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
          setBuyLoading(false);
          if (error?.reason === "ERC20: transfer amount exceeds balance") {
            toast.error("You don't have sufficient balance in your Scrooge");
          } else {
            toast.error(error?.reason);
          }
        });
    } catch (error) {
      setBuyLoading(false)
      toast.error("Token Buy Fail");
      console.log("errordata", error);
    }
  };

  const handleChange=(value)=>{
    setSelectedDropdown(value);
  }
  return (
    <Layout>
      <main className='main redeem-prizes-page'>
        <div className='container'>
          {buyLoading ? (
            <div className='pageImgContainer'>
              <img src={LoadingPoker} alt='game' className='imageAnimation' />
              <div className='loading-txt pulse'>PURCHASING TOKENS...</div>
            </div>
          ) : (
            <></>
          )}
          <div className='scrooge-main-heading'>
            <div className='pageTitle'>
              <h1 className='title'>Convert Your Crypto To Token</h1>
            </div>
            <div className='feature-overview-div'>
              Ready to cash in on all of your big wins? Browse through our huge
              list of amazing prizes and find something you just can't live
              without. Make sure you have enough available tickets for the prize
              you want, then click the REDEEM PRIZE button!
            </div>
            <div className='asterisk-desc cryptoTotoken'>
              Disclaimer : +16% will be added to the transaction to cover
              blockchain fees and contract taxes!
            </div>
           
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic-transition">
              {!selectedDropdown ? "select" : selectedDropdown}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  eventKey="busd"
                  onClick={() => handleChange("BUSD")}
                >
                  BUSD
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="og"
                  onClick={() => handleChange("Scrooge")}
                >
                  Scrooge
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="jr"
                   onClick={() => handleChange("Scrooge JR")}
                >
                  Scrooge JR
                </Dropdown.Item>
                
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className='buy-chips-content'>
            <div className='buy-chips-grid'>
              <div className='buy-chips-grid-box'>
                {/* <p>25000 </p> */}
                <img src={coin3} alt='coin' />

                <div
                  className='gradient-btn'
                  onClick={() => convert("OG", 10, 1000)}>
                  <span>10$ WORTH SCROOGE OG gets you 1000 Tokens </span>
                </div>
              </div>
              <div className='buy-chips-grid-box'>
                {/* <p>25000 </p> */}
                <img src={coin3} alt='coin' />

                <div
                  className='gradient-btn'
                  onClick={() => convert("JR", 10, 1000)}>
                  <span>10$ WORTH SCROOGE JR gets you 1000 Tokens </span>
                </div>
              </div>
              <div className='buy-chips-grid-box'>
                {/* <p>20000 </p> */}

                <div className='chips-images'>
                  <img src={coin4} alt='coin' />
                  <img src={coin3} alt='coin' />
                </div>

                <div
                  className='gradient-btn'
                  onClick={() => convert("OG", 20, 2000)}>
                  <span>20$ WORTH SCROOGE OG gets you 2000 Tokens </span>
                </div>
              </div>
              <div className='buy-chips-grid-box'>
                {/* <p>20000 </p> */}

                <div className='chips-images'>
                  <img src={coin4} alt='coin' />
                  <img src={coin3} alt='coin' />
                </div>

                <div
                  className='gradient-btn'
                  onClick={() => convert("JR", 20, 2000)}>
                  <span>20$ WORTH SCROOGE JR gets you 2000 Tokens </span>
                </div>
              </div>
              <div className='buy-chips-grid-box'>
                {/* <p>10000 </p> */}
                <img src={coin2} alt='coin' />

                <div
                  className='gradient-btn'
                  onClick={() => convert("OG", 50, 5000)}>
                  <span>50$ WORTH SCROOGE OG gets you 5000 Tokens </span>
                </div>
              </div>
              <div className='buy-chips-grid-box'>
                {/* <p>10000 </p> */}
                <img src={coin2} alt='coin' />

                <div
                  className='gradient-btn'
                  onClick={() => convert("JR", 50, 5000)}>
                  <span>50$ WORTH SCROOGE JR gets you 5000 Tokens </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
