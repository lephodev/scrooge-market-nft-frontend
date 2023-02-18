import {useEffect, useState} from 'react';
import Axios from 'axios';
import RobotAI from '../images/robotAI.gif'
import DiceGif from '../images/diceGif.gif'
import { TypeAnimation } from 'react-type-animation';
import LoadingPoker from '../images/scroogeHatLogo.png';

export default function AffiliateAITools(){
    let user_id;
    const [user, setUser]=useState([]);
    const [AISuggestion, setAISuggestion]=useState();
    const [showAITools, setShowAITools]=useState(true);
    const [suggestionLoading, setSuggestionLoading]=useState(false);

    async function getAISuggestion(){
        setAISuggestion();
        setSuggestionLoading(true);
        const prompt = "Give me one unique, new, or interesting tip on how to successfully promote my Scrooge Casino affiliate link to get more people to sign up or make purchases at Scrooge Casino, which is an online casino where players can win real prizes playing live poker, blackjack, slots, and other casino games.";
        try {
            Axios.get(`http://localhost:9001/api/getAIMessage/${prompt}/6399cb2354a1dd8bdd842a1a/suggestion`).then((data)=>{
                //console.log("setAISuggestion: ", data.data);
                //setAISuggestion(data.data);
                setAISuggestion(
                    <TypeAnimation sequence={[data.data]}
                        wrapper="span"
                        cursor={true}
                        />
                );
                setSuggestionLoading(false);
                return (
                    true
                );
            });
        } catch (err) {
            console.error(err);
        };
    }


    return (<>
    {(showAITools)?(

    
    <div className="bordered-section bg-animated" style={{marginBottom: '40px'}}>
        <div className='flex-row-no-margin'>
            {(showAITools==='jfkjdj')?(
                <div className='earn-free-tokens-desc-div-full bg-gray'>
                    <div className='earn-free-tokens-desc-header'>
                        LET'S ROLL THE DICE<br></br>
                        <img src={DiceGif} width="100px" alt="Scrooge Casino, Scrooge LLC" />
                    </div>
                    <div className='earn-free-tokens-desc'>
                        Click the button to have a message chosen for you at random.
                    </div>
                
                    <div className='social-share-filter-btns-div'>
                        
                        <button className='button1' onClick={()=>getAISuggestion()}>GIMME A MESSAGE!</button>
                    </div>
                    <div>
                        {(AISuggestion)?(
                            <>
                                <div className='social-share-card'>
                                    <div className='social-share-message'>{AISuggestion}</div>
                                    
                                    <div className='close-btn-round-div'>
                                        <div className='close-btn-round' onClick={() => setAISuggestion(null)}>X</div>
                                    </div>
                                </div>
                        </>):(<></>)}
                    </div>
                </div>
            ):(<></>)}
                

                <div className='earn-free-tokens-desc-div-full bg-gray'>
                    <div className='earn-free-tokens-desc-header'>
                     <span className='bg-animated' style={{padding: '0 15px', fontSize: '36px'}}>SCROOGE AFFILIATE TIPS WITH THE POWER OF AI!</span><br></br>
                        <img style={{marginTop: '20px'}} src={RobotAI} width="100px" alt="Scrooge Casino, Scrooge LLC" />
                    </div>
                    <div className='earn-free-tokens-desc' style={{fontSize: '20px', marginBottom: '10px', padding:'0 50px'}}>
                    <p>At <a href="https://scrooge.casino" target="_blank" rel="noreferrer" alt="Visit Scrooge Casino and play today">Scrooge Casino</a>, we understand the challenges that come with affiliate marketing and want to help you achieve your goals. 
                    That's why we've created an AI-powered platform that provides personalized affiliate marketing tips and strategies. </p>
                    </div>
                
                    
                    <div>
                        {(AISuggestion)?(
                            <>
                                <div className='social-share-card'>
                                    <div className='social-share-message'>{AISuggestion}</div>
                                    
                                    <div className='close-btn-round-div'>
                                        <div className='close-btn-round' style={{margin: '0 auto 30px auto'}} onClick={() => setAISuggestion(null)}>X</div>
                                    </div>
                                </div>
                        </>):(<></>)}
                    </div>
                    <div className='social-share-filter-btns-div' style={{marginTop: '20px'}}>
                        
                        {(suggestionLoading)?(<>
                            <img src={LoadingPoker} alt="game" className="imageAnimation" style={{width: '70px', height: '70px'}}/>
                        </>):(<>
                            <button className='button2 bg-animated' onClick={()=>getAISuggestion()}>GIVE ME A TIP!</button>
                        </>)}
                        
                    </div>
                    <div className='earn-free-tokens-desc' style={{fontSize: '16px', marginBottom: '10px', padding:'0 50px'}}>
                    <p>Our state-of-the-art technology offers tailored advice to help you maximize your earnings and grow your business. 
                    Whether you're just starting out or looking to take your Scrooge affiliate marketing efforts to the next level, we're here to help.</p>
                    </div>
                </div>
            </div>
        

    </div>
    ):(<></>)}
    </>);
}