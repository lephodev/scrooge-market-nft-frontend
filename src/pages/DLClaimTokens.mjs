//import GetWalletDLNFTs from "../scripts/getWalletDLNFTs.mjs"
import {useEffect, useState} from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import Axios from "axios";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAddress } from "@thirdweb-dev/react";
import { CheckDLOnPage } from '../components/DLGate.jsx';
import GetWalletDLNFTs from '../scripts/getWalletDLNFTs.mjs';
import DLLogoMembersOnly from '../images/DLLogoMembersOnly.png';

export default function DLClaimTokens() {
  const [walletDL, setWalletDL]=useState([]);
  const [hasDL, setHasDL]=useState(0);
  const navigate = useNavigate();
  const address = useAddress();

  /*async function getWalletDLBalance() {
    if(address){
      try {
        console.log("start address: ", address);
        const userRes = await Axios.get(`https://34.237.237.45:9001/api/getWalletDLBalance/${address}`).then((res) =>{ 
          console.log('DLgate2: ',res);
          if (typeof res.data.balance != undefined) {
            console.log('Has DL2');
            setHasDL(true);
            return true;
          } else {
            console.log('Does not have DL2');
            setHasDL(false);
            //navigate("/", { replace: true });
          }
        });
      } catch (error) {
        setHasDL(false);
        //navigate("/", { replace: true });
      } 
    } else {
      return false;
    }
    
  }*/

  async function getWalletDL() {
    //console.log("zzzzz");
    const DLBal = await CheckDLOnPage(address);
    //console.log('DLBal: ',DLBal);
    if(DLBal >= 1){
      setHasDL(DLBal);
    } else {
      //setHasDL(-1);
      navigate("/", { replace: true });
    }
    
  }
  

  useEffect(() => {
    window.scrollTo(0, 0);
    if(address){
      //console.log("sending addr: ", address);
      getWalletDL(address);
    }
  }, [address]);
  

  return (
    <div className="container">
      <main className="main">
        {(hasDL)?(<>
          <div className='large-header-div'>
            <img className='large-header-img' src={DLLogoMembersOnly} alt="Ducky Lucks Members Only" />
            <div className="mint-DL-div">
                <iframe
                    src="https://gateway.ipfscdn.io/ipfs/Qmcine1gpZUbQ73nk7ZGCcjKBVFYXrEtqrhujXk3HDQ6Nn/erc721.html?contract=0xEe7c31b42e8bC3F2e04B5e1bfde84462fe1aA768&chainId=1&theme=dark&primaryColor=teal"
                    width="600px"
                    height="600px"
                    style={{maxWidth:"100%"}}
                    frameborder="0"
                    ></iframe>
            </div>
            <div className="flex-row">
              <GetWalletDLNFTs />
            </div>
          </div>
        </>):(
          <div style={{width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center"}}>
            <div className=''><img className="detecting-dl-img pulse" src="https://casino-nft-marketplace.s3.amazonaws.com/DLGif1.gif" alt="duckylucks nfts" /></div><br></br>
            <div className='detecting-txt'>Detecting your Ducky Lucks...</div>
          </div>
        )}

        {(!address)?(
          <div className='white-txt'>Please connect your wallet.</div>
        ):(<></>)}
          
        <div style={{marginTop: "75px"}}><ShowBottomNavCards /></div>
        
        
        
      </main>
    </div>
  );
}