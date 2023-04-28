import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import HolderClaimChips from "./HolderClaimChips.mjs";
import { DLGate } from "../components/DLGate.jsx";
import DLClaimTokens from "./DLClaimTokens.mjs";
import Layout from "./Layout.mjs";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import DailyRewards from "../components/DailyRewards.mjs";
import AuthContext from "../context/authContext.ts";
import NewRoulette from "../components/roulette/roulette.mjs";
import wheel from "../images/wheel-fortune.jpg";

const EarnFreeCoins = () => {
  const { user } = useContext(AuthContext);
  const [showRoulette, setShowRoulette] = useState(false);
  const [key, setKey] = useState("dailyClaims");
  const [canSpin, setCanSpin] = useState(false);
  const [spinTimer, setSpinTimer] = useState("");

  // const handleclick = (value) => {
  //   localStorage.setItem("class", value);
  //   setActive(value);
  // };

  useEffect(() => {
    if (window !== "undefined") {
      // const ab = localStorage.getItem("class");
      // setActive(ab);
    }
    if (user?.lastSpinTime) handleSpinTimer(user?.lastSpinTime, Date.now());
    else setCanSpin(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenRoulette = () => {
    if (canSpin) setShowRoulette(true);
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
        setSpinTimer(`${h}:${m}: ${s}`);
        // setSpinTimer("12:00:00")
        // setCanSpin(true);
      }
      date1 += 1000;
    }, 1000);
  };

  return (
    <Layout>
      <div>
        <div className='tab-btn'>
          <Button
            className={`${key === "dailyClaims" ? "active-btn" : ""}`}
            onClick={() => setKey("dailyClaims")}
          >
            Daily Claims
          </Button>
          <Button
            className={`${key === "monthlyClaims" ? "active-btn" : ""}`}
            onClick={() => setKey("monthlyClaims")}
          >
            Monthly Claims
          </Button>
          <Button
            className={`${key === "duckyLuckClaims" ? "active-btn" : ""}`}
            onClick={() => setKey("duckyLuckClaims")}
          >
            Ducky Luck Claims
          </Button>
        </div>
        {showRoulette ? <NewRoulette /> : null}

        {key === "dailyClaims" ? (
          <div className='spin-popup-content'>
            <div className='spin-wheel'>
              <div className='spin-win-text'>
                <p>spin to win</p>
              </div>
              <img src={wheel} alt='wheel' />
              <div className='spin-button'>
                <button onClick={handleOpenRoulette}>
                  {" "}
                  {canSpin ? "Spin Now" : spinTimer}
                </button>
              </div>
            </div>
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
