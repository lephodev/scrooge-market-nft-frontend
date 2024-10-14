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
import MegaSpinWheel from "./megaSpinWheel.mjs";

const MegaWheel = ({ handleOpenRoulette, show }) => {
  const [winPopup, setWinPopup] = useState(false);
  const [winItem, setWinItem] = useState();
  const [volume, setVolume] = useState(false);
  const [bigWheel, setBigWheel] = useState(false);
  const [closeDisable, setCloseDisable] = useState(false);

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
        <>
          <MegaSpinWheel
            items={MegaWheelPlaces}
            setWinPopup={setWinPopup}
            setWinItem={setWinItem}
            setVolume={setVolume}
            setCloseDisable={setCloseDisable}
          />
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
export default MegaWheel;
