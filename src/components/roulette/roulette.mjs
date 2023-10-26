import React from "react";
import { useState } from "react";
import Wheel from "./wheel.mjs";
import WinPopup from "./winPopup.mjs";
import bgaudio from "../../images/spin/wheel-win3.wav";
import winItemaudio from "../../images/spin/wheel-win.wav";
import rotatewheel from "../../images/spin/wheel-rotate.wav";
import coin from "../../images/spin/wheel-win2.wav";
import { Modal } from "react-bootstrap";
// import axios from "axios";
// import { marketPlaceInstance } from "../../config/axios.js";
// import Lottie from "react-lottie";
// import confettiimage1 from "../../images/spin/spin-confetti-1.json";
// import confettiimage2 from "../../images/spin/spin-confetti-2.json";

const NewRoulette = ({ idToken, uid, handleOpenRoulette, show }) => {
  const places = [
    { token: 50, chances: 65, gc: 500000 },
    { token: 100, chances: 24, gc: 1000000 },
    { token: 150, chances: 10, gc: 2000000 },
    { token: 2000, chances: 1, gc: 15000000 },
    { token: 50, chances: 65, gc: 500000 },
    { token: 100, chances: 24, gc: 1000000 },
    { token: 150, chances: 10, gc: 2000000 },
    { token: 50, chances: 65, gc: 500000 },
    { token: 100, chances: 24, gc: 1000000 },
    { token: 50, chances: 65, gc: 500000 },
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

  // const confetti1 = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: confettiimage1,
  // };

  // const confetti2 = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: confettiimage2,
  // };

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: confettiimage1,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };
  // useEffect(() => {
  //   if (window?.innerWidth <= 991) {
  //     setRemoveAnim(true);
  //   }
  // }, []);

  return (
    <Modal
      show={show}
      onHide={handleOpenRoulette}
      className="roulette-wrapper roulette-wheel-game"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      {/* <>
        <div className='confetti1'>
          <Lottie options={defaultOptions} height={400} width={400} />
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>

        <div className='confetti2'>
          <Lottie options={defaultOptions} height={400} width={400} />
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>

        <div className='confetti3'>
          <Lottie options={defaultOptions} height={400} width={400} />
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>

        <div className='confetti4'>
          <Lottie options={defaultOptions} height={400} width={400} />
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      </> */}
      <Modal.Body>
        <div className="wheel-wrapper">
          <Wheel
            items={places}
            setWinPopup={setWinPopup}
            setWinItem={setWinItem}
            setVolume={setVolume}
            handleSpin={handleSpin}
            winItem={winItem}
          />
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
export default NewRoulette;
