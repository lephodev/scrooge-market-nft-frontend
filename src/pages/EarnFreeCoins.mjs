import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import HolderClaimChips from "./HolderClaimChips.mjs";
import { DLGate } from "../components/DLGate.jsx";
import DLClaimTokens from "./DLClaimTokens.mjs";
import Layout from "./Layout.mjs";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import DailyRewards from "../components/DailyRewards.mjs";
import AuthContext from "../context/authContext.ts";
import MainRoulette from "../components/mainRoulette/mainRoulette.mjs";
import RiskWheel from "../components/RiskRoullete/riskWheel.mjs";
import LoyalityWheel from "../components/loyalityWheel/loyalityWheel.mjs";
import WeeklyWheel from "../components/weeklyWheel/weeklyWheel.mjs";
import { marketPlaceInstance } from "../config/axios.js";
import regularThumbnail from "../images/wheel/main-wheel/main-thumbnail.png";
import riskThumbnail from "../images/wheel/risk-wheel/risk-thumbnail.png";
import bigThumbnail from "../images/wheel/big-wheel/big-thumbnail.png";
import loyaltyThumbnail from "../images/wheel/loyalty-wheel/loyalty-thumbnail.png";

const EarnFreeCoins = () => {
  const { user, dateTimeNow } = useContext(AuthContext);
  const [showRoulette, setShowRoulette] = useState(false);
  const [key, setKey] = useState("dailyClaims");
  const [canSpin, setCanSpin] = useState(false);
  const [spinTimer, setSpinTimer] = useState("");
  const [show, setShow] = useState(false);
  const [riskWheel, setRiskWheel] = useState(false);
  const [loyalityWheel, setLoylityWheel] = useState(false);
  const [weeklyWheel, setWeeklyWheel] = useState(false);
  const [isWeeklyWheelActive, setIsWeeklyWheelActive] = useState(false);

  // const handleclick = (value) => {
  //   localStorage.setItem("class", value);
  //   setActive(value);
  // };

  const getWeeklyWheel = async () => {
    try {
      const response = await marketPlaceInstance().get("/getWeeklyWheel");
      const { success, isWeeklySpin } = response.data;
      if (success) {
        // console.log("isWeeklySpin", isWeeklySpin);
        setIsWeeklyWheelActive(isWeeklySpin);
      } else {
        setIsWeeklyWheelActive(isWeeklySpin);
        // console.log("else isWeeklySpin", isWeeklySpin);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getWeeklyWheel();
    if (window !== "undefined") {
      // const ab = localStorage.getItem("class");
      // setActive(ab);
    }
    if (user?.lastSpinTime && dateTimeNow)
      handleSpinTimer(user?.lastSpinTime, dateTimeNow);
    else setCanSpin(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenRoulette = (value) => {
    // if (canSpin) {
    //   setShowRoulette(true);
    // }
    if (value === "risk") {
      setRiskWheel(true);
      setWeeklyWheel(false);
      setShowRoulette(false);
      setLoylityWheel(false);
    }
    if (value === "loyality") {
      setLoylityWheel(true);
      setShowRoulette(false);
      setWeeklyWheel(false);
      setRiskWheel(false);
    } else if (value === "normal") {
      setShowRoulette(true);
      setRiskWheel(false);
      setWeeklyWheel(false);
      setLoylityWheel(false);
    } else if (value === "weekly") {
      setShowRoulette(false);
      setRiskWheel(false);
      setWeeklyWheel(true);
      setLoylityWheel(false);
    }
    setShow(!show);
  };

  const addZero = (val) => {
    if (!(val >= 10)) val = `0${val}`;
    return val;
  };

  const handleSpinTimer = (nextSpinTIme, datetimeNow) => {
    let date1 = datetimeNow;
    let interval = setInterval(() => {
      const date2 = new Date(nextSpinTIme);
      const diffTime = (date2 - date1) / 1000;
      if (diffTime <= 0) {
        clearInterval(interval);
        setCanSpin(true);
      } else {
        let h = Math.floor(diffTime / 3600);
        let m = Math.floor((diffTime % 3600) / 60);
        let s = Math.floor((diffTime % 3600) % 60);
        setSpinTimer(`${addZero(h)}:${addZero(m)}:${addZero(s)}`);
        // setSpinTimer("12:00:00")
        // setCanSpin(true);
      }
      date1 += 1000;
    }, 1000);
  };

  return (
    <Layout>
      <div className="container">
        <div className="tab-btn">
          <Button
            className={`${key === "dailyClaims" ? "active-btn" : ""}`}
            onClick={() => setKey("dailyClaims")}
          >
            Daily Claims
          </Button>
          {/* <Button
            className={`${key === "monthlyClaims" ? "active-btn" : ""}`}
            onClick={() => setKey("monthlyClaims")}>
            Monthly Claims
          </Button>  */}
          {/* <Button
          </Button>
          <Button
            className={`${key === "duckyLuckClaims" ? "active-btn" : ""}`}
            onClick={() => setKey("duckyLuckClaims")}>
            Ducky Luck Claims
          </Button> */}
        </div>

        {showRoulette ? (
          // <NewRoulette show={show} handleOpenRoulette={handleOpenRoulette} />
          <MainRoulette
            show={show}
            handleOpenRoulette={handleOpenRoulette}
            riskWheel={riskWheel}
          />
        ) : null}

        {riskWheel ? (
          <RiskWheel
            show={show}
            handleOpenRoulette={handleOpenRoulette}
            riskWheel={riskWheel}
          />
        ) : null}

        {loyalityWheel ? (
          <LoyalityWheel
            show={show}
            handleOpenRoulette={handleOpenRoulette}
            loyalityWheel={loyalityWheel}
          />
        ) : (
          ""
        )}

        {weeklyWheel ? (
          <WeeklyWheel
            show={show}
            handleOpenRoulette={handleOpenRoulette}
            weeklyWheel={weeklyWheel}
          />
        ) : (
          ""
        )}

        {key === "dailyClaims" ? (
          <div className="spin-popup-content spin-page-content">
            <p className="title-memo">
              Daily wheel spin coins have a one times play through requirement
              and an expiration of 7 days if not used.
            </p>
            <div className="spin-wheel">
              <div className="spin-win-text-content">
                {!isWeeklyWheelActive && user?.loyalitySpinCount !== 29 ? (
                  <div className="spin-win-text">
                    <p>Pick one</p>
                  </div>
                ) : null}
                {user?.loyalitySpinCount !== 29 ? (
                  <div className="current-streak">
                    <p>
                      Current streak : <span>{user?.loyalitySpinCount}</span>{" "}
                    </p>
                  </div>
                ) : null}
                <div
                  className={`spin-button ${
                    isWeeklyWheelActive && user?.loyalitySpinCount === 29
                      ? ""
                      : isWeeklyWheelActive
                      ? "single-wheel"
                      : user?.loyalitySpinCount === 29
                      ? "single-wheel"
                      : ""
                  }`}
                >
                  {!isWeeklyWheelActive ? (
                    <>
                      {user?.loyalitySpinCount !== 29 ? (
                        <div className="risk-grid">
                          <img
                            src={regularThumbnail}
                            alt="regular-thumbnail"
                            className="img-fulid"
                          />
                          <p>Spin me for guaranteed prizing </p>
                          <button
                            disabled={!canSpin}
                            onClick={() => handleOpenRoulette("normal")}
                          >
                            {" "}
                            {canSpin ? "Regular Wheel" : spinTimer}
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                      {user?.loyalitySpinCount !== 29 ? (
                        <div className="or-grid">
                          <span>or</span>
                        </div>
                      ) : null}
                      {user?.loyalitySpinCount !== 29 ? (
                        <div className="risk-grid">
                          <img
                            src={riskThumbnail}
                            alt="risk-thumbnail"
                            className="img-fulid"
                          />
                          <p>
                            Take a risk for higher odds at the big wheel. Choose
                            carefully, you may end up with no prize.{" "}
                          </p>
                          <button
                            disabled={!canSpin}
                            onClick={() => handleOpenRoulette("risk")}
                          >
                            {" "}
                            {canSpin ? "Take a Risk" : spinTimer}
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )}
                  {user?.loyalitySpinCount === 29 && (
                    <div className="risk-grid">
                      <img
                        src={loyaltyThumbnail}
                        alt="loyalty-thumbnail"
                        className="img-fulid"
                      />
                      <p>
                        Congrats on 30 straight days of spinning, here is a
                        Bonus Wheel for today’s spin{" "}
                      </p>
                      <button
                        disabled={!canSpin}
                        onClick={() => handleOpenRoulette("loyality")}
                      >
                        {" "}
                        {canSpin ? "Loyality Wheel" : spinTimer}
                      </button>
                    </div>
                  )}

                  {isWeeklyWheelActive ? (
                    <div className="risk-grid">
                      <img
                        src={bigThumbnail}
                        alt="big-thumbnail"
                        className="img-fulid"
                      />
                      <p>
                        Thank you for being a loyal Scrooge user, you have been
                        rewarded 7 days of access to the Big Wheel!{" "}
                      </p>
                      <button
                        disabled={!canSpin}
                        onClick={() => handleOpenRoulette("weekly")}
                      >
                        {" "}
                        {canSpin ? "Weekly Wheel" : spinTimer}
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="tabs-claim">
          {key === "dailyClaims" ? (
            <div className="tab-claims">
              <DailyRewards />
            </div>
          ) : key === "monthlyClaims" ? (
            <div className="tab-claims">
              <HolderClaimChips />
            </div>
          ) : key === "duckyLuckClaims" ? (
            <div>
              {/* "gghh" */}
              <DLGate>
                <DLClaimTokens />
              </DLGate>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="flex-row" style={{ margin: "50px auto 0px" }}>
          <ShowBottomNavCards />
        </div>
      </div>
    </Layout>
  );
};

export default EarnFreeCoins;
