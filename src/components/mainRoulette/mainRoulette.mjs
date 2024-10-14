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
  user,
  setUser,
}) => {
  const MainWheelPlaces = [
    { token: "Big wheel", chances: 1 },
    { token: 20, chances: 16 },
    { token: 25, chances: 16 },
    { token: 250, chances: 0.09 },
    { token: 30, chances: 16 },
    { token: 50, chances: 2.99 },
    { token: 30, chances: 16 },
    { token: 2000, chances: 0.01 },
    { token: 25, chances: 16 },
    { token: 20, chances: 16 },
  ];

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
      backdrop={closeDisable ? "static" : true }
      keyboard={!closeDisable}
    >
      <Modal.Header> 
        <button
          type="button"
          className="btn-close"
          disabled={closeDisable}  
          aria-label="Close"
          onClick={!closeDisable ? handleOpenRoulette : null}
        />
      </Modal.Header>
      <Modal.Body>
        {user?.wheelType === "Big wheel" && (
          <BigSpinWheel items={BigWheelPlaces} setWinPopup={setWinPopup} setCloseDisable={setCloseDisable} />
        )}
        <>
          {user?.wheelType !== "Big wheel" && !bigWheel && (
            <MainSpinWheel
              setBigWheel={setBigWheel}
              bigWheel={bigWheel}
              items={MainWheelPlaces}
              setWinPopup={setWinPopup}
              setVolume={setVolume}
              handleOpenRoulette={handleOpenRoulette}
              setCloseDisable={setCloseDisable}
            />
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
