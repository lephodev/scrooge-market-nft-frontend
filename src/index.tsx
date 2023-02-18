import React, { useState } from "react";
import { createRoot } from "react-dom/client";
//import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import ChainContext from "./context/Chain";
import "./styles/globals.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, redirect} from "react-router-dom";
import {ProtectedRoute} from "./components/ProtectedRoute";
import { DLGate } from "./components/DLGate";
import Layout from "./pages/Layout.mjs";
import Home from "./pages/Home.mjs";
import NoPage from "./pages/NoPage.mjs";
import Login from "./pages/Login.mjs";
import NFTTokens from "./pages/NFT-Tokens.mjs";
import MyWallet from "./pages/MyWallet.mjs";
import CreateListing from "./pages/CreateListing.mjs";
import Contact from "./pages/Contact.mjs";
import Privacy from "./pages/PrivacyPolicy.mjs";
import Terms from "./pages/TermsandConditions.mjs";
import Explore from "./pages/Explore.mjs";
import CreatePost from "./pages/CreatePosts.mjs";
import BlogPosts from "./pages/BlogPosts.mjs";
import RedeemNFTs from "./pages/RedeemNFTs.mjs";
import RedeemPrizes from "./pages/RedeemPrizes.mjs";
import HolderClaimChips from "./pages/HolderClaimChips.mjs";
import DLClaimTokens from "./pages/DLClaimTokens.mjs";
import EarnTokens from "./pages/EarnTokens.mjs";
import { AuthProvider, useAuth } from './components/ProtectedRoute';
import queryString from 'query-string';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import Raffles from "./pages/Raffles.mjs";

export default function App() {
  const [selectedChain, setSelectedChain] = useState(ChainId.BinanceSmartChainMainnet);
  const user = useAuth();
  //let location = useLocation();
  //console.log('app loc: ', location.search);
  return (
    <ChainContext.Provider value={{ selectedChain, setSelectedChain }}>
      <ThirdwebProvider desiredChainId={selectedChain}
        dAppMeta={{
          name: "Scrooge Casino NFT Marketplace",
          description: "Everything you need to be a high roller in the Scrooge Casino.",
          isDarkMode: true,
          logoUrl: "https://casino-nft-marketplace.s3.amazonaws.com/highRollerBasic.png",
          url: "https://market.scrooge.casino",
        }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />} >
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/my-wallet" element={<ProtectedRoute><MyWallet /></ProtectedRoute>} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/*" element={<NoPage />} />
              <Route path="/blog-posts" element={<BlogPosts />} />
              <Route path="/create-posts" element={<CreatePost />} />
              <Route path="/redeem-nfts" element={<ProtectedRoute><RedeemNFTs /></ProtectedRoute>} />
              <Route path="/redeem-prizes" element={<ProtectedRoute><RedeemPrizes /></ProtectedRoute>} />
              <Route path="/claim-free-tokens" element={<ProtectedRoute><HolderClaimChips /></ProtectedRoute>} />
              <Route path="/ducky-lucks-claim-tokens" element={<ProtectedRoute><DLGate><DLClaimTokens /></DLGate></ProtectedRoute>} />
              <Route path="/earn-tokens" element={<ProtectedRoute><EarnTokens /></ProtectedRoute>} />
              <Route path="/raffles" element={<ProtectedRoute><Raffles /></ProtectedRoute>} />
            </Route>
            <Route path="/nft-tokens" element={<Layout />} >
              <Route index element={<NFTTokens />} />
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
