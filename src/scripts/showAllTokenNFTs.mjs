import React,{useState,useEffect} from 'react';
import { useContract, ThirdwebNftMedia, useActiveListings, ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useNavigate } from "react-router-dom";
import SaleBadge from '../images/saleBadge1.png';
import LoadingGif from '../images/loading1.gif';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactModal from 'react-modal';
import Axios from 'axios';

export default function ShowAllTokenNFTs() {
    const [buyLoading,setBuyLoading]=useState(false);
    const [showModal, setShowModal]=useState(false);
    const [NFTRedeemID, setNFTRedeemID]=useState('');
    const [NFTRedeemName, setNFTRedeemName]=useState('');
    const [email, setEmail]=useState('');
        const handleChange = event => {
            setEmail(event.target.value);
        };

    const address = useAddress();
    let user_id = '';

    function notify(message) {
        toast(message);
    } 

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
      let path = `/nft-tokens`; 
      navigate(path);
    }

    const { contract } = useContract("0x91197754fCC899B543FebB5BE4dae193C75EF9d1", "marketplace")
    // data is the active listings, isLoading is a loading flag while we load the listings.
    const { data: listings, isLoading: loadingListings } =
      useActiveListings(contract);

    function getEmailAddress(NFT_ID, NFT_Name){
    setShowModal(true);
    setNFTRedeemID(NFT_ID);
    setNFTRedeemName(NFT_Name);
    }

    async function handleBuyAsset(token_id, qty, emailaddress) {
        setBuyLoading(true);
        let usernameConfirmed = false;
        if (emailaddress == null || emailaddress === '' || emailaddress === 'Email Address') {
            notify('No email entered.');
          } else {
            setShowModal(false);
            setBuyLoading(true);
            Axios.get(`http://3.238.243.35:9002/api/verifyEmail/${emailaddress}`).then((data)=>{
                console.log(data);
          const username = data.data.username;
          user_id = data.data._id;
          console.log('User ID: '+user_id+'');
          if (username != null){
            if (window.confirm("Email address verified for username: "+username+". Is this correct?") == true) {
              usernameConfirmed = true;
            } else {
              usernameConfirmed = false;
              setBuyLoading(false);
              return false;
            }
          } else {
            notify('Email address not found. Please try again.');
            return false;
          }
          }).then(async () => {
            if (usernameConfirmed){
                try {
                    await contract.buyoutListing(token_id, qty);
                    Axios.get(`http://3.238.243.35:9002/api/getFreeTokens/${address}/${token_id}/${user_id}/${qty}`).then((data)=>{
                        notify("You have successfully purchased your NFT and "+data.data+" chips have been added to your casino account with email address: "+emailaddress+"!");
                        setBuyLoading(false);    
                    });
                    setBuyLoading(false);
                    //window.location.reload();
                  } catch (err) {
                    console.error(err);
                    notify("Error purchasing NFT!");
                    setBuyLoading(false);
                  };
            } else {
              setBuyLoading(false);
              notify("Canceled by user. Please try again.");
            }
          });
        } 
    }
        
  return (
    <div>
        <ToastContainer 
                position='top-center'
                autoClose={4000}
                />
        <ReactModal
                isOpen = {showModal}
                contentLabel = {"Modal Challenge 1"}
                style={{
                    overlay: {
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom:'30%',
                      backgroundColor: 'rgba(231,201,117,0.85)'
                    },
                    content: {
                      position: 'absolute',
                      top: '30px',
                      left: '30px',
                      right: '30px',
                      bottom: '30px',
                      border: '4px solid #D2042D',
                      background: '#1b2129',
                      overflow: 'auto',
                      WebkitOverflowScrolling: 'touch',
                      borderRadius: '4px',
                      outline: 'none',
                      padding: '20px'
                    }
                  }}
                >
                    <div className='modal-popup'>
                        <div className='modal-header'>
                            Please enter your Scrooge Casino profile email address.<br></br>Your chips will be credited to this account.
                        </div>
                        <form>
                            <input type="text" id="emailaddress" name="emailaddress" placeholder='Email Address' onChange={handleChange}
                            value={email}></input>
                            
                        </form>
                        <div>
                          <br></br>
                          <strong>NFT to purchase: </strong>{NFTRedeemName}
                        </div>
                        <button className="modal-popup-btn" onClick={() => handleBuyAsset(NFTRedeemID,1,email)}>SUBMIT</button><br></br><br></br>
                        <button className="modal-popup-btn" onClick={() => setShowModal(false)}>CLOSE</button>
                    </div>
            </ReactModal>
        {buyLoading ? (<div className="loading-img-div">
          <img className="loading-img" src={LoadingGif} alt="Loading..." />
        </div>) : (<></>)}
        <div className="nft-home-sell-title">
            <h1>Scrooge Casino Marketplace NFTs</h1>
        </div>
        
      {loadingListings ? (
        <div className="loading-img-div">
            <img className="loading-img" src={LoadingGif} alt="Loading..." />
        </div>
      ) : (
        <div className="">
          
            <div className="nft-token-row-card">
                <div className="nft-token-row-card-image">
                    <ThirdwebNftMedia
                        key={listings[0].id}
                        metadata={listings[0].asset}
                        height={150}
                    />
                </div>
                <div className="nft-token-row-desc">
                    <span className="nft-token-row-name">{listings[0].asset.name.toString()}</span><br></br><br></br>
                    
                    {listings[0].asset.description.toString()}
                </div>
                <div className="nft-token-row-details">
                    <span className="erc1155-price">${(listings[0].buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br>
                    {(!address) ? (<div className='connect-wallet-inline'>
                        <ConnectWallet />
                        </div>) : 
                        (<button className="erc1155-buy-btn" onClick={() => getEmailAddress(listings[0].asset.id, listings[0].asset.name.toString())} id={listings[0].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                    

                </div>
            </div>

            <div className="nft-token-row-card">
                <div className="nft-token-row-card-image">
                    <ThirdwebNftMedia
                        key={listings[1].id}
                        metadata={listings[1].asset}
                        height={150}
                    />
                </div>
                <div className="nft-token-row-desc">
                    <span className="nft-token-row-name">{listings[1].asset.name.toString()}</span><br></br><br></br>
                    
                    {listings[1].asset.description.toString()}
                </div>
                <div className="nft-token-row-details">
                    <span className="erc1155-price">${(listings[1].buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br>
                    {(!address) ? (<div className='connect-wallet-inline'>
                        <ConnectWallet />
                        </div>) : 
                        (<button className="erc1155-buy-btn" onClick={() => getEmailAddress(listings[1].asset.id, listings[1].asset.name.toString())} id={listings[1].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
            </div>

            <div className="nft-token-row-card">
                <div className="nft-token-row-card-image">
                    <ThirdwebNftMedia
                        key={listings[2].id}
                        metadata={listings[2].asset}
                        height={150}
                    />
                </div>
                <div className="nft-token-row-desc">
                    <span className="nft-token-row-name">{listings[2].asset.name.toString()}</span><br></br><br></br>
                    
                    {listings[2].asset.description.toString()}
                </div>
                <div className="nft-token-row-details">
                    <span className="erc1155-price">${(listings[2].buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br>
                    {(!address) ? (<div className='connect-wallet-inline'>
                        <ConnectWallet />
                        </div>) : 
                        (<button className="erc1155-buy-btn" onClick={() => getEmailAddress(listings[2].asset.id, listings[2].asset.name.toString())} id={listings[2].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-row-sale">
                    <img className="sale-badge-img" src={SaleBadge} alt="Get the best deal possible" /><br></br>
                    1% OFF
                </div>
            </div>

            <div className="nft-token-row-card">
                <div className="nft-token-row-card-image">
                    <ThirdwebNftMedia
                        key={listings[3].id}
                        metadata={listings[3].asset}
                        height={150}
                    />
                </div>
                <div className="nft-token-row-desc">
                    <span className="nft-token-row-name">{listings[3].asset.name.toString()}</span><br></br><br></br>
                    
                    {listings[3].asset.description.toString()}
                </div>
                <div className="nft-token-row-details">
                    <span className="erc1155-price">${(listings[3].buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br>
                    {(!address) ? (<div className='connect-wallet-inline'>
                        <ConnectWallet />
                        </div>) : 
                        (<button className="erc1155-buy-btn" onClick={() => getEmailAddress(listings[3].asset.id, listings[3].asset.name.toString())} id={listings[3].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-row-sale">
                    <img className="sale-badge-img" src={SaleBadge} alt="Get the best deal possible" /><br></br>
                    2% OFF
                </div>
            </div>

            <div className="nft-token-row-card green-border-6px">
                <div className="nft-token-row-card-image">
                    <ThirdwebNftMedia
                        key={listings[4].id}
                        metadata={listings[4].asset}
                        height={150}
                    />
                </div>
                <div className="nft-token-row-desc">
                    <span className="nft-token-row-name">{listings[4].asset.name.toString()}</span><br></br><br></br>
                    
                    {listings[4].asset.description.toString()}
                </div>
                <div className="nft-token-row-details">
                    <span className="erc1155-price">${(listings[4].buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br>
                    {(!address) ? (<div className='connect-wallet-inline'>
                        <ConnectWallet />
                        </div>) : 
                        (<button className="erc1155-buy-btn" onClick={() => getEmailAddress(listings[4].asset.id, listings[4].asset.name.toString())} id={listings[4].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-row-sale">
                    <img className="sale-badge-img" src={SaleBadge} alt="Get the best deal possible" /><br></br>
                    3% OFF
                </div>
            </div>

            <div className="nft-token-row-card green-border-6px">
                <div className="nft-token-row-card-image">
                    <ThirdwebNftMedia
                        key={listings[5].id}
                        metadata={listings[5].asset}
                        height={150}
                    />
                </div>
                <div className="nft-token-row-desc">
                    <span className="nft-token-row-name">{listings[5].asset.name.toString()}</span><br></br><br></br>
                    
                    {listings[5].asset.description.toString()}
                </div>
                <div className="nft-token-row-details">
                    <span className="erc1155-price">${(listings[5].buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br>
                    {(!address) ? (<div className='connect-wallet-inline'>
                        <ConnectWallet />
                        </div>) : 
                        (<button className="erc1155-buy-btn" onClick={() => getEmailAddress(listings[5].asset.id, listings[5].asset.name.toString())} id={listings[5].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-row-sale">
                    <img className="sale-badge-img" src={SaleBadge} alt="Get the best deal possible" /><br></br>
                    4% OFF
                </div>
            </div>

            <div className="nft-token-row-card green-border-6px">
                <div className="nft-token-row-card-image">
                    <ThirdwebNftMedia
                        key={listings[6].id}
                        metadata={listings[6].asset}
                        height={150}
                    />
                </div>
                <div className="nft-token-row-desc">
                    <span className="nft-token-row-name">{listings[6].asset.name.toString()}</span><br></br><br></br>
                    
                    {listings[6].asset.description.toString()}
                </div>
                <div className="nft-token-row-details">
                    <span className="erc1155-price">${(listings[6].buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br>
                    {(!address) ? (<div className='connect-wallet-inline'>
                        <ConnectWallet />
                        </div>) : 
                        (<button className="erc1155-buy-btn" onClick={() => getEmailAddress(listings[6].asset.id, listings[6].asset.name.toString())} id={listings[6].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-row-sale">
                    <img className="sale-badge-img" src={SaleBadge} alt="Get the best deal possible" /><br></br>
                    5% OFF
                </div>
            </div>

            <div className="nft-token-row-card green-border-6px">
                <div className="nft-token-row-card-image">
                    <ThirdwebNftMedia
                        key={listings[7].id}
                        metadata={listings[7].asset}
                        height={150}
                    />
                </div>
                <div className="nft-token-row-desc">
                    <span className="nft-token-row-name">{listings[7].asset.name.toString()}</span><br></br><br></br>
                    
                    {listings[7].asset.description.toString()}
                </div>
                <div className="nft-token-row-details">
                    <span className="erc1155-price">${(listings[7].buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br>
                    {(!address) ? (<div className='connect-wallet-inline'>
                        <ConnectWallet />
                        </div>) : 
                        (<button className="erc1155-buy-btn" onClick={() => getEmailAddress(listings[7].asset.id, listings[7].asset.name.toString())} id={listings[7].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-row-sale">
                    <img className="sale-badge-img" src={SaleBadge} alt="Get the best deal possible" /><br></br>
                    6% OFF
                </div>
            </div>

            <div className="nft-token-row-card pink-border-6px">
                <div className="nft-token-row-card-image">
                    <ThirdwebNftMedia
                        key={listings[8].id}
                        metadata={listings[8].asset}
                        height={150}
                    />
                </div>
                <div className="nft-token-row-desc">
                    <span className="nft-token-row-name">{listings[8].asset.name.toString()}</span><br></br><br></br>
                    
                    {listings[8].asset.description.toString()}
                </div>
                <div className="nft-token-row-details">
                    <span className="erc1155-price">${(listings[8].buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br>
                    {(!address) ? (<div className='connect-wallet-inline'>
                        <ConnectWallet />
                        </div>) : 
                        (<button className="erc1155-buy-btn" onClick={() => getEmailAddress(listings[8].asset.id, listings[8].asset.name.toString())} id={listings[8].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-row-sale">
                    <img className="sale-badge-img" src={SaleBadge} alt="Get the best deal possible" /><br></br>
                    7% OFF
                </div>
            </div>

            <div className="nft-token-row-card pink-border-6px">
                <div className="nft-token-row-card-image">
                    <ThirdwebNftMedia
                        key={listings[9].id}
                        metadata={listings[9].asset}
                        height={150}
                    />
                </div>
                <div className="nft-token-row-desc">
                    <span className="nft-token-row-name">{listings[9].asset.name.toString()}</span><br></br><br></br>
                    
                    {listings[9].asset.description.toString()}
                </div>
                <div className="nft-token-row-details">
                    <span className="erc1155-price">${(listings[9].buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br>
                    {(!address) ? (<div className='connect-wallet-inline'>
                        <ConnectWallet />
                        </div>) : 
                        (<button className="erc1155-buy-btn" onClick={() => getEmailAddress(listings[9].asset.id, listings[9].asset.name.toString())} id={listings[9].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-row-sale">
                    <img className="sale-badge-img" src={SaleBadge} alt="Get the best deal possible" /><br></br>
                    8% OFF
                </div>
            </div>

            <div className="nft-token-row-card blue-border-6px">
                <div className="nft-token-row-card-image">
                    <ThirdwebNftMedia
                        key={listings[10].id}
                        metadata={listings[10].asset}
                        height={150}
                    />
                </div>
                <div className="nft-token-row-desc">
                    <span className="nft-token-row-name">{listings[10].asset.name.toString()}</span><br></br><br></br>
                    
                    {listings[10].asset.description.toString()}
                </div>
                <div className="nft-token-row-details">
                    <span className="erc1155-price">${(listings[10].buyoutPrice/10**18).toFixed(2).toString()} BUSD</span><br></br>
                    {(!address) ? (<div className='connect-wallet-inline'>
                        <ConnectWallet />
                        </div>) : 
                        (<button className="erc1155-buy-btn" onClick={() => getEmailAddress(listings[10].asset.id, listings[10].asset.name.toString())} id={listings[10].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-row-sale">
                    <img className="sale-badge-img" src={SaleBadge} alt="Get the best deal possible" /><br></br>
                    9% OFF
                </div>
            </div>
            
         
        </div>
      )}
    </div>
  );
}