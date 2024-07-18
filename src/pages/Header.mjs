import React, { useContext, useEffect, useRef, useState } from "react";
import newLogo from "../images/new-logo.webp";
import { Button, Dropdown, Form, Nav, Navbar } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import cookie from "js-cookie";
import { HiOutlineLogout } from "react-icons/hi";
import {
  // blackjackUrl,
  // pokerUrl,
  // rouletteUrl,
  scroogeClient,
  // slotUrl,
} from "../config/keys.js";

// import playPolicy from "../asset/SCROOGE CASINO Game Play Policy.docx";
import bell from "../images/bell.svg";
import profile from "../images/profile.png";
import { Link, useLocation } from "react-router-dom";
import hatLogo from "../images/scroogeHatLogo.png";
import AuthContext from "../context/authContext.ts";
import { authInstance } from "../config/axios.js";
const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState("");
  const subMenuRef = useRef();
  const { mode, user, setMode } = useContext(AuthContext);
  const useCurrentPath = () => {
    const location = useLocation();
    const [currentPath, setCurrentPath] = useState("");

    useEffect(() => {
      setCurrentPath(location.pathname);
    }, [location]);
    return currentPath;
  };

  const handleModeChange = (e) => {
    const {
      target: { checked },
    } = e;
    const gameMode = checked ? "token" : "goldCoin";
    // console.log("Modeee", gameMode);

    cookie.set("mode", gameMode, {
      domain: ".scrooge.casino",
      path: "/",
      httpOnly: false,
    });

    setMode(gameMode);
    // setMode(checked);
  };

  const handleLogout = async () => {
    if (user?.id) {
      const tokenData = localStorage.getItem("refreshToken") || "";

      await (
        await authInstance()
      ).post(
        "/auth/logout",
        { refreshToken: tokenData },
        { withCredentials: true, credentials: "include" }
      );
      localStorage.removeItem("megaBonus");
      localStorage.removeItem("activeCount");
    }
    localStorage.clear();
    window.location.href = `${scroogeClient}`;
  };

  const currentRoute = useCurrentPath();
  const isActive = (routeName) => (routeName === currentRoute ? "active" : "");
   
  const handleMouseEnter = (value) => {
    setDropdownVisible(value);
  };
  const handleMouseLeave = () => {
    setDropdownVisible("");
  };
  const handleDropDown = (value) => {
    if (value === isDropdownVisible) {
      setDropdownVisible(" ");
      return;
    }
    setDropdownVisible(value);
  };

  return (
    // <div className='headerContainer'>
    //   <div className='header_top'>
    //      <div className='header_log'>sdfsdf</div>
    //      <div className='header_center_content'>sdfsdf</div>
    //      <div className='header_profile'>sdfsdf</div>
    //   </div>
    // </div>
    <Navbar
      collapseOnSelect
      expand="lg"
      expanded={navOpen}
      onToggle={() => {
        setNavOpen(!navOpen);
      }}
    >
      <div className="header_outer">
        <div className={`${user?"user_header":"non_login"} header-Container new_header_container "`}>
          <div className="header-content ">
            <div className="header_logo">
              <Link to={scroogeClient}>
                {user ? (
                  <img src={newLogo} alt="logo" height={70} width={70} />
                ) : (
                  <img src={hatLogo} alt="logo" />
                )}
              </Link>
            </div>
            <div className="headerMode-container">
              <div className={`slotLobby-mode `}>
                <Form>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label={
                      mode === "token"
                        ? `ST: ${parseInt(user?.wallet)}`
                        : `GC: ${parseInt(user?.goldCoin)}`
                    }
                    defaultChecked={mode === "token"}
                    checked={mode === "token"}
                    onChange={handleModeChange}
                    // disabled={disableRedirections}
                  />
                  <Button
                    className="purchase-btn"
                    // disabled={disableRedirections}
                  >
                    <a
                      // href={`${marketPlaceUrl}/crypto-to-gc`}
                      href="/"
                      rel="noreferrer"
                    >
                      <FaPlusCircle />
                    </a>
                  </Button>
                </Form>
              </div>
              {/* <p>jhgh</p> */}
              {/* {mode === "token" ? <p>ST 100:1 USD </p> : null} */}
              {/* <div className="tickets-token">
                        <Button
                          className="btn btn-primary"
                          disabled={user?.ticket < 10}
                          onClick={handleTicketTotoken}
                        >
                          <img src={ticket} alt="" /> <span>Ticket</span>{" "}
                          <FaArrowsAltH /><img src={coin} alt="" />{" "}
                          <span>Token</span>
                        </Button>
                        <TicketTotoken
                          user={user}
                          show={ticketToToken}
                          handleClose={handleTicketTotoken}
                          setUser={setUser}
                        />
                      </div> */}
            </div>
            <div className="notifyProfileheader">
              <div>
                <img src={bell} height={20} width={20} alt="bell_icon" />
              </div>
              <div className="user-profile">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="success"
                    id="dropdown-basic"
                    // disabled={disableRedirections}
                  >
                    <img
                      // src={user?.profile ? user?.profile : profile}
                      // onError={(e) => {
                      //   e.target.onerror = null;
                      //   e.target.src = profile;
                      // }}
                      src={profile}
                      alt="profile"
                    />
                    <span>
                      {/* {localStorage.getItem("name")
                              ? localStorage.getItem("name")
                              : user?.username} */}
                      {/* <i className="las la-angle-down" /> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                      </svg>
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Link
                      className="dropdown-item"
                      to={`${scroogeClient}/profile`}
                    >
                      Profile
                    </Link>
                    <Link
                      className="dropdown-item"
                      to={`${scroogeClient}/setting`}
                    >
                      Settings
                    </Link>
                    <div
                      onClick={handleLogout}
                      role="presentation"
                      className="dropdown-item"
                    >
                      Logout
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
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

              <Nav className="mr-auto ">
                {user ? (
                  <>
                  <div className="navItem">
                    <Link
                      to={scroogeClient}
                      className={`nav-link ${isActive(scroogeClient)}`}
                    >
                      Home
                    </Link>
                    {/* <Link
                      to={`${scroogeClient}/games`}
                      className={`nav-link ${isActive(
                        `${scroogeClient}/games`
                      )}`}
                    >
                      Games
                    </Link> */}

                    <div
                                    className={`nav-link custom-dd ${isActive(
                                      "/games"
                                    )}`}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={() => {
                                      handleDropDown("games");
                                    }}
                                    role="presentation"
                                    // ref={subMenuRef1}
                                  >
                                    <span
                                      className={`${
                                        !isDropdownVisible ? "drop-arrow" : ""
                                      }`}
                                    >
                                      Games <ArrowIcon />
                                    </span>
                                    {isDropdownVisible === "games" ? (
                                      <div className="custom-dropdown-menu">
                                        <ul>
                                         <li>
                                            <Link to={`${scroogeClient}/new-releases`}>
                                              New Releases
                                            </Link>
                                          </li>
                                          {/* <li>
                                            <Link to={pokerUrl}>Poker</Link>
                                          </li> */}
                                          <li>
                                            <Link to={`${scroogeClient}/games`}>Slots</Link>
                                          </li>
                                          <li>
                                            <Link to={`${scroogeClient}/table-games`}>
                                              Table Games
                                            </Link>
                                          </li>
                                          <li>
                                            <Link to={`${scroogeClient}/casual`}>Casuals</Link>
                                          </li>
                                          <li>
                                            <Link to={`${scroogeClient}/classic-slot`}>
                                              Classic Slots
                                            </Link>
                                          </li>
                                          <li>
                                            <Link to={`${scroogeClient}/fish-games`}>
                                              Fish Games
                                            </Link>
                                          </li>
                                          <li>
                                            <Link to={`${scroogeClient}/holdAndWin-games`}>
                                              Hold And Win
                                            </Link>
                                          </li>
                                          <li>
                                            <Link to={`${scroogeClient}/jackpot-games`}>
                                              Jackpots
                                            </Link>
                                          </li>
                                          <li>
                                            <Link to={`${scroogeClient}/keno`}>Keno</Link>
                                          </li>                                          
                                          <li>
                                            <Link to={`${scroogeClient}/megaways`}>Megaways</Link>
                                          </li>
                                          <li>
                                            <Link to={`${scroogeClient}/penny-machine`}>
                                              Penny Machine
                                            </Link>
                                          </li>
                                          <li>
                                            <Link to={`${scroogeClient}/scratcher-games`} >
                                              Scratcher
                                            </Link>
                                          </li>
                                          <li>
                                            <Link to={`${scroogeClient}/video-poker`}>
                                              Video Poker
                                            </Link>
                                          </li>
                                         
                                          {/* <li>
                                            <Link to="/halloween-games">
                                              Halloween Games
                                            </Link>
                                          </li> */}
                                        </ul>
                                      </div>
                                  ) : null} 
                                  </div>
                    <Link
                      to={`/crypto-to-gc`}
                      className={`nav-link ${isActive("/crypto-to-gc")}`}
                    >
                      Purchase Center{" "}
                    </Link>
                    <Link
                      to={`/redeem-prizes`}
                      className={`nav-link ${isActive("/redeem-prizes")}`}
                    >
                      Redemption Center 
                    </Link>
                    <Link
                      to={`/claim-free-tokens`}
                      className={`nav-link ${isActive("/claim-free-tokens")}`}
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
                  </div>
                  <div className="header-btn-mobile user-profile">
                        <a
                          className="dropdown-item"
                          href={`${scroogeClient}/profile`}
                        >
                          <img
                            src={user?.profile ? user?.profile : profile}
                            alt="profile"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = profile;
                            }}
                          />
                        </a>
                        <a
                          className="dropdown-item text-white"
                          href={`${scroogeClient}/setting`}
                        >
                          <SettingSvg /> 
                        </a>
                        {/* <div className="header-btn-mobile logout-btn">
                        <Button onClick={handleLogout}>
                          <HiOutlineLogout />
                        </Button>
                      </div> */}
                      </div>

                      <div className="header-btn-mobile user-profile policy-menu">
                              <div
                                className={`nav-link custom-dd ${isActive(
                                  "/redeem-prizes"
                                )}`}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => {
                                  handleDropDown("responsible");
                                }}
                                role="presentation"
                                // ref={subMenuRef}
                              >
                                <span
                                  className={`${
                                    isDropdownVisible !== "responsible"
                                      ? "drop-arrow"
                                      : ""
                                  }`}
                                >
                                  Responsible Gaming Controls{" "}
                                  {/* <i className="las la-angle-down" /> */}
                                  <ArrowIcon />
                                </span>
                                {isDropdownVisible === "responsible" ? (
                                  <div className="custom-dropdown-menu">
                                    <ul>
                                      <li>
                                        <Link to="/profile?active=spending">
                                          {" "}
                                          Spending Limit
                                        </Link>
                                      </li>
                                      <li>
                                        <Link to="/deactivateAccount">
                                          {" "}
                                          Access Restrictions
                                        </Link>
                                      </li>
                                      <li>
                                        <Link to="/profile?active=transaction">
                                          {" "}
                                          Account History
                                        </Link>
                                      </li>
                                    </ul>
                                  </div>
                                  ): null} 
                              </div>
                            </div>

                            <div className="header-btn-mobile user-profile policy-menu">
                              <div
                                className={`nav-link custom-dd ${isActive(
                                  "/redeem-prizes"
                                )}`}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => {
                                  handleDropDown("terms");
                                }}
                                role="presentation"
                                ref={subMenuRef}
                              >
                                <span
                                  className={`${
                                    isDropdownVisible !== "terms"
                                      ? "drop-arrow"
                                      : ""
                                  }`}
                                >
                                  Terms and Policies{" "}
                                  {/* <i className="las la-angle-down" /> */}
                                  <ArrowIcon />
                                </span>
                                {isDropdownVisible === "terms" ? (
                                  <div className="custom-dropdown-menu">
                                    <ul>
                                      <li>
                                        <Link to="/privacyPolicy">
                                          Privacy policy
                                        </Link>
                                      </li>
                                      <li>
                                        <Link to="/termsncondition">
                                          Terms of Services
                                        </Link>
                                      </li>
                                      <li>
                                        {" "}
                                        <a href={"/"} target="blank">
                                          Responsible Social Gameplay
                                        </a>
                                      </li>
                                      <li>
                                        <Link to="/sweepsrules" target="blank">
                                          Sweeps Rules
                                        </Link>
                                      </li>
                                    </ul>
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            <div className="header-btn-mobile user-profile side-logout">
                              <Button
                                onClick={handleLogout}
                                // disabled={disableRedirections}
                              >
                                Logout <HiOutlineLogout width={100} />
                              </Button>
                            </div>
                  </>
                ) : (
                  <a
                    href={`${scroogeClient}`}
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
        </div>
      </div>
    </Navbar>
  );
};

