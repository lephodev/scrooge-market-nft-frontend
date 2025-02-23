/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import bgaudio from "../../images/spin/wheel-win3.wav";
import winItemaudio from "../../images/spin/wheel-win.wav";
import rotatewheel from "../../images/spin/wheel-rotate.wav";
import coin from "../../images/spin/wheel-win2.wav";
import { Modal } from "react-bootstrap";
import BigSpinWheel from "../mainRoulette/bigSpinWheel.mjs";
import RegRiskSpinWheel from "./regRiskSpinWheel.mjs";

const RegRiskWheel = ({ handleOpenRoulette, show, user }) => {
  const RegularRiskWheelPlaces = [
    { token: "Green1", chances: 10 },
    { token: "Green2", chances: 10 },
    { token: "Red7", chances: 10 },
    { token: "Red1", chances: 10 },
    { token: "Red2", chances: 10 },
    { token: "Red3", chances: 10 },
    { token: "Red4", chances: 10 },
    { token: "Red5", chances: 10 },
    { token: "Red6", chances: 10 },
    { token: "Green3", chances: 10 },
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
      backdrop={closeDisable ? "static" : true}
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
          {user?.wheelType === "Big wheel" && (
            <BigSpinWheel
              items={BigWheelPlaces}
              setWinPopup={setWinPopup}
              setCloseDisable={setCloseDisable}
            />
          )}
          {user?.wheelType !== "Big wheel" && !bigWheel && (
            <RegRiskSpinWheel
              items={RegularRiskWheelPlaces}
              setWinPopup={setWinPopup}
              setWinItem={setWinItem}
              setVolume={setVolume}
              setBigWheel={setBigWheel}
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
export default RegRiskWheel;
