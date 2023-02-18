import {useContext, useEffect, useState} from 'react';
import Countdown from 'react-countdown';
import {
  EmailShareButton,
  FacebookShareButton,
  FacebookMessengerShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  LinkedinIcon,
  PinterestIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  WhatsappIcon
} from "react-share";

export default function ShareSocialButtons() {
    

    function getCountdown(claimableIn){
      return (
        <Countdown date={claimableIn}></Countdown>
      )
    }
    
    

  return (
    <div className="bordered-section">
        <div className="pageTitle">
          <h1>EARN FREE TOKENS</h1>
        </div>
        <div>
          <div className='social-share-card'>
            <TwitterShareButton
                url="https://scrooge.casino"
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
              url="https://scrooge.casino"
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