import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import HolderClaimChips from "./HolderClaimChips.mjs";
import { DLGate } from "../components/DLGate.jsx";
import DLClaimTokens from "./DLClaimTokens.mjs";
import Layout from "./Layout.mjs";
import LoadingPoker from "../images/scroogeHatLogo.png";

import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import DailyRewards from "../components/DailyRewards.mjs";
import AuthContext from "../context/authContext.ts";
import MainRoulette from "../components/mainRoulette/mainRoulette.mjs";
import RiskWheel from "../components/RiskRoullete/riskWheel.mjs";
import LoyalityWheel from "../components/loyalityWheel/loyalityWheel.mjs";
import WeeklyWheel from "../components/weeklyWheel/weeklyWheel.mjs";
import { marketPlaceInstance } from "../config/axios.js";
import regularThumbnail from "../images/wheel/main-wheel/main-thumbnail.png";
import regRiskThumbnail from "../images/wheel/regular-risk-wheel/reg-risk-thumbnail.png";
import riskThumbnail from "../images/wheel/risk-wheel/risk-thumbnail.png";
import bigThumbnail from "../images/wheel/big-wheel/big-thumbnail.png";
import loyaltyThumbnail from "../images/wheel/loyalty-wheel/loyalty-thumbnail.png";
import bigText from "../images/wheel/big-wheel/Big-Wheel-Text.webp";
import RegRiskWheel from "../components/RegRiskRoullete/regRiskWheel.mjs";
// import MegaWheel from "../components/megaWheel/megaWheel.mjs";
const EarnFreeCoins = () => {
  const { user, dateTimeNow } = useContext(AuthContext);
  const [showRoulette, setShowRoulette] = useState(false);
  const [key, setKey] = useState("dailyClaims");
  const [canSpin, setCanSpin] = useState(false);
  const [spinTimer, setSpinTimer] = useState("");
  const [show, setShow] = useState(false);
  const [riskWheel, setRiskWheel] = useState(false);
  const [regRiskWheel, setRegRiskWheel] = useState(false);
  const [loyalityWheel, setLoylityWheel] = useState(false);
  const [weeklyWheel, setWeeklyWheel] = useState(false);
  const [isWeeklyWheelActive, setIsWeeklyWheelActive] = useState(false);
  const [globalLoader, setglobalLoader] = useState(true);

  // const handleclick = (value) => {
  //   localStorage.setItem("class", value);
  //   setActive(value);
  // };

  const getWeeklyWheel = async () => {
    setglobalLoader(true);

    try {
      const response = await (
        await marketPlaceInstance()
      ).get("/getWeeklyWheel");
      const { success, isWeeklySpin } = response.data;
      if (success) {
        setglobalLoader(false);

        // console.log("isWeeklySpin", isWeeklySpin);
        setIsWeeklyWheelActive(isWeeklySpin);
      } else {
        setIsWeeklyWheelActive(isWeeklySpin);
        setglobalLoader(false);

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
    if (value === "regRisk") {
      setRiskWheel(false);
      setWeeklyWheel(false);
      setShowRoulette(false);
      setLoylityWheel(false);
      setRegRiskWheel(true);
    }
    if (value === "loyality") {
      setLoylityWheel(true);
      setShowRoulette(false);
      setWeeklyWheel(false);
      setRiskWheel(false);
      setRegRiskWheel(false);
    } else if (value === "normal") {
      setShowRoulette(true);
      setRiskWheel(false);
      setRegRiskWheel(false);
      setWeeklyWheel(false);
      setLoylityWheel(false);
    } else if (value === "weekly") {
      setShowRoulette(false);
      setRiskWheel(false);
      setRegRiskWheel(false);
      setWeeklyWheel(true);
      setLoylityWheel(false);
    } else if (value === "risk") {
      setRiskWheel(true);
      setWeeklyWheel(false);
      setShowRoulette(false);
      setLoylityWheel(false);
      setRegRiskWheel(false);
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
      <div className='container free-coin-page'>
        {globalLoader && (
          <div className='loading'>
            <div className='loading-img-div'>
              <img src={LoadingPoker} alt='game' className='imageAnimation' />
            </div>
          </div>
        )}
        <div className='tab-btn'>
          <Button
            className={`${key === "dailyClaims" ? "active-btn" : ""}`}
            onClick={() => setKey("dailyClaims")}>
            Daily Claims
          </Button>
        </div>

        {showRoulette ? (
          <MainRoulette
            show={show}
            handleOpenRoulette={handleOpenRoulette}
            regRiskWheel={regRiskWheel}
          />
        ) : null}

        {riskWheel ? (
          <RiskWheel
            show={show}
            handleOpenRoulette={handleOpenRoulette}
            riskWheel={riskWheel}
          />
        ) : // <MegaWheel
        //   show={show}
        //   handleOpenRoulette={handleOpenRoulette}

        // />
        null}

        {regRiskWheel ? (
          <RegRiskWheel
            show={show}
            handleOpenRoulette={handleOpenRoulette}
            regRiskWheel={regRiskWheel}
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
          <div className='spin-popup-content spin-page-content'>
            {!globalLoader && (
              <p className='title-memo'>
                Daily wheel spin coins have a one times play through requirement
                and an expiration of 7 days if not used.
              </p>
            )}
            {!globalLoader && (
              <>
                <div className='spin-wheel'>
                  <div className='spin-win-text-content'>
                    {!isWeeklyWheelActive && user?.loyalitySpinCount !== 30 ? (
                      <div className='spin-win-text'>
                        <p>Pick one</p>
                      </div>
                    ) : null}
                    {user?.loyalitySpinCount !== 30 ? (
                      <div className='current-streak'>
                        <p>
                          Current streak :{" "}
                          <span>{user?.loyalitySpinCount}</span>{" "}
                        </p>
                      </div>
                    ) : null}
                    <div
                      className={`spin-button ${
                        isWeeklyWheelActive && user?.loyalitySpinCount === 30
                          ? "single-wheel"
                          : user?.loyalitySpinCount === 30
                          ? "single-wheel"
                          : ""
                      }`}>
                      {!isWeeklyWheelActive ? (
                        <>
                          {user?.loyalitySpinCount !== 30 ? (
                            <div className='risk-grid'>
                              <img
                                src={regularThumbnail}
                                alt='regular-thumbnail'
                                className='img-fulid'
                              />
                              <p>Spin me for guaranteed prizing </p>
                              <button
                                disabled={!canSpin}
                                onClick={() => handleOpenRoulette("normal")}>
                                {" "}
                                {canSpin ? "Regular Wheel" : spinTimer}
                              </button>
                            </div>
                          ) : (
                            ""
                          )}
                          {user?.loyalitySpinCount !== 30 ? (
                            <div className='or-grid'>
                              <span>or</span>
                            </div>
                          ) : null}
                          {user?.loyalitySpinCount !== 30 ? (
                            <div className='risk-grid'>
                              <img
                                src={regRiskThumbnail}
                                alt='risk-thumbnail'
                                className='img-fulid'
                              />
                              <p>
                                Take a risk for higher odds at the big wheel.
                                Choose carefully, you may end up with no prize.{" "}
                              </p>
                              <button
                                disabled={!canSpin}
                                onClick={() => handleOpenRoulette("regRisk")}>
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
                      {user?.loyalitySpinCount === 30 && (
                        <div className='risk-grid'>
                          <img
                            src={loyaltyThumbnail}
                            alt='loyalty-thumbnail'
                            className='img-fulid'
                          />
                          <p>
                            Congrats on 30 straight days of spinning, here is a
                            Bonus Wheel for today’s spin{" "}
                          </p>
                          <button
                            disabled={!canSpin}
                            onClick={() => handleOpenRoulette("loyality")}>
                            {" "}
                            {canSpin ? "Loyality Wheel" : spinTimer}
                          </button>
                        </div>
                      )}

                      {isWeeklyWheelActive && user?.loyalitySpinCount !== 30 ? (
                        <>
                          <div className='risk-grid'>
                            <div className='big-wheel-image-grid'>
                              <div className='big-wheel-label-grid'>
                                <img
                                  src={bigText}
                                  alt='big-wheel-label'
                                  className='img-fluid'
                                />
                              </div>
                              <img
                                src={bigThumbnail}
                                alt='big-thumbnail'
                                className='img-fulid'
                              />
                            </div>
                            <p>
                              Thank you for being a loyal Scrooge user, you have
                              been rewarded 7 days of access to the Big Wheel!{" "}
                            </p>
                            <button
                              disabled={!canSpin}
                              onClick={() => handleOpenRoulette("weekly")}>
                              {" "}
                              {canSpin ? "Big Wheel " : spinTimer}
                            </button>
                          </div>
                          {user?.loyalitySpinCount !== 30 ? (
                            <div className='or-grid'>
                              <span>or</span>
                            </div>
                          ) : null}
                          <div
                            className={`risk-grid ${
                              isWeeklyWheelActive ? "second-wheel-padd" : ""
                            }`}>
                            <img
                              src={riskThumbnail}
                              alt='risk-thumbnail'
                              className='img-fulid'
                            />
                            <p>
                              Risk it for an even larger Mega Wheel. Choose
                              carefully, as you can be left with no daily
                              reward.
                            </p>
                            <button
                              disabled={!canSpin}
                              onClick={() => handleOpenRoulette("risk")}>
                              {" "}
                              {canSpin ? "Take a Risk" : spinTimer}
                            </button>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          ""
        )}
        <div className='tabs-claim'>
          {key === "dailyClaims" ? (
            <div className='tab-claims'>
              <DailyRewards />
            </div>
          ) : key === "monthlyClaims" ? (
            <div className='tab-claims'>
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
        <div className='flex-row' style={{ margin: "50px auto 0px" }}>
          <ShowBottomNavCards />
        </div>
      </div>
    </Layout>
  );
};

export default EarnFreeCoins;
