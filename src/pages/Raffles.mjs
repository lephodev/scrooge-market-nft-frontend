import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useEffect } from "react";
import "../styles/Home.css";
//import { Link } from "react-router-dom";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import { useNetworkMismatch } from "@thirdweb-dev/react";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";
import AllCurrentRaffles from "../components/AllCurrentRaffles.mjs";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./Layout.mjs";

export default function Raffles() {
  const isMismatched = useNetworkMismatch();
  const address = useAddress();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className='container'>
        <main className='main raffles-page'>
          <h1 className='title'>SCROOGE RAFFLES</h1>

          <AllCurrentRaffles />
          {isMismatched ? <SwitchNetworkBSC /> : <span></span>}

          {!address ? (
            <div>
              <p className='description yellow'>
                Get started by connecting your wallet.
              </p>

              <div className='connect-wallet-div'>
                <ConnectWallet modalTitle='Wallet supports only MetaMask, Trust Wallet, and SafePal.' />
              </div>
            </div>
          ) : (
            <span></span>
          )}
          <div style={{ height: "100px" }}></div>
          <ShowBottomNavCards />
        </main>
      </div>
    </Layout>
  );
}
