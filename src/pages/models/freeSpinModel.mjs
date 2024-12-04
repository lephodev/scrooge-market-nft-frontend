import { Modal, Button } from "react-bootstrap";
// import freeSpin from "../../images/freeSpin.jpg";
import "./freeSpin.css";
import { relaxLaunchUrl, slotUrl } from "../../config/keys.js";
import {
  bGamingInstance,
  hacksawInstance,
  relaxGamingInstance,
} from "../../config/axios.js";
const FreeSpinModel = ({
  showFreeSpin,
  handleCloseFreeSpin,
  packgaeData,
  user,
}) => {
  console.log(
    "showFreeSpin, handleCloseFreeSpin, packgaeData ",
    showFreeSpin,
    handleCloseFreeSpin,
    packgaeData
  );

  const handleRedirectToGame = async () => {
    if (
      packgaeData?.provider === "Relax" ||
      packgaeData?.provider === "Relax-Kalamba" ||
      packgaeData?.provider === "Relax-Evoplay" ||
      packgaeData?.provider === "Relax-Playson"
    ) {
      const tickt = await (await relaxGamingInstance()).get(`/getToken/SC.`);

      let relaxGameUrl = "";
      relaxGameUrl = `${relaxLaunchUrl}gameid=${
        packgaeData?.freeSpinGame
      }&ticket=${tickt.data.token}&jurisdiction=MT&lang=en_SC&channel=${
        window.innerWidth <= 767 ? "mobile" : "web"
      }&partner=scrooge&partnerid=2258&moneymode=real`;
      localStorage.setItem(
        "game",
        `${slotUrl}/#/?game=${encodeURIComponent(relaxGameUrl)}`
      );
      window.location.href = `${slotUrl}/#/?game=${encodeURIComponent(
        relaxGameUrl
      )}&mode=token`;
    } else if (packgaeData?.provider === "bGaming") {
      const launchData = await (
        await bGamingInstance()
      ).post(`/launch/${packgaeData?.freeSpinGame}/ST`);
      const {
        data: {
          launch_options: { game_url },
        },
      } = launchData;
      localStorage.setItem(
        "game",
        `${slotUrl}/#/?game=${encodeURIComponent(game_url)}`
      );
      window.location.href = `${slotUrl}/#/?game=${encodeURIComponent(
        game_url
      )}`;
      // window.location.href = game_url;
    } else if (packgaeData?.provider === "Hacksaw") {
      const resp = await (
        await hacksawInstance()
      ).post("/launchGame", {
        userId: user?.id || user?._id,
        mode: "token",
        gameId: packgaeData?.freeSpinGame,
        device: window.innerWidth <= 767 ? "mobile" : "desktop",
      });
      localStorage.setItem(
        "game",
        `${slotUrl}/#/?game=${encodeURIComponent(resp.data.url)}`
      );
      window.location.href = `${slotUrl}/#/?game=${encodeURIComponent(
        resp.data.url
      )}`;
      // window.location.href = resp.data.url;
      return;

      // window.location.href = game_url;
    }
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
