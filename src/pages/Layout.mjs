import { Link } from "react-router-dom";
import {
  ConnectWallet,
  ThirdwebNftMedia,
  useDisconnect,
  useAddress,
} from "@thirdweb-dev/react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import hatLogo from "../images/scroogeHatLogo.png";
import newLogo from "../images/new-logo.webp";
import { useContext } from "react";
import playPolicy from "../images/SCROOGE CASINO Game Play Policy.docx";

// import DLBigD from "../images/DLBigD.png";
// import WalletIcon from "../images/wallet.png";
// import StoreIconBadge from "../images/store.svg";
// import ClaimIconBadge from "../images/claim.svg";
// import PrizesIconBadge from "../images/prize.svg";
// import WalletIconBadge from "../images/walletIconBadge.png";
// import TophatIconBadge from "../images/tophatIconBadge.png";
// import tokenmobile from "../images/token.svg";
import logo from "../images/footer/logo.png";
import envelope from "../images/footer/envelope.svg";
import twitter from "../images/footer/twitter.svg";
// import discord from "../images/footer/discord.svg";
// import telegram from "../images/footer/telegram.svg";
import facebook from "../images/footer/facebook.svg";
// import reddit from "../images/footer/reddit.svg";

// import { ConnectWallet } from "@thirdweb-dev/react";
import CookieConsent from "react-cookie-consent";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
// import NewRoulette from "../components/roulette/roulette.mjs";
// import AuthContext from "../context/authContext.ts";
import {
  blackjackUrl,
  pokerUrl,
  rouletteUrl,
  scroogeClient,
  slotUrl,
} from "../config/keys.js";
import { Button, Container, Nav, Navbar, Spinner } from "react-bootstrap";
import AuthContext from "../context/authContext.ts";
import ConnectWalletModel from "./models/connectWalletModel.mjs";
import { marketPlaceInstance } from "../config/axios.js";

export const Tooltip = (id, metadata, message) => (
  <Popup
    trigger={<ThirdwebNftMedia key={id} metadata={metadata} height={200} />}
    position="bottom center"
    on={["hover", "focus"]}
    closeOnDocumentClick
  >
    <span> {message} </span>
  </Popup>
);

