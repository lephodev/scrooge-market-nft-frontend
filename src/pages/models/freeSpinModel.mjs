import { Modal, Button } from "react-bootstrap";
// import freeSpin from "../../images/freeSpin.jpg";
import "./freeSpin.css";
import { relaxLaunchUrl, slotUrl } from "../../config/keys.js";
import { relaxGamingInstance } from "../../config/axios.js";
const FreeSpinModel = ({ showFreeSpin, handleCloseFreeSpin, packgaeData }) => {
  console.log(
    "showFreeSpin, handleCloseFreeSpin, packgaeData ",
    showFreeSpin,
    handleCloseFreeSpin,
    packgaeData
  );

  const handleRedirectToGame = async (obj, provider, subprovider) => {
    const tickt = await (await relaxGamingInstance()).get(`/getToken/SC.`);

    let relaxGameUrl = "";
    relaxGameUrl = `${relaxLaunchUrl}gameid=erikthered&ticket=${
      tickt.data.token
    }&jurisdiction=MT&lang=en_SC&channel=${
      window.innerWidth <= 767 ? "mobile" : "web"
    }&partner=scrooge&partnerid=2258&moneymode=real`;
    localStorage.setItem(
      "game",
      `${slotUrl}/#/?game=${encodeURIComponent(relaxGameUrl)}`
    );
    window.location.href = `${slotUrl}/#/?game=${encodeURIComponent(
      relaxGameUrl
    )}&mode=token`;
  };
  return (
    <>
      <Modal className="contest-modal" centered size="lg" show={showFreeSpin}>
        <div className="contest-banner-slider">
          <Modal.Header>
            <div className="contest-title-grid">
              YOU GOT {packgaeData?.numberofSpins} FREE SPINS{" "}
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="contest-content">
              <img
                src={packgaeData?.spinBannerImage}
                alt="banner"
                className="img-fluid"
                loading="lazy"
              />
            </div>
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: "center" }}>
            <Button
              onClick={() => handleRedirectToGame()}
              style={{ background: "yellow", color: "black", border: "none" }}
            >
              Play Now
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default FreeSpinModel;
