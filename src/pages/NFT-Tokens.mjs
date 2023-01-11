import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import ShowCollection  from "../scripts/ShowCollection.mjs";
import GetWalletNFTs from "../scripts/getWalletNFTs.mjs";
//import GetWalletERC1155NFTs from "./scripts/getWalletERC1155NFTs.mjs";
import MarketplaceShowActiveListings from "../scripts/marketplaceShowActiveListings.mjs";
import "../styles/Home.css";
import GetWalletERC1155NFTs from "../scripts/getWalletERC1155NFTs.mjs";
import ShowCasinoTokenNFTs from "../scripts/showCasinoTokenNFTs.mjs";
import { Link } from "react-router-dom";
import ShowAllTokenNFTs from "../scripts/showAllTokenNFTs.mjs";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import { useNetworkMismatch } from "@thirdweb-dev/react";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";

export default function NFTTokens() {
  const isMismatched = useNetworkMismatch();
  const address = useAddress();

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
