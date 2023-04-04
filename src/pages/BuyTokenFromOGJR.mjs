import { useState, useEffect, useContext } from "react";
import Layout from "./Layout.mjs";
import LoadingPoker from "../images/scroogeHatLogo.png";
import coin1 from "../images/4.png";
import coin2 from "../images/3.png";
import coin3 from "../images/2.png";
import coin4 from "../images/1.png";
import AuthContext from "../context/authContext.ts";
import { useCookies } from "react-cookie";
import { useAddress, useSDK, useSDKContext } from "@thirdweb-dev/react";
import { marketPlaceInstance, authInstance } from "../config/axios.js";
import { toast } from "react-toastify";
import { useReward } from "react-rewards";

export default function BuyTokenFromOGJR() {
  const { user, loading, setUser } = useContext(AuthContext);
  const [buyLoading, setBuyLoading] = useState(false);
  const { reward } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });
  const [cookies] = useCookies(["token"]);
  const sdk = useSDK();
  const address = useAddress();
  const OGWalletAddress = "0xDcD9738D4D9Ea8c723484b9DDf5f34Ab9A601D92";
  const JRWalletAddress = "0x4E0625BE79Aba0bd7596ad3698C9265D6CbbFAFf";
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

  const convert = async (type, crypto, tokens) => {
    let contractAddresss, walletAddress;
    setBuyLoading(true);
    if (!address) {
      setBuyLoading(false);
      return toast.error("Please Connect Your Metamask Wallet");
    } else if (type === "OG") {
      contractAddresss = process.env.REACT_APP_OGCONTRACT_ADDRESS;
      walletAddress = OGWalletAddress;
      console.log(process.env.OG_WALLET_ADDRESS);
    } else if (type === "JR") {
      contractAddresss = process.env.REACT_APP_JRCONTRACT_ADDRESS;
      walletAddress = JRWalletAddress;
    }
    console.log("wallet", walletAddress);
    console.log("contract", contractAddresss);
    try {
      const txResult = await sdk.wallet.transfer(
        walletAddress,
        crypto,
        contractAddresss
      );

      const response = await marketPlaceInstance().get(
        `convertCryptoToToken/${user?.id}/${address}/${tokens}`
      );
      setBuyLoading(false);
      if (response.data.success) {
        toast.success(`Successfully Purchased ${tokens} Tokens`);
        reward();
        getUserDataInstant();
      } else {
        toast.error("Token Buy Failed");
      }

      console.log(txResult);
    } catch (error) {
      setBuyLoading(false);
      toast.error("Token Buy Failed");
      console.log(error);
    }
  };
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
          </div>
          <div className='buy-chips-content'>
            <div className='buy-chips-grid'>
              <div className='buy-chips-grid-box'>
                <img src={coin4} alt='coin' />

                <div
                  className='gradient-btn'
                  onClick={() => convert("OG", 5, 510)}>
                  <span>5 SCROOGE OG gets you 510 chips </span>
                </div>
              </div>
              <div className='buy-chips-grid-box'>
                <img src={coin4} alt='coin' />

                <div
                  className='gradient-btn'
                  onClick={() => convert("JR", 5, 510)}>
                  <span>5 SCROOGE JR gets you 510 chips </span>
                </div>
              </div>

              <div className='buy-chips-grid-box'>
                {/* <p>25000 </p> */}
                <img src={coin3} alt='coin' />

                <div
                  className='gradient-btn'
                  onClick={() => convert("OG", 10, 1025)}>
                  <span>10 SCROOGE OG gets you 1025 chips </span>
                </div>
              </div>
              <div className='buy-chips-grid-box'>
                {/* <p>25000 </p> */}
                <img src={coin3} alt='coin' />

                <div
                  className='gradient-btn'
                  onClick={() => convert("JR", 10, 1025)}>
                  <span>10 SCROOGE JR gets you 1025 chips </span>
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
                  onClick={() => convert("OG", 15, 2600)}>
                  <span>15 SCROOGE OG gets you 2600 chips </span>
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
                  onClick={() => convert("JR", 15, 2600)}>
                  <span>15 SCROOGE JR gets you 2600 chips </span>
                </div>
              </div>
              <div className='buy-chips-grid-box'>
                {/* <p>10000 </p> */}
                <img src={coin2} alt='coin' />

                <div
                  className='gradient-btn'
                  onClick={() => convert("OG", 20, 5250)}>
                  <span>20 SCROOGE OG gets you 5250 chips </span>
                </div>
              </div>
              <div className='buy-chips-grid-box'>
                {/* <p>10000 </p> */}
                <img src={coin2} alt='coin' />

                <div
                  className='gradient-btn'
                  onClick={() => convert("JR", 20, 5250)}>
                  <span>20 SCROOGE JR gets you 5250 chips </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
