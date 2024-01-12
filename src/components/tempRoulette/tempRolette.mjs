import React from "react";
import { useState } from "react";
// import Wheel from "./wheel.mjs";

import bgaudio from "../../images/spin/wheel-win3.wav";
import winItemaudio from "../../images/spin/wheel-win.wav";
import rotatewheel from "../../images/spin/wheel-rotate.wav";
import coin from "../../images/spin/wheel-win2.wav";
import { Modal } from "react-bootstrap";
import TempSpinWheel from "./tempSpinWheel.mjs";
import WinPopup from "../roulette/winPopup.mjs";
// import axios from "axios";
// import { marketPlaceInstance } from "../../config/axios.js";
// import Lottie from "react-lottie";
// import confettiimage1 from "../../images/spin/spin-confetti-1.json";
// import confettiimage2 from "../../images/spin/spin-confetti-2.json";

const TempRoulette = ({ idToken, uid, handleOpenRoulette, show }) => {
  const places = [
    { token: "10ST", chances: 20 },
    { token: "30ST", chances: 20 },
    { token: "25ST", chances: 20 },
    { token: "20ST", chances: 20 },
    { token: "15ST", chances: 20 },
  ];
  const [winPopup, setWinPopup] = useState(false);
  const [winItem, setWinItem] = useState();
  const [volume, setVolume] = useState(false);
  // const [removeAnim, setRemoveAnim] = useState(false);
  const handleSpin = async (winItem) => {
    // const response =   await marketPlaceInstance().('/winAmount',{  params: { winAmount: places[winItem] },});
    // await axios.get("https://lucky-wheel-t3e66zpola-uc.a.run.app/", {
    //   headers: { idtoken: idToken },
    //   params: { winAmount: places[winItem] },
    // });
  };

  return (
    <Modal
      show={show}
      onHide={handleOpenRoulette}
      className="roulette-wrapper roulette-wheel-game"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton></Modal.Header>

      <Modal.Body>
        <div className="wheel-wrapper">
          <TempSpinWheel
            items={places}
            // setWinPopup={setWinPopup}
            // setWinItem={setWinItem}
            // setVolume={setVolume}
            // handleSpin={handleSpin}
            // winItem={winItem}
          />

          {/* <Wheel
            items={places}
            setWinPopup={setWinPopup}
            setWinItem={setWinItem}
            setVolume={setVolume}
            handleSpin={handleSpin}
            winItem={winItem}
          /> */}
        </div>
        {winPopup && (
          <WinPopup setWinPopup={setWinPopup} winAmount={places[winItem]} />
        )}
        <audio className="bg-audio" muted={!volume}>
          <source src={bgaudio}></source>
        </audio>
        <audio className="rotate-wheel">
          <source src={rotatewheel}></source>
        </audio>
        <audio className="winitem-wheel">
          <source src={winItemaudio}></source>
        </audio>
        <audio id="coin-audio">
          <source src={coin}></source>
        </audio>
      </Modal.Body>
    </Modal>
  );
};
export default TempRoulette;
