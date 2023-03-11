import {useContext, useEffect, useState} from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingPoker from '../images/scroogeHatLogo.png';
import RobotAI from '../images/robotAI.gif'
import DiceGif from '../images/diceGif.gif'
import AffiliateLeaderboard from '../components/AffiliateLeaderboard.mjs';
import { TypeAnimation } from 'react-type-animation';
import AffiliateAITools from './AffiliateAITools.mjs';
import DailyRewards from '../components/DailyRewards.mjs';
import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  PinterestIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  WhatsappIcon
} from "react-share";
import getAffiliateUser from '../scripts/getAffilateUser.mjs';
import {createAffiliateUser} from '../scripts/getAffilateUser.mjs';
import AuthContext from '../context/authContext.ts';

export default function SharableData(){
   const { user } = useContext(AuthContext);
    const [affUser, setAffUser]=useState([]);
    const [affUserID, setAffUserID]=useState('');
    const [creatingAffUser, setCreatingAffUser]=useState(false);
    const [showAITools, setShowAITools]=useState(true);
    const [showSocialShare, setShowSocialShare]=useState(true);
    const [showAffLeaderboards, setShowAffLeaderboards]=useState(true);
    const [showDailyRewards, setShowDailyRewards]=useState(true);
    function notify(message) {
        toast.success('🎩 '+message);
      }; 
   
    
    const [allMessages, setAllMessages]=useState([]);
    const [messages, setMessages]=useState([]);
    const [randomMessage, setRandomMessage]=useState([]);
    const getMessages = () => {
        try {
            Axios.get(`https://34.237.237.45:9001/api/getSharableMessages`).then((data)=>{
                setAllMessages(data.data);  
                setMessages(data.data);  
            });
        } catch (err) {
            console.error(err);
        };
    }

    /*const sendEmail = () => {
        try {
            Axios.get(`https://34.237.237.45:9001/api/sendEmail/bradyllewis@gmail.com/ScroogeSubject/WelcomeToTheJungle`).then((data)=>{
                //console.log("send email data: ", data.data);
            });
        } catch (err) {
            console.error(err);
        };
    }*/

    const shortLink = (link) => {
        const uri = 'https://mozilla.org/?x=шеллы';
        const encoded = encodeURIComponent(uri);
        try {
            Axios.get(`https://34.237.237.45:9001/api/getShortLink/${encoded}`).then((data)=>{
                //console.log("short link: ", data.data);
                return data.data;
            });
        } catch (err) {
            console.error(err);
        };
    }
    
    const filterMessages = (filterOn) => {
        if(allMessages.length > 2){
            if (filterOn === 'facebook') {
                setMessages([...allMessages].filter(message => message.target === 'facebook'));
            } else if (filterOn === 'twitter') {
                setMessages([...allMessages].filter(message => message.target === 'twitter'));
            }
        }
    }

    const getRandomMessage = () => {
        
        var randomValue = messages[Math.floor(Math.random() * messages.length)];
        setRandomMessage(randomValue);
        //console.log("rando: ", randomMessage);
    }

    const createAffUser = async (user_id) => {
        setCreatingAffUser(true);
        const createdAffUser = await createAffiliateUser(user_id).then(async (affNew)=>{
            //console.log('affNew: ', affNew);
            const getAff = await getAffiliateUser(user_id).then((aff)=>{
                //console.log('user2: ', user_id);
                //console.log('new aff user: ', aff);
                setAffUser(aff);
                setAffUserID(aff.user_id);
                //console.log('new created aff user: ', affUser);
                setCreatingAffUser(false);
                notify('You are now an affiliate! Congratulations! 🥳🥳🥳');
            });
        });
        
    }

    const refreshAffData = async () => {
        const getAff = await getAffiliateUser(user[0]);
        setAffUser(getAff);
    }

    const decrementAITickets = () => {
        affUser.ai_tickets = affUser.ai_tickets - 1;
    }

    const [AIMessage, setAIMessage]=useState();
    async function getAIMessage(){
        setAIMessage([]);
        const prompt = "Give me a tweet about Scrooge Casino, an online casino where you can win awesome prizes playing live poker, blackjack, slots, and other games.";
        try {
            Axios.get(`https://34.237.237.45:9001/api/getAIMessage/${prompt}/${user[0]}/message`).then((data)=>{
                //console.log("getAIMessage: ", data.data);
                affUser.ai_tickets = affUser.ai_tickets - 1;
                //setAIMessage(data.data);
                setAIMessage(
                    <TypeAnimation sequence={[data.data+ ' #ScroogeCasino 👉']}
                        wrapper="span"
                        cursor={true}
                        />
                );
                //refreshAffData();

                return (
                    true
                );
            });
        } catch (err) {
            console.error(err);
        };
    }


    useEffect(() => {
        getMessages();
      }, []);

    return (<>
    
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
        {(creatingAffUser) ? (<div className="pageImgContainer">
            <img src={LoadingPoker} alt="game" className="imageAnimation" />
            <div className='loading-txt pulse'>
                CREATING YOUR AFFILIATE ACCOUNT...
            </div>
        </div>) : (<></>)}
        
        {(!showAffLeaderboards || !showAITools || !showSocialShare || !showDailyRewards)?(<>
                <div className="min-menu-div">
                {(!showAITools)?(<><button className="min-menu-btn bg-animated" onClick={()=>{setShowAITools(true)}}>AI TOOLS</button></>):(<></>)}
                {(!showDailyRewards)?(<><button className="min-menu-btn" onClick={()=>{setShowDailyRewards(true)}}>DAILY REWARDS</button></>):(<></>)}
                {(!showAffLeaderboards)?(<><button className="min-menu-btn" onClick={()=>{setShowAffLeaderboards(true)}}>LEADERBOARDS</button></>):(<></>)}
                {(!showSocialShare)?(<><button className="min-menu-btn" onClick={()=>{setShowSocialShare(true)}}>SOCIAL SHARING</button></>):(<></>)}
                </div>
            </>):(<></>)}

            
        {(affUser.user_id && (affUser.toString() !== '') && (affUser.toString() !== 'User not found.'))?(
            <div className='affiliate-card-div' style={{backgroundColor: '#1b2129'}}>
                <div className='affiliate-card-row'>
                    <div style={{textAlign: 'center'}}>
                        <div className='inlineTitle'>{user[1]}'s Affiliate Dashboard</div>
                        <div style={{marginTop: '15px'}}><img className="wallet-casino-profile-img" src={user[4]} alt="Scrooge Casino profile picture" /></div>
                    </div>
                    <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignSelf: 'center'}}>
                        <div className='affiliate-card-row'>
                            <div><strong>ID:</strong> {affUser.user_id}</div>
                            <div><strong>Total Earned:</strong> {(affUser.total_earned > 0)?(affUser.total_earned):(<>0</>)} Tokens</div>
                            <div><strong>Last Commission Earned:</strong> {(affUser.last_earned_at)?(affUser.last_earned_at.substring(0, affUser.last_earned_at.indexOf("T"))):(<>Start earning today!</>)}</div>
                        </div>
                        <div className='affiliate-card-row'>
                            <div className='bg-animated' style={{borderRadius: '5px', padding: '5px 25px'}}><strong>AI Tickets:</strong> {affUser.ai_tickets}</div>
                            <div className='txt-align-center'><strong>Affiliate Link: </strong><a href={affUser.aff_short_link} alt="Your affiliate link">{affUser.aff_short_link}</a></div>
                        </div>
                    </div>
                        
                </div>
                
            </div>):(<></>)}

        {(affUser.toString() === 'User not found.' && user[0])?(<div className='affiliate-card-div'>
            <div style={{textAlign: "center"}}>Start earning <strong>FREE CASINO TOKENS</strong><br></br>with one click!<br></br>👇👇👇<br></br>
            <button className='submit-btn pulse' onClick={()=>createAffUser(user[0])}>Become an Affiliate</button></div>
            </div>):(<></>)}

        {(affUser.toString() === '')?(<div className='affiliate-card-div'>
            <div className='pageTitle'>
            LOADING YOUR AFFILIATE DETAILS
                </div>
            
            </div>):(<></>)}

            {(showDailyRewards)?(<>
                <div className='close-btn-round-div'>
                    <div className='close-btn-round' style={{width: '45px', marginTop: '0'}} onClick={() => setShowDailyRewards(false)}>X</div>
                </div>
                <DailyRewards /></>):(<></>)}

            
            {(showAffLeaderboards)?(<>
                <div className='close-btn-round-div'>
                    <div className='close-btn-round' style={{width: '45px', marginTop: '0'}} onClick={() => setShowAffLeaderboards(false)}>X</div>
                </div>
                <AffiliateLeaderboard /></>):(<></>)}

            
            {(showAITools)?(<>
                <div className='close-btn-round-div'>
                    <div className='close-btn-round' style={{width: '45px', marginTop: '0'}} onClick={() => setShowAITools(false)}>X</div>
                </div>
                <AffiliateAITools /></>):(<></>)}

            

        {(showSocialShare)?(<> 
            <div className='close-btn-round-div'>
                <div className='close-btn-round' style={{width: '45px', marginTop: '0'}} onClick={() => setShowSocialShare(false)}>X</div>
            </div>
        <div className="bordered-section">
            
            <div className="pageTitle" style={{marginBottom: "20px"}}>
                <h1>EARN FREE TOKENS</h1>
            </div>
            <div className='flex-row'>
                <div className='earn-free-tokens-desc-div'>
                    <div className='earn-free-tokens-desc-header'>
                        LET'S ROLL THE DICE<br></br>
                        <img src={DiceGif} width="100px" alt="Scrooge Casino, Scrooge LLC" />
                    </div>
                    <div className='earn-free-tokens-desc'>
                        Click the button to have a message chosen for you at random.
                    </div>
                
                    <div className='social-share-filter-btns-div'>
                        
                        <button className='button2' onClick={()=>getRandomMessage()}>GIMME A MESSAGE!</button>
                    </div>
                    <div>
                        {(randomMessage.message)?(
                            <>
                                <div className='social-share-card'>
                                    <div className='social-share-message'>{randomMessage.message} <a href={`https://Scrooge.Casino/?aff_id=${affUser.user_id}`}>{`Scrooge.Casino/?aff_id=${affUser.user_id}`}</a></div>
                                    <div className='social-share-btn-div'>
                                        <FacebookShareButton
                                            url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                            quote={randomMessage.message}
                                            className="social-share-btn"
                                        >
                                            <FacebookIcon size={40} round />
                                        </FacebookShareButton>
                                        <TwitterShareButton
                                            url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                            title={randomMessage.message}
                                            className="social-share-btn"
                                        >
                                            <TwitterIcon size={40} round />
                                        </TwitterShareButton>
                                        <PinterestShareButton
                                            url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                            description={randomMessage.message}
                                            media="https://casino-nft-marketplace.s3.amazonaws.com/affPinterest.jpg"
                                            className="social-share-btn"
                                        >
                                            <PinterestIcon size={40} round />
                                        </PinterestShareButton>
                                        <TumblrShareButton
                                            title={randomMessage.message}
                                            url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                            caption="Join me for free at Scrooge Casino and WIN REAL PRIZES!"
                                            className="social-share-btn"
                                        >
                                            <TumblrIcon size={40} round />
                                        </TumblrShareButton>
                                        <TelegramShareButton
                                            url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                            title={randomMessage.message}
                                            className="social-share-btn"
                                        >
                                            <TelegramIcon size={40} round />
                                        </TelegramShareButton>
                                        <WhatsappShareButton
                                            title={randomMessage.message}
                                            url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                            className="social-share-btn"
                                        >
                                            <WhatsappIcon size={40} round />
                                        </WhatsappShareButton>
                                        <EmailShareButton
                                            subject={randomMessage.message}
                                            body={randomMessage.message}
                                            url={`https://Scrooge.Casino/?aff_id=${affUser.user_id}
                                            
                                            `}
                                            className="social-share-btn"
                                        >
                                            <EmailIcon size={40} round />
                                        </EmailShareButton>
                                    </div>
                                    <div className='close-btn-round-div'>
                                        <div className='close-btn-round' style={{margin: '0 auto 30px auto'}} onClick={() => setRandomMessage([])}>X</div>
                                    </div>
                                </div>
                        </>):(<></>)}
                    </div>
                </div>

                {(affUser.ai_tickets<1)?(<></>):(<></>)}
                <div className='earn-free-tokens-desc-div bg-animated'>
                    <div className='earn-free-tokens-desc-header'>
                        STEP INTO THE FUTURE<br></br>
                        <img src={RobotAI} width="100px" alt="Scrooge Casino, Scrooge LLC" />
                    </div>
                    <div className='earn-free-tokens-desc'>
                        Want a new message to use with your affiliate link but don't want to use any brain power? Let our AI write up a custom post just for you!
                    </div>
                
                    <div className='social-share-filter-btns-div'>
                        
                        <button className='button2' onClick={()=>getAIMessage()}>CREATE A MESSAGE!</button>
                    </div>
                    <div>
                        {(AIMessage)?(
                            <>
                                <div className='social-share-card'>
                                    <div className='social-share-message'>{AIMessage} <a href={`https://Scrooge.Casino/?aff_id=${affUser.user_id}`}>{`Scrooge.Casino/?aff_id=${affUser.user_id}`}</a></div>
                                    <div className='social-share-btn-div'>
                                        <FacebookShareButton
                                            url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                            quote={randomMessage.message}
                                            className="social-share-btn"
                                        >
                                            <FacebookIcon size={40} round />
                                        </FacebookShareButton>
                                        <TwitterShareButton
                                            url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                            title={randomMessage.message}
                                            className="social-share-btn"
                                        >
                                            <TwitterIcon size={40} round />
                                        </TwitterShareButton>
                                        <PinterestShareButton
                                            url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                            description={randomMessage.message}
                                            media="https://casino-nft-marketplace.s3.amazonaws.com/affPinterest.jpg"
                                            className="social-share-btn"
                                        >
                                            <PinterestIcon size={40} round />
                                        </PinterestShareButton>
                                        <TumblrShareButton
                                            title={randomMessage.message}
                                            url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                            caption="Join me for free at Scrooge Casino and WIN REAL PRIZES!"
                                            className="social-share-btn"
                                        >
                                            <TumblrIcon size={40} round />
                                        </TumblrShareButton>
                                        <TelegramShareButton
                                            url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                            title={randomMessage.message}
                                            className="social-share-btn"
                                        >
                                            <TelegramIcon size={40} round />
                                        </TelegramShareButton>
                                        <WhatsappShareButton
                                            title={randomMessage.message}
                                            url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                            className="social-share-btn"
                                        >
                                            <WhatsappIcon size={40} round />
                                        </WhatsappShareButton>
                                        <EmailShareButton
                                            subject={randomMessage.message}
                                            body={randomMessage.message}
                                            url={`https://Scrooge.Casino/?aff_id=${affUser.user_id}
                                            
                                            `}
                                            className="social-share-btn"
                                        >
                                            <EmailIcon size={40} round />
                                        </EmailShareButton>
                                    </div>
                                    <div className='close-btn-round-div'>
                                        <div className='close-btn-round'  style={{margin: '0 auto 30px auto'}} onClick={() => setAIMessage()}>X</div>
                                    </div>
                                </div>
                        </>):(<></>)}
                    </div>
                </div>
            </div>
            <div>
                <div className="inlineTitle txt-align-center" style={{marginBottom: '25px'}}>👇 Pre-made messages ready for you to share! 👇</div>
                {(messages.length>2)?(
                    <>{messages.map((message) => (
                        <div className='social-share-card' key={message._id}>
                            <div className='social-share-message'>{message.message}</div>
                            <div className='social-share-btn-div'>
                                <FacebookShareButton
                                    url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                    quote={message.message}
                                    className="social-share-btn"
                                >
                                    <FacebookIcon size={40} round />
                                </FacebookShareButton>
                                <TwitterShareButton
                                    url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                    title={message.message}
                                    className="social-share-btn"
                                >
                                    <TwitterIcon size={40} round />
                                </TwitterShareButton>
                                <PinterestShareButton
                                    url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                    description={message.message}
                                    media="https://casino-nft-marketplace.s3.amazonaws.com/affPinterest.jpg"
                                    className="social-share-btn"
                                >
                                    <PinterestIcon size={40} round />
                                </PinterestShareButton>
                                <TumblrShareButton
                                    title={message.message}
                                    url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                    caption="Join me for free at Scrooge Casino and WIN REAL PRIZES!"
                                    className="social-share-btn"
                                >
                                    <TumblrIcon size={40} round />
                                </TumblrShareButton>
                                <TelegramShareButton
                                    url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                    title={message.message}
                                    className="social-share-btn"
                                >
                                    <TelegramIcon size={40} round />
                                </TelegramShareButton>
                                <WhatsappShareButton
                                    title={message.message}
                                    url={`Scrooge.Casino/?aff_id=${affUser.user_id}`}
                                    className="social-share-btn"
                                >
                                    <WhatsappIcon size={40} round />
                                </WhatsappShareButton>
                                <EmailShareButton
                                    subject={message.message}
                                    body={message.message}
                                    url={`https://Scrooge.Casino/?aff_id=${affUser.user_id}
                                    
                                    `}
                                    className="social-share-btn"
                                >
                                    <EmailIcon size={40} round />
                                </EmailShareButton>
                            </div>
                            
                            
                        </div>
                        )
                    )}
                </>):(<div style={{width: "100%", textAlign: "center"}}>Messages loading...<br></br><img src={LoadingPoker} alt="game" className="imageAnimation" /></div>)}
            </div>
        </div>
        </>):(<></>)}
    </>);
};