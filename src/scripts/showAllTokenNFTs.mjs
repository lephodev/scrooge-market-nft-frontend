import {useState,useEffect} from 'react';
import { useContract, ThirdwebNftMedia, useActiveListings, ConnectWallet, useAddress } from "@thirdweb-dev/react";
import SaleBadge from '../images/saleBadge1.png';
import StripeBadge from '../images/buyWithStripe.jpg';
import LoadingPoker from '../images/scroogeHatLogo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'axios';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useReward } from 'react-rewards';
import {getUserCookie, getUserCookieProd} from "../config/cookie.mjs";

export default function ShowAllTokenNFTs() {
    const [buyLoading,setBuyLoading]=useState(false);
    const [buySuccess,setBuySuccess]=useState(false);

    const address = useAddress();
    let user_id = '';
    const location = useLocation();
    //console.log('loc: ',location.search);
    const [searchParams, setSearchParams] = useSearchParams();
    const [affID, setAffID] = useState('');
    function getAffData() {
        const q = searchParams.get('aff_id');
        if(q){
            setAffID(q);
            const aff_id = Cookies.set('aff_id',  q );
            //console.log('cookie: ',aff_id);
        } else {
            const aff_id = Cookies.get('aff_id', { domain: 'market.scrooge.casino:3000' });//change before going live
            //console.log('cookie: ',aff_id);
            if(aff_id){
                setAffID(aff_id);
            }
        }
    }
    
    

    function notify(message) {
        toast.success('🎩 '+message);
      };

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

    const { contract } = useContract("0x91197754fCC899B543FebB5BE4dae193C75EF9d1", "marketplace")
    // data is the active listings, isLoading is a loading flag while we load the listings.
    const { data: listings, isLoading: loadingListings } = useActiveListings(contract);
    const { reward, isAnimating } = useReward('rewardId', 'confetti', {colors: ['#D2042D', '#FBFF12', '#AD1927', '#E7C975', '#FF0000']});

    async function handleBuyAsset(token_id, qty) {
        setBuyLoading(true);
        qty=1;
        user_id = user[0];
        try {
            await contract.buyoutListing(token_id, qty);
            Axios.get(`https://34.237.237.45:9001/api/getFreeTokens/${address}/${token_id}/${user_id}/${qty}/${affID}`).then((data)=>{
                notify("You have successfully purchased your NFT and "+data.data+" chips have been added to your casino account!");
                setBuyLoading(false);
                setBuySuccess(true);
            });
        } catch (err) {
            console.error(err);
            notify("Error purchasing NFT!");
            setBuyLoading(false);
        };
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        checkToken();
        getAffData();
      }, []);
        
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
        
        {buyLoading ? (<div className="pageImgContainer">
                    <img src={LoadingPoker} alt="game" className="imageAnimation" />
                    <div className='loading-txt pulse'>
                        PURCHASING...
                    </div>
                </div>) : (<></>)}
        {buySuccess ? (<div className="pageImgContainer">
                
                <div className='loading-txt'>
                    PURCHASED SUCCESSFULLY<br></br>
                    <button className="page-nav-header-btn" onClick={(() => {
                        setBuySuccess(false);
                        reward();
                    })}>CLOSE</button>
                </div>
                
                
            </div>) : (<></>)}
        <div className="nft-home-sell-title">
            <h1>Scrooge Casino Marketplace NFTs</h1>
        </div>
        <div className="feature-overview-div" style={{marginBottom: '30px'}}>
                Running low in the casino? Lucky for you, we have a great selection of purchasable casino badge NFTs that include a special bonus amount of FREE TOKENS 
                to be used in <a href="https://scrooge.casino" target="_blank" rel="noreferrer" alt="buy your Scrooge Casino NFTs today">Scrooge Casino</a>. Simply choose the badge that is perfect for you 
                from the list below, make your purchase, and your free bonus tokens will be automatically credited to your connected Scrooge Casino account. It couldn't be easier!
            </div>
      {loadingListings ? (
        <div className="loading-img-div">
            <img src={LoadingPoker} alt="game" className="imageAnimation" />
        </div>
      ) : (
        <div className="">
          <div style={{width: "100%", textAlign: "center"}}><div id="rewardId" style={{margin: "0 auto"}} /></div>
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
                        (<button className="erc1155-buy-btn" onClick={() => handleBuyAsset(listings[0].asset.id, 1)} id={listings[0].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-stripe-badge-div">
                    <a href={`https://buy.stripe.com/test_7sIbJSfwn5mb4p2dQS?client_reference_id=${address}_${user[0]}_${affID}`} alt="buy with Stripe" target="_blank" rel="noreferrer"><img className="stripe-badge-img" src={StripeBadge} alt="Buy NFT with Stripe" /></a>
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
                        (<button className="erc1155-buy-btn" onClick={() => handleBuyAsset(listings[1].asset.id, 1)} id={listings[1].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-stripe-badge-div">
                    <a href={`https://buy.stripe.com/dR6bLA6ZIesc86s289?client_reference_id=${address}_${user[0]}_${affID}`} alt="buy with Stripe" target="_blank" rel="noreferrer"><img className="stripe-badge-img" src={StripeBadge} alt="Buy NFT with Stripe" /></a>
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
                        (<button className="erc1155-buy-btn" onClick={() => handleBuyAsset(listings[2].asset.id, 1)} id={listings[2].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-stripe-badge-div">
                    <a href={`https://buy.stripe.com/00g5ncesaabW9aw8wy?client_reference_id=${address}_${user[0]}_${affID}`} alt="buy with Stripe" target="_blank" rel="noreferrer"><img className="stripe-badge-img" src={StripeBadge} alt="Buy NFT with Stripe" /></a>
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
                        (<button className="erc1155-buy-btn" onClick={() => handleBuyAsset(listings[3].asset.id, 1)} id={listings[3].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-stripe-badge-div">
                    <a href={`https://buy.stripe.com/eVaaHw5VEfwg72obIL?client_reference_id=${address}_${user[0]}_${affID}`} alt="buy with Stripe" target="_blank" rel="noreferrer"><img className="stripe-badge-img" src={StripeBadge} alt="Buy NFT with Stripe" /></a>
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
                        (<button className="erc1155-buy-btn" onClick={() => handleBuyAsset(listings[4].asset.id, 1)} id={listings[4].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-stripe-badge-div">
                    <a href={`https://buy.stripe.com/bIYcPE3NwabW2M8bIM?client_reference_id=${address}_${user[0]}_${affID}`} alt="buy with Stripe" target="_blank" rel="noreferrer"><img className="stripe-badge-img" src={StripeBadge} alt="Buy NFT with Stripe" /></a>
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
                        (<button className="erc1155-buy-btn" onClick={() => handleBuyAsset(listings[5].asset.id, 1)} id={listings[5].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-stripe-badge-div">
                    <a href={`https://buy.stripe.com/3cs2b03Nw83OaeAfZ3?client_reference_id=${address}_${user[0]}_${affID}`} alt="buy with Stripe" target="_blank" rel="noreferrer"><img className="stripe-badge-img" src={StripeBadge} alt="Buy NFT with Stripe" /></a>
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
                        (<button className="erc1155-buy-btn" onClick={() => handleBuyAsset(listings[6].asset.id, 1)} id={listings[6].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-stripe-badge-div">
                    <a href={`https://buy.stripe.com/5kAeXM1Fo97S2M8aEK?client_reference_id=${address}_${user[0]}_${affID}`} alt="buy with Stripe" target="_blank" rel="noreferrer"><img className="stripe-badge-img" src={StripeBadge} alt="Buy NFT with Stripe" /></a>
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
                        (<button className="erc1155-buy-btn" onClick={() => handleBuyAsset(listings[7].asset.id, 1)} id={listings[7].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-stripe-badge-div">
                    <a href={`https://buy.stripe.com/28oeXM4RAesc2M86ov?client_reference_id=${address}_${user[0]}_${affID}`} alt="buy with Stripe" target="_blank" rel="noreferrer"><img className="stripe-badge-img" src={StripeBadge} alt="Buy NFT with Stripe" /></a>
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
                        (<button className="erc1155-buy-btn" onClick={() => handleBuyAsset(listings[8].asset.id, 1)} id={listings[8].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-stripe-badge-div">
                    <a href={`https://buy.stripe.com/aEU5nc5VEck4dqMcMU?client_reference_id=${address}_${user[0]}_${affID}`} alt="buy with Stripe" target="_blank" rel="noreferrer"><img className="stripe-badge-img" src={StripeBadge} alt="Buy NFT with Stripe" /></a>
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
                        (<button className="erc1155-buy-btn" onClick={() => handleBuyAsset(listings[9].asset.id, 1)} id={listings[9].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-stripe-badge-div">
                    <a href={`https://buy.stripe.com/8wM16Wck25VG86sbIR?client_reference_id=${address}_${user[0]}_${affID}`} alt="buy with Stripe" target="_blank" rel="noreferrer"><img className="stripe-badge-img" src={StripeBadge} alt="Buy NFT with Stripe" /></a>
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
                        (<button className="erc1155-buy-btn" onClick={() => handleBuyAsset(listings[10].asset.id, 1)} id={listings[10].asset.name.toString()}>
                            BUY NFT!
                        </button>)}
                </div>
                <div className="nft-token-stripe-badge-div">
                    <a href={`https://buy.stripe.com/eVa16W2JsesccmI4gq?client_reference_id=${address}_${user[0]}_${affID}`} alt="buy with Stripe" target="_blank" rel="noreferrer"><img className="stripe-badge-img" src={StripeBadge} alt="Buy NFT with Stripe" /></a>
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