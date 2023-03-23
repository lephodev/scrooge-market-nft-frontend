//import GetWalletDLNFTs from "../scripts/getWalletDLNFTs.mjs"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";
import "react-toastify/dist/ReactToastify.css";
import { useAddress, ConnectWallet } from "@thirdweb-dev/react";
import { CheckDLOnPage } from "../components/DLGate.jsx";
import GetWalletDLNFTs from "../scripts/getWalletDLNFTs.mjs";
import DLLogoMembersOnly from "../images/DLLogoMembersOnly.png";
import Layout from "./Layout.mjs";

export default function DLClaimTokens() {
  // const [walletDL, setWalletDL]=useState([]);
  const [hasDL, setHasDL] = useState(0);
  const navigate = useNavigate();
  const address = useAddress();
  const [loading, setLoading] = useState(true);

  // async function getWalletDLBalance() {
  //   if(address){
  //     try {
  //       console.log("start address: ", address);
  //       const userRes = await marketPlaceInstance().get(`/getWalletDLBalance/${address}`).then((res) =>{
  //         console.log('DLgate2: ',res);
  //         if (typeof res.data.balance != undefined) {
  //           console.log('Has DL2');
  //           setHasDL(true);
  //           return true;
  //         } else {
  //           console.log('Does not have DL2');
  //           setHasDL(false);
  //           navigate("/", { replace: true });
  //         }
  //       });
  //     } catch (error) {
  //       setHasDL(false);
  //       //navigate("/", { replace: true });
  //     }
  //   } else {
  //     return false;
  //   }

  // }

  async function getWalletDL() {
    console.log("zzzzz");
    setLoading(true);
    const DLBal = await CheckDLOnPage(address);
    console.log("DLBal: ", DLBal);
    setHasDL(DLBal);
    setLoading(false);
  }

  useEffect(() => {
    console.log("bghgh", address);
    if (address) {
      getWalletDL(address);
    } else {
      setLoading(false);
    }
  }, [address]);

  console.log("loacacac", loading);
  return (
    <Layout>
      <main className='main'>
        <div className='container'>
          {hasDL ? (
            <>
              <div className='large-header-div'>
                <img
                  className='large-header-img'
                  src={DLLogoMembersOnly}
                  alt='Ducky Lucks Members Only'
                />
                <div className='mint-DL-div'>
                  <iframe
                    src={`https://gateway.ipfscdn.io/ipfs/Qmcine1gpZUbQ73nk7ZGCcjKBVFYXrEtqrhujXk3HDQ6Nn/erc721.html?contract=${process.env.REACT_APP_MAINNET_ADDRESS}&chainId=1&theme=dark&primaryColor=teal`}
                    width='600px'
                    height='600px'
                    style={{ maxWidth: "100%" }}
                    frameborder='0'
                    title='DLLogo'
                  ></iframe>
                </div>
                <div className='flex-row'>
                  <GetWalletDLNFTs />
                </div>
              </div>
            </>
          ) : loading ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div className=''>
                <img
                  className='detecting-dl-img pulse'
                  src='https://casino-nft-marketplace.s3.amazonaws.com/DLGif1.gif'
                  alt='duckylucks nfts'
                />
              </div>
              <br></br>
              <div className='detecting-txt'>Detecting your Ducky Lucks...</div>
            </div>
          ) : (
            <div
              className=''
              style={{
                textAlign: "center",
                fontSize: "24px",
              }}
            >
              No DL Tokens
            </div>
          )}

          {!address ? (
            // <div className="connect-wallet">Please connect your wallet.</div>
            <div className='connect-wallet-div'>
              <ConnectWallet />
            </div>
          ) : (
            <></>
          )}

          <div style={{ marginTop: "75px" }}>
            <ShowBottomNavCards />
          </div>
        </div>
      </main>
    </Layout>
  );
}
