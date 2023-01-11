import React,{useState,useEffect} from 'react';
import Axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { ConnectWallet, useNetworkMismatch, useAddress } from "@thirdweb-dev/react";
import Duck1 from '../images/duck1.png';
import { ToastContainer, toast } from 'react-toastify';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
import ReactModal from 'react-modal';

function RedeemPrizes() {

    //const [postList,setPostList]=useState([]);
    const [chipCount,setChipCount]=useState([]);
    const [prizes,setPrizes]=useState([]);
    const [showModal, setShowModal]=useState(false);
    const [email, setEmail]=useState('');
    const handleChange = event => {
        setEmail(event.target.value);
    
        console.log('value is:', event.target.value);
      };

    const address = useAddress();
    function notify(message) {
        toast(message);
    } 
    //let history = useNavigate();

    
    
    useEffect((user_id)=>{
        user_id = 1;
        Axios.get(`http://localhost:3002/api/getUserChipCount/${user_id}`).then((data)=>{
        setChipCount(data.data[0].chips);
        //console.log(data.data[0].chips);
        });

        Axios.get(`http://localhost:3002/api/getPrizes`).then((data)=>{
        setPrizes(data.data);
        console.log(data.data);
        });

        
    },[]);
    
    const AddChips = (token_id, user_id, qty) => {
        //const address = '0x77eA7d7428178f676a16E620E705e8fAF63402B6';
        //const token_id = 4;
        Axios.get(`http://localhost:3002/api/getWalletNFTBalanceByTokenID/${address}/${token_id}/${user_id}/${qty}`).then((data)=>{
        //setNFTBalance(data.data);
        //console.log('FE NFT Balance: ',data.data);
        });
    };

    const RedeemPrize = (prize_id, user_id, qty) => {
        Axios.get(`http://localhost:3002/api/redeemPrize/${prize_id}/${user_id}/${qty}`).then((data)=>{
        //setNFTBalance(data.data);
        //console.log('Prize cost: ',data.data[0].price);
        notify("Prize Redeemed!");
        });
    };

    

    return (
    
        <div className="bordered-section">

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
                        <button className="modal-popup-btn" onClick={() => setShowModal(false)}>SUBMIT</button>
                    </div>
            </ReactModal>



            <div className="pageTitle">
                <h1>Redeem for Prizes</h1>
            </div>
            <button className="submit-btn" onClick={() => setShowModal(true)}>Toast Me</button>
            <ToastContainer 
                position='top-center'
                autoClose={4000}
                />
            <div className='prizes-chip-count'>
                Your Token Balance: {chipCount}
            </div>
            <div className="prizes_container">
                {prizes.map((prize) => (
                    <div className='prizes-card'>
                        <div className='prize-name'>{prize.name}</div><br></br>
                        <div className='prize-cost'>Cost: {prize.price} Tokens</div><br></br>
                        {prize.description}<br></br><br></br>
                        <img className="card-img" src={Duck1} alt="ducky lucks nft collection" /><br></br>
                        <button className="submit-btn" onClick={(() => RedeemPrize(prize.id, 1, 1))}>REDEEM PRIZE</button>
                        <br></br>
                    </div>
                ))};
            </div>
        </div>
        )
    }
    
    export default RedeemPrizes;