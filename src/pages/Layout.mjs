import { Outlet, Link } from "react-router-dom";
import Logo from '../images/scroogeHatLogo.png';
import WalletIcon from '../images/walletIcon.png';
import { ConnectWallet } from "@thirdweb-dev/react";

const Layout = () => {
  return (
    <>
      <nav className="header-nav-container">
        <Link to="/"><img src={Logo} alt="logo" className="menu-logo-img"/></Link>
        <div className="header-nav-menu">
          <ul>
            
            <li>
              <Link to="/nft-tokens">Casino NFT Shop</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <Link to="/my-wallet"><img className="wallet-icon-img" src={WalletIcon} alt="my wallet" /></Link>
        <div className="connect-wallet-header">
          <ConnectWallet />
        </div>
      </nav>

      <Outlet />
      <div className="footer-div">Copyright &copy; Scrooge LLC. All rights reserved.</div>
    </>
  )
};

export default Layout;