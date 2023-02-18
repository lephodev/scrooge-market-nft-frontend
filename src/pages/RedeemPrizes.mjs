import {useState,useEffect} from 'react';
import Axios from 'axios';
import LoadingPoker from '../images/scroogeHatLogo.png';
import { useAddress } from "@thirdweb-dev/react";
import { ToastContainer, toast } from 'react-toastify';
//import ChainContext from "../context/Chain";
//import { useContext } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom";
import { useReward } from 'react-rewards';
import {getUserCookie, getUserCookieProd} from "../config/cookie.mjs";

function RedeemPrizes() {
    const { reward, isAnimating } = useReward('rewardId', 'confetti', {colors: ['#D2042D', '#FBFF12', '#AD1927', '#E7C975', '#FF0000']});
    let prizesReceived = 0;
    useEffect(() => {
        window.scrollTo(0, 0);
        checkToken();
        getCoinGeckoDataOG();
        getCoinGeckoDataJR();
        if (prizesReceived === 0) {
            getPrizes(); 
        }
        prizesReceived = 1;
      }, []);
    
    const [chipCount,setChipCount]=useState([]);
    const [redeemLoading,setRedeemLoading]=useState(false);
    const [redeemSuccess,setRedeemSuccess]=useState(false);
    const [allPrizes,setAllPrizes]=useState([]);
    const [prizes,setPrizes]=useState([]);
    const [prizesLoading,setPrizesLoading]=useState([]);
    const [currentPriceOG, setCurrentPriceOG]=useState("Loading...");
    const [currentPriceJR, setCurrentPriceJR]=useState("Loading...");
    const [OG1000, setOG1000]=useState();
    const [OG5000, setOG5000]=useState();
    const [OG10000, setOG10000]=useState();
    const [JR1000, setJR1000]=useState();
    const [JR5000, setJR5000]=useState();
    const [JR10000, setJR10000]=useState();
    const address = useAddress();
    function notify(message) {
        toast.success('🎩 '+message);
      } 

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
      }
    let user_id = '';
    const navigate = useNavigate();
    const [user, setUser]=useState([]);
    async function checkToken() {
        //let access_token = Cookies.get('token', { domain: 'scrooge.casino' });
        let access_token = getUserCookieProd();
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
                    user_id = res.data.user.id;
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
    };

    async function getPrizes(){
        setPrizesLoading(true);
        if(prizes.length < 2){
            Axios.get(`https://34.237.237.45:9001/api/getPrizes`).then((data)=>{
                if(prizes.length < 2){
                    setPrizes(data.data);
                    setPrizesLoading(false);
                    setAllPrizes(data.data);
                }
            });
        }
    }

    const sortPrizes = (sortOn) => {
        if (sortOn === 'priceAscending') {
            setPrizes([...prizes].sort((a, b) => a.price - b.price));
        } else if (sortOn === 'priceDescending') {
            setPrizes([...prizes].sort((a, b) => b.price - a.price));
        } else if (sortOn === 'nameDescending') {
            setPrizes([...prizes].sort((a, b) => a.name > b.name ? 1 : -1,));
        } else if (sortOn === 'nameAscending') {
            setPrizes([...prizes].sort((a, b) => a.name > b.name ? -1 : 1,));
        } else if (sortOn === 'categoryDescending') {
            setPrizes([...prizes].sort((a, b) => a.category > b.category ? 1 : -1,));
        } else if (sortOn === 'categoryAscending') {
            setPrizes([...prizes].sort((a, b) => a.category > b.category ? -1 : 1,));
        }
    }

    const filterPrizes = (filterOn) => {
        if(allPrizes.length > 2){
            if (filterOn === 'Badges') {
                setPrizes([...allPrizes].filter(prize => prize.category === 'Badges'));
                //console.log('badges: ',prizes);
            } else if (filterOn === 'Crypto') {
                setPrizes([...allPrizes].filter(prize => prize.category === 'Crypto'));
                //console.log('crypto: ',prizes);
            } else if (filterOn === 'Merch') {
                setPrizes([...allPrizes].filter(prize => prize.category === 'Merch'));
                //console.log('merch: ',prizes);
            } else if (filterOn === 'NFTs') {
                setPrizes([...allPrizes].filter(prize => prize.category === 'NFTs'));
                //console.log('nfts: ',prizes);
            } 
        }
    }

    async function getCoinGeckoDataOG() {
        await fetch('https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/0xfa1ba18067ac6884fb26e329e60273488a247fc3')
          .then(response => response.json())
          .then((data) => {
              const current_price = data.market_data.current_price.usd;
              setCurrentPriceOG(current_price);
              setOG1000(((10/current_price)/2).toFixed(0));
              setOG5000(((50/current_price)/2).toFixed(0));
              setOG10000(((100/current_price)/2).toFixed(0));
              //console.log(OG1000, OG5000, OG10000);
              return current_price;
          })
          .catch((e) => {
              console.log(e);
              return false;
          });
      };

      async function getCoinGeckoDataJR() {
        await fetch('https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/0x2e9f79af51dd1bb56bbb1627fbe4cc90aa8985dd')
          .then(response => response.json())
          .then((data) => {
              const current_price = data.market_data.current_price.usd;
              setCurrentPriceJR(current_price);
              setJR1000(((10/current_price)/2).toFixed(0));
              setJR5000(((50/current_price)/2).toFixed(0));
              setJR10000(((100/current_price)/2).toFixed(0));
              //console.log(JR1000, JR5000, JR10000);
              return current_price;
          })
          .catch((e) => {
              console.log(e);
              return false;
          });
      };

    const RedeemPrize = async (prize_id) => {
        setRedeemLoading(true);
        user_id = user[0];
        Axios.get(`https://34.237.237.45:9001/api/redeemPrize/${address}/${user_id}/${prize_id}`).then((data)=>{
            
            setRedeemLoading(false);
            if(data.data === 'Balance Unacceptable') {
                notify('ERROR! - '+data.data);
            } else if (data.data === 'Invalid Prize Data') {
                notify('ERROR! - '+data.data);
            } else if (data.data === 'Prize Currently Unavailable') {
                notify('ERROR! - '+data.data);
            } else if (data.data === 'Transaction Failed') {
                notify('ERROR! - '+data.data);
            } else if (data.data === 'Not Enough Tickets') {
                notify('ERROR! - '+data.data);
            } else {
                setRedeemSuccess(true);
                //notify(data.data+' redeemed successfully!');
            }
        });
    };

    return (
        <div className="bordered-section">
            {redeemLoading ? (<div className="pageImgContainer">
                    <img src={LoadingPoker} alt="game" className="imageAnimation" />
                    <div className='loading-txt pulse'>
                        REDEEMING...
                    </div>
                </div>) : (<></>)}

            {redeemSuccess ? (<div className="pageImgContainer">
                
                <div className='loading-txt'>
                    REDEEMED SUCCESSFULLY<br></br>
                    <button className="page-nav-header-btn" onClick={(() => {
                        setRedeemSuccess(false);
                        reward();
                    })}>CLOSE</button>
                </div>
                
                
            </div>) : (<></>)}

            <div className="pageTitle">
                <h1>Redeem for Prizes</h1>
            </div>
            <div className="feature-overview-div" style={{marginBottom: '30px'}}>
                Ready to cash in on all of your big wins? Browse through our huge list of amazing prizes and find something you just can't live without. 
                Make sure you have enough available tickets for the prize you want, then click the REDEEM PRIZE button!
            </div>
            
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
            <div className='prizes-chip-count'>
                {(user[5]>0)?(<>Your Ticket Balance: {user[5]}</>):(<><img src={LoadingPoker} alt="game" className="imageAnimation" /></>)}
            </div>
            <div className='page-nav-header-btns-row'>
                <button className="page-nav-header-btn" onClick={(() => filterPrizes('Badges'))}>BADGES</button>
                <button className="page-nav-header-btn" onClick={(() => filterPrizes('Crypto'))}>CRYPTO</button>
                <button className="page-nav-header-btn" onClick={(() => filterPrizes('Merch'))}>MERCH</button>
                <button className="page-nav-header-btn" onClick={(() => filterPrizes('NFTs'))}>NFTS</button>
            </div>
            <div className='page-nav-header-btns-subrow'>
                <button className="page-nav-header-subbtn" onClick={(() => sortPrizes('priceDescending'))}>PRICE HIGH TO LOW</button>
                <button className="page-nav-header-subbtn" onClick={(() => sortPrizes('priceAscending'))}>PRICE LOW TO HIGH</button>
                <button className="page-nav-header-subbtn" onClick={(() => sortPrizes('nameDescending'))}>NAME A-Z</button>
                <button className="page-nav-header-subbtn" onClick={(() => sortPrizes('nameAscending'))}>NAME Z-A</button>
                <button className="page-nav-header-subbtn" onClick={(() => sortPrizes('categoryDescending'))}>CATEGORY A-Z</button>
                <button className="page-nav-header-subbtn" onClick={(() => sortPrizes('categoryAscending'))}>CATEGORY Z-A</button>
            </div>
           
            <div className="prizes_container">
                <div style={{width: "100%", textAlign: "center"}}><div id="rewardId" style={{margin: "0 auto"}} /></div>
                {(!prizesLoading)?(<>{prizes.map((prize) => (
                    <div className='prizes-card' key={prize._id}>
                    {(!prize.isDynamic)?(<div className='prize-name bold'>{prize.name}</div>):(<></>)}
                    {(prize._id === '63b74c51dd789f0383a51d3b')?(<div className='prize-name bold'>{prize.name.replace("xxxValue", parseInt(OG1000).toLocaleString('en-US'))}*</div>):(<></>)}
                    {(prize._id === '63b74ce7dd789f0383a51d3c')?(<div className='prize-name bold'>{prize.name.replace("xxxValue", parseInt(JR1000).toLocaleString('en-US'))}*</div>):(<></>)}
                    {(prize._id === '63b78b42dd789f0383a51d3d')?(<div className='prize-name bold'>{prize.name.replace("xxxValue", parseInt(OG1000).toLocaleString('en-US'))}*</div>):(<></>)}
                    {(prize._id === '63b78c0edd789f0383a51d3f')?(<div className='prize-name bold'>{prize.name.replace("xxxValue", parseInt(JR1000).toLocaleString('en-US'))}*</div>):(<></>)}
                    {(prize._id === '63cedf0d1736630ad01d5f4e')?(<div className='prize-name bold'>{prize.name.replace("xxxValue", parseInt(OG5000).toLocaleString('en-US'))}*</div>):(<></>)}
                    {(prize._id === '63cedf5a1736630ad01d5f50')?(<div className='prize-name bold'>{prize.name.replace("xxxValue", parseInt(JR5000).toLocaleString('en-US'))}*</div>):(<></>)}
                    {(prize._id === '63cedf761736630ad01d5f52')?(<div className='prize-name bold'>{prize.name.replace("xxxValue", parseInt(OG5000).toLocaleString('en-US'))}*</div>):(<></>)}
                    {(prize._id === '63cedfb61736630ad01d5f55')?(<div className='prize-name bold'>{prize.name.replace("xxxValue", parseInt(JR5000).toLocaleString('en-US'))}*</div>):(<></>)}
                    {(prize._id === '63cedf301736630ad01d5f4f')?(<div className='prize-name bold'>{prize.name.replace("xxxValue", parseInt(OG10000).toLocaleString('en-US'))}*</div>):(<></>)}
                    {(prize._id === '63cedf651736630ad01d5f51')?(<div className='prize-name bold'>{prize.name.replace("xxxValue", parseInt(JR10000).toLocaleString('en-US'))}*</div>):(<></>)}
                    {(prize._id === '63cedf9d1736630ad01d5f54')?(<div className='prize-name bold'>{prize.name.replace("xxxValue", parseInt(OG10000).toLocaleString('en-US'))}*</div>):(<></>)}
                    {(prize._id === '63cedfc51736630ad01d5f56')?(<div className='prize-name bold'>{prize.name.replace("xxxValue", parseInt(JR10000).toLocaleString('en-US'))}*</div>):(<></>)}
                    
                        <br></br>

                        <img className="card-img pulse" src={prize.image_url} alt={prize.name} /><br></br>
                        <div className='prize-cost'>Cost: {prize.price} Tickets</div><br></br>
                        Category: {prize.category}<br></br><br></br>
                        
                        {(!prize.isDynamic)?(<div>{prize.description}</div>):(<></>)}
                        {(prize._id === '63b74c51dd789f0383a51d3b')?(<div className=''>{prize.description.replace("xxxValue", parseInt(OG1000).toLocaleString('en-US'))}*</div>):(<></>)}
                        {(prize._id === '63b74ce7dd789f0383a51d3c')?(<div className=''>{prize.description.replace("xxxValue", parseInt(JR1000).toLocaleString('en-US'))}*</div>):(<></>)}
                        {(prize._id === '63b78b42dd789f0383a51d3d')?(<div className=''>{prize.description.replace("xxxValue", parseInt(OG1000).toLocaleString('en-US'))}*</div>):(<></>)}
                        {(prize._id === '63b78c0edd789f0383a51d3f')?(<div className=''>{prize.description.replace("xxxValue", parseInt(JR1000).toLocaleString('en-US'))}*</div>):(<></>)}
                        {(prize._id === '63cedf0d1736630ad01d5f4e')?(<div className=''>{prize.description.replace("xxxValue", parseInt(OG5000).toLocaleString('en-US'))}*</div>):(<></>)}
                        {(prize._id === '63cedf5a1736630ad01d5f50')?(<div className=''>{prize.description.replace("xxxValue", parseInt(JR5000).toLocaleString('en-US'))}*</div>):(<></>)}
                        {(prize._id === '63cedf761736630ad01d5f52')?(<div className=''>{prize.description.replace("xxxValue", parseInt(OG5000).toLocaleString('en-US'))}*</div>):(<></>)}
                        {(prize._id === '63cedfb61736630ad01d5f55')?(<div className=''>{prize.description.replace("xxxValue", parseInt(JR5000).toLocaleString('en-US'))}*</div>):(<></>)}
                        {(prize._id === '63cedf301736630ad01d5f4f')?(<div className=''>{prize.description.replace("xxxValue", parseInt(OG10000).toLocaleString('en-US'))}*</div>):(<></>)}
                        {(prize._id === '63cedf651736630ad01d5f51')?(<div className=''>{prize.description.replace("xxxValue", parseInt(JR10000).toLocaleString('en-US'))}*</div>):(<></>)}
                        {(prize._id === '63cedf9d1736630ad01d5f54')?(<div className=''>{prize.description.replace("xxxValue", parseInt(OG10000).toLocaleString('en-US'))}*</div>):(<></>)}
                        {(prize._id === '63cedfc51736630ad01d5f56')?(<div className=''>{prize.description.replace("xxxValue", parseInt(JR10000).toLocaleString('en-US'))}*</div>):(<></>)}
                        {(prize.isDynamic)?(<div className='asterisk-desc'>*Amount received is calculated at time of redemption and may vary from the amount displayed.</div>):(<></>)}
                        
                        <button className="submit-btn" onClick={(() => RedeemPrize(prize._id))}>REDEEM PRIZE</button>
                        <br></br>
                    </div>
                ))}</>):(<><img src={LoadingPoker} alt="game" className="imageAnimation" /></>)}
                
            </div>
        </div>
        )
    }
    
    export default RedeemPrizes;