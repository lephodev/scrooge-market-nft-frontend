import GetWalletERC1155NFTs from "../scripts/getWalletERC1155NFTs.mjs";
import { useEffect } from "react";
import {
  ConnectWallet,
  useNetworkMismatch,
  useAddress,
} from "@thirdweb-dev/react";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";
import Layout from "./Layout.mjs";

export default function RedeemNFTs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const address = useAddress();
  const isMismatched = useNetworkMismatch();

  return (
    <Layout>
      <div className='container'>
        <main className='main redeem-nfts-page'>
          <h1 className='title'>
            REDEEM YOUR<br></br>
            SCROOGE CASINO NFTS
          </h1>

          <br></br>
          <br></br>
          {isMismatched && address ? (
            <div>
              <SwitchNetworkBSC />
            </div>
          ) : (
            <span></span>
          )}

          {!address ? (
            <div>
              <p className='description yellow'>
                Get started by connecting your wallet.
              </p>

              <div className='connect-wallet-div'>
                <ConnectWallet />
              </div>
            </div>
          ) : (
            <span></span>
          )}

          {!isMismatched && address ? (
            <div>
              <GetWalletERC1155NFTs />
            </div>
          ) : (
            <span></span>
          )}

          <br></br>
          <br></br>
          <ShowBottomNavCards />
        </main>
      </div>
    </Layout>
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
