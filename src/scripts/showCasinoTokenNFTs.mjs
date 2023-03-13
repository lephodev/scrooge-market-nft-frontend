import {useState} from 'react';
import { useContract, ThirdwebNftMedia, useActiveListings } from "@thirdweb-dev/react";
import { useNavigate } from "react-router-dom";
import LoadingPoker from '../images/scroogeHatLogo.png';
import 'react-toastify/dist/ReactToastify.css';

export default function ShowCasinoTokenNFTs() {
    const [buyloading]=useState(false);
    // function notify(message) {
    //     toast.success('🎩 '+message);
    //   };
    let navigate = useNavigate(); 
    const routeChange = () =>{ 
      let path = `/nft-tokens`; 
      navigate(path);
    }

    const { contract } = useContract(process.env.REACT_APP_MARKETPLACE_ADDRESS, "marketplace")
    // data is the active listings, isLoading is a loading flag while we load the listings.
    const { data: listings = [], isLoading: loadingListings } =
      useActiveListings(contract);
      console.log("contract", contract, listings, loadingListings)

    

    // async function handleBuyAsset(_id, _qty) {
    //     setBuyloading(true);
    //     try {
    //         await contract.buyoutListing(_id, _qty);
    //         notify("NFT purchased successfully!");
    //         setBuyloading(false);
    //         //window.location.reload();
    //       } catch (err) {
    //         console.error(err);
    //         notify("Error purchasing NFT!");
    //         setBuyloading(false);
    //       };
    // }
        
  return (
    <div>
        {buyloading ? (<div className="pageImgContainer">
                    <img src={LoadingPoker} alt="game" className="imageAnimation" />
                    <div className='loading-txt pulse'>
                        PURCHASING...
                    </div>
                </div>) : (<></>)}
        <div className="nft-home-sell-title">
            <h1>Scrooge Casino NFT Token Packages</h1>
        </div>
        
      {loadingListings ? (
        <div className="loading-img-div">
        <img src={LoadingPoker} alt="game" className="imageAnimation" />
      </div>
      ) :  listings.length === 0 ? "" :(
        <div className="flex-row nft-home-sell-div">
          
          <div className="nft-home-sell-card">
                <div className="erc1155Card-image">
                    <ThirdwebNftMedia
                        key={listings[0].id}
                        metadata={listings[0].asset}
                        height={200}
                    />
                </div>
                <div className="nft-home-sell-details">
                    {listings[0].asset.name.toString()}<br></br>
                    <span className="erc1155-price">${(listings[0].buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br><br></br>
                    
                    SPECIAL: GET {listings[0].asset.attributes[2].value.toString()} FREE TOKENS!<br></br>
                    <button className="erc1155-buy-btn" onClick={routeChange} id={listings[0].asset.name.toString()}>
                        SHOP NOW!
                    </button>
                </div>
            </div>

            <div className="nft-home-sell-card">
                <div className="erc1155Card-image">
                    <ThirdwebNftMedia
                        key={listings[1].id}
                        metadata={listings[1].asset}
                        height={200}
                    />
                </div>
                <div className="nft-home-sell-details">
                    {listings[1].asset.name.toString()}<br></br>
                    <span className="erc1155-price">${(listings[1].buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br><br></br>
                    
                    SPECIAL: GET {listings[1].asset.attributes[2].value.toString()} FREE TOKENS!<br></br>
                    <button className="erc1155-buy-btn" onClick={routeChange} id={listings[1].asset.name.toString()}>
                    SHOP NOW!
                    </button>
                </div>
            </div>

            <div className="nft-home-sell-card">
                <div className="erc1155Card-image">
                    <ThirdwebNftMedia
                        key={listings[2].id}
                        metadata={listings[2].asset}
                        height={200}
                    />
                </div>
                <div className="nft-home-sell-details">
                    {listings[2].asset.name.toString()}<br></br>
                    <span className="erc1155-price">${(listings[2].buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br><br></br>
                    
                    SPECIAL: GET {listings[2].asset.attributes[2].value.toString()} FREE TOKENS!<br></br>
                    <button className="erc1155-buy-btn" onClick={routeChange} id={listings[2].asset.name.toString()}>
                    SHOP NOW!
                    </button>
                </div>
            </div>

            <div className="nft-home-sell-card">
                <div className="erc1155Card-image">
                    <ThirdwebNftMedia
                        key={listings[3].id}
                        metadata={listings[3].asset}
                        height={200}
                    />
                </div>
                <div className="nft-home-sell-details">
                    {listings[3].asset.name.toString()}<br></br>
                    <span className="erc1155-price">${(listings[3].buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br><br></br>
                    
                    SPECIAL: GET {listings[3].asset.attributes[2].value.toString()} FREE TOKENS!<br></br>
                    <button className="erc1155-buy-btn" onClick={routeChange} id={listings[3].asset.name.toString()}>
                    SHOP NOW!
                    </button>
                </div>
            </div>
            <div className="nft-home-sell-more">
                <button className="nft-home-sell-more-btn" onClick={routeChange}>
                        More Options
                    </button>
            </div>
         
        </div>
      )}
    </div>
  );
}