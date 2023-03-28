import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingPoker from "../images/scroogeHatLogo.png";
import RobotAI from "../images/robotAI.gif";
import DiceGif from "../images/diceGif.gif";
import AffiliateLeaderboard from "../components/AffiliateLeaderboard.mjs";
import { TypeAnimation } from "react-type-animation";
import AffiliateAITools from "./AffiliateAITools.mjs";
import DailyRewards from "../components/DailyRewards.mjs";
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
  PinterestShareCount,
} from "react-share";
import getAffiliateUser from "../scripts/getAffilateUser.mjs";
import { createAffiliateUser } from "../scripts/getAffilateUser.mjs";
import AuthContext from "../context/authContext.ts";
import { marketPlaceInstance } from "../config/axios.js";
import { scroogeClient } from "../config/keys.js";

export default function SharableData() {
  const { user } = useContext(AuthContext);
  const [affUser, setAffUser] = useState({});
  const [affUserID, setAffUserID] = useState("");
  const [creatingAffUser, setCreatingAffUser] = useState(false);
  const [showAITools, setShowAITools] = useState(true);
  const [showSocialShare, setShowSocialShare] = useState(true);
  const [showAffLeaderboards, setShowAffLeaderboards] = useState(true);
  const [showDailyRewards, setShowDailyRewards] = useState(true);

  const [allMessages, setAllMessages] = useState([]);
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
    const uri = "https://mozilla.org/?x=шеллы";
    const encoded = encodeURIComponent(uri);
    try {
      marketPlaceInstance()
        .get(`/getShortLink/${encoded}`)
        .then((data) => {
          //console.log("short link: ", data.data);
          return data.data;
        });
    } catch (err) {
      console.error(err);
    }
  };

  const filterMessages = (filterOn) => {
    if (allMessages.length > 2) {
      if (filterOn === "facebook") {
        setMessages(
          [...allMessages].filter((message) => message.target === "facebook")
        );
      } else if (filterOn === "twitter") {
        setMessages(
          [...allMessages].filter((message) => message.target === "twitter")
        );
      }
    }
  };

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
    console.log("user?.id---->>>>", user?.id);
    const getAff = await getAffiliateUser(user?.id);
    console.log("getAff000000000", getAff);
    setAffUser(getAff);
  };

  const decrementAITickets = () => {
    affUser.data.ai_tickets = affUser?.data?.ai_tickets - 1;
  };

  const [AIMessage, setAIMessage] = useState();
  async function getAIMessage() {
    setAIMessage([]);
    const prompt =
      "Give me a tweet about Scrooge Casino, an online casino where you can win awesome prizes playing live poker, blackjack, slots, and other games.";
    try {
      marketPlaceInstance()
        .get(`/getAIMessage/${prompt}/${user?.id}/message`)
        .then((data) => {
          //console.log("getAIMessage: ", data.data);
          affUser.data.ai_tickets = affUser?.data?.ai_tickets - 1;
          //setAIMessage(data.data);
          setAIMessage(
            <TypeAnimation
              sequence={[data.data + " #ScroogeCasino 👉"]}
              wrapper='span'
              cursor={true}
            />
          );
          //refreshAffData();

          return true;
        });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getMessages();
    refreshAffData();
  }, []);

  console.log("affUser", affUser);

  console.log("user>>>>", user);

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
                <button
                  className='min-menu-btn bg-animated'
                  onClick={() => {
                    setShowAITools(true);
                  }}
                >
                  AI TOOLS
                </button>
              </>
            ) : (
              <></>
            )}
            {!showDailyRewards ? (
              <>
                <button
                  className='min-menu-btn'
                  onClick={() => {
                    setShowDailyRewards(true);
                  }}
                >
                  DAILY REWARDS
                </button>
              </>
            ) : (
              <></>
            )}
            {!showAffLeaderboards ? (
              <>
                <button
                  className='min-menu-btn'
                  onClick={() => {
                    setShowAffLeaderboards(true);
                  }}
                >
                  LEADERBOARDS
                </button>
              </>
            ) : (
              <></>
            )}
            {!showSocialShare ? (
              <>
                <button
                  className='min-menu-btn'
                  onClick={() => {
                    setShowSocialShare(true);
                  }}
                >
                  SOCIAL SHARING
                </button>
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
                <img
                  className='wallet-casino-profile-img'
                  src={user?.profile}
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
                    <strong>AI Tickets:</strong> {affUser?.data?.ai_tickets}
                  </p>
                </div>
                <div className='txt-align-center'>
                  <p>
                    <strong>Affiliate Link: </strong>
                    <a
                      href={affUser?.data?.aff_short_link}
                      alt='Your affiliate link'
                    >
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

      {user && !affUser?.message?.toString() === "User not found." ? (
        <div className='affiliate-card-div'>
          <div style={{ textAlign: "center" }}>
            Start earning <strong>FREE CASINO TOKENS</strong>
            <br></br>with one click!<br></br>👇👇👇<br></br>
            <div className='earn-affiliate-btn'>
              <button
                className='gradient-btn pulse'
                onClick={() => createAffUser(user?.id)}
              >
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
      {console.log(affUser?.success)}
      {user && affUser?.success && showDailyRewards ? (
        <>
          <div className='close-btn-round-div'>
            <div
              className='close-btn-round'
              style={{ width: "45px", marginTop: "0" }}
              onClick={() => setShowDailyRewards(false)}
            >
              X
            </div>
          </div>
          <DailyRewards />
        </>
      ) : (
        <></>
      )}

      {showAffLeaderboards ? (
        <>
          <div className='close-btn-round-div'>
            <div
              className='close-btn-round'
              style={{ width: "45px", marginTop: "0" }}
              onClick={() => setShowAffLeaderboards(false)}
            >
              X
            </div>
          </div>
          <AffiliateLeaderboard />
        </>
      ) : (
        <></>
      )}

      {showAITools ? (
        <>
          <div className='close-btn-round-div'>
            <div
              className='close-btn-round'
              style={{ width: "45px", marginTop: "0" }}
              onClick={() => setShowAITools(false)}
            >
              X
            </div>
          </div>
          <AffiliateAITools />
        </>
      ) : (
        <></>
      )}

      {showSocialShare ? (
        <>
          <div className='close-btn-round-div'>
            <div
              className='close-btn-round'
              style={{ width: "45px", marginTop: "0" }}
              onClick={() => setShowSocialShare(false)}
            >
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
                      onClick={() => getRandomMessage()}
                    >
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
                              href={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                            >{`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}</a>
                          </div>
                          <div className='social-share-btn-div'>
                            <FacebookShareButton
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              quote={randomMessage.message}
                              className='social-share-btn'
                            >
                              <FacebookIcon size={40} round />
                            </FacebookShareButton>
                            <TwitterShareButton
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              title={randomMessage.message}
                              className='social-share-btn'
                            >
                              <TwitterIcon size={40} round />
                            </TwitterShareButton>
                            <PinterestShareButton
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              description={randomMessage.message}
                              media='https://casino-nft-marketplace.s3.amazonaws.com/affPinterest.jpg'
                              className='social-share-btn'
                            >
                              <PinterestIcon size={40} round />
                            </PinterestShareButton>
                            <TumblrShareButton
                              title={randomMessage.message}
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              caption='Join me for free at Scrooge Casino and WIN REAL PRIZES!'
                              className='social-share-btn'
                            >
                              <TumblrIcon size={40} round />
                            </TumblrShareButton>
                            <TelegramShareButton
                              url={`${scroogeClient}/?aff_id=${affUser?.data.user_id}`}
                              title={randomMessage.message}
                              className='social-share-btn'
                            >
                              <TelegramIcon size={40} round />
                            </TelegramShareButton>
                            <WhatsappShareButton
                              title={randomMessage.message}
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              className='social-share-btn'
                            >
                              <WhatsappIcon size={40} round />
                            </WhatsappShareButton>
                            <EmailShareButton
                              subject={randomMessage.message}
                              body={randomMessage.message}
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}
                                            
                                            `}
                              className='social-share-btn'
                            >
                              <EmailIcon size={40} round />
                            </EmailShareButton>
                          </div>
                          <div className='close-btn-round-div'>
                            <div
                              className='close-btn-round'
                              style={{ margin: "0 auto 30px auto" }}
                              onClick={() => setRandomMessage([])}
                            >
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
              <div className='earn-free-tokens-desc-div '>
                <div className='earn-free-tokens-desc-header'>
                  <h4> STEP INTO THE FUTURE</h4>
                  <img
                    src={RobotAI}
                    width='100px'
                    alt='Scrooge Casino, Scrooge LLC'
                  />
                </div>
                <div className='earn-free-tokens-desc'>
                  Want a new message to use with your affiliate link but don't
                  want to use any brain power? Let our AI write up a custom post
                  just for you!
                </div>

                <div className='social-share-filter-btns-div'>
                  <div className='new-btn'>
                    <button
                      // className='btn btn-new'
                      onClick={() => getAIMessage()}
                    >
                      CREATE A MESSAGE!
                    </button>
                  </div>
                </div>
                <div>
                  {AIMessage ? (
                    <>
                      <div className='social-share-grid-box'>
                        <div className='social-share-card'>
                          {/* <div className='card-color' /> */}

                          <div className='social-share-message'>
                            {AIMessage}{" "}
                            <a
                              href={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                            >{`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}</a>
                          </div>
                          <div className='social-share-btn-div'>
                            <FacebookShareButton
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              quote={randomMessage.message}
                              className='social-share-btn'
                            >
                              <FacebookIcon size={40} round />
                            </FacebookShareButton>
                            <TwitterShareButton
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              title={randomMessage.message}
                              className='social-share-btn'
                            >
                              <TwitterIcon size={40} round />
                            </TwitterShareButton>
                            <PinterestShareButton
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              description={randomMessage.message}
                              media='https://casino-nft-marketplace.s3.amazonaws.com/affPinterest.jpg'
                              className='social-share-btn'
                            >
                              <PinterestIcon size={40} round />
                            </PinterestShareButton>
                            <TumblrShareButton
                              title={randomMessage.message}
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              caption='Join me for free at Scrooge Casino and WIN REAL PRIZES!'
                              className='social-share-btn'
                            >
                              <TumblrIcon size={40} round />
                            </TumblrShareButton>
                            <TelegramShareButton
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              title={randomMessage.message}
                              className='social-share-btn'
                            >
                              <TelegramIcon size={40} round />
                            </TelegramShareButton>
                            <WhatsappShareButton
                              title={randomMessage.message}
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                              className='social-share-btn'
                            >
                              <WhatsappIcon size={40} round />
                            </WhatsappShareButton>
                            <EmailShareButton
                              subject={randomMessage.message}
                              body={randomMessage.message}
                              url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}
                                            
                                            `}
                              className='social-share-btn'
                            >
                              <EmailIcon size={40} round />
                            </EmailShareButton>
                          </div>
                          <div className='close-btn-round-div'>
                            <div
                              className='close-btn-round'
                              style={{ margin: "0 auto 30px auto" }}
                              onClick={() => setAIMessage()}
                            >
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
            </div>
            <div>
              <div
                className=' txt-align-center text-animate'
                style={{ marginBottom: "40px" }}
              >
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
                        </div>
                        <div className='social-share-btn-div'>
                          <FacebookShareButton
                            url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                            quote={message.message}
                            className='social-share-btn'
                          >
                            <FacebookIcon size={40} round />
                          </FacebookShareButton>
                          <TwitterShareButton
                            url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                            title={message.message}
                            className='social-share-btn'
                          >
                            <TwitterIcon size={40} round />
                          </TwitterShareButton>
                          <PinterestShareButton
                            url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                            description={message.message}
                            media='https://casino-nft-marketplace.s3.amazonaws.com/affPinterest.jpg'
                            className='social-share-btn'
                          >
                            <PinterestIcon size={40} round />
                          </PinterestShareButton>
                          <TumblrShareButton
                            title={message.message}
                            url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                            caption='Join me for free at Scrooge Casino and WIN REAL PRIZES!'
                            className='social-share-btn'
                          >
                            <TumblrIcon size={40} round />
                          </TumblrShareButton>
                          <TelegramShareButton
                            url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                            title={message.message}
                            className='social-share-btn'
                          >
                            <TelegramIcon size={40} round />
                          </TelegramShareButton>
                          <WhatsappShareButton
                            title={message.message}
                            url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}`}
                            className='social-share-btn'
                          >
                            <WhatsappIcon size={40} round />
                          </WhatsappShareButton>
                          <EmailShareButton
                            subject={message.message}
                            body={message.message}
                            url={`${scroogeClient}/?aff_id=${affUser?.data?.user_id}
                                    
                                    `}
                            className='social-share-btn'
                          >
                            <EmailIcon size={40} round />
                          </EmailShareButton>
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
