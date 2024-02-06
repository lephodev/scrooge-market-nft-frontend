/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
// import Wheel from "./wheel.mjs";

import bgaudio from "../../images/spin/wheel-win3.wav";
import winItemaudio from "../../images/spin/wheel-win.wav";
import rotatewheel from "../../images/spin/wheel-rotate.wav";
import coin from "../../images/spin/wheel-win2.wav";
import { Modal } from "react-bootstrap";
import MainSpinWheel from "./mainSpinWheel.mjs";
// import WinPopup from "../roulette/winPopup.mjs";
import BigSpinWheel from "./bigSpinWheel.mjs";
// import RiskSpinWheel from "./riskSpinWheel.mjs";
// import LoyaltySpinWheel from "./loyaltySpinWheel.mjs";

const MainRoulette = ({
  idToken,
  uid,
  handleOpenRoulette,
  show,
  riskWheel,
}) => {
  const MainWheelPlaces = [
    { token: "Big wheel", chances: 1 },
    { token: 10, chances: 11 },
    { token: 15, chances: 11 },
    { token: 20, chances: 11 },
    { token: 25, chances: 11 },
    { token: 30, chances: 11 },
    { token: 10, chances: 11 },
    { token: 15, chances: 11 },
    { token: 20, chances: 11 },
    { token: 25, chances: 11 },
  ];

  const BigWheelPlaces = [
    { token: 40, chances: 10 },
    { token: 45, chances: 10 },
    { token: 50, chances: 10 },
    { token: 55, chances: 10 },
    { token: 60, chances: 10 },
    { token: 65, chances: 10 },
    { token: 70, chances: 10 },
    { token: 80, chances: 10 },
    { token: 90, chances: 10 },
    { token: 100, chances: 10 },
  ];
  const [winPopup, setWinPopup] = useState(false);
  const [winItem, setWinItem] = useState();
  const [volume, setVolume] = useState(false);
  const [bigWheel, setBigWheel] = useState(false);

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
        <>
          {!bigWheel ? (
            <MainSpinWheel
              setBigWheel={setBigWheel}
              bigWheel={bigWheel}
              items={MainWheelPlaces}
              setWinPopup={setWinPopup}
              setVolume={setVolume}
              handleOpenRoulette={handleOpenRoulette}
            />
          ) : (
            <BigSpinWheel items={BigWheelPlaces} setWinPopup={setWinPopup} />
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
export default MainRoulette;
