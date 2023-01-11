import { useContract, ThirdwebNftMedia, useActiveListings, ConnectWallet } from "@thirdweb-dev/react";
import {useState} from "react";
import ScroogeCasino from '../images/scroogeCasinoLogo.png';

export default function MarketplaceShowActiveListings() {
    const { contract } = useContract("0x91197754fCC899B543FebB5BE4dae193C75EF9d1", "marketplace")
    // data is the active listings, isLoading is a loading flag while we load the listings.
    const { data: listings, isLoading: loadingListings } =
      useActiveListings(contract);

    /*this.state = {
        tokenIDtoBuy: null,
        qty: 0
    };*/

    async function handleBuyAsset(_id, _qty) {
        try {
            await contract.buyoutListing(_id, _qty);
            alert("Asset purchased successfully");
      
            //window.location.reload();
          } catch (err) {
            console.error(err);
            alert("Error purchasing asset");
          };
    }
        
  return (
    <div>
        
        <div className="pageTitle">
        </div>
      {loadingListings ? (
        <p>Loading currently-listed items...</p>
      ) : (
        <div className="flex-row">
          {listings.map((listing) => (
            <div className="erc1155Card">
                <div className="erc1155Card-image">
                    <ThirdwebNftMedia
                        key={listing.id}
                        metadata={listing.asset}
                        height={200}
                    />
                </div>
                <div className="erc1155Card-details">
                    {listing.asset.name.toString()}<br></br>
                    <span className="erc1155-price">${(listing.buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br>
                    <button className="erc1155-buy-btn" onClick={() => handleBuyAsset(listing.id,1)} id={listing.asset.name.toString()}>
                        BUY NFT!
                    </button>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}