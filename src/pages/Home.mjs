import { ConnectWallet, useAddress, useNetworkMismatch, ChainId } from "@thirdweb-dev/react";
import {useEffect} from 'react';
import ScroogeCasino from '../images/scroogeCasinoLogo.png';
import TicketsGIF from '../images/ticketsGif.gif';
import SlotsGIF from '../images/slotsGif.gif';
import ShowCasinoTokenNFTs from "../scripts/showCasinoTokenNFTs.mjs";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";
import { Link } from "react-router-dom";
import WalletIcon from '../images/walletIcon.png';
import CardsTokens from '../images/cardstokens.gif';
import CasinoNFT from '../images/absintheGold.png';
import MoneyBag from '../images/moneybag.gif';
import "../styles/Home.css";
import ChainContext from "../context/Chain";
import { useContext } from "react";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
    if (selectedChain===ChainId.Mainnet) {
      setSelectedChain(ChainId.BinanceSmartChainMainnet);
    }
  }, []);
  const address = useAddress();
  const isMismatched = useNetworkMismatch();
  const { selectedChain, setSelectedChain } = useContext(ChainContext);

  return (
    <div className="container">
      <main className="main">
        <img className="collection-header-img" src={ScroogeCasino} alt="Everything you need for Scrooge Casino" />
        <div className="title">
          NFT MARKETPLACE
        </div>
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
        
        <div className="grid">
          <Link to="/nft-tokens" className="card">
            <h2>SHOP FOR ALL YOUR CASINO NFTS &rarr;</h2>
            <p>
              Ready to step up to the table? Get everything you need to be a Scrooge Casino high roller.
            </p>
            <img className="card-img pulse" src={CasinoNFT} alt="buy scrooge casino nft token packages" />
          </Link>

          
          <Link to="/claim-free-tokens" className="card">
            <h2>CLAIM MONTHLY HOLDER TOKENS &rarr;</h2>
            <p>
              Are you a SCROOGE crypto holder? Come claim your FREE MONTHLY CASINO TOKENS!
            </p>
            <img className="card-img" src={CardsTokens} alt="claim your Scrooge monthly holder casino tokens" />
          </Link>
         

          <Link to="/redeem-prizes" className="card">
            <h2>REDEEM TICKETS FOR PRIZES &rarr;</h2>
            <p>
              Time to cash in your winnings? Browse our huge selection of available prizes.
            </p>
            <img className="card-img" src={TicketsGIF} alt="redeem your casino tickets for prizes" />
          </Link>

          <Link to="/earn-tokens" className="card">
            <h2>EARN CASINO TOKENS FOR FREE &rarr;</h2>
            <p>
              Time to cash in your winnings? Browse our huge selection of available prizes.
            </p>
            <img className="card-img" src={MoneyBag} alt="earn free Scrooge Casino tokens" />
          </Link>

          <Link to="/ducky-lucks-claim-tokens" className="card">
            <h2>COOL MOTHERDUCKERS THIS WAY &rarr;</h2>
            <p>
              Did you know that you get FREE CASINO TOKENS monthly just for holding a Ducky Lucks NFT?
            </p>
            <img className="card-img" src="https://casino-nft-marketplace.s3.amazonaws.com/DLGif1.gif" alt="duckylucks nfts" />
          </Link>

          <a href="https://scrooge.casino" className="card" target="_blank" rel="noreferrer">
            <h2>HEAD OVER TO SCROOGE CASINO &rarr;</h2>
            <p>
              Time to cash in your winnings? Browse our huge selection of available prizes.
            </p>
            <img className="card-img" src={SlotsGIF} alt="visit Scrooge Casino" />
          </a>

          
        </div>
        
        <br></br>
        <div><ShowCasinoTokenNFTs /></div>
        <br></br><br></br>
        <ShowBottomNavCards />
      </main>
    </div>
  );
}
