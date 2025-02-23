import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useEffect } from "react";
import "../styles/Home.css";
//import { Link } from "react-router-dom";
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
      <div className='main nft-page'>
        <div className='container'>
          <div className='scrooge-main-heading'>
            <h2>CASINO MARKETPLACE</h2>
            <p>Get everything you need to be a Scrooge Casino high roller.</p>
          </div>

          {isMismatched ? <SwitchNetworkBSC /> : ""}

          {!address ? (
            <div className='wallet-connect'>
              <p>Get started by connecting your wallet.</p>
              <div className='connect-wallet-div'>
                <ConnectWallet modalTitle='Wallet supports only MetaMask, Trust Wallet, and SafePal.' />
              </div>
            </div>
          ) : (
            ""
          )}

          <div className='show-all-token'>
            <ShowAllTokenNFTs />
          </div>

          <div className='show-nav-card'>
            <ShowBottomNavCards />
          </div>
        </div>
      </div>
    </Layout>
  );
}
