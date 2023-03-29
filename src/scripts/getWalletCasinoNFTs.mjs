import {
  useAddress,
  useOwnedNFTs,
  useContract,
  useBurnNFT,
} from "@thirdweb-dev/react";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import LoadingGif from "../images/loading1.gif";
import LoadingPoker from "../images/scroogeHatLogo.png";

import ReactModal from "react-modal";
import { Tooltip } from "../pages/Layout.mjs";
import { marketPlaceInstance } from "../config/axios.js";
import AuthContext from "../context/authContext.ts";
import { toast } from "react-toastify";

export default function GetWalletERC1155NFTs() {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [NFTRedeemID, setNFTRedeemID] = useState("");
  const [NFTRedeemName, setNFTRedeemName] = useState("");
  const [email, setEmail] = useState("");
  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const address = useAddress();
  function notify(message) {
    toast.success("🎩 " + message);
  }
  const { contract } = useContract(process.env.REACT_APP_BSC_MAINNET);
  const { data: nfts, isLoading } = useOwnedNFTs(contract, address);
  const { mutate: burnNft, isLoadingBurn, error } = useBurnNFT(contract);

  const [burnloading, setBurnLoading] = useState(false);

  if (error) {
    console.error("failed to burn nft", error);
  }

  function getEmailAddress(NFT_ID, NFT_Name) {
    setShowModal(true);
    setNFTRedeemID(NFT_ID);
    setNFTRedeemName(NFT_Name);
  }

  async function handleBurnNft(token_id, qty, emailaddress) {
    let usernameConfirmed = false;
    //let emailaddress = prompt("Please enter your Scrooge Casino profile email address. Your chips will be credited to this account.:", "Email Address");
    if (
      emailaddress == null ||
      emailaddress === "" ||
      emailaddress === "Email Address"
    ) {
      notify("No email entered.");
    } else {
      //check user table to make sure email address exists
      //alert('Your email is '+emailaddress);
      setShowModal(false);
      setBurnLoading(true);
      marketPlaceInstance()
        .get(`/verifyEmail/${emailaddress}`)
        .then((data) => {
          //setNFTBalance(data.data);
          //setBurnLoading(false);
          const username = data.data[0].username;
          //console.log(data.data[0].username);
          if (username != null) {
            if (
              window.confirm(
                "Email address verified for username: " +
                  data.data[0].username +
                  ". Is this correct?"
              ) === true
            ) {
              usernameConfirmed = true;
            } else {
              usernameConfirmed = false;
              setBurnLoading(false);
              //alert("Canceled by user. Please try again.");
              return false;
            }
          } else {
            notify("Email address not found. Please try again.");
            return false;
          }
        })
        .then(async () => {
          if (usernameConfirmed) {
            try {
              //const result = await contract.erc1155.burnFrom(address, token_id, qty);
              //console.log("NFT REDEEMED!! Your chips will be added shortly.");
              marketPlaceInstance()
                .get(
                  `/redeemTokenNFT/${address}/${token_id}/${user?.id}/${qty}`
                )
                .then((data) => {
                  //setNFTBalance(data.data);
                  setBurnLoading(false);
                  notify(
                    "You have successfully purchased your NFT and " +
                      data.data +
                      " chips have been added to your casino account with email address: " +
                      emailaddress +
                      "!"
                  );
                });

              //window.location.reload();
            } catch (err) {
              console.error(err);
              setBurnLoading(false);
              notify("Error purchasing NFT");
            }
          } else {
            setBurnLoading(false);
            notify("Canceled by user. Please try again.");
          }
        });
    }
  }
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='full-page-container'>
      <ReactModal
        isOpen={showModal}
        contentLabel={"Modal Challenge 1"}
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: "10%",
            backgroundColor: "rgba(231,201,117,0.85)",
          },
          content: {
            position: "absolute",
            top: "30px",
            left: "30px",
            right: "30px",
            bottom: "30px",
            border: "4px solid #D2042D",
            background: "#1b2129",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
          },
        }}
      >
        <div className='modal-popup'>
          <div className='modal-header'>
            Please enter your Scrooge Casino profile email address.<br></br>Your
            chips will be credited to this account.
          </div>
          <form>
            <input
              type='text'
              id='emailaddress'
              name='emailaddress'
              placeholder='Email Address'
              onChange={handleChange}
              value={email}
            ></input>
          </form>
          <div>
            <br></br>
            <strong>NFT to purchase: </strong>
            {NFTRedeemName}
          </div>
          <button
            className='modal-popup-btn'
            onClick={() => handleBurnNft(NFTRedeemID, 1, email)}
          >
            SUBMIT
          </button>
          <br></br>
          <br></br>
          <button
            className='modal-popup-btn'
            onClick={() => setShowModal(false)}
          >
            CLOSE
          </button>
        </div>
      </ReactModal>
      {burnloading ? (
        <div className='loading-img-div'>
          <img className='loading-img' src={LoadingGif} alt='Loading...' />
        </div>
      ) : (
        <></>
      )}
      <div
        className='
       pageTitless 
      text-animate'
      >
        <h1>My Scrooge Casino NFTs</h1>
      </div>

      {isLoading ? (
        <div className='pageImgContainer'>
          <img src={LoadingPoker} alt='game' className='imageAnimation' />
          <div className='loading-txt pulse'>LOADING WALLET...</div>
        </div>
      ) : (
        <div className='flex-row transaction-card-grid'>
          {nfts.map((nft) => (
            <div className='erc1155Card casino-card' key={nft.metadata.id}>
              <div className='erc1155Card-image'>
                {Tooltip(
                  nft.metadata.id,
                  nft.metadata,
                  nft.metadata.description
                )}
              </div>
              <div className='erc1155Card-details'>
                <span>{nft.metadata.name}</span>
                <br></br>
                <span className='erc1155-price'>
                  Quantity Owned: <span>{nft.quantityOwned}</span>
                </span>
                <br></br>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='bottom-row-btns-div'>
        <Link to='/nft-tokens'>
          <div className='new-btn'>
            <button
            //  className='subheader-btn'
            >
              BUY MORE NFTS
            </button>
          </div>
        </Link>
        <Link to='/redeem-prizes'>
          <div className='new-btn'>
            <button
            //  className='subheader-btn'
            >
              REDEEM MORE REWARDS
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
