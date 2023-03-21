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
import { scroogeClient } from "../config/keys.js";
import { marketPlaceInstance } from "../config/axios.js";

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
  // data is the active listings, isLoading is a loading flag while we load the listings.
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);
  const { reward } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });

  async function handleBuyAsset(token_id, qty) {
    if (!user)
      return toast.error("Please Login first", { containerId: "authenticate" });
    setBuyLoading(true);
    qty = 1;
    try {
      await contract.buyoutListing(token_id, qty);
      marketPlaceInstance()
        .get(
          `/getFreeTokens/${address}/${token_id}/${user?.id}/${qty}/${affID}`
        )
        .then((data) => {
          console.log("datatat", data);
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
      console.error(err);
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

  const handleBuyStripe = () => {
    window.open(
      `https://buy.stripe.com/test_bIY9BpcxRaMHeuA145?client_reference_id=${address}_${user?.id}_${affID}`,
      "__blank"
    );
  };

  useEffect(() => {
    function getAffData() {
      const q = searchParams.get("aff_id");
      if (q) {
        setAffID(q);
        const aff_id = Cookies.set("aff_id", q);
        console.log("cookie: ", aff_id);
      } else {
        const aff_id = Cookies.get("aff_id", { domain: scroogeClient }); //change before going live
        //console.log('cookie: ',aff_id);
        if (aff_id) {
          setAffID(aff_id);
        }
      }
    }
    getAffData();
  }, [searchParams]);

  return (
    <div>
      {buyLoading ? (
        <div className="pageImgContainer">
          <img src={LoadingPoker} alt="game" className="imageAnimation" />
          <div className="loading-txt pulse">PURCHASING...</div>
        </div>
      ) : (
        <></>
      )}
      {buySuccess ? (
        <div className="pageImgContainer">
          <div className="loading-txt">
            PURCHASED SUCCESSFULLY<br></br>
            <button
              className="page-nav-header-btn"
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
      <div className="nft-home-sell-title">
        <h1>Scrooge Casino Marketplace NFTs</h1>
      </div>
      <div className="feature-overview-div" style={{ marginBottom: "30px" }}>
        Running low in the casino? Lucky for you, we have a great selection of
        purchasable casino badge NFTs that include a special bonus amount of
        FREE TOKENS to be used in{" "}
        <a
          href={scroogeClient}
          target="_blank"
          rel="noreferrer"
          alt="buy your Scrooge Casino NFTs today"
        >
          Scrooge Casino
        </a>
        . Simply choose the badge that is perfect for you from the list below,
        make your purchase, and your free bonus tokens will be automatically
        credited to your connected Scrooge Casino account. It couldn't be
        easier!
      </div>
      {loadingListings ? (
        <div className="loading-img-div">
          <img src={LoadingPoker} alt="game" className="imageAnimation" />
        </div>
      ) : (
        <div className="">
          <div style={{ width: "100%", textAlign: "center" }}>
            <div id="rewardId" style={{ margin: "0 auto" }} />
          </div>

          <div className="nft-token-row-card">
            <div className="nft-token-row-card-image">
              <ThirdwebNftMedia
                key={listings[0].id}
                metadata={listings[0].asset}
                height={150}
              />
            </div>
            <div className="nft-token-row-desc">
              <span className="nft-token-row-name">
                {listings[0].asset.name.toString()}
              </span>

              {listings[0].asset.description.toString()}
            </div>
            <div className="nft-token-row-details">
              <span className="erc1155-price">
                ${(listings[0].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className="connect-wallet-inline">
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className="erc1155-buy-btn"
                  onClick={() => handleBuyAsset(listings[0].asset.id, 1)}
                  id={listings[0].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div
              className="nft-token-stripe-badge-div"
              onClick={handleBuyStripe}
            >
              <img
                className="stripe-badge-img"
                src={StripeBadge}
                alt="Buy NFT with Stripe"
              />
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
              <span className="nft-token-row-name">
                {listings[1].asset.name.toString()}
              </span>

              {listings[1].asset.description.toString()}
            </div>
            <div className="nft-token-row-details">
              <span className="erc1155-price">
                ${(listings[1].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className="connect-wallet-inline">
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className="erc1155-buy-btn"
                  onClick={() => handleBuyAsset(listings[1].asset.id, 1)}
                  id={listings[1].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div className="nft-token-stripe-badge-div">
              <a
                href={`https://buy.stripe.com/dR6bLA6ZIesc86s289?client_reference_id=${address}_${user?.id}_${affID}`}
                alt="buy with Stripe"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="stripe-badge-img"
                  src={StripeBadge}
                  alt="Buy NFT with Stripe"
                />
              </a>
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
              <span className="nft-token-row-name">
                {listings[2].asset.name.toString()}
              </span>

              {listings[2].asset.description.toString()}
            </div>
            <div className="nft-token-row-details">
              <span className="erc1155-price">
                ${(listings[2].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className="connect-wallet-inline">
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className="erc1155-buy-btn"
                  onClick={() => handleBuyAsset(listings[2].asset.id, 1)}
                  id={listings[2].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div className="nft-token-stripe-badge-div">
              <a
                href={`https://buy.stripe.com/00g5ncesaabW9aw8wy?client_reference_id=${address}_${user?.id}_${affID}`}
                alt="buy with Stripe"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="stripe-badge-img"
                  src={StripeBadge}
                  alt="Buy NFT with Stripe"
                />
              </a>
            </div>
            <div className="nft-token-row-sale">
              <img
                className="sale-badge-img"
                src={SaleBadge}
                alt="Get the best deal possible"
              />
              <br></br>
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
              <span className="nft-token-row-name">
                {listings[3].asset.name.toString()}
              </span>

              {listings[3].asset.description.toString()}
            </div>
            <div className="nft-token-row-details">
              <span className="erc1155-price">
                ${(listings[3].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className="connect-wallet-inline">
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className="erc1155-buy-btn"
                  onClick={() => handleBuyAsset(listings[3].asset.id, 1)}
                  id={listings[3].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div className="nft-token-stripe-badge-div">
              <a
                href={`https://buy.stripe.com/eVaaHw5VEfwg72obIL?client_reference_id=${address}_${user?.id}_${affID}`}
                alt="buy with Stripe"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="stripe-badge-img"
                  src={StripeBadge}
                  alt="Buy NFT with Stripe"
                />
              </a>
            </div>
            <div className="nft-token-row-sale">
              <img
                className="sale-badge-img"
                src={SaleBadge}
                alt="Get the best deal possible"
              />
              <br></br>
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
              <span className="nft-token-row-name">
                {listings[4].asset.name.toString()}
              </span>

              {listings[4].asset.description.toString()}
            </div>
            <div className="nft-token-row-details">
              <span className="erc1155-price">
                ${(listings[4].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className="connect-wallet-inline">
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className="erc1155-buy-btn"
                  onClick={() => handleBuyAsset(listings[4].asset.id, 1)}
                  id={listings[4].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div className="nft-token-stripe-badge-div">
              <a
                href={`https://buy.stripe.com/bIYcPE3NwabW2M8bIM?client_reference_id=${address}_${user?.id}_${affID}`}
                alt="buy with Stripe"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="stripe-badge-img"
                  src={StripeBadge}
                  alt="Buy NFT with Stripe"
                />
              </a>
            </div>
            <div className="nft-token-row-sale">
              <img
                className="sale-badge-img"
                src={SaleBadge}
                alt="Get the best deal possible"
              />
              <br></br>
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
              <span className="nft-token-row-name">
                {listings[5].asset.name.toString()}
              </span>

              {listings[5].asset.description.toString()}
            </div>
            <div className="nft-token-row-details">
              <span className="erc1155-price">
                ${(listings[5].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className="connect-wallet-inline">
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className="erc1155-buy-btn"
                  onClick={() => handleBuyAsset(listings[5].asset.id, 1)}
                  id={listings[5].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div className="nft-token-stripe-badge-div">
              <a
                href={`https://buy.stripe.com/3cs2b03Nw83OaeAfZ3?client_reference_id=${address}_${user?.id}_${affID}`}
                alt="buy with Stripe"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="stripe-badge-img"
                  src={StripeBadge}
                  alt="Buy NFT with Stripe"
                />
              </a>
            </div>
            <div className="nft-token-row-sale">
              <img
                className="sale-badge-img"
                src={SaleBadge}
                alt="Get the best deal possible"
              />
              <br></br>
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
              <span className="nft-token-row-name">
                {listings[6].asset.name.toString()}
              </span>

              {listings[6].asset.description.toString()}
            </div>
            <div className="nft-token-row-details">
              <span className="erc1155-price">
                ${(listings[6].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className="connect-wallet-inline">
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className="erc1155-buy-btn"
                  onClick={() => handleBuyAsset(listings[6].asset.id, 1)}
                  id={listings[6].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div className="nft-token-stripe-badge-div">
              <a
                href={`https://buy.stripe.com/5kAeXM1Fo97S2M8aEK?client_reference_id=${address}_${user?.id}_${affID}`}
                alt="buy with Stripe"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="stripe-badge-img"
                  src={StripeBadge}
                  alt="Buy NFT with Stripe"
                />
              </a>
            </div>
            <div className="nft-token-row-sale">
              <img
                className="sale-badge-img"
                src={SaleBadge}
                alt="Get the best deal possible"
              />
              <br></br>
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
              <span className="nft-token-row-name">
                {listings[7].asset.name.toString()}
              </span>

              {listings[7].asset.description.toString()}
            </div>
            <div className="nft-token-row-details">
              <span className="erc1155-price">
                ${(listings[7].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className="connect-wallet-inline">
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className="erc1155-buy-btn"
                  onClick={() => handleBuyAsset(listings[7].asset.id, 1)}
                  id={listings[7].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div className="nft-token-stripe-badge-div">
              <a
                href={`https://buy.stripe.com/28oeXM4RAesc2M86ov?client_reference_id=${address}_${user?.id}_${affID}`}
                alt="buy with Stripe"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="stripe-badge-img"
                  src={StripeBadge}
                  alt="Buy NFT with Stripe"
                />
              </a>
            </div>
            <div className="nft-token-row-sale">
              <img
                className="sale-badge-img"
                src={SaleBadge}
                alt="Get the best deal possible"
              />
              <br></br>
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
              <span className="nft-token-row-name">
                {listings[8].asset.name.toString()}
              </span>

              {listings[8].asset.description.toString()}
            </div>
            <div className="nft-token-row-details">
              <span className="erc1155-price">
                ${(listings[8].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className="connect-wallet-inline">
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className="erc1155-buy-btn"
                  onClick={() => handleBuyAsset(listings[8].asset.id, 1)}
                  id={listings[8].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div className="nft-token-stripe-badge-div">
              <a
                href={`https://buy.stripe.com/aEU5nc5VEck4dqMcMU?client_reference_id=${address}_${user?.id}_${affID}`}
                alt="buy with Stripe"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="stripe-badge-img"
                  src={StripeBadge}
                  alt="Buy NFT with Stripe"
                />
              </a>
            </div>
            <div className="nft-token-row-sale">
              <img
                className="sale-badge-img"
                src={SaleBadge}
                alt="Get the best deal possible"
              />
              <br></br>
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
              <span className="nft-token-row-name">
                {listings[9].asset.name.toString()}
              </span>

              {listings[9].asset.description.toString()}
            </div>
            <div className="nft-token-row-details">
              <span className="erc1155-price">
                ${(listings[9].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className="connect-wallet-inline">
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className="erc1155-buy-btn"
                  onClick={() => handleBuyAsset(listings[9].asset.id, 1)}
                  id={listings[9].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div className="nft-token-stripe-badge-div">
              <a
                href={`https://buy.stripe.com/8wM16Wck25VG86sbIR?client_reference_id=${address}_${user?.id}_${affID}`}
                alt="buy with Stripe"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="stripe-badge-img"
                  src={StripeBadge}
                  alt="Buy NFT with Stripe"
                />
              </a>
            </div>
            <div className="nft-token-row-sale">
              <img
                className="sale-badge-img"
                src={SaleBadge}
                alt="Get the best deal possible"
              />
              <br></br>
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
              <span className="nft-token-row-name">
                {listings[10].asset.name.toString()}
              </span>

              {listings[10].asset.description.toString()}
            </div>
            <div className="nft-token-row-details">
              <span className="erc1155-price">
                ${(listings[10].buyoutPrice / 10 ** 18).toFixed(2).toString()}{" "}
                BUSD
              </span>
              <br></br>
              {!address ? (
                <div className="connect-wallet-inline">
                  <ConnectWallet />
                </div>
              ) : (
                <button
                  className="erc1155-buy-btn"
                  onClick={() => handleBuyAsset(listings[10].asset.id, 1)}
                  id={listings[10].asset.name.toString()}
                >
                  BUY NFT!
                </button>
              )}
            </div>
            <div className="nft-token-stripe-badge-div">
              <a
                href={`https://buy.stripe.com/eVa16W2JsesccmI4gq?client_reference_id=${address}_${user?.id}_${affID}`}
                alt="buy with Stripe"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="stripe-badge-img"
                  src={StripeBadge}
                  alt="Buy NFT with Stripe"
                />
              </a>
            </div>
            <div className="nft-token-row-sale">
              <img
                className="sale-badge-img"
                src={SaleBadge}
                alt="Get the best deal possible"
              />
              <br></br>
              9% OFF
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
