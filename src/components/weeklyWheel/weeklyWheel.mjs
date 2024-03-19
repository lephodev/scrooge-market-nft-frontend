/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
// import Wheel from "./wheel.mjs";

import bgaudio from "../../images/spin/wheel-win3.wav";
import winItemaudio from "../../images/spin/wheel-win.wav";
import rotatewheel from "../../images/spin/wheel-rotate.wav";
import coin from "../../images/spin/wheel-win2.wav";
import { Modal } from "react-bootstrap";

import LoyaltyWheel from "../mainRoulette/loyaltySpinWheel.mjs";
import BigSpinWheel from "../mainRoulette/bigSpinWheel.mjs";

const WeeklyWheel = ({ handleOpenRoulette, show }) => {
  const [winPopup, setWinPopup] = useState(false);
  const [winItem, setWinItem] = useState();
  const [volume, setVolume] = useState(false);
  const [bigWheel, setBigWheel] = useState(false);

  const BigWheelPlaces = [
    { token: 100, chances: 12.4875 },
    { token: 60, chances: 12.4875 },
    { token: 65, chances: 12.4875 },
    { token: 500, chances: 0.09 },
    { token: 70, chances: 12.4875 },
    { token: 75, chances: 12.4875 },
    { token: 80, chances: 12.4875 },
    { token: 3000, chances: 0.01 },
    { token: 85, chances: 12.4875 },
    { token: 90, chances: 12.4875 },
  ];

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
          {console.log("LoyaltyWheelPlaces", BigWheelPlaces)}
          <>
            <BigSpinWheel
              items={BigWheelPlaces}
              setWinPopup={setWinPopup}
              setWinItem={setWinItem}
              setVolume={setVolume}
            />
          </>
        </div>

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
export default WeeklyWheel;
