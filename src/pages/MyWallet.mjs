import GetWalletCasinoNFTs from "../scripts/getWalletCasinoNFTs.mjs";
import { ConnectWallet, useNetworkMismatch, useAddress, ChainId, useSDK } from "@thirdweb-dev/react";
import {useEffect, useState, useContext} from 'react';
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";
import ChainContext from "../context/Chain";
import { Navigate, useNavigate } from "react-router-dom";
import Axios from "axios";
import Token from '../images/token.png';
import Ticket from '../images/ticket.png';
import ScroogeHatLogo from '../images/scroogeHatLogo.png';
import ScroogeJRLogo from '../images/scroogeJRLogo.jpg';
import ClaimOGPending from "../components/claimOGPending.mjs";
import { TwitterShareButton, TwitterIcon } from "react-share";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getUserCookie from "../config/cookie.mjs";

export default function MyWallet() {
  

  const [OGBalance, setOGBalance]=useState("Loading...");
  const [OGValue, setOGValue]=useState("Loading...");
  const [currentPriceOG, setCurrentPriceOG]=useState("Loading...");
  const navigate = useNavigate();
  const [user, setUser]=useState([]);
  const [userRedeemed, setUserRedeemed]=useState([]);
  const [merchRedeemed, setMerchRedeemed]=useState([]);
  const [showMerchRedeemed, setShowMerchRedeemed]=useState(false);
  const [showCasinoNFTs, setShowCasinoNFTs]=useState(true);
  const [showCrypto, setShowCrypto]=useState(true);
  const [showMinMenu, setShowMinMenu]=useState(true);
  function notify(message) {
    toast.success('🎩 '+message);
  } 
  /*async function checkToken() {
    //let access_token = Cookies.get('token', { domain: 'scrooge.casino' });
    let access_token = getUserCookie();
    if (access_token){
      try {
        const userRes = await Axios.get(`https://api.scrooge.casino/v1/auth/check-auth`, {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        }).then((res) =>{ 
          //console.log('resy: ',res);
          if (typeof res.data.user.id !== "undefined") {
              setUser([res.data.user.id, res.data.user.username, res.data.user.firstName, res.data.user.lastName, res.data.user.profile, res.data.user.ticket, res.data.user.wallet]);
              
              Axios.get(`http://localhost:9001/api/getUserRedeemed/${res.data.user.id}`).then((data)=>{
                //console.log('data: ', data);
                  setUserRedeemed(data.data);
                  });
                
          } else {
            setUser(null);
            navigate("/login", { replace: true });
          }
        });
      } catch (error) {
        setUser(null);
        navigate("/login", { replace: true });
      }
    } else {
      setUser(null);
      navigate("/login", { replace: true });
    }
  }*/

  async function checkToken() {
    const initUser = await getCheckToken().then((res)=>{
        setUser([res.data.user.id, res.data.user.username, res.data.user.firstName, res.data.user.lastName, res.data.user.profile, res.data.user.ticket, res.data.user.wallet]);
        try {    
          Axios.get(`http://localhost:9001/api/getUserRedeemed/${res.data.user.id}`).then((data)=>{
            //console.log('data: ', data);
              setUserRedeemed(data.data);
            });
        } catch (err) {
            console.error(err);
        };
        //return res;
    })
}

  async function getCoinGeckoDataOG(bal) {
    await fetch('https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/0xfa1ba18067ac6884fb26e329e60273488a247fc3')
      .then(response => response.json())
      .then((data) => {
          const current_price = data.market_data.current_price.usd;
          setCurrentPriceOG(current_price);
          setOGValue(((bal*current_price)).toFixed(2));
          return current_price;
      })
      .catch((e) => {
          console.log(e);
          return false;
      });
  };

  const handleMarkRedeemed = (trans_id) => {
    Axios.get(`http://localhost:9001/api/markMerchCouponRedeemed/${trans_id}/${user[0]}`).then((res)=>{
      //console.log('handle: ', res);
      getUserRedeemed();
    });
  };

  const getUserRedeemed = () => {
    //console.log('user: ', user[0]);
      Axios.get(`http://localhost:9001/api/getUserRedeemed/${user[0]}`).then((data)=>{
      //console.log('post get data: ', data);
      setUserRedeemed(data.data);
      //console.log('useRed: ',userRedeemed);
      });
  };

  const address = useAddress();
  const { selectedChain, setSelectedChain } = useContext(ChainContext);
  const isMismatched = useNetworkMismatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (selectedChain===ChainId.Mainnet) {
      setSelectedChain(ChainId.BinanceSmartChainMainnet);
    }
    if(user.length === 0){
      checkToken();
    }
    if(address && !isMismatched && (selectedChain===ChainId.BinanceSmartChainMainnet)){
      Axios.get(`http://localhost:9001/api/getOGBalance/${address}`).then((data)=>{
          setOGBalance(data.data);
          getCoinGeckoDataOG(data.data);
          });
    }
  }, [isMismatched]);

  return (
    <div className="container">
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
      <main className="main">
        <h1 className="title">
         {user[1]}'s SCROOGE CASINO WALLET
        </h1>

        {(!showMerchRedeemed || !showCasinoNFTs || !showCrypto)?(<>
            <div className="min-menu-div">
              {(!showMerchRedeemed)?(<><button className="min-menu-btn" onClick={()=>{setShowMerchRedeemed(true)}}>MERCH CODES</button></>):(<></>)}
              {(!showCasinoNFTs)?(<><button className="min-menu-btn" onClick={()=>{setShowCasinoNFTs(true)}}>CASINO NFTS</button></>):(<></>)}
              {(!showCrypto)?(<><button className="min-menu-btn" onClick={()=>{setShowCrypto(true)}}>CRYPTO</button></>):(<></>)}
            </div>
        </>):(<></>)}
        
        {(user[4])?(
          <div className="wallet-casino-profile-div">
            <div className="wallet-casino-profile-img-div">
              <img className="wallet-casino-profile-img" src={user[4]} alt="Scrooge Casino profile picture" /><br></br>
            </div>
            <div className="wallet-casino-profile-details">
              <div className="">
                <span className="wallet-casino-profile-username">{user[1]}</span><br></br>
                <span className="yellow">{user[2]} {user[3]}</span><br></br>
              </div>
              <div className="balance-column">
                <div className="token-ticket-row"><img className="token-small" src={Token} alt="Scrooge Casino balances" />TOKENS: {user[6].toLocaleString('en-US')}</div>
                <div className="token-ticket-row"><img className="ticket-small" src={Ticket} alt="Scrooge Casino balances" />TICKETS: {user[5].toLocaleString('en-US')}</div>
              </div>
              
            </div>
            <div className="crypto-balance-div">
              <div className="width-100">
              <div className="crypto-balance-header">CRYPTO BALANCE</div>
                <div className="crypto-balance-row"><img className="token-logo" src={ScroogeHatLogo} alt="Scrooge Casino balances" />SCROOGE COIN: {OGBalance.toLocaleString('en-US')}</div>
                <div className="crypto-balance-row">VALUE: ${OGValue.toLocaleString('en-US')}</div>
                <div className="claim-pending-div">
                  <ClaimOGPending />
                </div>
              </div>
            </div>
          </div>
        ):(<></>)}
        
        {(userRedeemed.length > 0 && showMerchRedeemed)?(
          <div className="transaction-div">
            <div className='close-btn-round-div' style={{width: '45px', marginTop: '0'}}>
              <div className='close-btn-round' onClick={() => setShowMerchRedeemed(false)}>X</div>
            </div>
            <div className="transaction-div-title">Your Merch Coupon Codes</div><br></br>
            {userRedeemed.map((red) => (
            <>
              {red.prize_details.map((deet) => (<>
                
                  {(deet.category === 'Merch')?(
                    
                    <div className={(red.markRedeemed)?('disabled transaction-card'):('transaction-card')} key={red._id}>
                      <div key={deet._id}>{deet.name}
                        <br></br>
                        COUPON CODE: <br></br>
                        <div className="transaction-card-coupon-code">{red.coupon_code}</div><br></br>
                        Received Date: {red.timestamp.substring(0, red.timestamp.indexOf("T"))}<br></br>
                        {(red.markRedeemed)?(<div className="green bold">Redeemed</div>):(<button className="claim-btn" onClick={()=>handleMarkRedeemed(red._id)}>Mark as Redeemed</button>)}
                      </div>
                    </div>
                  ):(<></>)}
                
                
                </>
              ))}
              
              </>
            ))}
          </div>
        ):(<></>)}
        
        {(isMismatched && address) ? (<div><SwitchNetworkBSC /></div>) : 
          (<span></span>)}

        {(!address) ? (<div>
          <p className="description yellow">
          Get started by connecting your wallet.
          </p>
        
          <div className="connect-wallet-div">
            <ConnectWallet />
          </div>
        </div>) : 
          (<span></span>)}
        
        {(!isMismatched && address && showCasinoNFTs) ? (<div className="bottom-margin-100">
            <div className='close-btn-round-div' style={{width: '45px', marginTop: '0'}}>
              <div className='close-btn-round' onClick={() => setShowCasinoNFTs(false)}>X</div>
            </div>
            <GetWalletCasinoNFTs /></div>) : 
          (<span></span>)}
        
        
        <ShowBottomNavCards />
        
      </main>
    </div>
  );
}