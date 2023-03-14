import { Outlet, Link } from "react-router-dom";
import { ThirdwebNftMedia } from "@thirdweb-dev/react";
import {useEffect, useState} from 'react';
import Logo from '../images/scroogeHatLogo.png';
import DLBigD from '../images/DLBigD.png';
import Token from '../images/token.png';
import Casino from '../images/casino200.png';
import WalletIcon from '../images/walletIcon.png';
import StoreIconBadge from '../images/storeIconBadge.png';
import ClaimIconBadge from '../images/claimIconBadge.png';
import PrizesIconBadge from '../images/prizesIconBadge.png';
import WalletIconBadge from '../images/walletIconBadge.png';
import TophatIconBadge from '../images/tophatIconBadge.png';
import { ConnectWallet } from "@thirdweb-dev/react";
import CookieConsent from "react-cookie-consent";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export const Tooltip = (id, metadata, message) => (
  <Popup
    trigger={
      <ThirdwebNftMedia
                  key={id}
                  metadata={metadata}
                  height={200}
                />
    }
    position="bottom center"
    on={['hover', 'focus']}
    closeOnDocumentClick
  >
    <span> {message} </span>
  </Popup>
);

const Layout = ({ children }) => {
  const [currentPriceOG, setCurrentPriceOG]=useState("");
  const [priceColor, setPriceColor]=useState("");
  const OGPrice = async () => {await fetch(`https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${process.env.REACT_APP_OGCONTRACT_ADDRESS}`)
    .then(response => response.json())
    .then((data) => {
        //console.log('gecko data: ', data.market_data.price_change_percentage_24h);
        const change_pct = data.market_data.price_change_percentage_24h;
        if(change_pct>0){
          setPriceColor('green');
        } else if (change_pct<0) {
          setPriceColor('red');
        }
        const current_price = data.market_data.current_price.usd;
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
  }, []);
  return (
    <>
      <nav className="header-nav-container">
        <div className="header-nav-logo-div">
          <div><Link to="/"><img src={Logo} alt="logo" className="menu-logo-img"/></Link></div>
          <div className={priceColor}>${currentPriceOG}</div>
        </div>
        
        <div className="header-nav-menu">
          <ul>
            
            <li>
              <Link to="/nft-tokens">Casino NFT Shop</Link>
            </li>
            <li>
              <Link to="/claim-free-tokens">Claim Monthly Tokens</Link>
            </li>
            <li>
              <Link to="/redeem-prizes">Redeem Prizes</Link>
            </li>
            <li>
              <Link to="/earn-tokens"><img className="token-nav pulse" src={Token} alt="Scrooge Casino balances" />EARN FREE TOKENS</Link>
            </li>
          </ul>
        </div>
        <div><Link to="/ducky-lucks-claim-tokens"><img src={DLBigD} alt="Ducky Lucks VIPs" className="wallet-icon-img"/></Link></div>
        <div><Link to="/my-wallet"><img className="wallet-icon-img" src={WalletIcon} alt="my wallet" /></Link></div>
        <div>
          <ConnectWallet />
        </div>
      </nav>
      {children}
      

      <Outlet />
      <nav className="header-nav-container-mobile">
        
        <div className="header-nav-menu-mobile">
          <ul>
            <li>
            <Link to="/"><img src={TophatIconBadge} alt="logo" className="wallet-icon-img-mobile"/></Link>
            </li>
            <li>
              <Link to="/nft-tokens"><img className="wallet-icon-img-mobile" src={StoreIconBadge} alt="shop casino NFTs" /></Link>
            </li>
            <li>
              <Link to="/claim-free-tokens"><img className="wallet-icon-img-mobile" src={ClaimIconBadge} alt="claim monthly casino free tokens" /></Link>
            </li>
            <li>
              <Link to="/redeem-prizes"><img className="wallet-icon-img-mobile" src={PrizesIconBadge} alt="redeem casino tickets for prizes" /></Link>
            </li>
            <li>
              <Link to="/my-wallet"><img className="wallet-icon-img-mobile" src={WalletIconBadge} alt="my wallet" /></Link>
            </li>
          </ul>
        </div>
      </nav>


      <div className="footer-nav">
      <div className="footer-inner-div">
          <strong>MY WALLET</strong>
          <br></br><br></br>
          <Link to="/my-wallet"><img className="wallet-icon-img" src={WalletIcon} alt="my wallet" /></Link>
        </div>
        <div className="footer-inner-div">
          <strong>DESTINATIONS</strong><br></br><br></br>
          <Link to="/nft-tokens">NFT Marketplace</Link><br></br>
          <a href="https://scrooge.casino" target="_blank" rel="noreferrer">Scrooge Casino Home</a><br></br>
          <a href="https://poker.scrooge.casino" target="_blank" rel="noreferrer">Scrooge Poker</a><br></br>
          <a href="https://blackjack.scrooge.casino" target="_blank" rel="noreferrer">Scrooge Blackjack</a><br></br>
          <a href="https://roulette.scrooge.casino" target="_blank" rel="noreferrer">Scrooge Roulette</a><br></br>
        </div>
        <div className="footer-inner-div">
          <strong>SOCIAL</strong><br></br><br></br>
          <a href="https://twitter.com/scrooge_coin" target="_blank" rel="noreferrer">Scrooge Casino on Twitter</a><br></br>
          <a href="https://facebook.com/scroogegold" target="_blank" rel="noreferrer">Scrooge Casino on Facebook</a><br></br>
          <a href="http://t.me/scroogecoingold" target="_blank" rel="noreferrer">Scrooge on Telegram</a><br></br>
          <a href="https://discord.gg/scroogecoin" target="_blank" rel="noreferrer">Scrooge on Discord</a><br></br>
          <a href="https://www.reddit.com/r/scroogecoin/" target="_blank" rel="noreferrer">Scrooge on Reddit</a><br></br>
        </div>
        <div className="footer-inner-div">
          <strong>INFO</strong><br></br><br></br>
          <Link to="/privacy">Privacy Policy</Link><br></br>
          <Link to="/terms">Terms and Conditions</Link><br></br>
          <Link to="/contact">Contact Us</Link><br></br>
        </div>
      </div>
      <div className="footer-div">
        <Link to="/">
            <img className="" src={Casino} alt="scrooge casino nft token packages" />
          </Link>
      </div>
      <div className="footer-div">Copyright &copy; Scrooge LLC. All rights reserved.</div>
      <CookieConsent
        location="bottom"
        buttonText="ACCEPT"
        cookieName="nftMarketCookieConsent"
        style={{ background: "#D2042D", fontFamily: 'Martian Mono', paddingLeft: "10%", paddingRight: "10%", borderTop: "3px solid #e7c975"}}
        buttonStyle={{ color: "#0dff00", backgroundColor: "#000000", fontSize: "13px", borderRadius: "5px", border: "2px solid #e7c975", fontFamily: 'Martian Mono'  }}
        expires={150}
      >
        This website uses delicious cookies to enhance the user experience.{" "}
        <span style={{ fontSize: "11px", fontFamily: 'Martian Mono'  }}>Only for good stuff. We promise.</span>
      </CookieConsent>
    </>
  )
};

export default Layout;