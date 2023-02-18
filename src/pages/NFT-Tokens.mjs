import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import {useEffect,useState} from 'react';
import "../styles/Home.css";
//import { Link } from "react-router-dom";
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import ShowAllTokenNFTs from "../scripts/showAllTokenNFTs.mjs";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import { useNetworkMismatch } from "@thirdweb-dev/react";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";

export default function NFTTokens() {
  
  const isMismatched = useNetworkMismatch();
  const address = useAddress();
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container">
      <main className="main">
        
        <h1 className="title">
          CASINO MARKETPLACE
        </h1>
        <p className="description yellow">
         Get everything you need to be a Scrooge Casino high roller.
        </p>
        {(isMismatched) ? (<SwitchNetworkBSC />) : 
          (<span></span>)}
        
        {(!address) ? (<div>
          <p className="description yellow">
          Get started by connecting your wallet.
          </p>
        
          <div className="connect-wallet-div">
            <ConnectWallet />
          </div>
        </div>) : 
          (<span></span>)}
        <br></br><br></br>
        <div className="full-page-container"><ShowAllTokenNFTs /></div>
        <br></br><br></br>
        <ShowBottomNavCards />
      </main>
    </div>
  );
}
