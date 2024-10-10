import React, { useState } from "react";
import spinbtn from "../../images/wheel/risk-wheel/risk-wheel-btn.png";
import "../mainRoulette/mainWheel.css";
import rotatewheel from "../../images/sounds/wheel-rotate.wav";
import BetterLuckNextTimePopup from "../roulette/BetterLuckNextTimePopup.mjs";
import bgaudio from "../../images/sounds/wheel-win3.wav";
import winItemaudio from "../../images/sounds/wheel-win.wav";
import wheelStop from "../../images/sounds/wheel-stop.wav";
import { getClientSeed } from "../../utils/generateClientSeed.js";
import { marketPlaceInstance } from "../../config/axios.js";
import { toast } from "react-toastify";
import "../../components/roulette/wheel.css";
import WinPopup from "../roulette/winPopup.mjs";

function RiskSpinWheel({ items, setWinItem, setWinPopup, setBigWheel, setCloseDisable }) {
  const [selectItem, setselectItem] = useState(null);
  const [isWinResult, setIsWinResult] = useState(false);
  const [wheelResult, setWheelResult] = useState();

  const [spinButtonDisable, setSpinButtonDisable] = useState(false);

  const select = async () => {
    console.log("wwwwwwwww");
    if (selectItem === null) {
      try {
        const clientSeed = getClientSeed();
        // console.log({ clientSeed });
        setSpinButtonDisable(true);
        setCloseDisable(true)
        const response = await (
          await marketPlaceInstance()
        ).get("/gameResultForRiskWheel", {
          params: { clientSeed },
        });
        console.log("==>>>", response);
        const selectedItem = items.findIndex(
          (el) => el.token === response?.data?.resultData?.token
        );
        console.log("selectedItem", selectedItem);
        if (selectedItem === -1) return;
        setselectItem(selectedItem);
        setWinItem(selectedItem);
        setWheelResult(selectedItem);
        if (selectedItem === 0 || selectedItem === 5) {
          setTimeout(() => {
            setBigWheel(true);
          }, 5000);
        }
        let ele = document.getElementById("rotate-wheel");
        if (ele) {
          ele.play();
        }
        setTimeout(() => {
          let ele = document.getElementById("wheel-stop");
          if (ele) {
            ele.play();
          }
        }, 3400);
      } catch (error) {
        if (error?.response?.data?.msg) {
          toast.error(error?.response?.data?.msg, { toastId: "spin-wheel" });
        }
        setSpinButtonDisable(false);
        setCloseDisable(false)
      }
    } else {
      setselectItem(null);
      setTimeout(selectItem, 500);
    }
  };

  const handleEvent = () => {
    setWinPopup(true);
    setIsWinResult(true);
    let ele = document.getElementById("winitem-wheel");
    if (ele) {
      ele.play();
    }
  };

  const wheelVars = {
    "--nb-item": items.length,
    "--selected-item": selectItem,
  };

  const spinning = selectItem !== null ? "spinning" : "";
  return (
    <div className='risk-wheel-wrapper'>
      <div className='risk-wheel-container'>
        <div
          className={`risk-wheel ${spinning}`}
          style={wheelVars}
          onTransitionEnd={handleEvent}>
          {items.map((item, index) => (
            <div
              className='risk-wheel-item'
              key={`item-${index + 1}`}
              style={{ "--item-nb": index }}>
              {/* {item.token} */}
            </div>
          ))}
        </div>
        {console.log("wheelResult", wheelResult)}
        {isWinResult && (wheelResult === 0 || wheelResult === 5) ? (
          <WinPopup setWinPopup={setWinPopup} winAmount={items[wheelResult]} />
        ) : isWinResult ? (
          <BetterLuckNextTimePopup />
        ) : (
          ""
        )}
      </div>
      <div
        className={`spin-btn ${spinButtonDisable ? "spin-disable" : ""}`}
        onClick={select}>
        <img src={spinbtn} alt='spin' />
        {/* <h6>{"SPIN NOW"} </h6> */}
        <audio id='bg-audio'>
          <source src={bgaudio}></source>
        </audio>
        <audio id='rotate-wheel'>
          <source src={rotatewheel}></source>
        </audio>
        <audio id='winitem-wheel'>
          <source src={winItemaudio}></source>
        </audio>
        <audio id='wheel-stop'>
          <source src={wheelStop}></source>
        </audio>
      </div>
    </div>
  );
}

export default RiskSpinWheel;
