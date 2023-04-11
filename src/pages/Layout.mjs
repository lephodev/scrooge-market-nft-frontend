import { Link } from "react-router-dom";
import { ThirdwebNftMedia } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import Logo from "../images/scroogeHatLogo.png";
import DLBigD from "../images/DLBigD.png";
import WalletIcon from "../images/wallet.png";
import StoreIconBadge from "../images/storeIconBadge.png";
import ClaimIconBadge from "../images/claimIconBadge.png";
import PrizesIconBadge from "../images/prizesIconBadge.png";
import WalletIconBadge from "../images/walletIconBadge.png";
import TophatIconBadge from "../images/tophatIconBadge.png";
import tokenmobile from "../images/tokenmobile.png";
import logo from "../images/footer/logo.png";
import envelope from "../images/footer/envelope.svg";
import twitter from "../images/footer/twitter.svg";
import discord from "../images/footer/discord.svg";
import telegram from "../images/footer/telegram.svg";
import facebook from "../images/footer/facebook.svg";
import reddit from "../images/footer/reddit.svg";

import { ConnectWallet } from "@thirdweb-dev/react";
import CookieConsent from "react-cookie-consent";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { blackjackUrl, pokerUrl, scroogeClient } from "../config/keys.js";

export const Tooltip = (id, metadata, message) => (
  <Popup
    trigger={<ThirdwebNftMedia key={id} metadata={metadata} height={200} />}
    position='bottom center'
    on={["hover", "focus"]}
    closeOnDocumentClick>
    <span> {message} </span>
  </Popup>
);

