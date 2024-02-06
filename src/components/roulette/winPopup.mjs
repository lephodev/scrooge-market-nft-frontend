import React from "react";
// import Lottie from "react-lottie";
// import winimg from "../../assets/images/roulette/win.png";
// import buttonimg from "../../assets/images/roulette/btn.png";
import winn from "../../images/ribbon.png";
import { useState } from "react";
// import coinicon from "../../assets/animation/collect-coin.json";
// import coinicon from "../../images/animation/collect-coin.json";

const WinPopup = ({ winAmount }) => {
  const [coin, setCoin] = useState(false);

  const handleCollect = () => {
    setCoin(true);
    let ele = document.getElementById("coin-audio");
    // console.log(ele, "jjjjjjjjjj");
    if (ele) {
      ele.play();
    }
    setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  const displayToken = (token) => {
    if (typeof token === "string" && token === "Big wheel") {
      return winAmount?.token;
    } else if (typeof token === "string" && token.startsWith("Green")) {
      return "";
    } else {
      return `${winAmount?.token}ST`;
    }
  };

  return (
    <div className='spin-win-popup winning-animation-win'>
      <div className='spin-popup-content animate__animated animate__zoomIn'>
        <div className='winning-popup-content'>
          <div className='wining-image'>
            <img src={winn} alt='winimg' />
            <div className='winning-amount-ribbon'>
              <p>YOU WIN</p>
            </div>
            <div className='pyro'>
              <div className='before'></div>
              <div className='after'></div>
            </div>
          </div>

          <div className='winning-amount'>
            {" "}
            {displayToken(winAmount?.token)}
          </div>

          {displayToken(winAmount?.token) && (
            <div className='winning-btn'>
              <div className='win-btn' onClick={handleCollect}>
                <p>COLLECT</p>
              </div>
            </div>
          )}

          {coin ? (
            <div className='collect-coin'>
              {/* <Lottie options={coinanim} height={500} width={500} /> */}
            </div>
          ) : (
            ""
          )}
        </div>
        {/* <div className="before"></div>
      <div className="after"></div> */}
      </div>
    </div>
  );
};
export default WinPopup;
