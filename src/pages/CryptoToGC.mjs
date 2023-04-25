/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from "react";
import Layout from "./Layout.mjs";
import LoadingPoker from "../images/scroogeHatLogo.png";
//import coin1 from "../images/4.png";
// import coin2 from "../images/3.png";
import coin3 from "../images/2.png";
//import coin4 from "../images/1.png";
import AuthContext from "../context/authContext.ts";
import { useCookies } from "react-cookie";

import {
  useAddress,
  ConnectWallet,
  useContractWrite,
  useContract,
} from "@thirdweb-dev/react";
import { marketPlaceInstance, authInstance } from "../config/axios.js";
import { toast } from "react-toastify";
import { useReward } from "react-rewards";

export default function CryptoToGC() {
  const { user, setUser } = useContext(AuthContext);
  const [prizesLoading, setPrizesLoading] = useState([]);
  const [allPrizes, setAllPrizes] = useState([]);
  const [buyLoading, setBuyLoading] = useState(false);
  const { reward } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });
  const [cookies] = useCookies(["token"]);
  const address = useAddress();
  const { contract } = useContract(process.env.REACT_APP_NATIVE_TOKEN_ADDRESS);
  console.log("contractbusd", contract);

  console.log(prizesLoading);

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

  // getGCPackages
  async function getGCPackages() {
    console.log("dfdfdfdfd");
    setPrizesLoading(true);
    try {
      const res = await marketPlaceInstance().get(`/getGCPackages`);
      console.log("res", res);
      if (res.data) {
        setPrizesLoading(false);
        setAllPrizes(res.data || []);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const convert = async (busd, gc,pid) => {
    console.log(busd);
    setBuyLoading(true);
    if (!address) {
      setBuyLoading(false);
      return toast.error("Please Connect Your Metamask Wallet");
    }
    try {
      const txResult = await contract.call("transfer", [
        "0xDcD9738D4D9Ea8c723484b9DDf5f34Ab9A601D92",
        busd,
      ]);
      console.log("txResult", txResult);
      if (txResult.receipt) {
        const {transactionHash}=txResult?.receipt||{}
        marketPlaceInstance()
          .get(
            `convertCryptoToGoldCoin/${user?.id}/${address}/${transactionHash}/${pid}`
          )
          .then((response) => {
            setBuyLoading(false);
            if (response.data.success) {
              console.log("ddfdf", response.data);
              setUser(response?.data?.user);
              toast.success(`Successfully Purchased ${gc} Tokens`);
              reward();
              getUserDataInstant();
            } else {
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
              <h1 className='title'>Convert Your Crypto To Gold Coins</h1>
            </div>
            <div className='feature-overview-div'>
              Ready to cash in on all of your big wins? Browse through our huge
              list of amazing prizes and find something you just can't live
              without. Make sure you have enough available crypto for the prize
              you want, then click the REDEEM PRIZE button!
            </div>
            <div className='asterisk-desc cryptoTotoken'>
              Disclaimer : +16% will be added to the transaction to cover
              blockchain fees and contract taxes!
            </div>
          </div>
          {address ? (
            <div className='buy-chips-content'>
              <div className='buy-chips-grid'>
                {allPrizes.map((prize) => (
                  
                  <div className='buy-chips-grid-box'>
                    <img src={coin3} alt='coin' />
                    {console.log("prize",prize)}
                    <div
                      className='gradient-btn'
                      onClick={() =>
                        convert(prize.priceInBUSD, prize.gcAmount,prize._id)
                      }>
                      <span>
                        {prize.priceInBUSD} BUSD gets you {prize.gcAmount} GOLD
                        COINS
                      </span>
                    </div>
                  </div>
                ))}
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
      </main>
    </Layout>
  );
}
