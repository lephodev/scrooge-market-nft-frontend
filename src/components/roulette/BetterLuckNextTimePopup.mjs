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
    <div className="spin-win-popup winning-animation-win">
      <div className="spin-popup-content animate__animated animate__zoomIn">
        <div className="winning-popup-content">
          <div className="wining-image">
            <img src={winn} alt="winimg" />
            <div className="winning-amount-ribbon">
              <p style={{ marginTop: "-44px" }}>No Prize</p>
            </div>
            <p
              style={{ color: "white", marginBottom: 0, paddingBottom: "30px" }}
            >
              Better luck tomorrow!{" "}
            </p>
          </div>

          <div className="winning-btn">
            <div className="win-btn" onClick={handleCollect}>
              <p>Close</p>
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
