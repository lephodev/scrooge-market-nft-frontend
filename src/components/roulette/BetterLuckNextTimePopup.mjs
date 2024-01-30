import winn from "../../images/ribbon.png";

const BetterLuckNextTimePopup = ({ winAmount }) => {
  const handleCollect = () => {
    let ele = document.getElementById("coin-audio");
    if (ele) {
      ele.play();
    }
    setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  return (
    <div className='spin-win-popup winning-animation-win'>
      <div className='spin-popup-content animate__animated animate__zoomIn'>
        <div className='winning-popup-content'>
          <div className='wining-image'>
            <img src={winn} alt='winimg' />
            <div className='winning-amount-ribbon'>
              <p style={{ marginTop: "-20px" }}>You Loose</p>
            </div>
            <p style={{ color: "red" }}>Better Luck in Next Time </p>
          </div>

          <div className='winning-btn'>
            <div className='win-btn' onClick={handleCollect}>
              <p>Lets Go</p>
            </div>
          </div>
        </div>
        {/* <div className="before"></div>
      <div className="after"></div> */}
      </div>
    </div>
  );
};
export default BetterLuckNextTimePopup;
