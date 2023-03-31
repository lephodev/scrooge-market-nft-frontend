import { useState, useEffect, useContext } from "react";
import {
  useContract,
  ThirdwebNftMedia,
  useActiveListings,
  ConnectWallet,
  useAddress,
} from "@thirdweb-dev/react";
import SaleBadge from "../images/saleBadge1.png";
import StripeBadge from "../images/buyWithStripe.jpg";
import LoadingPoker from "../images/scroogeHatLogo.png";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useReward } from "react-rewards";
import AuthContext from "../context/authContext.ts";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { scroogeClient } from "../config/keys.js";
import { marketPlaceInstance } from "../config/axios.js";

const stripePromise = loadStripe(
  "pk_test_51Mo3YgIintOuilEoLwYx4fCCGOTI10Ed9yIMGLFCAVOL7WmdJCiWokb3E7wpQYEeIhUYmALBZtKF2AgXwbGGxw0n00WCYA87bT"
);
export default function ShowAllTokenNFTs() {
  const [buyLoading, setBuyLoading] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const address = useAddress();
  const [searchParams] = useSearchParams();
  const [affID, setAffID] = useState("");

  const { contract } = useContract(
    process.env.REACT_APP_MARKETPLACE_ADDRESS,
    "marketplace"
  );
  console.log("contract", contract);
  // console.log("contract000",contract);
  // data is the active listings, isLoading is a loading flag while we load the listings.
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);

  console.log("listings", listings);
  const { reward } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });

  async function handleBuyAsset(token_id, qty, assetId) {
    console.log("token_id, qty", token_id, qty, assetId);
    if (!user)
      return toast.error("Please Login first", { containerId: "authenticate" });
    setBuyLoading(true);
    qty = 1;
    try {
      console.log(
        "token_id, qty",
        token_id,
        qty,
        "address",
        address,
        "userId",
        user?.id,
        "affID",
        affID
      );
      console.log();
      const buyout = await contract.buyoutListing(token_id, qty);
      console.log("buyoutbuyoutbuyout", buyout);
      marketPlaceInstance()
        .post(`/getFreeTokens`, {
          address: address,
          token_id: assetId,
          userid: user.id,
          qty: qty,
          affID: affID,
        })
        .then((data) => {
          toast.success(
            "You have successfully purchased your NFT and " +
              data.data +
              " chips have been added to your casino account!",
            { containerId: "purchased" }
          );
          setBuyLoading(false);
          setBuySuccess(true);
        });
    } catch (err) {
      console.log("err", err);
      toast.error("Error purchasing NFT!", { containerId: "authenticate" });
      setBuyLoading(false);
    }

    // try {
    //   await contract.buyoutListing(token_id, qty);
    //   Axios.get(
    //     `https://34.237.237.45:9001/api/getFreeTokens/${address}/${token_id}/${user?.id}/${qty}/${affID}`
    //   ).then((data) => {
    //     toast.success(
    //       "You have successfully purchased your NFT and " +
    //         data.data +
    //         " chips have been added to your casino account!",
    //       { containerId: "purchased" }
    //     );
    //     setBuyLoading(false);
    //     setBuySuccess(true);
    //   });
    // } catch (err) {
    //   console.error(err);
    //   toast.error("Error purchasing NFT!", { containerId: "authenticate" });
    //   setBuyLoading(false);
    // }
  }

  // const handleBuyStripe = () => {
  //   window.open(
  //     `https://buy.stripe.com/test_7sIbJSfwn5mb4p2dQS?client_reference_id=${address}_${user?.id}_${affID}`,
  //     "__blank"
  //   );
  // };

  const handleBuyStripe = async (item) => {
    console.log("itemitemitem", item);
    let stripe;
    stripe = await stripePromise;
    const response = await marketPlaceInstance().post("/user/depositMoney", {
      ...item,
      userId: user?.id,
      address,
      affID,
    });
    const { code, msg } = response?.data;
    // console.log("response", response);
    if (code === 200) {
      const session = await response.data.id;
      // When the customer clicks on the button, redirect them to Checkout.
      const result = await stripe.redirectToCheckout({
        sessionId: session,
      });

      // console.log(result);
      if (result.error) {
        console.log(result.error);
      }
    } else {
      return toast.error(msg, { id: "A" });
    }
  };

  useEffect(() => {
    function getAffData() {
      const q = searchParams.get("aff_id");
      // console.log("q", q);
      if (q) {
        setAffID(q);
        const aff_id = Cookies.set("aff_id", q);
        // console.log("cookie: ", aff_id);
      } else {
        const aff_id = Cookies.get("aff_id", { domain: scroogeClient }); //change before going live
        // console.log("cookie=====>>>>>: ", aff_id);
        if (aff_id) {
          setAffID(aff_id);
        }
      }
    }
    getAffData();
  }, [searchParams]);

  // console.log("AffIdd", affID);

  return (
    <div>
      {buyLoading ? (
        <div className='pageImgContainer'>
          <img src={LoadingPoker} alt='game' className='imageAnimation' />
          <div className='loading-txt pulse'>PURCHASING...</div>
        </div>
      ) : (
        <></>
      )}
      {buySuccess ? (
        <div className='pageImgContainer'>
          <div className='loading-txt'>
            PURCHASED SUCCESSFULLY<br></br>
            <button
              className='page-nav-header-btn'
              onClick={() => {
                setBuySuccess(false);
                reward();
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className='scrooge-second-heading'>
        <div className='nft-home-sell-titles text-animate'>
          <h1>Scrooge Casino Marketplace NFTs</h1>
        </div>
        <div className='feature-overview-div'>
          <p>
            Running low in the casino? Lucky for you, we have a great selection
            of purchasable casino badge NFTs that include a special bonus amount
            of FREE TOKENS to be used in {""}
            <a
              href={scroogeClient}
              target='_blank'
              rel='noreferrer'
              alt='buy your Scrooge Casino NFTs today'
            >
              Scrooge Casino
            </a>
            . Simply choose the badge that is perfect for you from the list
            below, make your purchase, and your free bonus tokens will be
            automatically credited to your connected Scrooge Casino account. It
            couldn't be easier!
          </p>
        </div>
      </div>
      {/* {console.log("lllll", listings)} */}
      {loadingListings ? (
        <div className='loading-img-div'>
          <img src={LoadingPoker} alt='game' className='imageAnimation' />
        </div>
      ) : (
        <div className='nft-card-grid'>
          {listings &&
            listings.length > 0 &&
            listings.map((el, index) => {
              return (
                <>
                  <div className='nft-token-row-card'>
                    <div className='nft-card-left'>
                      <div className='nft-token-row-card-image'>
                        <ThirdwebNftMedia
                          key={el?.id}
                          metadata={el?.asset}
                          height={150}
                        />
                      </div>
                      <div className='nft-token-row-desc'>
                        <span className='nft-token-row-namess text-animate'>
                          <h4> {el?.asset?.name.toString()}</h4>
                        </span>
                        <p> {el?.asset?.description.toString()}</p>
                      </div>
                    </div>
                    {index !== 0 && index !== 1 ? (
                      <div className='nft-token-row-sale'>
                        <img
                          className='sale-badge-img'
                          src={SaleBadge}
                          alt='Get the best deal possible'
                        />
                        <br></br>
                        {index - 1}% OFF
                      </div>
                    ) : (
                      ""
                    )}
                    <div className='nft-card-right'>
                      <div className='nft-token-row-details'>
                        <span className='erc1155-price'>
                          ${(el?.buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                          BUSD
                        </span>
                        <br></br>
                        {!address ? (
                          <div className='connect-wallet-inline'>
                            <ConnectWallet />
                          </div>
                        ) : (
                          <button
                            className='erc1155-buy-btn'
                            onClick={() =>
                              handleBuyAsset(el?.id, 1, el?.asset?.id)
                            }
                            id={el?.asset?.name.toString()}
                          >
                            BUY NFT!
                          </button>
                        )}
                      </div>
                      <div
                        className='nft-token-stripe-badge-div'
                        onClick={() => handleBuyStripe(el)}
                      >
                        <img
                          className='stripe-badge-img'
                          src={StripeBadge}
                          alt='Buy NFT with Stripe'
                        />
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          {/* <div className='nft-token-row-card'>
            <div className='nft-token-row-card-image'>
              <ThirdwebNftMedia
                key={listings[1].id}
                metadata={listings[1].asset}
                height={150}
              />
            </div>
            <div className='nft-token-row-desc'>
              <span className='nft-token-row-namess text-animate'>
                <h4>{listings[1].asset.name.toString()}</h4>
              </span>
              <p>{listings[1].asset.description.toString()}</p>
            </div>
            <div className='nft-token-row-details'>
              <span className='erc1155-price'>
                ${(listings[1].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className='connect-wallet-inline'>
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className='erc1155-buy-btn'
                  onClick={() => handleBuyAsset(listings[1]?.id, 1)}
                  id={listings[1].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div
              className='nft-token-stripe-badge-div'
              onClick={() => handleBuyStripe(listings[1])}
            >
              <img
                className='stripe-badge-img'
                src={StripeBadge}
                alt='Buy NFT with Stripe'
              />
            </div>
          </div>

          <div className='nft-token-row-card'>
            <div className='nft-token-row-card-image'>
              <ThirdwebNftMedia
                key={listings[2].id}
                metadata={listings[2].asset}
                height={150}
              />
            </div>
            <div className='nft-token-row-desc'>
              <span className='nft-token-row-namess text-animate'>
                <h4>{listings[2].asset.name.toString()}</h4>
              </span>
              <p>{listings[2].asset.description.toString()}</p>
            </div>
            <div className='nft-token-row-details'>
              <span className='erc1155-price'>
                ${(listings[2].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className='connect-wallet-inline'>
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className='erc1155-buy-btn'
                  onClick={() => handleBuyAsset(listings[2]?.id, 1)}
                  id={listings[2].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div
              className='nft-token-stripe-badge-div'
              onClick={() => handleBuyStripe(listings[2])}
            >
              <img
                className='stripe-badge-img'
                src={StripeBadge}
                alt='Buy NFT with Stripe'
              />
             
            </div>
            <div className='nft-token-row-sale'>
              <img
                className='sale-badge-img'
                src={SaleBadge}
                alt='Get the best deal possible'
              />
              <br></br>
              1% OFF
            </div>
          </div>

          <div className='nft-token-row-card'>
            <div className='nft-token-row-card-image'>
              <ThirdwebNftMedia
                key={listings[3].id}
                metadata={listings[3].asset}
                height={150}
              />
            </div>
            <div className='nft-token-row-desc'>
              <span className='nft-token-row-namess text-animate'>
                <h4>{listings[3].asset.name.toString()}</h4>
              </span>

              <p> {listings[3].asset.description.toString()}</p>
            </div>
            <div className='nft-token-row-details'>
              <span className='erc1155-price'>
                ${(listings[3].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className='connect-wallet-inline'>
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className='erc1155-buy-btn'
                  onClick={() => handleBuyAsset(listings[3]?.id, 1)}
                  id={listings[3].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div
              className='nft-token-stripe-badge-div'
              onClick={() => handleBuyStripe(listings[3])}
            >
             
              <img
                className='stripe-badge-img'
                src={StripeBadge}
                alt='Buy NFT with Stripe'
              />
              
            </div>
            <div className='nft-token-row-sale'>
              <img
                className='sale-badge-img'
                src={SaleBadge}
                alt='Get the best deal possible'
              />
              <br></br>
              2% OFF
            </div>
          </div> */}

          {/* <div className='nft-token-row-card green-border-6px'>
            <div className='nft-token-row-card-image'>
              <ThirdwebNftMedia
                key={listings[4].id}
                metadata={listings[4].asset}
                height={150}
              />
            </div>
            <div className='nft-token-row-desc'>
              <span className='nft-token-row-namess text-animate'>
                <h4>{listings[4].asset.name.toString()}</h4>
              </span>

              <p>{listings[4].asset.description.toString()}</p>
            </div>
            <div className='nft-token-row-details'>
              <span className='erc1155-price'>
                ${(listings[4].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className='connect-wallet-inline'>
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className='erc1155-buy-btn'
                  onClick={() => handleBuyAsset(listings[4]?.id, 1)}
                  id={listings[4].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div
              className='nft-token-stripe-badge-div'
              onClick={() => handleBuyStripe(listings[4])}
            >
              <img
                className='stripe-badge-img'
                src={StripeBadge}
                alt='Buy NFT with Stripe'
              />
              
            </div>
            <div className='nft-token-row-sale'>
              <img
                className='sale-badge-img'
                src={SaleBadge}
                alt='Get the best deal possible'
              />
              <br></br>
              3% OFF
            </div>
          </div>

          <div className='nft-token-row-card green-border-6px'>
            <div className='nft-token-row-card-image'>
              <ThirdwebNftMedia
                key={listings[5].id}
                metadata={listings[5].asset}
                height={150}
              />
            </div>
            <div className='nft-token-row-desc'>
              <span className='nft-token-row-namess text-animate'>
                <h4>{listings[5].asset.name.toString()}</h4>
              </span>

              <p> {listings[5].asset.description.toString()}</p>
            </div>
            <div className='nft-token-row-details'>
              <span className='erc1155-price'>
                ${(listings[5].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className='connect-wallet-inline'>
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className='erc1155-buy-btn'
                  onClick={() => handleBuyAsset(listings[5]?.id, 1)}
                  id={listings[5].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div
              className='nft-token-stripe-badge-div'
              onClick={() => handleBuyStripe(listings[5])}
            >
             
              <img
                className='stripe-badge-img'
                src={StripeBadge}
                alt='Buy NFT with Stripe'
              />
             
            </div>
            <div className='nft-token-row-sale'>
              <img
                className='sale-badge-img'
                src={SaleBadge}
                alt='Get the best deal possible'
              />
              <br></br>
              4% OFF
            </div>
          </div>

          <div className='nft-token-row-card green-border-6px'>
            <div className='nft-token-row-card-image'>
              <ThirdwebNftMedia
                key={listings[6].id}
                metadata={listings[6].asset}
                height={150}
              />
            </div>
            <div className='nft-token-row-desc'>
              <span className='nft-token-row-namess text-animate'>
                <h4>{listings[6].asset.name.toString()}</h4>
              </span>

              <p>{listings[6].asset.description.toString()}</p>
            </div>
            <div className='nft-token-row-details'>
              <span className='erc1155-price'>
                ${(listings[6].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className='connect-wallet-inline'>
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className='erc1155-buy-btn'
                  onClick={() => handleBuyAsset(listings[6]?.id, 1)}
                  id={listings[6].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div
              className='nft-token-stripe-badge-div'
              onClick={() => handleBuyStripe(listings[6])}
            >
              
              <img
                className='stripe-badge-img'
                src={StripeBadge}
                alt='Buy NFT with Stripe'
              />
              
            </div>
            <div className='nft-token-row-sale'>
              <img
                className='sale-badge-img'
                src={SaleBadge}
                alt='Get the best deal possible'
              />
              <br></br>
              5% OFF
            </div>
          </div>

          <div className='nft-token-row-card green-border-6px'>
            <div className='nft-token-row-card-image'>
              <ThirdwebNftMedia
                key={listings[7].id}
                metadata={listings[7].asset}
                height={150}
              />
            </div>
            <div className='nft-token-row-desc'>
              <span className='nft-token-row-namess text-animate'>
                <h4>{listings[7].asset.name.toString()}</h4>
              </span>

              <p> {listings[7].asset.description.toString()}</p>
            </div>
            <div className='nft-token-row-details'>
              <span className='erc1155-price'>
                ${(listings[7].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className='connect-wallet-inline'>
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className='erc1155-buy-btn'
                  onClick={() => handleBuyAsset(listings[7]?.id, 1)}
                  id={listings[7].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div
              className='nft-token-stripe-badge-div'
              onClick={() => handleBuyStripe(listings[7])}
            >
             
              <img
                className='stripe-badge-img'
                src={StripeBadge}
                alt='Buy NFT with Stripe'
              />
             
            </div>
            <div className='nft-token-row-sale'>
              <img
                className='sale-badge-img'
                src={SaleBadge}
                alt='Get the best deal possible'
              />
              <br></br>
              6% OFF
            </div>
          </div> */}

          {/* <div className='nft-token-row-card pink-border-6px'>
            <div className='nft-token-row-card-image'>
              <ThirdwebNftMedia
                key={listings[8].id}
                metadata={listings[8].asset}
                height={150}
              />
            </div>
            <div className='nft-token-row-desc'>
              <span className='nft-token-row-namess text-animate'>
                <h4>{listings[8].asset.name.toString()}</h4>
              </span>

              <p> {listings[8].asset.description.toString()}</p>
            </div>
            <div className='nft-token-row-details'>
              <span className='erc1155-price'>
                ${(listings[8].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className='connect-wallet-inline'>
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className='erc1155-buy-btn'
                  onClick={() => handleBuyAsset(listings[8]?.id, 1)}
                  id={listings[8].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div
              className='nft-token-stripe-badge-div'
              onClick={() => handleBuyStripe(listings[8])}
            >
             
              <img
                className='stripe-badge-img'
                src={StripeBadge}
                alt='Buy NFT with Stripe'
              />
              
            </div>
            <div className='nft-token-row-sale'>
              <img
                className='sale-badge-img'
                src={SaleBadge}
                alt='Get the best deal possible'
              />
              <br></br>
              7% OFF
            </div>
          </div>

           <div className='nft-token-row-card pink-border-6px'>
            <div className='nft-token-row-card-image'>
              <ThirdwebNftMedia
                key={listings[9].id}
                metadata={listings[9].asset}
                height={150}
              />
            </div>
            <div className='nft-token-row-desc'>
              <span className='nft-token-row-namess text-animate'>
                <h4> {listings[9].asset.name.toString()}</h4>
              </span>

              <p>{listings[9].asset.description.toString()}</p>
            </div>
            <div className='nft-token-row-details'>
              <span className='erc1155-price'>
                ${(listings[9].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className='connect-wallet-inline'>
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className='erc1155-buy-btn'
                  onClick={() => handleBuyAsset(listings[9]?.id, 1)}
                  id={listings[9].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div
              className='nft-token-stripe-badge-div'
              onClick={() => handleBuyStripe(listings[9])}
            >
              
              <img
                className='stripe-badge-img'
                src={StripeBadge}
                alt='Buy NFT with Stripe'
              />
              
            </div>
            <div className='nft-token-row-sale'>
              <img
                className='sale-badge-img'
                src={SaleBadge}
                alt='Get the best deal possible'
              />
              <br></br>
              8% OFF
            </div>
          </div> */}

          {/* <div className='nft-token-row-card blue-border-6px'>
            <div className='nft-token-row-card-image'>
              <ThirdwebNftMedia
                key={listings[10].id}
                metadata={listings[10].asset}
                height={150}
              />
            </div>
            <div className='nft-token-row-desc'>
              <span className='nft-token-row-namess text-animate'>
                <h4>{listings[10]?.asset?.name?.toString()}</h4>
              </span>

              <p>{listings[10]?.asset?.description?.toString()}</p>
            </div>
            <div className='nft-token-row-details'>
              <span className='erc1155-price'>
                ${(listings[10]?.buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className='connect-wallet-inline'>
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className='erc1155-buy-btn'
                  onClick={() => handleBuyAsset(listings[10]?.asset?.id, 1)}
                  id={listings[10]?.asset?.name?.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div
              className='nft-token-stripe-badge-div'
              onClick={() => handleBuyStripe(listings[10])}
            >
              
              <img
                className='stripe-badge-img'
                src={StripeBadge}
                alt='Buy NFT with Stripe'
              />
              
            </div>
            <div className='nft-token-row-sale'>
              <img
                className='sale-badge-img'
                src={SaleBadge}
                alt='Get the best deal possible'
              />
              <br></br>
              9% OFF
            </div>
          </div>  */}
        </div>
      )}
    </div>
  );
}
