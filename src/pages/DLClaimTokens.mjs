
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useAddress, ConnectWallet } from "@thirdweb-dev/react";
import { CheckDLOnPage } from "../components/DLGate.jsx";
import GetWalletDLNFTs from "../scripts/getWalletDLNFTs.mjs";
import DLLogoMembersOnly from "../images/DLLogoMembersOnly.png";

export default function DLClaimTokens() {
  // const [walletDL, setWalletDL]=useState([]);
  const [hasDL, setHasDL] = useState(0);
  const address = useAddress();
  const [loading, setLoading] = useState(true);

  async function getWalletDL() {
    setLoading(true);
    const DLBal = await CheckDLOnPage(address);
    setHasDL(DLBal);
    setLoading(false);
  }

  useEffect(() => {
    if (address) {
      getWalletDL(address);
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
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
                    title='DLLogo'></iframe>
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
              }}>
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
              className='text-animate'
              style={{
                textAlign: "center",
              }}>
              <h1>No DL Tokens</h1>
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
        </div>
      </main>
  );
}
