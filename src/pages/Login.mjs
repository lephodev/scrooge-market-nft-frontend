import { ConnectWallet, useNetworkMismatch, useAddress } from "@thirdweb-dev/react";
import {useEffect} from 'react';
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";
import ScroogeCasino from '../images/scroogeCasinoLogo.png';

export default function Login() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);
  const address = useAddress();
  const isMismatched = useNetworkMismatch();

  return (
    <div className="container">
      <main className="main">
      
        <div className="login-page-body">
          <div>
            <img className="login-page-img" src={ScroogeCasino} alt="Everything you need for Scrooge Casino" />
          </div>
          <div className="login-page-desc">
            You must be logged into your Scrooge Casino player account in order to access several areas of this marketplace. 
            Please <a href="https://scrooge.casino/login" target="_blank" rel="noreferrer" alt="Login to Scrooge Casino">LOG IN</a> and then return to the marketplace.
          </div>
          <a href="https://scrooge.casino/login" target="_blank" rel="noreferrer" alt="Login to Scrooge Casino"><button className="submit-btn">LOGIN TO YOUR SCROOGE CASINO ACCOUNT</button></a>
        </div>
        


      </main>
    </div>
  );
}
