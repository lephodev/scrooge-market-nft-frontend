import React, { useContext, useEffect, useState } from "react";
import newLogo from "../images/new-logo.webp";
import { Button, Dropdown, Form, Nav, Navbar } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import cookie from "js-cookie";

import {
  // blackjackUrl,
  // pokerUrl,
  // rouletteUrl,
  scroogeClient,
  // slotUrl,
} from "../config/keys.js";
import bell from "../images/bell.svg";
import profile from "../images/profile.png";
import { Link, useLocation } from "react-router-dom";
import hatLogo from "../images/scroogeHatLogo.png";
import AuthContext from "../context/authContext.ts";
import { authInstance } from "../config/axios.js";
const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
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
                  <div className="navItem">
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
