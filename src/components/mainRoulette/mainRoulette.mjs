import React from "react";
import { useState } from "react";
// import Wheel from "./wheel.mjs";

import bgaudio from "../../images/spin/wheel-win3.wav";
import winItemaudio from "../../images/spin/wheel-win.wav";
import rotatewheel from "../../images/spin/wheel-rotate.wav";
import coin from "../../images/spin/wheel-win2.wav";
import { Modal } from "react-bootstrap";
import MainSpinWheel from "./mainSpinWheel.mjs";
import WinPopup from "../roulette/winPopup.mjs";
import BigSpinWheel from "./bigSpinWheel.mjs";
import RiskSpinWheel from "./riskSpinWheel.mjs";
import LoyaltySpinWheel from "./loyaltySpinWheel.mjs";

const MainRoulette = ({
  idToken,
  uid,
  handleOpenRoulette,
  show,
  riskWheel,
}) => {
  const MainWheelPlaces = [
    { token: "Big wheel", chances: 1 },
    { token: "10 ST", chances: 11 },
    { token: "Relax 10 free spin", chances: 11 },
    { token: "15 ST", chances: 11 },

    { token: "Ka 10 free spin", chances: 11 },
    { token: "20 ST", chances: 11 },

    { token: "Slot mill 10 free spin", chances: 11 },
    { token: "25 ST", chances: 11 },

    { token: "Bgaming 10 free spin", chances: 11 },
    { token: "30 ST", chances: 11 },
  ];
  const BigWheelPlaces = [
    { token: "40 ST", chances: 10 },
    { token: "45 ST", chances: 10 },
    { token: "50 ST", chances: 10 },
    { token: "55 ST", chances: 10 },
    { token: "60 ST", chances: 10 },
    { token: "65 ST", chances: 10 },
    { token: "70 ST", chances: 10 },
    { token: "80 ST", chances: 10 },
    { token: "90 ST", chances: 10 },
    { token: "100 ST", chances: 10 },
  ];
  const RiskWheelPlaces = [
    { token: "Red", chances: 10.5 },
    { token: "Red", chances: 10.5 },
    { token: "Red", chances: 10.5 },
    { token: "Red", chances: 10.5 },
    { token: "Red", chances: 10.5 },
    { token: "Red", chances: 10.5 },
    { token: "Red", chances: 10.5 },
    { token: "Red", chances: 10.5 },
    { token: "Red", chances: 10.5 },
    { token: "Green", chances: 5.5 },
  ];
  const LoyaltyWheelPlaces = [
    { token: "150 ST", chances: 10 },
    { token: "175 ST", chances: 10 },
    { token: "200 ST", chances: 10 },
    { token: "225 ST", chances: 10 },
    { token: "250 ST", chances: 10 },
  ];
  const [winPopup, setWinPopup] = useState(false);
  const [winItem, setWinItem] = useState();
  const [volume, setVolume] = useState(false);
  // const [removeAnim, setRemoveAnim] = useState(false);

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
          {riskWheel ? (
            <RiskSpinWheel
              items={RiskWheelPlaces}
              setWinPopup={setWinPopup}
              setWinItem={setWinItem}
              setVolume={setVolume}
            />
          ) : (
            <MainSpinWheel
              items={MainWheelPlaces}
              setWinPopup={setWinPopup}
              setWinItem={setWinItem}
              setVolume={setVolume}
            />
            // <LoyaltySpinWheel
            //   items={LoyaltyWheelPlaces}
            //   setWinPopup={setWinPopup}
            //   setWinItem={setWinItem}
            //   setVolume={setVolume}
            // />

            // <BigSpinWheel
            //   items={BigWheelPlaces}
            //   setWinPopup={setWinPopup}
            //   setWinItem={setWinItem}
            //   setVolume={setVolume}
            // />
          )}
        </div>
        {winPopup && (
          <WinPopup
            setWinPopup={setWinPopup}
            winAmount={MainWheelPlaces[winItem]}
          />
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
export default MainRoulette;
