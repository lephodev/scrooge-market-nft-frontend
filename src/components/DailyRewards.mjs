import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import LoadingPoker from "../images/scroogeHatLogo.png";
import MoneyBagGreen from "../images/moneybagGreen.png";
import MoneyBagGray from "../images/moneybagGray.png";
import { useAddress } from "@thirdweb-dev/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Countdown from "react-countdown";
import { useReward } from "react-rewards";
import AuthContext from "../context/authContext.ts";
import { scroogeClient } from "../config/keys.js";
import { marketPlaceInstance } from "../config/axios.js";

function DailyRewards() {
  const { user } = useContext(AuthContext);
  console.log("useruser", user);
  const { reward, isAnimating } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });
  const [buyLoading, setBuyLoading] = useState(false);
  const [nextClaimDate, setNextClaimDate] = useState("Loading...");
  const [loader, setLoader] = useState(true);
  const [fullDailyRewards, setFullDailyRewards] = useState(false);
  /*const [OGBalance, setOGBalance]=useState("Loading...");
    const [currentPrice, setCurrentPrice]=useState("Loading...");
    const [email, setEmail]=useState('');
    const handleChange = event => {
        setEmail(event.target.value);
      };*/
  let user_id = "";
  const address = useAddress();
  //const isMismatched = useNetworkMismatch();
  function notify(message) {
    toast.success("🎩 " + message);
  }

  async function getNextClaimDate() {
    console.log("user---", user.id);
    try {
      if (user.id) {
        console.log("---");
        console.log(address);
        const data = await marketPlaceInstance().get(
          `/getNextClaimDate/${address}/daily/${user.id}/0`
        );
        setLoader(false);
        console.log("claimdat3e", data.data);
        if (data.data.success) {
          setFullDailyRewards(true);
          setNextClaimDate(data.data.data[0]);
        } else {
          setFullDailyRewards(false);
          setNextClaimDate("No Data Found");
        }
        return data.data;
      }
    } catch (error) {
      setLoader(false);
      console.log("clamdateerror", error);
    }
  }

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const claimTokens = async () => {
    console.log("user+++", user.id);
    setBuyLoading(true);
    user_id = user.id;
    console.log("user_id", user.id);
    try {
      const data = await marketPlaceInstance().get(
        `/claimDailyRewards/${user.id}`
      );
      console.log("datatatta", data);
      notify("Tokens Claimed: " + data.data);
      setBuyLoading(false);
      reward();
      zzz();
      //await timeout(4200);
      //window.location.reload();
    } catch (err) {
      console.error(err);
      notify("Error in claiming tokens!");
      setBuyLoading(false);
    }
  };

  const zzz = async () => {
    await getNextClaimDate();
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (user) {
      //console.log('UE zzz');
      zzz();
    }
  }, [user, address]);

  return (
    <>
      {console.log("fullDR", fullDailyRewards)}
      {!loader && !fullDailyRewards ? (
        <>
          <div className='daily-reward-card-div'>
            {console.log("nextclaimdate", nextClaimDate)}
            <div className='inlineTitle'>DAILY REWARDS</div>
            <div className='rewards'>
              <span>Last Claim Amount:</span> <p>{nextClaimDate.qty} Tokens</p>
            </div>
            <div className='rewards'>
              <span>Consecutive:</span>{" "}
              <p>{nextClaimDate.consecutive_days} day</p>
              {nextClaimDate.consecutive_days >= 2 ||
              nextClaimDate.consecutive_days === 0 ? (
                <>s</>
              ) : (
                <></>
              )}
            </div>
            <div className='available-btn'>
              <span>Available:</span>{" "}
              <Countdown date={nextClaimDate.nextClaimDate}>
                {/* <button
                          className='button-inline'
                          style={{ marginLeft: "20px" }}
                          onClick={() => claimTokens()}>
                          Claim NOW
                        </button> */}
                <div className='new-btn'>
                  <button onClick={() => claimTokens()}>Claim NOW</button>
                </div>
              </Countdown>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='bordered-section'>
            {user && nextClaimDate.nextClaimDate ? (
              <div className='prizes_container'>
                <div
                  className='prizes-card'
                  style={{ width: "100%", margin: "0 auto" }}
                >
                  <div className='pageTitle' style={{ margin: "20px auto" }}>
                    <h1>Claim Your Daily Rewards</h1>
                  </div>
                  <div>
                    Get free tokens, well, for FREE! Visit daily to earn more.
                  </div>
                  <div
                    className='prizes-chip-count'
                    style={{ marginTop: "35px" }}
                  >
                    <div className='additional-info-div'>
                      You have claimed your daily rewards{" "}
                      {nextClaimDate.consecutive_days} day
                      {nextClaimDate.consecutive_days >= 2 ||
                      nextClaimDate.consecutive_days === 0 ? (
                        <>s</>
                      ) : (
                        <></>
                      )}{" "}
                      in a row.
                      <div className='daily-reward-bag-div'>
                        <div className='daily-rewards-bag-card'>
                          {nextClaimDate.consecutive_days > 0 ? (
                            <>
                              <div>
                                <img
                                  className='daily-reward-bag'
                                  src={MoneyBagGreen}
                                  alt='daily reward money bag'
                                />
                              </div>
                              <div className='green'>25 Tokens</div>
                            </>
                          ) : (
                            <>
                              <div>
                                <img
                                  className='daily-reward-bag'
                                  src={MoneyBagGray}
                                  alt='daily reward money bag'
                                />
                              </div>
                              <div className='red'>25 Tokens</div>
                            </>
                          )}
                        </div>
                        <div className='daily-rewards-bag-card'>
                          {nextClaimDate.consecutive_days > 1 ? (
                            <>
                              <div>
                                <img
                                  className='daily-reward-bag'
                                  src={MoneyBagGreen}
                                  alt='daily reward money bag'
                                />
                              </div>
                              <div className='green'>35 Tokens</div>
                            </>
                          ) : (
                            <>
                              <div>
                                <img
                                  className='daily-reward-bag'
                                  src={MoneyBagGray}
                                  alt='daily reward money bag'
                                />
                              </div>
                              <div className='red'>35 Tokens</div>
                            </>
                          )}
                        </div>
                        <div className='daily-rewards-bag-card'>
                          {nextClaimDate.consecutive_days > 2 ? (
                            <>
                              <div>
                                <img
                                  className='daily-reward-bag'
                                  src={MoneyBagGreen}
                                  alt='daily reward money bag'
                                />
                              </div>
                              <div className='green'>45 Tokens</div>
                            </>
                          ) : (
                            <>
                              <div>
                                <img
                                  className='daily-reward-bag'
                                  src={MoneyBagGray}
                                  alt='daily reward money bag'
                                />
                              </div>
                              <div className='red'>45 Tokens</div>
                            </>
                          )}
                        </div>
                        <div className='daily-rewards-bag-card'>
                          {nextClaimDate.consecutive_days > 3 ? (
                            <>
                              <div>
                                <img
                                  className='daily-reward-bag'
                                  src={MoneyBagGreen}
                                  alt='daily reward money bag'
                                />
                              </div>
                              <div className='green'>60 Tokens</div>
                            </>
                          ) : (
                            <>
                              <div>
                                <img
                                  className='daily-reward-bag'
                                  src={MoneyBagGray}
                                  alt='daily reward money bag'
                                />
                              </div>
                              <div className='red'>60 Tokens</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    Your last claim amount was {nextClaimDate.qty} Tokens
                  </div>
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <div id='rewardId' style={{ margin: "0 auto" }} />
                  </div>
                  {new Date(nextClaimDate.nextClaimDate) <= new Date() ||
                  nextClaimDate === "CLAIM NOW" ? (
                    <button className='button2' onClick={() => claimTokens()}>
                      Claim Tokens
                    </button>
                  ) : (
                    <>
                      <div className='next-claim-div next-claim-box'>
                        {nextClaimDate !== "Loading..." ? (
                          <>
                            Next Claim Available :{" "}
                            <Countdown date={nextClaimDate.nextClaimDate}>
                              <div className='new-btn'>
                                <button
                                  // className='submit-btn'
                                  onClick={() => claimTokens()}
                                >
                                  Claim Tokens
                                </button>
                              </div>
                            </Countdown>
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
                    </>
                  )}

                  <div className='fine-print-txt' style={{ marginTop: "40px" }}>
                    *Your claimed tokens will automatically be added to your
                    connected{" "}
                    <a
                      href={scroogeClient}
                      alt='Visit Scrooge Casino'
                      target='_blank'
                      rel='noreferrer'
                    >
                      Scrooge Casino
                    </a>{" "}
                    account.
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ width: "100%", textAlign: "center" }}>
                <img
                  src={LoadingPoker}
                  alt='game'
                  className='imageAnimation'
                  style={{ margin: "0 auto" }}
                />
              </div>
            )}
          </div>
        </>
      )}

      {buyLoading ? (
        <div className='pageImgContainer'>
          <img src={LoadingPoker} alt='game' className='imageAnimation' />
          <div className='loading-txt pulse'>CLAIMING TOKENS...</div>
        </div>
      ) : (
        <></>
      )}

      <ToastContainer
        position='top-center'
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </>
  );
}

export default DailyRewards;
