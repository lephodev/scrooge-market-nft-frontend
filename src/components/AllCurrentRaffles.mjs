import { useEffect, useState } from "react";
import Axios from "axios";
import {
  ConnectWallet,
  useNetworkMismatch,
  useAddress,
  ChainId,
  useSDK,
} from "@thirdweb-dev/react";
import Countdown from "react-countdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TicketsGIF from "../images/ticketsGif.gif";
import { marketPlaceInstance } from "../config/axios.js";

export default function AllCurrentRaffles() {
  let raffle_id;
  const [raffles, setRaffles] = useState([]);
  const [items, setItems] = useState([]);
  const [user, setUser] = useState([]);
  const [userRaffleTickets, setUserRaffleTickets] = useState([]);
  const [showLeaderboards, setShowLeaderboards] = useState(true);
  const [leaderboardByCount, setLeaderboardByCount] = useState([]);
  const [leaderboardByTokens, setLeaderboardByTokens] = useState([]);
  const [currentPriceOG, setCurrentPriceOG] = useState();
  const sdk = useSDK();
  const address = useAddress();
  const [data, setData] = useState();

  const handlePurchase = async (amt, item_id) => {
    try {
      const initEntryPurchase = await Axios.get(
        `https://34.237.237.45:9001/api/initEntryPurchase/${user[0]}/${address}/${amt}/${item_id}`
      ).then(async (data) => {
        const price = (amt / currentPriceOG).toFixed(0);
        const purchase = await sdk.wallet.transfer(
          "0xEcc9A9EFB21e71c2a794DEb28CA512dD05363a45",
          0.5,
          "0xe9e7cea3dedca5984780bafc599bd69add087d56"
        );
        //console.log('purchase: ', purchase); //${purchase.receipt.transactionHash}
        const finalizeEntryPurchase = await Axios.get(
          `https://34.237.237.45:9001/api/finalizeEntryPurchase/${user[0]}/${address}/${amt}/${data.data}/${purchase.receipt.transactionHash}`
        ).then(async (resp) => {
          if (resp.data >= 1) {
            toast("Purchase successful! You bought " + resp.data + " tickets!");
          } else {
            toast("Purchase unsuccessful! " + resp.data);
          }
          return resp.data;
        });
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const encrypt = async () => {
    let encrypted;
    setData("");
    const base64data = Buffer.from("Product 1").toString("base64");
    try {
      Axios.get(`https://34.237.237.45:9001/api/encrypt/${base64data}`).then(
        async (data) => {
          //console.log("encrypt: ", data.data);
          encrypted = data.data;
          setData(data.data);
          return data.data;
        }
      );
    } catch (err) {
      console.error(err);
    }
    //console.log('encrypted: ', encrypted);
    return encrypted;
  };

  const decrypt = async (data) => {
    let encrypted;
    //setData('');
    //const base64data = Buffer.from(data).toString('base64');
    try {
      Axios.get(`https://34.237.237.45:9001/api/decrypt/${data}`).then(
        async (data) => {
          //console.log("decrypt: ", data.data);
          encrypted = data.data;
          setData(data.data);
          return data.data;
        }
      );
    } catch (err) {
      console.error(err);
    }
    //console.log('encrypted: ', encrypted);
    return encrypted;
  };

  // async function getCurrentRaffles() {
  //     try {
  //         Axios.get(`https://34.237.237.45:9001/api/getCurrentRaffles/0/0`).then(async (data)=>{
  //             setRaffles(data.data);
  //             return data.data;
  //         });
  //     } catch (err) {
  //         console.error(err);
  //     };
  // }

  async function getCurrentRaffles() {
    try {
      const res = await marketPlaceInstance().get(`/getCurrentRaffles/0/0`);
      console.log("res", res);
      if (res.data) {
        setRaffles(res.data);
        return res.data;
      }
    } catch (e) {
      console.log(e);
    }
  }

  //   async function getItems() {
  //     try {
  //       Axios.get(`https://34.237.237.45:9001/api/getItems/entry`).then(
  //         async (data) => {
  //           setItems(data.data);
  //           return data.data;
  //         }
  //       );
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  async function getItems() {
    try {
      const res = await marketPlaceInstance().get(`/getItems/entry`);
      console.log("res", res);
      if (res.data) {
        setItems(res.data);
        return res.data;
      }
    } catch (e) {
      console.log(e);
    }
  }
  //   async function enterRaffle(raffle_id) {
  //     try {
  //       Axios.get(
  //         `https://34.237.237.45:9001/api/enterRaffle/${raffle_id}/${user[0]}/${address}`
  //       ).then(async (data) => {
  //         toast(data.data);
  //         return data.data;
  //       });
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }

  async function enterRaffle(raffle_id) {
    console.log("user[0]", user[0]);
    try {
      const res = await marketPlaceInstance().get(
        `enterRaffle/${raffle_id}/${user[0]}/${address}`
      );
      console.log("res", res);
      if (res.data) {
        toast(res?.data);
        return res.data;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function checkToken() {
    const initUser = async () => {
      try {
        Axios.get(
          `https://34.237.237.45:9001/api/getUserRaffleTickets/${user.id}`
        ).then(async (data) => {
          setUserRaffleTickets(data.data.tickets);
          return data.data;
        });
      } catch (err) {
        console.error(err);
      }
      //return res;
    };
    initUser();
  }

  async function getCoinGeckoDataOG() {
    await fetch(
      `https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${process.env.REACT_APP_OGCONTRACT_ADDRESS}`
    )
      .then((response) => response.json())
      .then((data) => {
        const current_price = data.market_data.current_price.usd;
        setCurrentPriceOG(current_price);
        return current_price;
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  }

  useEffect(() => {
    if (raffles.length === 0) {
      console.log("Refledddd");
      getCurrentRaffles();
    }
    if (user.length === 0) {
      checkToken();
    }
    if (items.length === 0) {
      getItems();
    }
    if (!currentPriceOG) {
      getCoinGeckoDataOG();
    }
  }, []);

  return (
    <>
      <div className='half-page-menu-wrapper'>
        <div className='half-page-card-menu-div'>
          <div
            className='feature-overview-div1'
            style={{ margin: "5px auto", width: "100%", textAlign: "center" }}
          >
            <div className='flex-row-no-margin'>
              <div>
                <div className='raffles-page-card'>
                  <img
                    className='wallet-casino-profile-img'
                    src={user}
                    alt='Scrooge-Casino-profilepicture'
                  />
                </div>
              </div>

              <div>
                <div className='inlineTitle' style={{ fontSize: "20px" }}>
                  RAFFLE TICKET BALANCE
                </div>

                <div>
                  YOU HAVE{" "}
                  <span
                    className='green'
                    style={{ fontSize: "26px", fontWeight: "bold" }}
                  >
                    {userRaffleTickets} TICKETS
                  </span>{" "}
                  TO SPEND
                </div>
              </div>
            </div>
          </div>
          <div
            className='feature-overview-div3'
            style={{ margin: "5px auto", width: "100%", textAlign: "left" }}
          >
            <p>
              Scrooge Raffles are the perfect way to finally get that incredible
              prize you've had your eye on but couldn't afford.
            </p>
            <p>
              {" "}
              Simply purchase a Scrooge Entry NFT from below and you will
              automatically recieve your NFT, and your Scrooge Raffles account
              will be credited with your bonus raffle entry tickets.
            </p>
          </div>
          <div
            className='feature-overview-div3'
            style={{ margin: "5px auto", width: "100%", textAlign: "center" }}
          >
            <div style={{ fontSize: "20px" }}>
              Winning big with Scrooge Raffles is as easy as 1, 2, 3!
            </div>
            <div className='flex-row-no-margin' style={{ marginTop: "25px" }}>
              {/* <div className='feature-overview-block'>1. BUY TICKETS</div> */}
              {/* <div className='feature-overview-block'>2. CHOOSE RAFFLE</div> */}
              <div className='new-btn'>
                <button>1. BUY TICKETS</button>
              </div>
              <div className='new-btn'>
                <button>2. CHOOSE RAFFLE</button>
              </div>
              <div
                className='feature-overview-block bg-animated2'
                style={{ fontWeight: "bold" }}
              >
                3. WIN BIG!
              </div>
            </div>
          </div>
        </div>

        {raffles.length !== 0 ? (
          <>
            <div className='leaderboard-card-div' style={{ margin: "0 auto" }}>
              <div className='pulse'>
                <strong>ENTER TO WIN!</strong>
              </div>
              <div className='teeter'>
                <div className='ending-soon bg-animated3'>ENDING SOON</div>
              </div>
              <div
                className='pageTitless text-animate'
                style={{ marginBottom: "-20px" }}
              >
                <h1>{raffles[0].prize_details.name}</h1>
              </div>
              <div className='flex-row-no-margin'>
                <div className='raffle-data-box'>
                  <div>
                    <strong>ENTRY FEE:</strong>
                  </div>
                  <div>{raffles[0].entry_fee} Tickets</div>
                </div>
                <div>
                  <img
                    className='raffle-img pulse'
                    src={raffles[0].prize_details.image_url}
                    alt='Scrooge raffle prize'
                  />
                </div>
                <div className='raffle-data-box'>
                  <div>
                    <strong>DRAW:</strong>
                  </div>
                  <div>
                    <Countdown date={raffles[0].end_date}></Countdown>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: "25px" }}>
                {raffles[0].prize_details.description}
              </div>
              <div className='leaderboard-row'>
                <div>
                  <div>
                    <strong># OF PRIZES</strong>
                  </div>
                  <div>{raffles[0].prize_qty}</div>
                </div>
                <div>
                  <div>
                    <strong># OF ENTRIES</strong>
                  </div>
                  <div>{raffles[0].entries_count}</div>
                </div>
                <div>
                  <div>
                    <strong>TOTAL VALUE</strong>
                  </div>
                  <div>
                    {(
                      raffles[0].prize_details.price * raffles[0].prize_qty
                    ).toLocaleString("en-US")}{" "}
                    Tokens
                  </div>
                </div>
              </div>
              <div className='new-btn'>
                <button
                  // className='button4'
                  style={{ width: "60%", margin: "35px auto 0 auto" }}
                  onClick={() => enterRaffle(raffles[0]._id)}
                >
                  ENTER RAFFLE
                </button>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      {items.length !== 0 && currentPriceOG ? (
        <>
          <div
            className='pageTitless text-animate'
            style={{ marginBottom: "20px" }}
          >
            <h1>BUY SCROOGE RAFFLE ENTRY NFTS</h1>
          </div>
          <div className='raffles-header-shop-div'>
            {items.slice(0, 4).map((item, index) => (
              <>
                <div className='raffles-header-shop-card' key={item + index}>
                  <div>
                    <h4>{item.name}</h4>
                  </div>
                  <div>
                    <img
                      className='card-img'
                      src={item.image_url}
                      alt='purchase scrooge raffle NFTs'
                    />
                  </div>
                  <div
                    className='green'
                    style={{ fontWeight: 600, fontSize: "18px" }}
                  >
                    SPECIAL BONUS:<br></br> {item.chip_value} FREE RAFFLE ENTR
                    {item.chip_value > 1 ? <span>IES</span> : <span>Y</span>}
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    PRICE:{" "}
                    {(
                      parseInt(item.price.$numberDecimal) / currentPriceOG
                    ).toFixed(0)}{" "}
                    SCROOGE
                  </div>
                  <div style={{ fontSize: "12px" }}>
                    (~ ${parseInt(item.price.$numberDecimal)} USD)
                  </div>
                  <div className='card-btn' style={{ marginTop: "15px" }}>
                    <button
                      onClick={() =>
                        handlePurchase(
                          parseInt(item.price.$numberDecimal),
                          item._id
                        )
                      }
                      className='gradient-btn pulse'
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              </>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}

      {raffles.length !== 0 ? (
        <>
          <div className='min-menu-div' style={{ marginTop: "40px" }}>
            <div>FILTER BY:</div>
            <button
              className='min-menu-btn'
              onClick={() => {
                alert(true);
              }}
            >
              BADGES
            </button>
            <button
              className='min-menu-btn'
              onClick={() => {
                alert(true);
              }}
            >
              CRYPTO
            </button>
            <button
              className='min-menu-btn'
              onClick={() => {
                alert(true);
              }}
            >
              MERCH
            </button>
            <button
              className='min-menu-btn'
              onClick={() => {
                alert(true);
              }}
            >
              NFTS
            </button>
          </div>

          <div className='bordered-section'>
            <div className='pageTitless text-animate'>
              <h1>CURRENT RAFFLES</h1>
            </div>
            <div className='flex-row-no-margin raffles-card-grid'>
              {raffles.map((raffle) => (
                <div className='leaderboard-card-div' key={raffle._id}>
                  <div className='teeter'>
                    <strong>ENTER TO WIN!</strong>
                  </div>

                  <div
                    className='pageTitless text-animate'
                    style={{ marginBottom: "-20px" }}
                  >
                    <h4>{raffle.prize_details.name}</h4>
                  </div>
                  <div className='flex-row-no-margin'>
                    <div className='raffle-data-box'>
                      <div>
                        <strong>ENTRY FEE:</strong>
                      </div>
                      <div>{raffle.entry_fee} Tickets</div>
                    </div>
                    <div>
                      <img
                        className='raffle-img pulse'
                        src={raffle.prize_details.image_url}
                        alt='Scrooge raffle prize'
                      />
                    </div>
                    <div className='raffle-data-box'>
                      <div>
                        <strong>DRAW:</strong>
                      </div>
                      <div>
                        <Countdown date={raffle.end_date}></Countdown>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: "25px" }}>
                    {raffle.prize_details.description}
                  </div>
                  <div className='leaderboard-row'>
                    <div>
                      <div>
                        <strong># OF PRIZES</strong>
                      </div>
                      <div>{raffle.prize_qty}</div>
                    </div>
                    <div>
                      <div>
                        <strong># OF ENTRIES</strong>
                      </div>
                      <div>{raffle.entries_count}</div>
                    </div>
                    <div>
                      <div>
                        <strong>TOTAL VALUE</strong>
                      </div>
                      <div>
                        {(
                          raffle.prize_details.price * raffle.prize_qty
                        ).toLocaleString("en-US")}{" "}
                        Tokens
                      </div>
                    </div>
                  </div>
                  <div className='new-btn'>
                    <button
                      // className='button4'
                      style={{ width: "60%", margin: "35px auto 0 auto" }}
                      onClick={() => enterRaffle(raffle._id)}
                    >
                      ENTER RAFFLE
                    </button>
                  </div>
                  <div
                    className='fine-print-txt'
                    style={{ marginTop: "15px", color: "darkgray" }}
                  >
                    Raffle ID: {raffle._id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