const useCurrentPath = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);
  return currentPath;
};

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const wrapperRef = useRef();
  const address = useAddress();

  // const { user } = useContext(AuthContext);
  const [currentPriceOG, setCurrentPriceOG] = useState("");
  const [priceColor, setPriceColor] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [loaderaddress, setLoaderAddress] = useState(false);
  // const [canSpin, setCanSpin] = useState(false);
  // const [spinTimer, setSpinTimer] = useState("");
  const currentRoute = useCurrentPath();
  const isActive = (routeName) => (routeName === currentRoute ? "active" : "");
  const disconnect = useDisconnect();
  const OGPrice = async () => {
    await fetch(`https://api.coinbrain.com/public/coin-info`, {
      method: "post",
      body: JSON.stringify({
        56: [process.env.REACT_APP_OGCONTRACT_ADDRESS],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const change_pct = data[0].priceUsd24hAgo;
        if (change_pct > 0) {
          setPriceColor("green");
        } else if (change_pct < 0) {
          setPriceColor("red");
        }
        const current_price = data[0].priceUsd;
        setCurrentPriceOG(current_price.toFixed(10));
        return current_price;
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    OGPrice();

    window.addEventListener("beforeunload", disconnect);
    return () => window.removeEventListener("beforeunload", disconnect);
  }, [disconnect]);

  // const [active, setActive] = useState(null);
  // const [showRoulette, setShowRoulette] = useState(false);
  // const handleclick = (value) => {
  //   localStorage.setItem("class", value);
  //   setActive(value);
  // };

  // useEffect(() => {
  //   if (window !== "undefined") {
  //     // const ab = Cookies.get("class");
  //     // setActive(ab);
  //   }
  //   if (user?.lastSpinTime) handleSpinTimer(user?.lastSpinTime, Date.now());
  //   else setCanSpin(true);
  // }, []);

  // const handleOpenRoulette = () => {
  //   setShowRoulette(true);
  // };

  // const handleSpinTimer = (nextSpinTIme, datetimeNow) => {
  //   let date1 = datetimeNow;
  //   let interval = setInterval(() => {
  //     const date2 = new Date(nextSpinTIme);
  //     const diffTime = (date2 - date1) / 1000;
  //     if (diffTime <= 0) {
  //       clearInterval(interval);
  //       setCanSpin(true);
  //     } else {
  //       let h = Math.floor(diffTime / 3600);
  //       let m = Math.floor((diffTime % 3600) / 60);
  //       let s = Math.floor((diffTime % 3600) % 60);
  //       setSpinTimer(`${h}:${m}: ${s}`);
  //       // setSpinTimer("12:00:00")
  //       // setCanSpin(true);
  //     }
  //     date1 += 1000;
  //   }, 1000);
  // };

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setNavOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };
  useOutsideAlerter(wrapperRef);

  const handleConnectWallet = () => {
    setShowConnect(!showConnect);
  };

  const handleConnect = () => {
    setLoaderAddress(true);

    setShowConnect(!showConnect);
  };

  useEffect(() => {
    if (address) {
      setLoaderAddress(false);
      saveConnectWallet(address);
    }
  }, [address]);

  const saveConnectWallet = async (walletAddress) => {
    try {
      console.log("lasyout address", walletAddress);

      const res = await (
        await marketPlaceInstance()
      ).post("/saveUserconnectedWallet", { walletAddress });
      console.log("resres", res);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <>
      <ConnectWalletModel
        show={showConnect}
        handleConnectWallet={handleConnectWallet}
        handleConnect={handleConnect}
      />
      <div className="wrapper">
        <div className="header" ref={wrapperRef}>
          <Navbar
            collapseOnSelect
            expand="lg"
            expanded={navOpen}
            onToggle={() => {
              setNavOpen(!navOpen);
            }}
          >
            <Container>
              <div className="header-Container">
                <div className="header-content">
                  <div className="logo">
                    <Link to={scroogeClient}>
                      {user ? (
                        <img
                          src={newLogo}
                          alt="logo"
                          height={110}
                          width={110}
                          className="new-logo"
                        />
                      ) : (
                        <img src={hatLogo} alt="logo" />
                      )}
                    </Link>
                  </div>
                  <div className="main-menu">
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                      <div className="logo-mobile">
                        <Link to={scroogeClient}>
                          {user ? (
                            <img
                              src={newLogo}
                              alt="logo"
                              height={45}
                              width={45}
                              className="new-logo"
                            />
                          ) : (
                            <img src={hatLogo} alt="logo" />
                          )}
                        </Link>
                      </div>

                      <Nav className="mr-auto">
                        {user ? (
                          <>
                            <Link
                              to={scroogeClient}
                              className={`nav-link ${isActive(scroogeClient)}`}
                            >
                              Home
                            </Link>
                            <Link
                              to={`${scroogeClient}/games`}
                              className={`nav-link ${isActive(
                                `${scroogeClient}/games`
                              )}`}
                            >
                              Games
                            </Link>
                            <Link
                              to={`/crypto-to-gc`}
                              className={`nav-link ${isActive(
                                "/crypto-to-gc"
                              )}`}
                            >
                              Purchase Center{" "}
                            </Link>
                            <Link
                              to={`/redeem-prizes`}
                              className={`nav-link ${isActive(
                                "/redeem-prizes"
                              )}`}
                            >
                              Redemption Center
                            </Link>
                            <Link
                              to={`/claim-free-tokens`}
                              className={`nav-link ${isActive(
                                "/claim-free-tokens"
                              )}`}
                            >
                              Daily Wheel Spin
                            </Link>
                            <Link
                              to={`${scroogeClient}/affiliate`}
                              className={`nav-link ${isActive("/affiliate")}`}
                            >
                              Affiliate Program
                            </Link>
                            {/* <Link
                              to={`/my-wallet`}
                              className={`nav-link ${isActive("/my-wallet")}`}
                            >
                              Holder Claim Center
                            </Link> */}
                          </>
                        ) : (
                          <a
                            href={`${scroogeClient}/login`}
                            /* target="_blank" */ rel="noreferrer"
                            alt="Login to Scrooge Casino"
                          >
                            <button className="submit-btn">
                              LOGIN TO YOUR SCROOGE CASINO ACCOUNT
                            </button>
                          </a>
                        )}
                      </Nav>
                    </Navbar.Collapse>
                  </div>
                  <div className="wallet">
                    {address ? (
                      <ConnectWallet />
                    ) : (
                      <Button onClick={() => handleConnectWallet()}>
                        {!loaderaddress ? (
                          "Connect Wallet"
                        ) : (
                          <Spinner animation="border" />
                        )}
                      </Button>
                    )}

                    <div className={priceColor}>${currentPriceOG}</div>
                  </div>
                </div>
              </div>
            </Container>
          </Navbar>
        </div>

        <div className="content">{children}</div>

        <div className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-info">
                <Link to={scroogeClient}>
                  <img src={logo} alt="scrooge casino nft token packages" />
                </Link>
                <h6>
                  Want to stay ahead of your competition. Subscribe and be the
                  first to know everything happening in the world of SCROOGE.
                </h6>
                <p>
                  <span>Copyright &copy; Scrooge LLC.</span> All Rights Reserved
                </p>
              </div>

              <div className="footer-menu">
                <h3>Destinations</h3>
                <ul>
                  {/* <li>
                  <Link to='/nft-tokens'>NFT Marketplace</Link>
                </li> */}
                  <li>
                    <a href={scroogeClient} rel="noreferrer">
                      Scrooge Casino Home
                    </a>
                  </li>
                  <li>
                    <a
                      href={`${user ? pokerUrl : `${scroogeClient}/login`}`}
                      rel="noreferrer"
                    >
                      Poker
                    </a>
                  </li>
                  <li>
                    <a
                      href={`${user ? blackjackUrl : `${scroogeClient}/login`}`}
                      rel="noreferrer"
                    >
                      Blackjack
                    </a>
                  </li>
                  <li>
                    <a
                      href={`${user ? slotUrl : `${scroogeClient}/login`}`}
                      rel="noreferrer"
                    >
                      Slot
                    </a>
                  </li>
                  <li>
                    <a
                      href={`${user ? rouletteUrl : `${scroogeClient}/login`}`}
                      rel="noreferrer"
                    >
                      Roulette
                    </a>
                  </li>
                </ul>
              </div>

              <div className="footer-menu">
                <h3>Policy</h3>
                <ul>
                  <li>
                    <Link to="/privacy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/terms">Terms and Conditions</Link>
                  </li>

                  {/* <li>
                    <Link to='/contact'>Contact Us</Link>
                  </li> */}
                  <li>
                    {" "}
                    <a href={playPolicy} target="blank">
                      Responsible Social Gameplay
                    </a>
                  </li>
                  <li>
                    <a href={`${scroogeClient}/sweepsrules`}> Sweeps Rules</a>
                  </li>
                </ul>
              </div>

              <div className="footer-contact">
                <h3>Follow us</h3>
                <ul className="footer-social">
                  <li>
                    <a
                      href="https://www.facebook.com/scroogegold/"
                      rel="noopener noreferrer"
                    >
                      <img src={facebook} alt="" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://twitter.com/Scrooge_Casino"
                      rel="noopener noreferrer"
                    >
                      <img src={twitter} alt="" />
                    </a>
                  </li>
                  {/* <li>
                    <a
                      href='http://t.me/scroogecoingold'
                      rel='noopener noreferrer'>
                      <img src={telegram} alt='' />
                    </a>
                  </li> */}
                  {/* <li>
                    <a
                      href="https://discord.gg/scroogecoin"
                      rel="noopener noreferrer"
                    >
                      <img src={discord} alt="" />
                    </a>
                  </li> */}
                  {/* <li>
                    <a
                      href="https://www.reddit.com/r/scroogecoin/"
                      rel="noopener noreferrer"
                    >
                      <img src={reddit} alt="" />
                    </a>
                  </li> */}
                </ul>
                <h3>Contact Us</h3>
                <ul className="footer-support">
                  <li>
                    <a
                      href="mailto:info@scrooge.casino"
                      rel="noopener noreferrer"
                    >
                      <img src={envelope} alt="" />
                      info@scrooge.casino {/* support@scroogegold.com */}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <CookieConsent
            location="bottom"
            buttonText="ACCEPT"
            cookieName="nftMarketCookieConsent"
            expires={150}
          >
            <h4>Cookies Policy</h4>
            <p>
              This website uses delicious cookies to enhance the user
              experience. Only for good stuff. We promise.
            </p>
          </CookieConsent>

          {/* <div className='mobile-menu'>
        <nav className='header-nav-container-mobile'>
          <div className='header-nav-menu-mobile'>
            <ul>
              <li
                onClick={() => handleclick("/")}
                className={active && active === "/" ? "active" : ""}>
                <Link to='/'>
                  <img src={TophatIconBadge} alt='logo' />
                </Link>
              </li>
              <li
                onClick={() => handleclick("/nft-tokens")}
                className={active && active === "/nft-tokens" ? "active" : ""}>
                <Link to='/crypto-to-gc'>
                  <StoreSvg />
                </Link>
              </li>
              <li
                onClick={() => handleclick("/claim-free-tokens")}
                className={active === "/claim-free-tokens" ? "active" : ""}>
                <Link to='/claim-free-tokens'>
                 
                  <ClaimSvg />
                </Link>
              </li>
              <li
                onClick={() => handleclick("/redeem-prizes")}
                className={active === "/redeem-prizes" ? "active" : ""}>
                <Link to='/redeem-prizes'>
                  <PrizeSvg />
                </Link>
              </li>
              <li
                onClick={() => handleclick("/earn-tokens")}
                className={active === "/earn-tokens" ? "active" : ""}>
                <Link to='/earn-tokens'>
                  <TokenSvg />
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div> */}
        </div>
      </div>
      {/* {showRoulette ? <NewRoulette /> : null} */}
    </>
  );
};

export default Layout;

// const HomeSVG = () => {
//   return (
//     <svg
//       xmlns='http://www.w3.org/2000/svg'
//       viewBox='0 0 72 72'
//       width='128px'
//       height='128px'>
//       <path d='M 36 10 C 34.861 10 33.722922 10.386609 32.794922 11.162109 L 11.517578 28.941406 C 10.052578 30.165406 9.5519375 32.270219 10.460938 33.949219 C 11.711938 36.258219 14.661453 36.740437 16.564453 35.148438 L 35.359375 19.445312 C 35.730375 19.135313 36.269625 19.135313 36.640625 19.445312 L 55.435547 35.148438 C 56.183547 35.774437 57.093047 36.078125 57.998047 36.078125 C 59.171047 36.078125 60.333953 35.567219 61.126953 34.574219 C 62.503953 32.850219 62.112922 30.303672 60.419922 28.888672 L 58 26.867188 L 58 16.667969 C 58 15.194969 56.805984 14 55.333984 14 L 52.667969 14 C 51.194969 14 50 15.194969 50 16.667969 L 50 20.181641 L 39.205078 11.162109 C 38.277078 10.386609 37.139 10 36 10 z M 35.996094 22.925781 L 13.996094 41.302734 L 13.996094 50 C 13.996094 54.418 17.578094 58 21.996094 58 L 49.996094 58 C 54.414094 58 57.996094 54.418 57.996094 50 L 57.996094 41.302734 L 35.996094 22.925781 z M 32 38 L 40 38 C 41.105 38 42 38.895 42 40 L 42 50 L 30 50 L 30 40 C 30 38.895 30.895 38 32 38 z' />
//     </svg>
//   );
// };

// const StoreSvg = () => {
//   return (
//     <svg
//       width='214'
//       height='213'
//       viewBox='0 0 214 213'
//       fill='none'
//       xmlns='http://www.w3.org/2000/svg'>
//       <path
//         d='M87.3326 1.53372C66.5326 5.93372 49.7326 14.8671 34.3993 29.4004C7.86597 54.7337 -4.13403 90.6004 2.53263 125.267C13.466 182.067 67.466 220.6 123.333 211.534C182.533 201.934 223.199 145.134 212.133 87.267C207.733 64.867 197.066 45.4004 180.133 29.4004C160.533 10.6004 138.399 1.26705 111.599 0.33372C101.333 -0.0662796 93.066 0.33372 87.3326 1.53372ZM148.666 48.3337V51.6671H107.333H65.9993V48.3337V45.0004H107.333H148.666V48.3337ZM166.266 71.0004C171.199 79.8004 175.333 87.667 175.333 88.467C175.333 89.267 174.133 91.5337 172.533 93.5337C169.333 97.5337 162.933 98.2004 159.333 95.0004C157.333 93.1337 156.933 93.1337 155.333 95.0004C154.399 96.067 151.599 97.0004 148.933 97.0004C146.399 97.0004 143.199 96.067 141.999 95.0004C139.999 93.1337 139.599 93.1337 137.999 95.0004C135.866 97.5337 128.133 97.5337 125.999 95.0004C124.399 93.1337 123.999 93.1337 121.866 95.1337C120.133 96.7337 118.133 97.1337 114.399 96.467C108.133 95.4004 106.533 95.4004 100.266 96.467C96.5326 97.1337 94.5326 96.7337 92.7993 95.1337C90.666 93.1337 90.266 93.1337 88.666 95.0004C87.7326 96.067 85.066 97.0004 82.666 97.0004C80.266 97.0004 77.5993 96.067 76.666 95.0004C75.066 93.1337 74.666 93.1337 72.666 95.0004C69.866 97.5337 61.466 97.5337 59.3326 95.0004C57.7326 93.1337 57.3326 93.1337 55.3326 95.0004C51.7326 98.2004 45.3326 97.5337 42.1326 93.5337C40.5326 91.5337 39.3326 89.4004 39.3326 88.6004C39.3326 87.267 54.666 59.0004 57.066 55.9337C57.9993 54.7337 69.1993 54.3337 107.866 54.6004L157.333 55.0004L166.266 71.0004ZM59.9993 98.3337C61.066 100.067 70.3993 100.067 72.266 98.2004C73.3326 97.1337 74.5326 97.1337 76.3993 98.2004C79.866 100.067 85.466 100.067 88.7993 98.2004C90.7993 97.267 91.9993 97.267 93.466 98.3337C94.5326 99.4004 97.1993 99.667 100.266 99.1337C103.066 98.6004 106.266 98.3337 107.333 98.3337C108.399 98.3337 111.599 98.6004 114.399 99.1337C117.466 99.667 120.133 99.4004 121.199 98.3337C122.666 97.267 123.866 97.267 125.866 98.2004C129.199 100.067 134.799 100.067 138.266 98.2004C140.133 97.1337 141.333 97.1337 142.399 98.2004C144.399 100.2 153.066 100.067 155.066 98.067C158.799 94.3337 159.466 99.267 159.066 130.067C158.533 170.334 161.333 167 127.599 167H102.666L102.266 147.267L101.866 127.667H89.3326H76.7993L76.3993 147.267L75.9993 167H68.9326C63.5993 166.867 61.3326 166.2 58.9326 163.934C56.1326 161 55.9993 159.934 55.5993 130.734C55.3326 114.2 55.466 99.8004 55.866 98.867C56.666 96.7337 58.7993 96.467 59.9993 98.3337Z'
//         fill='black'
//       />
//       <path
//         d='M120.932 129.267C119.999 130.201 119.332 134.467 119.332 139.001C119.332 143.534 119.999 147.801 120.932 148.734C121.865 149.667 126.265 150.334 131.599 150.334C141.999 150.334 143.332 149.134 143.332 139.001C143.332 128.867 141.999 127.667 131.599 127.667C126.265 127.667 121.865 128.334 120.932 129.267Z'
//         fill='black'
//       />
//     </svg>
//   );
// };

// const TokenSvg = () => {
//   return (
//     <svg
//       width='210'
//       height='213'
//       viewBox='0 0 210 213'
//       fill='none'
//       xmlns='http://www.w3.org/2000/svg'>
//       <path
//         d='M68.5759 5.42418C43.8716 14.8644 25.1303 31.1701 11.9263 53.9124C1.70375 71.0764 0 78.8002 0 106.692C0 135.441 1.70375 141.449 12.7781 160.329C45.1494 212.679 110.744 228.556 161.43 196.373C227.451 154.322 225.747 56.487 158.875 14.8644C134.17 -0.583207 94.5581 -4.4451 68.5759 5.42418ZM127.781 75.7965C135.022 79.6584 140.985 86.9531 141.837 91.6732C143.115 98.9678 140.985 99.826 117.133 98.5387C92.0025 96.8223 91.5766 96.8223 91.5766 108.408C91.5766 118.706 92.4284 119.565 98.3916 114.845C103.929 109.695 104.355 110.554 99.6694 120.423C95.8359 129.434 95.8359 134.583 99.2434 142.736L104.355 153.463L88.595 147.027C63.4647 136.299 61.335 132.867 62.6128 106.692C63.8906 83.9494 64.7425 82.6621 80.9281 73.2219C98.8175 62.9235 106.058 63.3526 127.781 75.7965ZM111.596 104.546C110.318 105.833 106.484 106.263 103.503 104.975C100.095 103.688 101.373 102.401 106.058 102.401C110.744 101.972 113.299 103.259 111.596 104.546ZM144.393 117.419C153.338 126.43 152.912 134.583 142.689 144.881C132.893 154.751 128.633 155.18 116.707 149.172C107.336 144.023 105.633 123.856 113.725 115.703C120.966 108.408 136.726 109.266 144.393 117.419Z'
//         fill='black'
//       />
//       <path
//         d='M68.9995 100.683C64.7402 104.974 65.592 119.134 69.8514 119.134C71.9811 119.134 74.9627 116.56 75.8145 113.556C77.5183 109.265 78.3702 109.265 78.3702 113.556C79.222 124.713 87.3149 118.705 86.8889 107.12C86.8889 100.683 85.6111 98.1084 84.3333 101.112C83.0555 104.974 80.4999 105.403 77.0924 102.399C74.1108 99.8248 70.2774 98.9666 68.9995 100.683Z'
//         fill='black'
//       />
//       <path
//         d='M122.669 121.711C121.391 125.573 122.669 130.293 126.077 132.439C131.188 135.443 131.188 136.301 126.077 136.301C120.965 136.301 120.965 137.588 124.799 141.45C128.632 145.312 131.188 145.312 135.447 141.021C139.707 136.73 138.855 134.584 132.892 129.864C125.225 124.286 125.225 124.286 132.892 122.57C140.133 121.282 140.133 120.853 132.892 117.85C127.78 116.133 124.373 117.42 122.669 121.711Z'
//         fill='black'
//       />
//     </svg>
//   );
// };

// const PrizeSvg = () => {
//   return (
//     <svg
//       width='213'
//       height='214'
//       viewBox='0 0 213 214'
//       fill='none'
//       xmlns='http://www.w3.org/2000/svg'>
//       <path
//         d='M88.4668 2.13354C57.9335 7.20021 27.4001 29.0669 12.6001 56.5335C9.93346 61.3335 6.20013 70.6669 4.20013 77.3335C1.00013 87.8669 0.466797 91.4669 0.466797 107.334C0.466797 123.2 1.00013 126.8 4.20013 137.334C14.7335 172 39.2668 196.934 74.3335 208.8C86.2001 212.934 88.0668 213.2 106.333 213.2C124.733 213.2 126.333 213.067 138.333 208.934C176.733 195.734 202.733 166.4 210.867 126.934C217.8 93.8669 206.333 56.8002 181.667 32.2669C157.4 8.00021 121.8 -3.46646 88.4668 2.13354ZM111.667 44.6669C116.6 47.3335 117.533 57.8669 113.4 65.3335C111.667 68.4002 101.4 68.8002 99.5335 65.8669C91.5335 53.4669 100.067 38.4002 111.667 44.6669ZM91.1335 53.7335C91.9335 54.2669 93.0001 56.4002 93.4001 58.6669C93.8001 60.8002 94.4668 63.8669 95.0001 65.3335C95.8001 67.8669 95.2668 68.0002 87.8001 67.6002L79.6668 67.0669V62.8002C79.6668 58.5335 82.0668 55.2002 86.3335 53.6002C89.1335 52.5335 89.5335 52.5335 91.1335 53.7335ZM129.533 55.4669C132.467 57.7335 133 59.2002 132.733 62.9335L132.333 67.6002L124.6 67.8669C117.4 68.0002 116.867 67.8669 117.667 65.3335C118.2 63.8669 118.867 61.2002 119.267 59.3335C120.467 53.4669 120.867 52.6669 123.4 52.6669C124.867 52.6669 127.533 54.0002 129.533 55.4669ZM97.0001 80.6669V90.0002H72.3335H47.6668V80.6669V71.3335H72.3335H97.0001V80.6669ZM111.667 80.0002V88.6669H106.333H101V80.0002V71.3335H106.333H111.667V80.0002ZM165 80.6669V90.0002H140.333H115.667V80.6669V71.3335H140.333H165V80.6669ZM90.6001 94.9335C86.0668 95.3335 83.2668 96.1335 82.7335 97.4669C82.3335 98.4002 80.7335 99.3335 79.1335 99.3335C77.5335 99.3335 74.8668 100.534 73.2668 102C69.4001 105.6 69.2668 115.6 72.8668 121.467C75.4001 125.6 83.4001 132.667 85.8001 132.667C86.4668 132.8 89.0001 134.534 91.4001 136.534C95.0001 139.6 95.6668 140.934 95.0001 143.734C94.4668 145.6 92.6001 148.134 90.8668 149.334C89.1335 150.4 87.6668 152.134 87.6668 153.067C87.6668 154 86.4668 155.467 85.0001 156.4C83.5335 157.334 82.3335 159.467 82.3335 161.334V164.8L68.7335 164.4L55.0001 164L54.6001 128.934L54.3335 94.0002L75.9335 94.2669C87.9335 94.4002 94.4668 94.6669 90.6001 94.9335ZM109.4 94.9335C107.667 95.2002 105 95.2002 103.4 94.9335C101.667 94.6669 103 94.4002 106.333 94.4002C109.667 94.4002 111 94.6669 109.4 94.9335ZM158.067 128.934L157.667 164L144.067 164.4L130.333 164.8V161.334C130.333 159.467 129.133 157.334 127.667 156.4C126.2 155.467 125 154 125 153.067C125 152.267 123.533 150.4 121.8 149.067C119.933 147.734 118.067 145.067 117.667 143.2C116.867 140.134 117.533 139.2 123 135.867C138.067 126.534 142.333 120.8 142.333 110.134C142.333 104.8 141.8 103.067 139.4 101.467C137.8 100.267 135.133 99.3335 133.533 99.3335C131.933 99.3335 130.333 98.4002 129.933 97.4669C129.4 96.1335 126.6 95.3335 122.067 94.9335C118.2 94.6669 124.733 94.4002 136.733 94.2669L158.333 94.0002L158.067 128.934ZM127.4 111.867C127.133 122.134 126.467 125.2 124.2 128.267C114.467 141.334 98.2001 141.334 88.4668 128.267C86.2001 125.2 85.5335 122.134 85.2668 111.867L84.7335 99.3335H106.333H127.933L127.4 111.867ZM81.0001 110.267C81.0001 114.134 81.5335 119.6 82.2001 122.267C83.1335 126.134 83.0001 126.934 81.5335 126.4C78.0668 125.067 74.3335 117.2 74.3335 111.067C74.3335 104.534 75.0001 103.334 78.6001 103.334C80.6001 103.334 81.0001 104.4 81.0001 110.267ZM138.067 110C138.6 116.534 135.933 123.067 131.667 125.6C129.4 127.067 129.267 126.934 130.467 122.934C131.133 120.667 131.667 115.2 131.667 110.934C131.667 103.6 131.8 103.2 134.733 103.6C137.133 103.867 137.8 104.934 138.067 110ZM114.067 144.534C114.467 147.067 113.933 147.334 106.467 147.334C101.933 147.334 98.3335 146.8 98.3335 146.134C98.3335 142.267 100.067 141.334 106.733 141.467C112.733 141.6 113.667 142 114.067 144.534ZM120.733 153.6C121.133 154.934 117.667 155.334 106.467 155.334C92.8668 155.334 90.0668 154.667 92.6001 152.134C94.3335 150.534 120.067 151.867 120.733 153.6ZM126.333 165.334V171.334H106.333H86.3335V165.334V159.334H106.333H126.333V165.334Z'
//         fill='black'
//       />
//       <path
//         d='M103.4 108C102.6 109.867 101.4 111.334 100.866 111.334C100.333 111.334 98.1996 112 96.1996 112.667L92.5996 114.134L95.5329 117.067C97.2663 118.934 98.3329 121.867 98.3329 124.534C98.3329 128.534 98.5996 128.934 101.4 128C104.466 127.067 106.066 126.934 111.666 127.6C114.6 128 115 127.6 114.6 124.267C114.2 121.734 115.133 119.334 117.133 117.2L120.066 114.134L116.466 112.667C114.466 112 112.333 111.334 111.8 111.334C111.266 111.334 110.066 109.867 109.266 108C108.466 106.134 107.133 104.667 106.333 104.667C105.533 104.667 104.2 106.134 103.4 108ZM109.666 114.534C111.666 115.6 112.6 116.8 111.8 117.334C111 117.734 110.333 119.2 110.333 120.4C110.333 122 109.133 122.667 106.333 122.667C103.8 122.667 102.466 122.134 102.866 121.067C103.266 120.267 102.6 118.8 101.533 117.867C99.9329 116.534 100.066 116 102.6 114.667C104.333 113.734 105.8 112.934 105.8 112.8C105.933 112.667 107.666 113.467 109.666 114.534Z'
//         fill='black'
//       />
//     </svg>
//   );
// };

// const ClaimSvg = () => {
//   return (
//     <svg
//       width='214'
//       height='213'
//       viewBox='0 0 214 213'
//       fill='none'
//       xmlns='http://www.w3.org/2000/svg'>
//       <path
//         d='M89.3338 1.13365C65.7338 5.80031 47.2004 15.8003 30.2671 33.1336C7.33377 56.467 -3.7329 92.867 2.53377 125.267C7.0671 148.334 14.8004 163 32.0004 180.467C49.7338 198.467 67.7338 207.934 91.0671 211.534C115.067 215.267 141.067 210.334 161.6 198.2C172.134 191.934 188.934 175.667 196.267 164.6C224.534 121.934 218.134 65.667 180.934 30.067C168.134 17.8003 156 10.467 139.6 5.00031C129.334 1.53365 124.534 0.733648 111.6 0.333648C103.067 0.0669811 93.0671 0.333648 89.3338 1.13365ZM117.067 47.0003C120.534 48.2003 125.467 51.267 128 53.5337L132.534 57.8003L132.4 79.8003C132.267 110.6 132 108.6 136.534 109.667C143.2 111.134 150.667 117.534 154.534 125.134C160.667 137.534 158.534 149.8 148.534 159.934C142 166.467 135.867 169 126.667 169C120.534 169 110.8 165 106 160.467C103.2 157.8 100.8 157.267 90.6671 156.6C76.9338 155.8 68.4004 153.134 61.8671 147.8L57.3338 143.934L57.2004 101.534C57.0671 68.067 57.3338 58.3337 58.8004 56.2003C61.2004 52.2003 68.2671 48.067 76.8004 45.667C86.1338 43.1337 108.134 43.8003 117.067 47.0003Z'
//         fill='black'
//       />
//       <path
//         d='M74.2675 50.2C48.5341 59.1333 62.1341 77 94.6675 77C127.867 77 141.201 57.8 113.734 49.6667C104.001 46.8667 83.3341 47.1333 74.2675 50.2ZM103.067 55.5333C103.734 57.4 100.267 57.4 98.4008 55.5333C96.6675 53.8 92.6675 54.8667 92.6675 56.8667C92.6675 57.5333 95.2008 59.9333 98.4008 61.9333C101.467 64.0667 104.001 66.6 104.001 67.6667C104.001 68.7333 101.867 70.6 99.3341 71.8C94.9341 73.9333 94.5341 73.9333 91.0675 71.4C87.2008 68.7333 86.2675 66.3333 88.9341 66.3333C89.7341 66.3333 91.4675 67.2667 92.6675 68.3333C94.9341 70.3333 99.3341 69.8 99.3341 67.5333C99.3341 66.8667 96.9341 64.8667 94.1341 63.1333C86.8008 58.4667 86.2675 57 90.6675 53.5333C94.0008 50.8667 94.8008 50.7333 98.5341 52.3333C100.667 53.2667 102.801 54.7333 103.067 55.5333Z'
//         fill='black'
//       />
//       <path
//         d='M60.668 74.2006C60.668 77.6672 67.468 82.7339 75.7346 85.5339C83.7346 88.2006 104.535 88.3339 113.201 85.8006C121.068 83.4006 128.668 77.6672 128.668 74.2006V71.4006L124.268 74.2006C109.868 83.1339 79.468 83.1339 65.068 74.2006L60.668 71.4006V74.2006Z'
//         fill='black'
//       />
//       <path
//         d='M60.668 84.8673C60.668 92.0673 76.9346 98.6006 94.668 98.6006C112.401 98.6006 128.668 92.0673 128.668 84.8673C128.668 82.4673 128.535 82.4673 124.001 85.1339C109.468 93.6673 79.868 93.8006 65.468 85.2673C60.9346 82.6006 60.668 82.6006 60.668 84.8673Z'
//         fill='black'
//       />
//       <path
//         d='M60.668 95.7999C60.668 99.1332 67.6013 104.467 75.6013 107.133C85.2013 110.333 104.268 110.333 113.735 107.133C121.735 104.467 128.668 99.1332 128.668 95.7999C128.668 93.7999 127.601 93.9332 120.401 97.5332C112.401 101.533 111.468 101.667 94.668 101.667C77.868 101.667 76.9346 101.533 68.9346 97.5332C61.7346 93.9332 60.668 93.7999 60.668 95.7999Z'
//         fill='black'
//       />
//       <path
//         d='M60.668 106.067C60.668 111.267 70.268 117.267 82.668 119.534C96.4013 122.067 100.935 121.534 106.401 116.601L111.201 112.334L97.3346 112.734C82.268 113.267 71.3346 111.001 64.4013 106.067C60.8013 103.534 60.668 103.534 60.668 106.067Z'
//         fill='black'
//       />
//       <path
//         d='M125.733 105.534C122.533 107.934 122.666 108.867 126 108.067C127.466 107.667 128.666 106.467 128.666 105.534C128.666 103.267 128.666 103.267 125.733 105.534Z'
//         fill='black'
//       />
//       <path
//         d='M117.333 114.067C110.8 117.133 104.133 124.467 102 131C96.6664 147.267 109.6 164.867 127.066 165C135.733 165 141.333 162.733 146.933 156.867C152.266 151.267 154 146.6 154 138.467C154 119.8 133.866 106.333 117.333 114.067ZM131.466 126.6C132.933 128.067 134 129.933 134 130.6C134 132.067 131.733 131.933 130.666 130.333C130.266 129.533 128.933 129 127.866 129C124.666 129 125.733 133.667 130 137.667C134.533 141.933 135.2 146.867 131.733 150.6C128.933 153.667 127.466 153.667 124.533 150.067C121.466 146.6 121.333 145 124 145C125.066 145 126 145.533 126 146.333C126 147 126.8 147.667 127.866 147.667C131.866 147.667 131.466 144.733 126.8 139.667C121.2 133.533 120.933 131.933 124.8 127.133C128.133 122.867 128.4 122.867 131.466 126.6Z'
//         fill='black'
//       />
//       <path
//         d='M60.668 117.001C60.668 123.534 72.8013 129.801 88.4013 131.267C97.2013 132.067 99.3346 131.134 99.3346 126.334C99.3346 124.734 97.3346 124.201 90.268 123.934C79.6013 123.534 69.068 120.734 64.268 116.867L60.668 114.201V117.001Z'
//         fill='black'
//       />
//       <path
//         d='M60.668 127.933C60.668 134.333 72.9346 140.733 87.468 141.933C96.5346 142.733 96.668 142.733 96.668 139.4C96.668 136.333 96.0013 136.067 86.268 134.733C77.7346 133.667 70.9346 131.4 61.7346 126.6C61.068 126.333 60.668 126.867 60.668 127.933Z'
//         fill='black'
//       />
//       <path
//         d='M60.668 139.667C60.668 146.333 76.1346 153 91.6013 153H100.668L99.068 149.667C97.868 147 96.668 146.333 92.668 146.333C84.4013 146.333 73.7346 143.8 67.068 140.333C61.068 137.4 60.668 137.267 60.668 139.667Z'
//         fill='black'
//       />
//     </svg>
//   );
// };
