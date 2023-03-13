import {useState,useEffect, useContext} from 'react';
import Axios from 'axios';
import LoadingPoker from '../images/scroogeHatLogo.png';
import { ConnectWallet, useNetworkMismatch, useAddress } from "@thirdweb-dev/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import ReactModal from 'react-modal';
import fetch from 'node-fetch';
import Countdown from 'react-countdown';
import SwitchNetworkBSC from "../scripts/switchNetworkBSC.mjs";
import { useReward } from 'react-rewards';
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import AuthContext from '../context/authContext.ts';
import Layout from './Layout.mjs';
import { marketPlaceInstance } from '../config/axios.js';

function HolderClaimChips() {
  
  const { user } = useContext(AuthContext);
  const { reward, isAnimating } = useReward('rewardId', 'confetti', {colors: ['#D2042D', '#FBFF12', '#AD1927', '#E7C975', '#FF0000']});

    const [buyLoading,setBuyLoading]=useState(false);
    const [nextClaimDate, setNextClaimDate]=useState("Loading...");
    const [OGBalance, setOGBalance]=useState("Loading...");
    const [currentPrice, setCurrentPrice]=useState("Loading...");
    const [email, setEmail]=useState('');
    const handleChange = event => {
        setEmail(event.target.value);
      };
    let user_id = '';
    const address = useAddress();
    const isMismatched = useNetworkMismatch();
    function notify(message) {
      toast.success('🎩 '+message);
    }  
    
    async function getNextClaimDate(){
      if(user){
       marketPlaceInstance().get(`/getNextClaimDate/${address}/holder/${user.id}/0`).then((data)=>{
          setNextClaimDate(data.data);
          return nextClaimDate;
          });
      }
        
    };

    async function getCoinGeckoData() {
      await fetch('https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/0xfa1ba18067ac6884fb26e329e60273488a247fc3')
        .then(response => response.json())
        .then((data) => {
            const current_price = data.market_data.current_price.usd;
            setCurrentPrice(current_price);
            return current_price;
        })
        .catch((e) => {
            console.log(e);
            return false;
        });
    };

    function timeout(delay) {
      return new Promise( res => setTimeout(res, delay) );
    };

    const claimTokens = () => {
      setBuyLoading(true);
      user_id = user[0];
      try {
        marketPlaceInstance().get(`/claimHolderTokens/${address}/${user.id}`).then(async (data)=>{
          notify('Tokens Claimed: '+data.data);
          setBuyLoading(false);
          reward();
          zzz();
          //await timeout(4200); 
          //window.location.reload();
        });
      } catch (err) {
        console.error(err);
        notify("Error claiming tokens!");
        setBuyLoading(false);
      };
    };

const zzz = async () => {
  if(address && !isMismatched){
    const xxx = await getNextClaimDate().then((resu)=>{
      return true;
    });
  } else {
    return false;
  }
};

useEffect(() => {
  getCoinGeckoData();
  if(address && !isMismatched){
   marketPlaceInstance().get(`/getOGBalance/${address}`).then((data)=>{
        setOGBalance(data.data);
        }).then(()=>{
          zzz();
        });
  }
}, [user, address]);

    return (
    <Layout>
        <div className="bordered-section">
            {buyLoading ? (<div className="pageImgContainer">
                    <img src={LoadingPoker} alt="game" className="imageAnimation" />
                    <div className='loading-txt pulse'>
                        CLAIMING TOKENS...
                    </div>
                </div>) : (<></>)}
            <div className="pageTitle">
                <h1>Claim Free Tokens</h1>
            </div>
            <div className="feature-overview-div" style={{marginBottom: '30px'}}>
                <p>Did you know that you get FREE TOKENS EVERY MONTH just for holding Scrooge in your wallet? 
                Once every 30 days, you can come right to this page and claim your free <a href="https://scrooge.casino" target="_blank" rel="noreferrer" alt="claim free tokens to spend in Scrooge Casino">Scrooge Casino</a> tokens just by clicking the CLAIM TOKENS button.</p>
                <p>Your claimable monthly token rate is automatically determined based on the amount of Scrooge you currently hold, as well as the current Scrooge price.</p>
            </div>
            {(isMismatched && address) ? (<div><SwitchNetworkBSC /></div>) : 
              (<span></span>)}
            {(address)?(
              <div className="prizes_container">
                  <div className='prizes-card'>
                      {(OGBalance)?(<div className='holder-claim-details'>Scrooge Coin Balance: {OGBalance.toLocaleString('en-US')}</div>):(<div className='holder-claim-details'>Scrooge Coin Balance: {OGBalance}</div>)}
                      
                      <div className='holder-claim-details'>Scrooge Coin Price: ${parseFloat(currentPrice).toFixed(10)}</div><br></br>
                   
                      <div className='prizes-chip-count'>Your Claimable Monthly Token Rate:<br></br>
                      <div className='additional-info-div'>
                        Your Balance ({OGBalance.toLocaleString('en-US')})<br></br> X <br></br>Current Scrooge Coin Price (${parseFloat(currentPrice).toFixed(10)})<br></br> X <br></br> EARNING RATE (10%)<br></br> = <br></br>
                      </div>
                      {(OGBalance > 0)?(<>Claim {((OGBalance * currentPrice)*.1).toFixed(0).toLocaleString('en-US')}</>):(<>0</>)} FREE Tokens Every 30 Days</div>
                      <div style={{width: "100%", textAlign: "center"}}><div id="rewardId" style={{margin: "0 auto"}} /></div>
                      {((new Date(nextClaimDate) <= new Date() || nextClaimDate === 'CLAIM NOW') && OGBalance > 0) ? (<button className="submit-btn" onClick={() => claimTokens()}>Claim {((OGBalance * currentPrice)*.1).toFixed(0).toLocaleString('en-US')} Tokens</button>) : (<><div className='prize-name'>{(nextClaimDate !== 'Loading...' && OGBalance>0)?(<>Next Claim Available:<br></br><Countdown date={nextClaimDate}><button className="submit-btn" onClick={() => claimTokens()}>Claim {(OGBalance * currentPrice).toFixed(0).toLocaleString('en-US')} Tokens</button></Countdown></>):(<><img src={LoadingPoker} alt="game" className="imageAnimation" /></>)}</div><br></br><br></br></>)}
                      <div className='fine-print-txt' style={{marginTop: '40px'}}>
                        *Your claimed tokens will automatically be added to your connected <a href="https://scrooge.casino" alt="Visit Scrooge Casino" target="_blank" rel="noreferrer">Scrooge Casino</a> account.
                      </div>
                  </div>
                  <div className='fine-print-txt' style={{marginTop: '40px'}}>
                    Monthly claimable token rates are calculated based on the current price of the Scrooge cryptocurrency token. This ensures a fair and even claimable monthly amount for all holders.
                  </div>
              </div>
            ):(<div>
              <p className="description yellow">
              Get started by connecting your wallet.
              </p>
              <div className="connect-wallet-div">
                <ConnectWallet />
              </div>
            </div>)}

            
        </div>
        <div className="flex-row" style={{margin: '100px auto'}}>
          <ShowBottomNavCards />
        </div>
        </Layout>)
    };
    
    export default HolderClaimChips;