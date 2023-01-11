import { ConnectWallet, useNetworkMismatch, useAddress } from "@thirdweb-dev/react";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";

export default function Login() {
  const address = useAddress();
  const isMismatched = useNetworkMismatch();

  return (
    <div className="container">
      <main className="main">
      <h1 className="title">
          LOGIN TO YOUR ACCOUNT
        </h1>
        <br></br><br></br>
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
        <ShowBottomNavCards />
      </main>
    </div>
  );
}
