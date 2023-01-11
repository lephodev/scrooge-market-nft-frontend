import { useContext, useState } from "react";
import GetWalletNFTs from "../scripts/getWalletNFTs.mjs";
//import GetWalletERC1155NFTs from "./scripts/getWalletERC1155NFTs.mjs";
import MarketplaceShowActiveListings from "../scripts/marketplaceShowActiveListings.mjs";
import "../styles/Home.css";
import GetWalletERC1155NFTs from "../scripts/getWalletERC1155NFTs.mjs";
import ShowCasinoTokenNFTs from "../scripts/showCasinoTokenNFTs.mjs";
import { useAddress, useOwnedNFTs, useContract, useContractRead, ThirdwebNftMedia, useNetwork, ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import ChainContext from "../context/Chain";

export default function CreateListing() {
  const NATIVE_TOKEN_ADDRESS = '0xe9e7cea3dedca5984780bafc599bd69add087d56';
  const { selectedChain, setSelectedChain } = useContext(ChainContext);
  const address = useAddress();
  const { contract } = useContract("0xD831267dDF05156Da33e35EaD05DDBf9ffE1F93E");
  //const { contract } = useContract("0xEe7c31b42e8bC3F2e04B5e1bfde84462fe1aA768");
  const { data: nfts, isLoading } = useOwnedNFTs(contract, address);
  const [buyoutPricePerToken, setBuyoutPricePerToken] = useState("");
  const [reservePricePerToken, setReservePricePerToken] = useState("");
  const [listingDurationInSeconds, setListingDurationInSeconds] = useState("");
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    alert(`Buy Now: ${buyoutPricePerToken} and Reserve: ${reservePricePerToken} and Duration: ${listingDurationInSeconds}`);
    // Data of the auction you want to create
    const auction = {
      // address of the contract the asset you want to list is on
      assetContractAddress: "0x...",
      // token ID of the asset you want to list
      tokenId: "0",
    // when should the listing open up for offers
      startTimestamp: new Date(),
      // how long the listing will be open for
      listingDurationInSeconds: listingDurationInSeconds,
      // how many of the asset you want to list
      quantity: 1,
      // address of the currency contract that will be used to pay for the listing
      currencyContractAddress: NATIVE_TOKEN_ADDRESS,
      // how much people would have to bid to instantly buy the asset
      buyoutPricePerToken: buyoutPricePerToken,
      // the minimum bid that will be accepted for the token
      reservePricePerToken: reservePricePerToken,
    }
    const tx = await contract.auction.createListing(auction);
    const receipt = tx.receipt; // the transaction receipt
    const listingId = tx.id; // the id of the newly created listing
  }

  return (
    
    <div className="container">
      <main className="main">
        <div>
          Ready to list one of your NFTs? Select one of your owned NFTs from below:   
        </div>
        
        <div className="flex-row">
            <button className="subheader-btn" onClick={(e) => setSelectedChain(ChainId.BinanceSmartChainMainnet)}>
                SCROOGE CASINO
            </button>
            <button className="subheader-btn" onClick={(e) => setSelectedChain(ChainId.Mainnet)}>
                DUCKY LUCKS
            </button>
        </div>
        <br></br><br></br>
        
        {nfts.map((nft) => (
          <div>
            {nft.metadata.name}
          </div>
        ))}
        <form className="create-listing-form" onSubmit={handleSubmit}>
          <label>Buy Now Price:
            <input 
              type="text" 
              value={buyoutPricePerToken}
              onChange={(e) => setBuyoutPricePerToken(e.target.value)}
            />
          </label>
          <label>Reserve Price:
            <input 
              type="text" 
              value={reservePricePerToken}
              onChange={(e) => setReservePricePerToken(e.target.value)}
            />
          </label>
          <label>Duration of Auction:
            <select value={listingDurationInSeconds} onChange={(e) => setListingDurationInSeconds(e.target.value)}>
              <option value="86400">1 Day</option>
              <option value="259200">3 Days</option>
              <option value="604800">7 Days</option>
              <option value="1296000">15 Days</option>
              <option value="2592000">30 Days</option>
            </select>
          </label>


          <input className="submit-btn" type="submit" value="CREATE LISTING" />
        </form>


        <br></br><br></br>
        {(selectedChain === ChainId.Mainnet) ? (<div><GetWalletNFTs /></div>) : (<div><GetWalletERC1155NFTs /></div>)}
        
             
      </main>
    </div>
  );
}
