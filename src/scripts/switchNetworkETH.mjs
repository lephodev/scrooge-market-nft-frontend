import { useNetwork, ChainId } from "@thirdweb-dev/react";

export default function SwitchNetworkETH() {

  const [, switchNetwork] = useNetwork();

  return (
    <div className="switch-network-div">Please switch to the Ethereum network.<br></br><br></br>
            <button className="subheader-btn" onClick={() => switchNetwork(ChainId.Mainnet)}>
                SWITCH NETWORK
            </button>
          </div>
    
  );
}