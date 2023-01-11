import { ConnectWallet, useAddress, useNetworkMismatch } from "@thirdweb-dev/react";
import { Link } from "react-router-dom";
import ScroogeCasino from '../images/scroogeCasinoLogo.png';
import ShowCasinoTokenNFTs from "../scripts/showCasinoTokenNFTs.mjs";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";

export default function Home() {
  const address = useAddress();
  const isMismatched = useNetworkMismatch();

  return (
    <div className="container">
      <main className="main">
        <img className="collection-header-img" src={ScroogeCasino} alt="Everything you need for Scrooge Casino" />
        <h1 className="title">
          NFT MARKETPLACE
        </h1>
        <br></br>
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
        
        
        <br></br>
        <div><ShowCasinoTokenNFTs /></div>
        <br></br><br></br>
        <ShowBottomNavCards />
      </main>
    </div>
  );
}
