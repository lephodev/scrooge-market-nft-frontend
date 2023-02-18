import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import {useEffect,useState} from 'react';
import "../styles/Home.css";
//import { Link } from "react-router-dom";
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import ShowAllTokenNFTs from "../scripts/showAllTokenNFTs.mjs";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import { useNetworkMismatch } from "@thirdweb-dev/react";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";
import AllCurrentRaffles from "../components/AllCurrentRaffles.mjs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Raffles() {
  
  const isMismatched = useNetworkMismatch();
  const address = useAddress();
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container">
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
      <main className="main">
        
        <h1 className="title">
          SCROOGE RAFFLES
        </h1>
        
        <AllCurrentRaffles />
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
        <div style={{height: '100px'}}></div>
        <ShowBottomNavCards />
      </main>
    </div>
  );
}
