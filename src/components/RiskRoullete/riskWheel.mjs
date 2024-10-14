/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
// import Wheel from "./wheel.mjs";

import bgaudio from "../../images/spin/wheel-win3.wav";
import winItemaudio from "../../images/spin/wheel-win.wav";
import rotatewheel from "../../images/spin/wheel-rotate.wav";
import coin from "../../images/spin/wheel-win2.wav";
import { Modal } from "react-bootstrap";
import RiskSpinWheel from "./riskSpinWheel.mjs";
import BigSpinWheel from "../mainRoulette/bigSpinWheel.mjs";
import MegaSpinWheel from "../megaWheel/megaSpinWheel.mjs";
// import WinPopup from "../roulette/winPopup.mjs";
// import BigSpinWheel from "./bigSpinWheel.mjs";
// import RiskSpinWheel fro./riskSpinWheel.mjs
// import LoyaltySpinWheel from "./loyaltySpinWheel.mjs";

const RiskWheel = ({ handleOpenRoulette, show }) => {
  const RiskWheelPlaces = [
    { token: "Green1", chances: 10 },
    { token: "Red1", chances: 10 },
    { token: "Red2", chances: 10 },
    { token: "Red3", chances: 10 },
    { token: "Red4", chances: 10 },
    { token: "Green2", chances: 10 },
    { token: "Red5", chances: 10 },
    { token: "Red6", chances: 10 },
    { token: "Red7", chances: 10 },
    { token: "Red8", chances: 10 },
  ];

  const MegaWheelPlaces = [
    { token: 500, chances: 11.11 },
    { token: 200, chances: 11.11 },
    { token: 225, chances: 11.11 },
    { token: 250, chances: 11.11 },
    { token: 275, chances: 11.11 },
    { token: 4000, chances: 0.01 },
    { token: 200, chances: 11.11 },
    { token: 225, chances: 11.11 },
    { token: 250, chances: 11.11 },
    { token: 275, chances: 11.11 },
  ];

  const [winPopup, setWinPopup] = useState(false);
  const [winItem, setWinItem] = useState();
  const [volume, setVolume] = useState(false);
  const [bigWheel, setBigWheel] = useState(false);
  const [closeDisable, setCloseDisable] = useState(false);

  return (
    <Modal
      show={show}
      onHide={handleOpenRoulette}
      className="roulette-wrapper roulette-wheel-game"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop={closeDisable ? "static" : true}
      keyboard={!closeDisable}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <>
          {!bigWheel ? (
            <RiskSpinWheel
              items={RiskWheelPlaces}
              setWinPopup={setWinPopup}
              setWinItem={setWinItem}
              setVolume={setVolume}
              setBigWheel={setBigWheel}
              setCloseDisable={setCloseDisable}
            />
          ) : (
            <MegaSpinWheel items={MegaWheelPlaces} setWinPopup={setWinPopup} />
          )}
        </>

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
export default RiskWheel;
