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
  const { reward, isAnimating } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });
  const [buyLoading, setBuyLoading] = useState(false);
  const [nextClaimDate, setNextClaimDate] = useState("Loading...");
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
        console.log("claimdat3e", data);
        if (data.success) {
          setFullDailyRewards(true);
          setNextClaimDate(data.data);
        } else {
          setFullDailyRewards(false);
          setNextClaimDate("No Data Found");
        }
        return data.data;
      }
    } catch (error) {
      console.log("clamdateerror", error);
    }
  }

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const claimTokens = async () => {
    console.log("user+++", user[0]);
    setBuyLoading(true);
    user_id = user[0];
    try {
      const data = await marketPlaceInstance().get(
        `/claimDailyRewards/${user.id}`
      );
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
  }, [user]);

  return (
    <>
      {console.log(fullDailyRewards)}
      {fullDailyRewards ? (
        <>
          <div className='bordered-section'>
            {user[0] && user[0] !== "" && nextClaimDate.nextClaimDate ? (
              <div className='prizes_container'>
                <div
                  className='prizes-card'
                  style={{ width: "95%", margin: "0 auto" }}>
                  <div className='pageTitle' style={{ margin: "20px auto" }}>
                    <h1>Claim Your Daily Rewards</h1>
                  </div>
                  <div>
                    Get free tokens, well, for FREE! Visit daily to earn more.
                  </div>
                  <div
                    className='prizes-chip-count'
                    style={{ marginTop: "35px" }}>
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
                      <div className='next-claim-div'>
                        {nextClaimDate !== "Loading..." ? (
                          <>
                            Next Claim Available:<br></br>
                            <Countdown date={nextClaimDate.nextClaimDate}>
                              <button
                                className='submit-btn'
                                onClick={() => claimTokens()}>
                                Claim Tokens
                              </button>
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
                      rel='noreferrer'>
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
      ) : (
        <>
          {!nextClaimDate.nextClaimDate ? (
            <div className='daily-reward-card-div'>
              <div className='inlineTitle'>DAILY REWARDS</div>
              <div>
                <strong>Last Claim Amount:</strong> {nextClaimDate.qty} Tokens
              </div>
              <div>
                <strong>Consecutive:</strong> {nextClaimDate.consecutive_days}{" "}
                day
                {nextClaimDate.consecutive_days >= 2 ||
                nextClaimDate.consecutive_days === 0 ? (
                  <>s</>
                ) : (
                  <></>
                )}
              </div>
              <div>
                <strong>Available:</strong>{" "}
                <Countdown date={nextClaimDate.nextClaimDate}>
                  <button
                    className='button-inline'
                    style={{ marginLeft: "20px" }}
                    onClick={() => claimTokens()}>
                    Claim NOW
                  </button>
                </Countdown>
              </div>
            </div>
          ) : (
            <></>
          )}
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
