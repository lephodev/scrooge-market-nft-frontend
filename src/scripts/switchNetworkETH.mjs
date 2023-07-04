import { useSwitchChain, ChainId } from "@thirdweb-dev/react";

export default function SwitchNetworkETH() {

  const switchChain = useSwitchChain();

  return (
    <div className="switch-network-div">Please switch to the Ethereum network.<br></br><br></br>
            <button className="subheader-btn" onClick={() => switchChain(ChainId.Mainnet)}>
                SWITCH NETWORK
            </button>
          </div>
    
  );
}