const Layout = ({ children }) => {
  const [currentPriceOG, setCurrentPriceOG] = useState("");
  const [priceColor, setPriceColor] = useState("");
  const OGPrice = async () => {
    await fetch(
      `https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${process.env.REACT_APP_OGCONTRACT_ADDRESS}`
    )
      .then((response) => response.json())
      .then((data) => {
        //console.log('gecko data: ', data.market_data.price_change_percentage_24h);
        const change_pct = data.market_data.price_change_percentage_24h;
        if (change_pct > 0) {
          setPriceColor("green");
        } else if (change_pct < 0) {
          setPriceColor("red");
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
    <div className='wrapper'>
      <div className='header'>
        <div className='container'>
          <nav className='header-nav'>
            <div className='header-nav-logo'>
              <Link to='/'>
                <img src={Logo} alt='logo' className='menu-logo-img' />
              </Link>
            </div>

            <div className='header-menu'>
              <ul>
                <li>
                  <Link to='/nft-tokens'>Casino NFT Shop</Link>
                </li>
                <li>
                  <Link to='/claim-free-tokens'>Claim Monthly Tokens</Link>
                </li>
                <li>
                  <Link to='/crypto-to-tokens'>Crypto To Token</Link>
                </li>
                <li>
                  <Link to='/redeem-prizes'>Redeem Prizes</Link>
                </li>
                <li>
                  <Link to='/earn-tokens'>Earn Free Tokens</Link>
                </li>
              </ul>
            </div>

            <div className='header-action'>
              <div className='icon-links'>
                <Link to='/ducky-lucks-claim-tokens'>
                  <img
                    src={DLBigD}
                    alt='Ducky Lucks VIPs'
                    className='wallet-icon'
                  />
                </Link>
                <Link to='/my-wallet'>
                  <img
                    className='wallet-icon'
                    src={WalletIcon}
                    alt='my wallet'
                  />
                </Link>
                <Link to={scroogeClient}>
                  <HomeSVG />
                </Link>
              </div>
              {console.log("currentPriceOG", currentPriceOG)}
              <div className='wallet'>
                <ConnectWallet />
                <div className={priceColor}>${currentPriceOG}</div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <div className='content'>{children}</div>

      <div className='footer'>
        <div className='container'>
          <div className='footer-grid'>
            <div className='footer-info'>
              <Link to='/'>
                <img src={logo} alt='scrooge casino nft token packages' />
              </Link>
              <h6>
                Want to stay ahead of your competition. Subscribe and be the
                first to know everything happening in the world of SCROOGE.
              </h6>
              <p>
                <span>Copyright &copy; Scrooge LLC.</span> All Rights Reserved
              </p>
            </div>

            <div className='footer-menu'>
              <h3>Destinations</h3>
              <ul>
                <li>
                  <Link to='/nft-tokens'>NFT Marketplace</Link>
                </li>
                <li>
                  <a href={scroogeClient} target='_blank' rel='noreferrer'>
                    Scrooge Casino Home
                  </a>
                </li>
                <li>
                  <a href={pokerUrl} target='_blank' rel='noreferrer'>
                    Scrooge Poker
                  </a>
                </li>
                <li>
                  <a href={blackjackUrl} target='_blank' rel='noreferrer'>
                    Scrooge Blackjack
                  </a>
                </li>
                <li>Scrooge Roulette</li>
              </ul>
            </div>

            <div className='footer-menu'>
              <h3>Policy</h3>
              <ul>
                <li>
                  <Link to='/privacy'>Privacy Policy</Link>
                </li>
                <li>
                  <Link to='/terms'>Terms and Conditions</Link>
                </li>

                <li>
                  <Link to='/contact'>Contact Us</Link>
                </li>
              </ul>
            </div>

            <div className='footer-contact'>
              <h3>Follow us</h3>
              <ul className='footer-social'>
                <li>
                  <a
                    href='https://www.facebook.com/scroogegold/'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <img src={facebook} alt='' />
                  </a>
                </li>
                <li>
                  <a
                    href='https://twitter.com/scrooge_coin'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <img src={twitter} alt='' />
                  </a>
                </li>
                <li>
                  <a
                    href='http://t.me/scroogecoingold'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <img src={telegram} alt='' />
                  </a>
                </li>
                <li>
                  <a
                    href='https://discord.gg/scroogecoin'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <img src={discord} alt='' />
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.reddit.com/r/scroogecoin/'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <img src={reddit} alt='' />
                  </a>
                </li>
              </ul>
              <h3>Contact Us</h3>
              <ul className='footer-support'>
                <li>
                  <a
                    href='mailto:support@scroogegold.com'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <img src={envelope} alt='' />
                    support@scroogegold.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <CookieConsent
        location='bottom'
        buttonText='ACCEPT'
        cookieName='nftMarketCookieConsent'
        expires={150}>
        <h4>Cookies Policy</h4>
        <p>
          This website uses delicious cookies to enhance the user experience.
          Only for good stuff. We promise.
        </p>
      </CookieConsent>

      <div className='mobile-menu'>
        <nav className='header-nav-container-mobile'>
          <div className='header-nav-menu-mobile'>
            <ul>
              <li>
                <Link to='/'>
                  <img src={TophatIconBadge} alt='logo' />
                </Link>
              </li>
              <li>
                <Link to='/nft-tokens'>
                  <img src={StoreIconBadge} alt='shop casino NFTs' />
                </Link>
              </li>
              <li>
                <Link to='/crypto-to-tokens'>
                  <img
                    src={WalletIconBadge}
                    alt='claim monthly casino free tokens'
                  />
                </Link>
              </li>
              <li>
                <Link to='/claim-free-tokens'>
                  <img
                    src={ClaimIconBadge}
                    alt='claim monthly casino free tokens'
                  />
                </Link>
              </li>
              <li>
                <Link to='/redeem-prizes'>
                  <img
                    src={PrizesIconBadge}
                    alt='redeem casino tickets for prizes'
                  />
                </Link>
              </li>
              <li>
                <Link to='/earn-tokens'>
                  <img src={tokenmobile} alt='my wallet' />
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;

const HomeSVG = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 72 72'
      width='128px'
      height='128px'>
      <path d='M 36 10 C 34.861 10 33.722922 10.386609 32.794922 11.162109 L 11.517578 28.941406 C 10.052578 30.165406 9.5519375 32.270219 10.460938 33.949219 C 11.711938 36.258219 14.661453 36.740437 16.564453 35.148438 L 35.359375 19.445312 C 35.730375 19.135313 36.269625 19.135313 36.640625 19.445312 L 55.435547 35.148438 C 56.183547 35.774437 57.093047 36.078125 57.998047 36.078125 C 59.171047 36.078125 60.333953 35.567219 61.126953 34.574219 C 62.503953 32.850219 62.112922 30.303672 60.419922 28.888672 L 58 26.867188 L 58 16.667969 C 58 15.194969 56.805984 14 55.333984 14 L 52.667969 14 C 51.194969 14 50 15.194969 50 16.667969 L 50 20.181641 L 39.205078 11.162109 C 38.277078 10.386609 37.139 10 36 10 z M 35.996094 22.925781 L 13.996094 41.302734 L 13.996094 50 C 13.996094 54.418 17.578094 58 21.996094 58 L 49.996094 58 C 54.414094 58 57.996094 54.418 57.996094 50 L 57.996094 41.302734 L 35.996094 22.925781 z M 32 38 L 40 38 C 41.105 38 42 38.895 42 40 L 42 50 L 30 50 L 30 40 C 30 38.895 30.895 38 32 38 z' />
    </svg>
  );
};