export default Header;

function SettingSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      width="50px"
      height="50px"
    >
      {" "}
      <path d="M47.16,21.221l-5.91-0.966c-0.346-1.186-0.819-2.326-1.411-3.405l3.45-4.917c0.279-0.397,0.231-0.938-0.112-1.282 l-3.889-3.887c-0.347-0.346-0.893-0.391-1.291-0.104l-4.843,3.481c-1.089-0.602-2.239-1.08-3.432-1.427l-1.031-5.886 C28.607,2.35,28.192,2,27.706,2h-5.5c-0.49,0-0.908,0.355-0.987,0.839l-0.956,5.854c-1.2,0.345-2.352,0.818-3.437,1.412l-4.83-3.45 c-0.399-0.285-0.942-0.239-1.289,0.106L6.82,10.648c-0.343,0.343-0.391,0.883-0.112,1.28l3.399,4.863 c-0.605,1.095-1.087,2.254-1.438,3.46l-5.831,0.971c-0.482,0.08-0.836,0.498-0.836,0.986v5.5c0,0.485,0.348,0.9,0.825,0.985 l5.831,1.034c0.349,1.203,0.831,2.362,1.438,3.46l-3.441,4.813c-0.284,0.397-0.239,0.942,0.106,1.289l3.888,3.891 c0.343,0.343,0.884,0.391,1.281,0.112l4.87-3.411c1.093,0.601,2.248,1.078,3.445,1.424l0.976,5.861C21.3,47.647,21.717,48,22.206,48 h5.5c0.485,0,0.9-0.348,0.984-0.825l1.045-5.89c1.199-0.353,2.348-0.833,3.43-1.435l4.905,3.441 c0.398,0.281,0.938,0.232,1.282-0.111l3.888-3.891c0.346-0.347,0.391-0.894,0.104-1.292l-3.498-4.857 c0.593-1.08,1.064-2.222,1.407-3.408l5.918-1.039c0.479-0.084,0.827-0.5,0.827-0.985v-5.5C47.999,21.718,47.644,21.3,47.16,21.221z M25,32c-3.866,0-7-3.134-7-7c0-3.866,3.134-7,7-7s7,3.134,7,7C32,28.866,28.866,32,25,32z" />
    </svg>
  );
}

function ArrowIcon() {
  return(
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1L5 5L9 1" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
  )
}