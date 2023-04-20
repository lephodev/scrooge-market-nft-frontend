/* eslint-disable react-hooks/exhaustive-deps */
import {
  useAddress,
  useOwnedNFTs,
  useContract,
  ThirdwebNftMedia,
  ChainId,
} from "@thirdweb-dev/react";
import { useCookies } from "react-cookie";

import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import ChainContext from "../context/Chain.ts";
import DLBigD from "../images/DLBigD.png";
import Countdown from "react-countdown";
import { useReward } from "react-rewards";
import AuthContext from "../context/authContext.ts";
import { scroogeClient } from "../config/keys.js";
import { authInstance, marketPlaceInstance } from "../config/axios.js";
import { toast } from "react-toastify";

export default function GetWalletDLNFTs() {
  const { user, setUser } = useContext(AuthContext);
  const { reward } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });
  function notify(message) {
    toast.success("🎩 " + message);
  }
  const { selectedChain, setSelectedChain } = useContext(ChainContext);
  setSelectedChain(ChainId.Mainnet);
  console.log("ChainId.Mainnet", ChainId.Mainnet);
  // const addresses = {
  //   [String(ChainId.Mainnet)]: process.env.REACT_APP_MAINNET_ADDRESS,
  //   [String(ChainId.BinanceSmartChainMainnet)]: "",
  // };
  const [cookies] = useCookies(["token"]);

  const address = useAddress();
  const [buyLoading, setBuyLoading] = useState(false);
  const [nextClaimDate, setNextClaimDate] = useState("");
  const [nfts, setNFTs] = useState([]);
  const [tokensClaimDate, setTokensClaimDate] = useState([
    { token_id: "", nextClaimDate: "" },
  ]);
  const [claimDateArray, setClaimDateArray] = useState([]);
  console.log(tokensClaimDate);
  console.log(claimDateArray);
  const { contract } = useContract(
    "0xEe7c31b42e8bC3F2e04B5e1bfde84462fe1aA768"
  );
  console.log("contracttttt", contract);
  const { data: ownedNFTs, isLoading, error } = useOwnedNFTs(contract, address);
  //setNFTs(ownedNFTs);
  console.log("data", ownedNFTs, isLoading);
  console.log("error", error);

  const claimTokens = (token_id) => {
    setBuyLoading(true);
    try {
      marketPlaceInstance()
        .get(`/claimDLTokens/${address}/${user?.id}/${token_id}`)
        .then(async (data) => {
          mapClaimDates(nfts);
          notify("Tokens Claimed: " + data.data);
          setBuyLoading(false);
          reward();
          getUserDataInstant();
          //await timeout(4200);
          //window.location.reload();
        });
    } catch (err) {
      console.error(err);
      toast.error("Error claiming tokens!", { containerId: "claim-error" });
      setBuyLoading(false);
    }
  };

  async function getNextClaimDate(token_id) {
    console.log("--called nextcD");
    await marketPlaceInstance()
      .get(`/getNextClaimDate/${address}/dl/${user?.id}/${token_id}`)
      .then(async (data) => {
        console.log("next claim: ", data.data);
        if (data.data.success) {
          dataArray.push([token_id, data.data.data[0].nextClaimDate]);
          console.log("foo: ", dataArray);
          setClaimDateArray(dataArray);
          console.log("setClaimDateArray: ", claimDateArray);
          setTokensClaimDate((tokensClaimDate) => [
            {
              token_id: token_id.toString(),
              nextClaimDate: data.data.data[0].nextClaimDate,
            },
          ]);
          setNextClaimDate(data.data.data[0].nextClaimDate);
        } else {
          dataArray.push([token_id, data.data.message]);
          setClaimDateArray(dataArray);
          setTokensClaimDate((tokensClaimDate) => [
            { token_id: token_id.toString(), nextClaimDate: data.data.message },
          ]);
          setNextClaimDate(data.data.message);
        }
      });
    return nextClaimDate;
  }

  // async function getCountdown(token_id) {
  //   const thisNextClaimDate = await getNextClaimDate(token_id).then((data) => {
  //     //console.log("thisNextClaimDate: ", data);
  //     let t;
  //     if (data !== "CLAIM NOW") {
  //       t = new Date(data);
  //       t = t.getTime();
  //     } else {
  //       t = 0;
  //     }

  //     //console.log("in get countdown: ", parseInt(t));
  //     return <Countdown date={new Date(t)}></Countdown>;
  //   });
  // }

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

  useEffect(() => {
    console.log(
      "ChainId.BinanceSmartChainMainnet",
      ChainId.BinanceSmartChainMainnet
    );
    setNFTs(ownedNFTs);
    return () => setSelectedChain(ChainId.BinanceSmartChainMainnet);
  }, [address, ownedNFTs]);
  let dataArray = [];
  useEffect(() => {
    if (nfts) {
      if (nfts.length > 0) {
        mapClaimDates(nfts);
      }
    }
  }, [nfts]);

  async function mapClaimDates(nfts) {
    console.log("mapclaimdates");
    nfts.map((nft) => foo(nft.metadata.id));
    async function foo(id) {
      //console.log('nft: ', id);
      setTimeout(async () => {
        await getNextClaimDate(id);
      }, 900000000000000000);
    }
  }

  return (
    <div>
      {buyLoading ? (
        <div className='pageImgContainer-dl bg-animated'>
          <img
            className='spin dl-loader-img'
            src={DLBigD}
            alt='Ducky Lucks Loader'
            style={{ margin: "10px auto", width: "200px", height: "200px" }}
          />
          <div className='loading-txt pulse'>CLAIMING TOKENS...</div>
        </div>
      ) : (
        <></>
      )}
      {selectedChain !== ChainId.Mainnet ? (
        <>
          <div className='new-btn claim-token-btn'>
            {/* <div className='button-section'> */}
            <button
              // className='submit-btn'
              style={{ width: "350px", margin: "35px auto" }}
              onClick={() => setSelectedChain(ChainId.Mainnet)}>
              Display My Ducks
            </button>
            {/* </div> */}
          </div>
        </>
      ) : (
        <></>
      )}

      {isLoading && selectedChain === ChainId.Mainnet ? (
        <div className='button-section'>
          <div style={{ fontFamily: "Poppins" }}>
            LOADING YOUR DUCKY LUCKS NFTS
          </div>
          <img
            className='spin dl-loader-img'
            src={DLBigD}
            alt='Ducky Lucks Loader'
            style={{ margin: "10px auto", width: "200px", height: "200px" }}
          />
        </div>
      ) : (
        <div className='flex-row'>
          <div className='flex-column claim-free-token'>
            <div className='feature-overview-div'>
              <p>
                Did you know that you get FREE TOKENS EVERY MONTH just for being
                a cool motherducker and holding at least one{" "}
                <a
                  href='https://duckylucks.com'
                  target='_blank'
                  rel='noreferrer'
                  alt='claim free tokens for holding ducky lucks NFTs'>
                  Ducky Lucks NFT
                </a>{" "}
                in your wallet? Once every 30 days, you can come right to this
                page and claim your free{" "}
                <a
                  href={scroogeClient}
                  rel='noreferrer'
                  alt='claim free tokens to spend in Scrooge Casino'>
                  Scrooge Casino
                </a>{" "}
                tokens just by clicking the CLAIM FREE TOKENS button.
              </p>
              <p>
                Your claimable monthly token amount is automatically determined
                based on the rarity points of the Ducky Lucks you currently
                hold.
              </p>
            </div>
            <div className='pageTitle'>
              <h1>My Ducky Lucks</h1>
            </div>
          </div>

          <div style={{ width: "100%", textAlign: "center" }}>
            <div id='rewardId' style={{ margin: "0 auto" }} />
          </div>
          {console.log("nfts90909", nfts)}
          {nfts?.map((nft) => (
            <div className='erc721Card dlNft-grid' key={nft.metadata.id}>
              <div className='erc721Card-name'>
                {nft.metadata.name}
                <br></br>
                <br></br>
                <ThirdwebNftMedia
                  className='erc721Card-image'
                  key={nft.metadata.id}
                  metadata={nft.metadata}
                  height={300}
                />
              </div>
              <div className='erc721Card-details'>
                <span className='erc721Card-col-title'>TRAITS</span>
                <br></br>
                <br></br>
                Background: <span>{nft.metadata.attributes[4].value}</span>
                <br></br>
                Feathers: <span>{nft.metadata.attributes[5].value}</span>
                <br></br>
                Head: <span>{nft.metadata.attributes[6].value}</span>
                <br></br>
                Clothes: <span>{nft.metadata.attributes[7].value}</span>
                <br></br>
                Eyes: <span>{nft.metadata.attributes[8].value}</span>
                <br></br>
                Mouth: <span>{nft.metadata.attributes[9].value}</span>
                <br></br>
                Accessories: <span>{nft.metadata.attributes[10].value}</span>
                <br></br>
              </div>
              <div className='erc721Card-3rd-col'>
                <span className='erc721Card-col-title'>RARITY</span>
                <br></br>
                <br></br>
                Duck ID: <span>{nft.metadata.attributes[0].value}</span>
                <br></br>
                Token ID: <span>{nft.metadata.id}</span>
                <br></br>
                Brood: <span>{nft.metadata.attributes[3].value}</span>
                <br></br>
                Birthday: <span>{nft.metadata.attributes[2].value}</span>
                <br></br>
                Hash: <span>{nft.metadata.attributes[1].value}</span>
                <br></br>
                {nft.metadata.attributes[12].value <= 20 ? (
                  <div className='rarity-pct-1'>
                    Rarity Points:{" "}
                    <span>{nft.metadata.attributes[11].value}</span>
                    <br></br>
                    Rarity Percentage:{" "}
                    <span>{nft.metadata.attributes[12].value}%</span>
                    <br></br>
                    <strong>
                      Monthly Claimable Amount:{" "}
                      <span>
                        {(
                          500-nft.metadata.attributes[11].value
                        ).toFixed(0)}{" "}
                        Tokens
                      </span>
                    </strong>
                  </div>
                ) : (
                  <span></span>
                )}
                {console.log("nmav", nft.metadata.attributes[12].value)}
                {nft.metadata.attributes[12].value > 20 &&
                nft.metadata.attributes[12].value <= 30 ? (
                  <div className='rarity-pct-2'>
                    Rarity Points:{" "}
                    <span>{nft.metadata.attributes[11].value}</span>
                    <br></br>
                    Rarity Percentage:{" "}
                    <span>{nft.metadata.attributes[12].value}%</span>
                    <br></br>
                    <strong>
                      Monthly Claimable Amount:{" "}
                      <span>
                        {(
                          500 -nft.metadata.attributes[11].value
                        ).toFixed(0)}{" "}
                        Tokens
                      </span>
                    </strong>
                  </div>
                ) : (
                  <span></span>
                )}
                {nft.metadata.attributes[12].value > 30 &&
                nft.metadata.attributes[12].value <= 40 ? (
                  <div className='rarity-pct-3'>
                    Rarity Points:{" "}
                    <span>{nft.metadata.attributes[11].value}</span>
                    <br></br>
                    Rarity Percentage:{" "}
                    <span>{nft.metadata.attributes[12].value}%</span>
                    <br></br>
                    <strong>
                      Monthly Claimable Amount:{" "}
                      <span>
                        {(
                          500 -nft.metadata.attributes[11].value
                        ).toFixed(0)}{" "}
                        Tokens
                      </span>
                    </strong>
                  </div>
                ) : (
                  <span></span>
                )}
                {nft.metadata.attributes[12].value > 40 &&
                nft.metadata.attributes[12].value <= 50 ? (
                  <div className='rarity-pct-4'>
                    Rarity Points:{" "}
                    <span>{nft.metadata.attributes[11].value}</span>
                    <br></br>
                    Rarity Percentage:{" "}
                    <span>{nft.metadata.attributes[12].value}%</span>
                    <br></br>
                    <strong>
                      Monthly Claimable Amount:{" "}
                      <span>
                        {(
                          500 -nft.metadata.attributes[11].value 
                        ).toFixed(0)}{" "}
                        Tokens
                      </span>
                    </strong>
                  </div>
                ) : (
                  <span></span>
                )}
                {nft.metadata.attributes[12].value > 50 &&
                nft.metadata.attributes[12].value <= 60 ? (
                  <div className='rarity-pct-5'>
                    Rarity Points:{" "}
                    <span>{nft.metadata.attributes[11].value}</span>
                    <br></br>
                    Rarity Percentage:{" "}
                    <span>{nft.metadata.attributes[12].value}%</span>
                    <br></br>
                    <strong>
                      Monthly Claimable Amount:{" "}
                      <span>
                        {(
                          500-nft.metadata.attributes[11].value
                        ).toFixed(0)}{" "}
                        Tokens
                      </span>
                    </strong>
                  </div>
                ) : (
                  <span></span>
                )}
                {nft.metadata.attributes[12].value > 60 &&
                nft.metadata.attributes[12].value <= 70 ? (
                  <div className='rarity-pct-6'>
                    Rarity Points:{" "}
                    <span>{nft.metadata.attributes[11].value}</span>
                    <br></br>
                    Rarity Percentage:{" "}
                    <span>{nft.metadata.attributes[12].value}%</span>
                    <br></br>
                    <strong>
                      Monthly Claimable Amount:{" "}
                      <span>
                        {(
                          500 -nft.metadata.attributes[11].value
                        ).toFixed(0)}{" "}
                        Tokens
                      </span>
                    </strong>
                  </div>
                ) : (
                  <span></span>
                )}
              </div>
              <div className='erc721Card-4th-col'>
                {claimDateArray.length === nfts.length ? (
                  <>
                    {claimDateArray
                      .find((element) => element[0] === nft.metadata.id)[1]
                      .toString() === "No Entries Found" ? (
                      <>
                        <button
                          className='subheader-btn'
                          onClick={() => claimTokens(nft.metadata.id)}>
                          CLAIM FREE TOKENS!
                        </button>
                      </>
                    ) : (
                      <>
                        <div>
                          NEXT CLAIM AVAILABLE:
                          <Countdown
                            date={
                              new Date(
                                claimDateArray.find(
                                  (element) => element[0] === nft.metadata.id
                                )[1]
                              )
                            }></Countdown>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div>
                    <img
                      className='spin dl-loader-img'
                      src={DLBigD}
                      alt='Ducky Lucks Loader'
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
