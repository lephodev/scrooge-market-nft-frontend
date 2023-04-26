/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
// import { FacebookProvider, ShareButton } from 'react-facebook';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingPoker from "../images/scroogeHatLogo.png";
import DiceGif from "../images/diceGif.gif";
import AffiliateLeaderboard from "../components/AffiliateLeaderboard.mjs";
import profile from "../images/profile.png";
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
  WhatsappIcon,
  // PinterestShareCount,
  // FacebookShareCount,
} from "react-share";
import getAffiliateUser from "../scripts/getAffilateUser.mjs";
import { createAffiliateUser } from "../scripts/getAffilateUser.mjs";
import AuthContext from "../context/authContext.ts";
import { marketPlaceInstance } from "../config/axios.js";
import { scroogeClient } from "../config/keys.js";

export default function SharableData() {
  const { user,setUser } = useContext(AuthContext);
  console.log(setUser);
  const [affUser, setAffUser] = useState({});
  const [/* affUserID */, setAffUserID] = useState("");
  const [creatingAffUser, setCreatingAffUser] = useState(false);
  const [showAITools, setShowAITools] = useState(true);
  const [showSocialShare, setShowSocialShare] = useState(true);
  const [showAffLeaderboards, setShowAffLeaderboards] = useState(true);
  const [showDailyRewards, setShowDailyRewards] = useState(true);
  const [shareCount,setShareCount]=useState(0)

  const [/* allMessages */, setAllMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [randomMessage, setRandomMessage] = useState([]);
  const getMessages = () => {
    try {
      marketPlaceInstance()
        .get(`/getSharableMessages`)
        .then((data) => {
          console.log("shareableamessage", data);
          if (data.data.success) {
            setAllMessages(data.data.data);
            setMessages(data.data.data);
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  const getSocialShare=()=>{
    console.log("abvvv");
    try {
      marketPlaceInstance()
        .get(`/getSocialShare/${user?.id}`)
        .then((data) => {
          console.log("getSocialShare", data);
          if (data.data.success) {
            setShareCount(data?.data?.count)
          }
        });
        refreshAffData();

    } catch (err) {
      console.log({err});
    }

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

  // const shortLink = (link) => {
  //   const uri = "https://mozilla.org/?x=шеллы";
  //   const encoded = encodeURIComponent(uri);
  //   try {
  //     marketPlaceInstance()
  //       .get(`/getShortLink/${encoded}`)
  //       .then((data) => {
  //         //console.log("short link: ", data.data);
  //         return data.data;
  //       });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const filterMessages = (filterOn) => {
  //   if (allMessages.length > 2) {
  //     if (filterOn === "facebook") {
  //       setMessages(
  //         [...allMessages].filter((message) => message.target === "facebook")
  //       );
  //     } else if (filterOn === "twitter") {
  //       setMessages(
  //         [...allMessages].filter((message) => message.target === "twitter")
  //       );
  //     }
  //   }
  // };

  const getRandomMessage = () => {
    var randomValue = messages[Math.floor(Math.random() * messages.length)];
    setRandomMessage(randomValue);
    //console.log("rando: ", randomMessage);
  };

  const createAffUser = async (user_id) => {
    setCreatingAffUser(true);
    console.log("userid", user_id);
    await createAffiliateUser(user_id).then(async (affNew) => {
      console.log("affNew: ", affNew);
      await getAffiliateUser(user_id).then((aff) => {
        //console.log('user2: ', user_id);
        console.log("new aff user: ", aff);
        setAffUser(aff);
        setAffUserID(aff.user_id);
        //console.log('new created aff user: ', affUser);
        setCreatingAffUser(false);
        toast.success("You are now an affiliate! Congratulations! 🥳🥳🥳", {
          containerId: "aff-member",
        });
      });
    });
  };

  const refreshAffData = async () => {
    console.log("user?.id---->>>>", user);
    const getAff = await getAffiliateUser(user?.id);
    console.log("getAff000000000", getAff);
    setAffUser(getAff);
  };

  // const decrementAITickets = () => {
  //   affUser.data.ai_tickets = affUser?.data?.ai_tickets - 1;
  // };

  // async function getAIMessage() {
  //   setAIMessage([]);
  //   const prompt =
  //     "Give me a tweet about Scrooge Casino, an online casino where you can win awesome prizes playing live poker, blackjack, slots, and other games.";
  //   try {
  //     marketPlaceInstance()
  //       .get(`/getAIMessage/${prompt}/${user?.id}/message`)
  //       .then((data) => {
  //         //console.log("getAIMessage: ", data.data);
  //         affUser.data.ai_tickets = affUser?.data?.ai_tickets - 1;
  //         //setAIMessage(data.data);
  //         setAIMessage(
  //           <TypeAnimation
  //             sequence={[data.data + " #ScroogeCasino 👉"]}
  //             wrapper='span'
  //             cursor={true}
  //           />
  //         );
  //         //refreshAffData();

  //         return true;
  //       });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  useEffect(() => {
    getMessages();
    refreshAffData();
    getSocialShare()
  }, []);

  console.log("affUser", affUser);

  console.log("user>>>>", user);
  // const clickevt=(message_id)=>{
  //   console.count("ggg");
  //   try {
  //     marketPlaceInstance()
  //     .get(`/shareReward/${affUser?.data?.user_id}/${message_id}`)
  //       .then((data) => {
  //       console.log("shareableamessage", data);
  //       if (data.data.success) {
  //         console.log("userrrrr12",data?.data?.user);
  //         // data.data.user.id=data?.data?.user?._id
  //          setUser(data?.data?.user)
  //         getSocialShare()
  //         toast.error(data.data.message, {
  //           containerId: "aff-member",
  //            id: "A" 

  //         });
          
  //         // setAllMessages(data.data.data);
  //         // setMessages(data.data.data);
  //       }
  //     });
      
  //   } catch (error) {
      
  //   }
  // }
const CheckIfShow=(e)=>{
  console.log("after close popup",e);
}
// const handleFacebookShare=(message_id,userid,message)=> {
//   console.log("user,message",message_id,userid,message);
//   let url=`${scroogeClient}/?aff_id=${userid}`
//   FB.ui({
//     method: 'share',
//     href: url,
//   }, function(response) {
//     if (response && !response.error_code) {
//       console.log('Shared successfully on Facebook!');
//       clickevt(message_id)
//     } else {
//       console.log('Failed to share on Facebook.');
//     }
//   });
// }
const handleShareError = () => {
  console.log('Error sharing content');
};
  return (
    <>
      {creatingAffUser ? (
        <div className='pageImgContainer'>
          <img src={LoadingPoker} alt='game' className='imageAnimation' />
          <div className='loading-txt pulse'>
            CREATING YOUR AFFILIATE ACCOUNT...
          </div>
        </div>
      ) : (
        <></>
      )}

      {!showAffLeaderboards ||
      !showAITools ||
      !showSocialShare ||
      !showDailyRewards ? (
        <>
          <div className='min-menu-div'>
            {!showAITools ? (
              <>
                <div className='new-btn'>
                  <button
                    // className='min-menu-btn bg-animated'
                    onClick={() => {
                      setShowAITools(true);
                    }}>
                    AI TOOLS
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
            {!showDailyRewards ? (
              <>
                <div className='new-btn'>
                  <button
                    // className='min-menu-btn'
                    onClick={() => {
                      setShowDailyRewards(true);
                    }}>
                    DAILY REWARDS
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
            {!showAffLeaderboards ? (
              <>
                <div className='new-btn'>
                  <button
                    // className='min-menu-btn'
                    onClick={() => {
                      setShowAffLeaderboards(true);
                    }}>
                    LEADERBOARDS
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
            {!showSocialShare &&
            affUser?.message?.toString() !== "User not found." ? (
              <>
                <div className='new-btn'>
                  <button
                    // className='min-menu-btn'
                    onClick={() => {
                      setShowSocialShare(true);
                    }}>
                    SOCIAL SHARING
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}

      {affUser?.data?.user_id &&
      affUser?.message?.toString() !== "" &&
      affUser?.message?.toString() !== "User not found." ? (
        <div className='affiliate-card-div earn-affiliate-card'>
          <div className='affiliate-card-row'>
            <div className='earn-card-profile'>
              <div className='inlineTitle text-animate'>
                {user?.username}'s Affiliate Dashboard
              </div>
              <div>
                {console.log("userprofile---", user)}
                <img
                  className='wallet-casino-profile-img'
                  src={
                    user?.profile && user?.profile !== ""
                      ? user?.profile
                      : profile
                  }
                  alt='Scrooge-Casino-profile'
                />
              </div>
            </div>
            <div className='earn-card-box'>
              <div className='affiliate-card-row earn-card-row'>
                <div>
                  <p>
                    <strong>ID:</strong> {affUser?.data?.user_id}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Total Earned:</strong>{" "}
                    {affUser?.data?.total_earned > 0 ? (
                      affUser?.data?.total_earned
                    ) : (
                      <>0</>
                    )}{" "}
                    Tokens
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Last Commission Earned:</strong>{" "}
                    {affUser?.data?.last_earned_at ? (
                      affUser?.data?.last_earned_at.substring(
                        0,
                        affUser?.data?.last_earned_at.indexOf("T")
                      )
                    ) : (
                      <>Start earning today!</>
                    )}
                  </p>
                </div>
              </div>
              <div className='affiliate-card-row'>
                <div className='text-animate'>
                  <p>
                    {/* <strong>AI Tickets:</strong> {affUser?.data?.ai_tickets} */}
                  </p>
                </div>
                <div className='txt-align-center'>
                  <p>
                    <strong>Affiliate Link: </strong>
                    <a alt='Your affiliate link'>
                      {affUser?.data?.aff_short_link}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
{console.log("affUser?.message",affUser?.message)}
      {user && affUser?.message?.toString() === "User not found." ? (
        <div className='affiliate-card-div'>
          <div style={{ textAlign: "center" }}>
            Start earning <strong>FREE CASINO TOKENS</strong>
            <br></br>with one click!<br></br>👇👇👇<br></br>
            <div className='earn-affiliate-btn'>
              <button
                className='gradient-btn pulse'
                onClick={() => createAffUser(user?.id)}>
                Become an Affiliate
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {affUser?.message?.toString() === "" ? (
        <div className='affiliate-card-div'>
          <div className='pageTitle'>LOADING YOUR AFFILIATE DETAILS</div>
        </div>
      ) : (
        <></>
      )}
      {showAffLeaderboards ? (
        <>
          <div className='close-btn-round-div'>
            <div
              className='close-btn-round'
              style={{ width: "45px", marginTop: "0" }}
              onClick={() => setShowAffLeaderboards(false)}>
              X
            </div>
          </div>
          <AffiliateLeaderboard />
        </>
      ) : (
        <></>
      )}

      {/* {showAITools ? (
        <>
          <div className='close-btn-round-div'>
            <div
              className='close-btn-round'
              style={{ width: "45px", marginTop: "0" }}
              onClick={() => setShowAITools(false)}>
              X
            </div>
          </div>
          <AffiliateAITools />
        </>
      ) : (
        <></>
      )} */}

      {showSocialShare && affUser?.message?.toString() !== "User not found." ? (
        <>
          <div className='close-btn-round-div'>
            <div
              className='close-btn-round'
              style={{ width: "45px", marginTop: "0" }}
              onClick={() => setShowSocialShare(false)}>
              X
            </div>
          </div>
          <div className='bordered-section'>
            <div className='pageTitless' style={{ marginBottom: "20px" }}>
              <div className='text-animate'>
                <h1>EARN FREE TOKENS</h1>
              </div>
            </div>
            <div className='flex-row'>
              <div className='earn-free-tokens-desc-div'>
                <div className='earn-free-tokens-desc-header'>
                  <h4> LET'S ROLL THE DICE</h4>
                  <img
                    src={DiceGif}
                    width='100px'
                    alt='Scrooge Casino, Scrooge LLC'
                  />
                </div>
                <div className='earn-free-tokens-desc'>
                  Click the button to have a message chosen for you at random.
                </div>

                <div className='social-share-filter-btns-div'>
                  <div className='new-btn'>
                    <button
                      // className='btn btn-new'
                      onClick={() => getRandomMessage()}>
                      GIMME A MESSAGE!
                    </button>
                  </div>
                </div>
                <div>
                  {randomMessage.message ? (
                    <>
                      <div className='social-share-grid-box'>
                        <div className='social-share-card'>
                          {/* <div className='card-color' /> */}
                          <div className='social-share-message'>
                            {randomMessage.message}{" "}
                            <a
                              href={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}>{`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}</a>
                          </div>
                          <div className='social-share-btn-div'>
                          <span /* onClick={()=>clickevt(randomMessage._id)} */ >
                            <FacebookShareButton
                              disabled={shareCount===20}
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              quote={randomMessage.message}
                              className='social-share-btn'>
                              <FacebookIcon size={40} round />
                            </FacebookShareButton>
                            </span>
                            <span /* onClick={()=>clickevt(randomMessage._id)} */ >
                            <TwitterShareButton
                            disabled={shareCount===20}
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              title={randomMessage.message}
                              className='social-share-btn'>
                              <TwitterIcon size={40} round />
                            </TwitterShareButton>
                            </span>
                            <span /* onClick={()=>clickevt(randomMessage._id)} */ >
                            <PinterestShareButton
                            disabled={shareCount===20}
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              description={randomMessage.message}
                              media='https://casino-nft-marketplace.s3.amazonaws.com/affPinterest.jpg'
                              className='social-share-btn'>
                              <PinterestIcon size={40} round />
                            </PinterestShareButton>
                            </span>
                            <span /* onClick={()=>clickevt(randomMessage._id)} */ >
                            <TumblrShareButton
                            disabled={shareCount===20}
                              title={randomMessage.message}
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              caption='Join me for free at Scrooge Casino and WIN REAL PRIZES!'
                              className='social-share-btn'>
                              <TumblrIcon size={40} round />
                            </TumblrShareButton>
                            </span>
                            <span /* onClick={()=>clickevt(randomMessage._id)} */ >
                            <TelegramShareButton
                            disabled={shareCount===20}
                              url={`${scroogeClient}/?aff_id=${affUser?.data.user_id}`}
                              title={randomMessage.message}
                              className='social-share-btn'>
                              <TelegramIcon size={40} round />
                            </TelegramShareButton>
                            </span>
                            <span /* onClick={()=>clickevt(randomMessage._id)}  */>
                            <WhatsappShareButton
                            disabled={shareCount===20}
                              title={randomMessage.message}
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              className='social-share-btn'>
                              <WhatsappIcon size={40} round />
                            </WhatsappShareButton>
                            </span>
                            <span /* onClick={()=>clickevt(randomMessage._id)} */ >
                            <EmailShareButton
                            disabled={shareCount===20}
                              subject={randomMessage.message}
                              body={randomMessage.message}
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}
                                            
                                            `}
                              className='social-share-btn'>
                              <EmailIcon size={40} round />
                            </EmailShareButton>
                            </span>
                          </div>
                          <div className='close-btn-round-div'>
                            <div
                              className='close-btn-round'
                              style={{ margin: "0 auto 30px auto" }}
                              onClick={() => setRandomMessage([])}>
                              X
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              {affUser?.data?.ai_tickets < 1 ? <></> : <></>}
            </div>
            <div>
              <div
                className=' txt-align-center text-animate'
                style={{ marginBottom: "40px" }}>
                <h1> 👇 Pre-made messages ready for you to share! 👇</h1>
              </div>

              {messages.length > 0 ? (
                <>
                  <div className='social-share-grid'>
                    {messages.map((message) => (
                      <div className='social-share-card' key={message._id}>
                        <div className='card-color' />
                        <div className='social-share-message'>
                          {message.message}
                          {/* {console.log("messaddadad---->>>",message)} */}
                        </div>
                        <div className='social-share-btn-div' >
                          <div /* onClick={()=>clickevt(message._id)} */>
                          
                          {/* <FacebookProvider appId={590649203004238}>
                          
                            <ShareButton className={shareCount===20 ? "shareBtn-disabled" : ""} href={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`} onClick={()=>handleFacebookShare(message._id,affUser?.data?.user_id,message.message)}>
                              <FacebookSVG/>
                            </ShareButton>
                          </FacebookProvider> */}
                          <FacebookShareButton
                          // onClick={handleFacebookShare}
                          disabled={shareCount===20}
                            url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                            quote={message.message}
                            
                            onShareError={()=>handleShareError()}
                            onShareWindowClose={(e)=>CheckIfShow(e)}
                            className='social-share-btn'>
                            <FacebookIcon size={40} round />
                            
                          </FacebookShareButton>
                          </div>
                          {/* <PinterestShareCount url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`} /> */}
                      
                          
                          <div /* onClick={()=>clickevt(message._id)} */ >
                          <TwitterShareButton
                          disabled={shareCount===20}
                            url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                            title={message.message}
                            className='social-share-btn'>
                            <TwitterIcon size={40} round />
                          </TwitterShareButton>
                          </div>
                          <div /* onClick={()=>clickevt(message._id)} */ >
                          <PinterestShareButton
                          disabled={shareCount===20}
                            url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                            description={message.message}
                            media='https://casino-nft-marketplace.s3.amazonaws.com/affPinterest.jpg'
                            className='social-share-btn'>
                            <PinterestIcon size={40} round />
                          </PinterestShareButton>
                          </div>
                          <div /* onClick={()=>clickevt(message._id)} */ >
                          <TumblrShareButton
                          disabled={shareCount===20}
                            title={message.message}
                            url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                            caption='Join me for free at Scrooge Casino and WIN REAL PRIZES!'
                            className='social-share-btn'>
                            <TumblrIcon size={40} round />
                          </TumblrShareButton>
                          </div>
                          <div /* onClick={()=>clickevt(message._id)} */ >
                          <TelegramShareButton
                          disabled={shareCount===20}
                            url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                            title={message.message}
                            className='social-share-btn'>
                            <TelegramIcon size={40} round />
                          </TelegramShareButton>
                          </div>
                          <div /* onClick={()=>clickevt(message._id)} */ >
                          <WhatsappShareButton
                          disabled={shareCount===20}
                            title={message.message}
                            url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                            className='social-share-btn'>
                            <WhatsappIcon size={40} round />
                          </WhatsappShareButton>
                          </div>
                          <div /* onClick={()=>clickevt(message._id)} */ >
                          <EmailShareButton
                          disabled={shareCount===20}
                            subject={message.message}
                            body={message.message}
                            url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}
                                    
                                    `}
                            className='social-share-btn'>
                            <EmailIcon size={40} round />
                          </EmailShareButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ width: "100%", textAlign: "center" }}>
                  Messages loading...<br></br>
                  <img
                    src={LoadingPoker}
                    alt='game'
                    className='imageAnimation'
                  />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}


// const FacebookSVG = () => {
//   return (
//     <svg width="45px" height="45px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <circle cx="24" cy="24" r="20" fill="#3B5998"/>
//     <path fill-rule="evenodd" clip-rule="evenodd" d="M29.315 16.9578C28.6917 16.8331 27.8498 16.74 27.3204 16.74C25.8867 16.74 25.7936 17.3633 25.7936 18.3607V20.1361H29.3774L29.065 23.8137H25.7936V35H21.3063V23.8137H19V20.1361H21.3063V17.8613C21.3063 14.7453 22.7708 13 26.4477 13C27.7252 13 28.6602 13.187 29.8753 13.4363L29.315 16.9578Z" fill="white"/>
//     </svg>
//   )
// }

