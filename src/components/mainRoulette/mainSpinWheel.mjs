import React, { useContext, useState } from "react";
// import spinWheel from "../../images/spinWheel.png";
import spinbtn from "../../images/wheel/main-wheel/main-wheel-btn.png";
import "./mainWheel.css";
import rotatewheel from "../../images/sounds/wheel-rotate.wav";
import bgaudio from "../../images/sounds/wheel-win3.wav";
import winItemaudio from "../../images/sounds/wheel-win.wav";
import wheelStop from "../../images/sounds/wheel-stop.wav";
import { getClientSeed } from "../../utils/generateClientSeed.js";
import { marketPlaceInstance } from "../../config/axios.js";
import { toast } from "react-toastify";
import "../../components/roulette/wheel.css";
import WinPopup from "../roulette/winPopup.mjs";
import AuthContext from "../../context/authContext.ts";

function MainSpinWheel({ items, setWinItem, setWinPopup, setBigWheel, setCloseDisable }) {
  const { setUser } = useContext(AuthContext);

  const [selectItem, setselectItem] = useState(null);

  const [spinButtonDisable, setSpinButtonDisable] = useState(false);
  const [wheelResult, setWheelResult] = useState();
  const [isWinResult, setIsWinResult] = useState(false);

  const select = async () => {
    if (selectItem === null) {
      try {
        const clientSeed = getClientSeed();
        // console.log({ clientSeed });
        setSpinButtonDisable(true);
        setCloseDisable(true)
        const response = await (
          await marketPlaceInstance()
        ).get("/gameResult", {
          params: { clientSeed },
        });
        console.log("==>>>", response);
        const selectedItem = items.findIndex(
          (el) => el.token === response?.data?.resultData?.token
        );

        console.log("selectedItem", selectedItem);
        if (selectedItem === -1) return;
        setselectItem(selectedItem);
        setWheelResult(selectedItem);
        if (selectedItem === 0) {
          setTimeout(() => {
            setUser(response.data.user);
            setBigWheel(true);
          }, 5000);
        }
        // if (this.props.onSelectItem) {
        //   onSelectItem(selectedItem);
        // }
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
        setCloseDisable(false);
      }
    } else {
      setselectItem(null);
      setTimeout(selectItem, 500);
    }
  };

  const handleEvent = () => {
    setWinPopup(true);
    setIsWinResult(true);
    // this.props.handleSpin(this.state.selectedItem);
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
    <div className='main-wheel-wrapper'>
      <div className='main-wheel-container'>
        <div
          className={`main-wheel ${spinning}`}
          style={wheelVars}
          onTransitionEnd={handleEvent}>
          {items.map((item, index) => (
            <div
              className='main-wheel-item'
              key={`item-${index + 1}`}
              style={{ "--item-nb": index }}>
              {/* {item.token} */}
            </div>
          ))}
        </div>
        {isWinResult && (
          <WinPopup setWinPopup={setWinPopup} winAmount={items[wheelResult]} />
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

export default MainSpinWheel;
