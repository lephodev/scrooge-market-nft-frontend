import GetWalletNFTs from "../scripts/getWalletNFTs.mjs";
import { Link } from "react-router-dom";
//import GetWalletERC1155NFTs from "./scripts/getWalletERC1155NFTs.mjs";
import MarketplaceShowActiveListings from "../scripts/marketplaceShowActiveListings.mjs";
import "../styles/Home.css";
import GetWalletERC1155NFTs from "../scripts/getWalletERC1155NFTs.mjs";
import ShowCasinoTokenNFTs from "../scripts/showCasinoTokenNFTs.mjs";

export default function Contact() {
  return (
    <div className="container">
      <main className="main">
      <h1 className="title">
          CONTACT US
        </h1>
       
        <p className="description yellow">
          Have a question? Need to raise a concern? Wanna tell us a joke?
        </p>
        <div className="contact-div">
            Send us an email at support@scrooge.casino<br></br><br></br>
            <a href="https://t.me/ScroogeJRverify" target="_blank">Chat with us on Telegram</a>
        </div>
        
        <br></br><br></br>        
      </main>
    </div>
  );
}
