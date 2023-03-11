import { useAddress, useOwnedNFTs, useContract, ThirdwebNftMedia, useNetworkMismatch, ChainId } from "@thirdweb-dev/react";
import {useState,useEffect,useContext} from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChainContext from "../context/Chain";
import LoadingPoker from '../images/scroogeHatLogo.png';
import DLBigD from '../images/DLBigD.png'
import Countdown from 'react-countdown';
import Cookies from 'js-cookie';
import { Navigate, useNavigate } from "react-router-dom";
import { useReward } from 'react-rewards';
import {getUserCookie, getUserCookieProd} from "../config/cookie.mjs";
import AuthContext from "../context/authContext";


export default function GetWalletDLNFTs() {
  let user_id;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { reward, isAnimating } = useReward('rewardId', 'confetti', {colors: ['#D2042D', '#FBFF12', '#AD1927', '#E7C975', '#FF0000']});
  function notify(message) {
    toast.success('🎩 '+message);
  }; 
 
  const { selectedChain, setSelectedChain } = useContext(ChainContext);
  setSelectedChain(ChainId.Mainnet);
  //console.log(selectedChain);
  const addresses = {
    [String(ChainId.Mainnet)]: "0xEe7c31b42e8bC3F2e04B5e1bfde84462fe1aA768",
    [String(ChainId.BinanceSmartChainMainnet)]: "",
  };
  const address = useAddress();
  const isMismatched = useNetworkMismatch();
  const [buyLoading,setBuyLoading]=useState(false);
  const [nextClaimDate, setNextClaimDate]=useState("");
  const [tokensClaimDate, setTokensClaimDate]=useState([{token_id: '', nextClaimDate: ''}]);
  const { contract } = useContract(addresses[String(selectedChain)]);
  const { data: nfts, isLoading } = useOwnedNFTs(contract, address);
  const claimTokens = (token_id) => {
    setBuyLoading(true);
    user_id = user[0];
    try {
      Axios.get(`https://34.237.237.45:9001/api/claimDLTokens/${address}/${user_id}/${token_id}`).then(async (data)=>{
        mapClaimDates(nfts);
        notify('Tokens Claimed: '+data.data);
        setBuyLoading(false);
        reward();
        
        //await timeout(4200); 
        //window.location.reload();
      });
    } catch (err) {
      console.error(err);
      notify("Error claiming tokens!");
      setBuyLoading(false);
    };
  };

  async function getNextClaimDate(token_id){
      await Axios.get(`https://34.237.237.45:9001/api/getNextClaimDate/${address}/dl/${user_id}/${token_id}`).then(async (data)=>{
        //console.log("next claim: ", data.data);
        dataArray.push([token_id, data.data]);
        //console.log('foo: ', dataArray);
        setClaimDateArray(dataArray);
        //console.log('setClaimDateArray: ', claimDateArray);
        setTokensClaimDate(tokensClaimDate => [{token_id: token_id.toString(), nextClaimDate: data.data}]);
        setNextClaimDate(data.data);
        });
      return nextClaimDate;
  };

  async function getCountdown(token_id){
    const thisNextClaimDate = await getNextClaimDate(token_id).then((data)=>{
      //console.log("thisNextClaimDate: ", data);
      let t;
      if(data !== 'CLAIM NOW') {
        t = new Date(data);
        t = t.getTime();
      } else {
        t = 0;
      }
      
      //console.log("in get countdown: ", parseInt(t));
      return (
        <Countdown date={new Date(t)}></Countdown>
      )
    });
    
  }

  useEffect(()=>{
    return ()=> setSelectedChain(ChainId.BinanceSmartChainMainnet);
},[address])
let dataArray=[];
const [claimDateArray, setClaimDateArray] = useState([]);
useEffect(()=>{
  if(nfts){
    if (nfts.length > 1){
      mapClaimDates(nfts);
    }
  }
},[nfts])

async function mapClaimDates(nfts) {
  nfts.map((nft) => (
    foo(nft.metadata.id)
  ));
  async function foo(id) {
    //console.log('nft: ', id);
    const thisNextClaimDate = await getNextClaimDate(id);
  }
}
  
  return (
    
    <div>
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
      {buyLoading ? (<div className="pageImgContainer-dl bg-animated">
                <img className='spin dl-loader-img' src={DLBigD} alt="Ducky Lucks Loader" style={{margin: '10px auto', width: '200px', height: '200px'}} />
                    <div className='loading-txt pulse'>
                        CLAIMING TOKENS...
                    </div>
                </div>) : (<></>)}
      {(selectedChain!==ChainId.Mainnet) ? (
      <div className="button-section">
        <button className="submit-btn" style={{width: "350px", margin: "35px auto"}} onClick={()=>setSelectedChain(ChainId.Mainnet)}>Display My Ducks</button>
      </div>):(<></>)}
        
      {(isLoading && (selectedChain===ChainId.Mainnet)) ? (
         <div className="button-section"><div style={{fontFamily: 'Poppins'}}>LOADING YOUR DUCKY LUCKS NFTS</div><img className='spin dl-loader-img' src={DLBigD} alt="Ducky Lucks Loader" style={{margin: '10px auto', width: '200px', height: '200px'}} /></div>
      ) : (
        
        <div className="flex-row">
          <div className="flex-column">
          <div className="feature-overview-div" style={{marginBottom: '30px'}}>
                <p>Did you know that you get FREE TOKENS EVERY MONTH just for being a cool motherducker and holding at least one <a href="https://duckylucks.com" target="_blank" rel="noreferrer" alt="claim free tokens for holding ducky lucks NFTs">Ducky Lucks NFT</a> in your wallet? 
                Once every 30 days, you can come right to this page and claim your free <a href="https://scrooge.casino" target="_blank" rel="noreferrer" alt="claim free tokens to spend in Scrooge Casino">Scrooge Casino</a> tokens just by clicking the CLAIM FREE TOKENS button.</p>
                <p>Your claimable monthly token amount is automatically determined based on the rarity points of the Ducky Lucks you currently hold.</p>
            </div>
            <div className="pageTitle">
              <h1>My Ducky Lucks</h1>
            </div>
          </div>
          
        <div style={{width: "100%", textAlign: "center"}}><div id="rewardId" style={{margin: "0 auto"}} /></div>
          {nfts.map((nft) => (
            <div className="erc721Card" key={nft.metadata.id}>
              <div className="erc721Card-name">            
               {nft.metadata.name}
               <br></br><br></br>
                <ThirdwebNftMedia className="erc721Card-image"
                  key={nft.metadata.id}
                  metadata={nft.metadata}
                  height={300}
                />
              </div>
              <div className="erc721Card-details">
               <span className="erc721Card-col-title">TRAITS</span><br></br><br></br>
                Background: <span>{nft.metadata.attributes[4].value}</span><br></br>
                Feathers: <span>{nft.metadata.attributes[5].value}</span><br></br>
                Head: <span>{nft.metadata.attributes[6].value}</span><br></br>
                Clothes: <span>{nft.metadata.attributes[7].value}</span><br></br>
                Eyes: <span>{nft.metadata.attributes[8].value}</span><br></br>
                Mouth: <span>{nft.metadata.attributes[9].value}</span><br></br>
                Accessories: <span>{nft.metadata.attributes[10].value}</span><br></br>
                
              </div>
              <div className="erc721Card-3rd-col">
                <span className="erc721Card-col-title">RARITY</span><br></br><br></br>
                Duck ID: <span>{nft.metadata.attributes[0].value}</span><br></br>
                Token ID: <span>{nft.metadata.id}</span><br></br>
                Brood: <span>{nft.metadata.attributes[3].value}</span><br></br>
                Birthday: <span>{nft.metadata.attributes[2].value}</span><br></br>
                Hash: <span>{nft.metadata.attributes[1].value}</span><br></br>
                {(nft.metadata.attributes[12].value <= 20) ? 
                  (<div className="rarity-pct-1">
                    Rarity Points: <span>{nft.metadata.attributes[11].value}</span><br></br>
                    Rarity Percentage: <span>{nft.metadata.attributes[12].value}%</span><br></br>
                    <strong>Monthly Claimable Amount: <span>{(1500 * (nft.metadata.attributes[12].value/100)).toFixed(0)} Tokens</span></strong>
                  </div>) : (<span></span>)}
                {(nft.metadata.attributes[12].value > 20 && nft.metadata.attributes[12].value <= 30) ? 
                (<div className="rarity-pct-2">
                  Rarity Points: <span>{nft.metadata.attributes[11].value}</span><br></br>
                  Rarity Percentage: <span>{nft.metadata.attributes[12].value}%</span><br></br>
                  <strong>Monthly Claimable Amount: <span>{(1500 * (nft.metadata.attributes[12].value/100)).toFixed(0)} Tokens</span></strong>
                </div>) : (<span></span>)}
                {(nft.metadata.attributes[12].value > 30 && nft.metadata.attributes[12].value <= 40) ? 
                  (<div className="rarity-pct-3">
                    Rarity Points: <span>{nft.metadata.attributes[11].value}</span><br></br>
                    Rarity Percentage: <span>{nft.metadata.attributes[12].value}%</span><br></br>
                    <strong>Monthly Claimable Amount: <span>{(1500 * (nft.metadata.attributes[12].value/100)).toFixed(0)} Tokens</span></strong>
                  </div>) : (<span></span>)}
                {(nft.metadata.attributes[12].value > 40 && nft.metadata.attributes[12].value <= 50) ? 
                (<div className="rarity-pct-4">
                  Rarity Points: <span>{nft.metadata.attributes[11].value}</span><br></br>
                  Rarity Percentage: <span>{nft.metadata.attributes[12].value}%</span><br></br>
                  <strong>Monthly Claimable Amount: <span>{(1500 * (nft.metadata.attributes[12].value/100)).toFixed(0)} Tokens</span></strong>
                </div>) : (<span></span>)}
                {(nft.metadata.attributes[12].value > 50 && nft.metadata.attributes[12].value <= 60) ? 
                  (<div className="rarity-pct-5">
                    Rarity Points: <span>{nft.metadata.attributes[11].value}</span><br></br>
                    Rarity Percentage: <span>{nft.metadata.attributes[12].value}%</span><br></br>
                    <strong>Monthly Claimable Amount: <span>{(1500 * (nft.metadata.attributes[12].value/100)).toFixed(0)} Tokens</span></strong>
                  </div>) : (<span></span>)}
                {(nft.metadata.attributes[12].value > 60 && nft.metadata.attributes[12].value <= 70) ? 
                (<div className="rarity-pct-6">
                  Rarity Points: <span>{nft.metadata.attributes[11].value}</span><br></br>
                  Rarity Percentage: <span>{nft.metadata.attributes[12].value}%</span><br></br>
                  <strong>Monthly Claimable Amount: <span>{(1500 * (nft.metadata.attributes[12].value/100)).toFixed(0)} Tokens</span></strong>
                </div>) : (<span></span>)}
              </div>
              <div className="erc721Card-4th-col">
              
             {(claimDateArray.length===nfts.length)?(<>
                {((claimDateArray.find(element => (element[0]===nft.metadata.id))[1].toString())==='CLAIM NOW')?(<>
                  
                    <button className="subheader-btn" onClick={() => claimTokens(nft.metadata.id)}>CLAIM FREE TOKENS!</button>
                  
                </>):(<>
                <div>
                  NEXT CLAIM AVAILABLE:<br></br>
                  <Countdown date={new Date(claimDateArray.find(element => (element[0]===nft.metadata.id))[1])}></Countdown>
                </div>
                </>)}
                
                
              </>):(<div><img className='spin dl-loader-img' src={DLBigD} alt="Ducky Lucks Loader" /></div>)}
              
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
