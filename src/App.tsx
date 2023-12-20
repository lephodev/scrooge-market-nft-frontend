import { ConnectWallet } from "@thirdweb-dev/react";
import ShowCollection from "./scripts/ShowCollection.mjs";
import GetWalletNFTs from "./scripts/getWalletNFTs.mjs";
import GetWalletERC1155NFTs from "./scripts/getWalletERC1155NFTs.mjs";
import MarketplaceShowActiveListings from "./scripts/marketplaceShowActiveListings.mjs";
import "./styles/Home.css";
import ShowCasinoTokenNFTs from "./scripts/showCasinoTokenNFTs.mjs";

export default function Home() {
  return (
    <div className='container'>
      <main className='main'>
        <h1 className='title'>
          Welcome to<br></br>Scrooge NFT Marketplace!
        </h1>

        <p className='description red'>
          Get started by connecting your wallet.
        </p>

        <div className='connect-wallet-div'>
          <ConnectWallet modalTitle='Wallet supports only MetaMask, Trust Wallet, and SafePal.' />
        </div>
        <div>
          <GetWalletERC1155NFTs />
        </div>
        <br></br>
        <br></br>
        <div>
          <ShowCasinoTokenNFTs />
        </div>
        <br></br>
        <br></br>
        <div className='grid'>
          <a href='https://portal.thirdweb.com/' className='card'>
            <h2>Portal &rarr;</h2>
            <p>
              Guides, references and resources that will help you build with
              thirdweb.
            </p>
          </a>

          <a href='https://thirdweb.com/dashboard' className='card'>
            <h2>Dashboard &rarr;</h2>
            <p>
              Deploy, configure and manage your smart contracts from the
              dashboard.
            </p>
          </a>

          <a href='https://portal.thirdweb.com/templates' className='card'>
            <h2>Templates &rarr;</h2>
            <p>
              Discover and clone template projects showcasing thirdweb features.
            </p>
          </a>
        </div>
      </main>
    </div>
  );
}
