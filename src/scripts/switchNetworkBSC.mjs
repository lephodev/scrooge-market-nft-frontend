import { useSwitchChain, ChainId } from "@thirdweb-dev/react";

export default function SwitchNetworkBSC() {
  const switchChain = useSwitchChain();

  return (
    <div className='switch-network-div'>
      Please switch to the Binance Smart Chain network.<br></br>
      <br></br>
      <button
        className='subheader-btn'
        onClick={() => switchChain(ChainId.BinanceSmartChainMainnet)}
      >
        SWITCH NETWORK
      </button>
    </div>
  );
}
