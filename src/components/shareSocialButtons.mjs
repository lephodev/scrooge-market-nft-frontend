// import Countdown from 'react-countdown';
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from "react-share";
import { scroogeClient } from '../config/keys.js';

export default function ShareSocialButtons() {
    

    // function getCountdown(claimableIn){
    //   return (
    //     <Countdown date={claimableIn}></Countdown>
    //   )
    // }
    
    

  return (
    <div className="bordered-section">
        <div className="pageTitle">
          <h1>EARN FREE TOKENS</h1>
        </div>
        <div>
          <div className='social-share-card'>
            <TwitterShareButton
                url={scroogeClient}
                title="Come join me and WIN all kinds of awesome prizes at Scrooge Casino! Play Now 👉 ScroogeCasino.com #Play2Earn #ScroogeCasino @scrooge_coin @ScroogePoker"
                className="social-share-btn"
              >
                <TwitterIcon size={32} round />
            </TwitterShareButton>
            <div className='social-share-message'>
              Come join me and WIN all kinds of awesome prizes at Scrooge Casino! Play Now 👉 ScroogeCasino.com #Play2Earn #ScroogeCasino @scrooge_coin @ScroogePoker
            </div>
          </div>
          <div className='social-share-card'>
            <FacebookShareButton
              url={scroogeClient}
              quote="Come join me and WIN all kinds of awesome prizes at Scrooge Casino! Play Now 👉 ScroogeCasino.com #Play2Earn @scroogegold"
              className="social-share-btn"
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <div className='social-share-message'>
              Come join me and WIN all kinds of awesome prizes at Scrooge Casino! Play Now 👉 ScroogeCasino.com #Play2Earn @scroogegold
            </div>
          </div>

          
        </div>
    </div>
    
  );
}