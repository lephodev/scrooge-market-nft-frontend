import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import {useEffect,useState} from 'react';
import "../styles/Home.css";
//import { Link } from "react-router-dom";
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import ShowAllTokenNFTs from "../scripts/showAllTokenNFTs.mjs";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import { useNetworkMismatch } from "@thirdweb-dev/react";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";
import Layout from "./Layout.mjs";

export default function NFTTokens() {
  
  const isMismatched = useNetworkMismatch();
  const address = useAddress();
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
   
      <main className="main nft-page">
      <div className="container">
        <h2>
          CASINO MARKETPLACE
        </h2>
        <p>
         Get everything you need to be a Scrooge Casino high roller.
        </p>
        {(isMismatched) ? (<SwitchNetworkBSC />) : 
          (<span></span>)}
        
        {(!address) ? (<div className="wallet-connect">
          <p>
          Get started by connecting your wallet.
          </p>
        
          <div className="connect-wallet-div">
            <ConnectWallet />
          </div>
        </div>) : 
          (<span></span>)}

        <div className="show-all-token"><ShowAllTokenNFTs /></div>

        <div className="show-nav-card">
        <ShowBottomNavCards />
        </div>
     
       </div>
    </main>
    </Layout>
  );
}
