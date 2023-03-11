import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
//import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import ChainContext from "./context/Chain";
import "./styles/globals.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { DLGate } from "./components/DLGate";
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
import Raffles from "./pages/Raffles.mjs";
import { useCookies } from "react-cookie";
import AuthContext from "./context/authContext";
import axios from "axios";
import { ToastContainer } from "react-toastify";

export default function App() {
  const [selectedChain, setSelectedChain] = useState(ChainId.BinanceSmartChainMainnet);
  const [user, setUser] = useState(null);
  const [cookies] = useCookies(['token']);
  const [loading, setLoading] = useState(false);

 

  useEffect(() => {
    login();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

   // call this function when you want to authenticate the user
   const login = async () => {
    setLoading(true)
    let access_token = cookies.token;
    axios.get('https://api.scrooge.casino/v1/auth/check-auth',{
      headers:{
        Authorization: `Bearer ${access_token}`
      }
    }).then((res: any)=>{ 
      setLoading(false);
      // console.log(convertedData)
      if (typeof res.data.user !== "undefined") {
        console.log("user", res.data)
          setUser({
             ...res.data.user
          });
      } else {
        setUser(null);
        return <Navigate to="/login" />
      }
    }).catch((err: any) => {
      setLoading(false);
      console.log("error ", err)
      return <Navigate to="/login" />
    })
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    return <Navigate to="/login" />
  };

  return (
    <AuthContext.Provider value={{
      user,
      logout,
      login,
      loading,
      setLoading,
      setUser
    }}>
       {loading ? (
        <div className="loader">
         loader...
        </div>
      ) : (
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
            {/* Protectde Route */}

            <Route path="/" element={<ProtectedRoute component={<Home />} />} />
            <Route path="/my-wallet" element={<ProtectedRoute component={<MyWallet />} />} />
            <Route path="/redeem-nfts" element={<ProtectedRoute component={< RedeemNFTs/>} /> } />
            <Route path="/redeem-prizes" element={<ProtectedRoute component={<RedeemPrizes />} />} />
            <Route path="/claim-free-tokens" element={<ProtectedRoute component={<HolderClaimChips />} />} />
            <Route path="/ducky-lucks-claim-tokens" element={<ProtectedRoute component={<DLGate><DLClaimTokens /></DLGate>} />} />
            <Route path="/earn-tokens" element={<ProtectedRoute component={<EarnTokens />} />} />
            <Route path="/raffles" element={<ProtectedRoute component={<Raffles />} /> } />
           
            {/* Public Routes */}

            <Route path="/login" element={<Login />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/blog-posts" element={<BlogPosts />} />
            <Route path="/create-posts" element={<CreatePost />} />
            <Route path="/nft-tokens" element={<NFTTokens />} />
            <Route path="/vip" element={<NoPage />} />
            <Route path="/*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      </ThirdwebProvider>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
    </ChainContext.Provider>
      )
            }
         </AuthContext.Provider>
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
