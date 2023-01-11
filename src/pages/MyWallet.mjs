import GetWalletCasinoNFTs from "../scripts/getWalletCasinoNFTs.mjs";
import { ConnectWallet, useNetworkMismatch, useAddress } from "@thirdweb-dev/react";
import ChainContext from "../context/Chain";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";

export default function MyWallet() {

  const address = useAddress();
  const isMismatched = useNetworkMismatch();
  

  return (
    <div className="container">
      <main className="main">
        <h1 className="title">
          MY SCROOGE CASINO WALLET
        </h1>
        
        <br></br><br></br>
        {(isMismatched && address) ? (<div><SwitchNetworkBSC /></div>) : 
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
        
        {(!isMismatched && address) ? (<div><GetWalletCasinoNFTs /></div>) : 
          (<span></span>)}
        
          <br></br><br></br>
        <ShowBottomNavCards />
        
      </main>
    </div>
  );
}

/* Buttons that can be added into code

<div className="flex-row">
            <button className="subheader-btn" onClick={(e) => setSelectedChain(ChainId.BinanceSmartChainMainnet)}>
                SCROOGE CASINO
            </button>
            <button className="subheader-btn" onClick={(e) => setSelectedChain(ChainId.Mainnet)}>
                DUCKY LUCKS
            </button>
        </div>
*/