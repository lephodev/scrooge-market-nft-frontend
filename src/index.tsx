import React, { useState } from "react";
import { createRoot } from "react-dom/client";
//import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import ChainContext from "./context/Chain";
import "./styles/globals.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout.mjs";
import Home from "./pages/Home.mjs";
import NoPage from "./pages/NoPage.mjs";
import Login from "./pages/Login.mjs";
import NFTTokens from "./pages/NFT-Tokens.mjs";
import MyWallet from "./pages/MyWallet.mjs";
import CreateListing from "./pages/CreateListing.mjs";
import Contact from "./pages/Contact.mjs";
import Explore from "./pages/Explore.mjs";
import CreatePost from "./pages/CreatePosts.mjs";
import BlogPosts from "./pages/BlogPosts.mjs";
import RedeemNFTs from "./pages/RedeemNFTs.mjs";
import RedeemPrizes from "./pages/RedeemPrizes.mjs";
//import server from "./server/index.mjs";


// This is the chainId your dApp will work on.
//const activeChainId = ChainId.Mainnet;
//const activeChainId = ChainId.BinanceSmartChainMainnet;


export default function App() {
  const [selectedChain, setSelectedChain] = useState(ChainId.BinanceSmartChainMainnet);

  return (
    <ChainContext.Provider value={{ selectedChain, setSelectedChain }}>
      <ThirdwebProvider desiredChainId={selectedChain}
        dAppMeta={{
          name: "Scrooge Casino Marketplace",
          description: "Get everything you need for the Scrooge Casino",
          isDarkMode: true,
          logoUrl: "https://duckylucks.app/wp-content/uploads/2022/12/cropped-DLFaviconLarge-150x150.png.pagespeed.ce.6Nk6csArBf.png",
          url: "https://scrooge.market",
        }}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="explore" element={<Explore />} />
          <Route path="nft-tokens" element={<NFTTokens />} />
          <Route path="contact" element={<Contact />} />
          <Route path="my-wallet" element={<MyWallet />} />
          <Route path="create-listing" element={<CreateListing />} />
          <Route path="*" element={<NoPage />} />
          <Route path="blog-posts" element={<BlogPosts />} />
          <Route path="create-posts" element={<CreatePost />} />
          <Route path="redeem-nfts" element={<RedeemNFTs />} />
          <Route path="redeem-prizes" element={<RedeemPrizes />} />
        </Route>
      </Routes>
      <Routes>
        <Route path="/auth" element={<Layout />}>
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
      <Routes>
        <Route path="/vip" element={<Layout />}>
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ThirdwebProvider>
    </ChainContext.Provider>
  );
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    
        <App />
      
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
