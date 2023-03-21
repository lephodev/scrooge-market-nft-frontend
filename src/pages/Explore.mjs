import { useContext, useEffect } from "react";
//import GetWalletNFTs from "../scripts/getWalletNFTs.mjs";
//import GetWalletERC1155NFTs from "./scripts/getWalletERC1155NFTs.mjs";
import MarketplaceShowActiveListings from "../scripts/marketplaceShowActiveListings.mjs";
import "../styles/Home.css";
//import GetWalletERC1155NFTs from "../scripts/getWalletERC1155NFTs.mjs";
//import ShowCasinoTokenNFTs from "../scripts/showCasinoTokenNFTs.mjs";
import {
  useAddress,
  useOwnedNFTs,
  useContract,
  useContractRead,
  ThirdwebNftMedia,
  useNetwork,
  ChainId,
} from "@thirdweb-dev/react";
import ChainContext from "../context/Chain.ts";
import ShowCollection from "../scripts/ShowCollection.mjs";
import Layout from "./Layout.mjs";

export default function Explore() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { selectedChain, setSelectedChain } = useContext(ChainContext);

  return (
    <Layout>
      <main className='main explore-page'>
        <div className='container'>
          <h1 className='title'>EXPLORE THE MARKETPLACE</h1>
          <div className='flex-row'>
            <button
              className='subheader-btn'
              onClick={(e) =>
                setSelectedChain(ChainId.BinanceSmartChainMainnet)
              }
            >
              SCROOGE CASINO
            </button>
            <button
              className='subheader-btn'
              onClick={(e) => setSelectedChain(ChainId.Mainnet)}
            >
              DUCKY LUCKS
            </button>
          </div>
          <br></br>
          {selectedChain === ChainId.Mainnet ? (
            <div>
              <ShowCollection />
            </div>
          ) : (
            <div>
              <MarketplaceShowActiveListings />
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
