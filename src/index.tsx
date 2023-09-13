import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
//import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import ChainContext from "./context/Chain";
import "./styles/globals.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home.mjs";
import NoPage from "./pages/NoPage.mjs";
import Login from "./pages/Login.mjs";
// import NFTTokens from "./pages/NFT-Tokens.mjs";
import CryptoToGC from "./pages/CryptoToGC.mjs";
import MyWallet from "./pages/MyWallet.mjs";
import CreateListing from "./pages/CreateListing.mjs";
import Contact from "./pages/Contact.mjs";
import Privacy from "./pages/PrivacyPolicy.mjs";
import Terms from "./pages/TermsandConditions.mjs";
import Explore from "./pages/Explore.mjs";
import CreatePost from "./pages/CreatePosts.mjs";
import BlogPosts from "./pages/BlogPosts.mjs";
// import RedeemNFTs from "./pages/RedeemNFTs.mjs";
import RedeemPrizes from "./pages/RedeemPrizes.mjs";
import EarnTokens from "./pages/EarnTokens.mjs";
import Raffles from "./pages/Raffles.mjs";
import { useCookies } from "react-cookie";
import AuthContext from "./context/authContext";
import { ToastContainer } from "react-toastify";
import { authInstance } from "./config/axios";
import LoadingPoker from "./images/scroogeHatLogo.png";
import PaymentSuccess from "./pages/PaymentSuccess.mjs";
import KycForm from "./pages/KycForm.mjs";
import BuyTokenFromOGJR from "./pages/BuyTokenFromOGJR.mjs";
import CloudWebsiteError from "./components/cloudWebsiteError.mjs";
import EarnFreeCoins from "./pages/EarnFreeCoins.mjs";

export default function App() {
  const [selectedChain, setSelectedChain] = useState<ChainId>(
    ChainId.BinanceSmartChainMainnet
  );
  const [user, setUser] = useState(null);
  const [spendedAmount, setSpendedAmount] = useState(null);
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);
  const [dateTimeNow, setDateTimeNow] = useState("");

  const underMaintainance = true;
  

  useEffect(() => {
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // call this function when you want to authenticate the user
  const login = async () => {
    setLoading(true);
    let access_token = cookies.token;
    authInstance()
      .get("/auth/check-auth", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Permissions-Policy": "geolocation=*",
        },
      })
      .then((res: any) => {
        // console.log(convertedData)

        if (res.data.user) {
          setUser({
            ...res.data.user,
          });
          if (res.data.datetimenow) setDateTimeNow(res.data.datetimenow);
          setSpendedAmount(res.data.spended);
          setLoading(false);
        } else {
          setUser(null);
          setDateTimeNow("");
          setLoading(false);
          return <Navigate to='/login' />;
        }
      })
      .catch((err: any) => {
        setLoading(false);
        console.log("error ", err);
        return <Navigate to='/login' />;
      });
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    return <Navigate to='/login' />;
  };

  return { underMaintainance ? (
    "Under Maintainance" : (
      <AuthContext.Provider
        value={{
          spendedAmount,
          setSpendedAmount,
          user,
          logout,
          login,
          loading,
          setLoading,
          setUser,
          dateTimeNow,
        }}>
        {loading ? (
          <div className='loading'>
            <div className='loading-img-div'>
              <img src={LoadingPoker} alt='game' className='imageAnimation' />
            </div>
          </div>
        ) : (
          <ChainContext.Provider value={{ selectedChain, setSelectedChain }}>
            <ThirdwebProvider
              activeChain={selectedChain}
              dAppMeta={{
                name: "Scrooge Casino NFT Marketplace",
                description:
                  "Everything you need to be a high roller in the Scrooge Casino.",
                isDarkMode: true,
                logoUrl:
                  "https://casino-nft-marketplace.s3.amazonaws.com/highRollerBasic.png",
                url: "https://market.scrooge.casino",
              }}>
              <BrowserRouter>
                <Routes>
                  {/* Protectde Route */}
  
                  <Route
                    path='/'
                    element={<ProtectedRoute component={<Home />} />}
                  />
                  <Route
                    path='/my-wallet'
                    element={<ProtectedRoute component={<MyWallet />} />}
                  />
                  {/* <Route
                    path='/redeem-nfts'
                    element={<ProtectedRoute component={<RedeemNFTs />} />}
                  /> */}
                  <Route
                    path='/crypto-to-gc'
                    element={<ProtectedRoute component={<CryptoToGC />} />}
                  />
                  <Route
                    path='/redeem-prizes'
                    element={<ProtectedRoute component={<RedeemPrizes />} />}
                  />
                  <Route
                    path='/crypto-to-tokens'
                    element={<ProtectedRoute component={<BuyTokenFromOGJR />} />}
                  />
                  <Route
                    path='/claim-free-tokens'
                    element={<ProtectedRoute component={<EarnFreeCoins />} />}
                  />
                  {/* <Route
                    path='/kyc'
                    element={<ProtectedRoute component={<KycForm />} />}
                  /> */}
                  <Route
                    path='/earn-tokens'
                    element={<ProtectedRoute component={<EarnTokens />} />}
                  />
                  <Route
                    path='/raffles'
                    element={<ProtectedRoute component={<Raffles />} />}
                  />
  
                  {/* Public Routes */}
  
                  <Route path='/login' element={<Login />} />
                  <Route path='/kyc' element={<KycForm />} />
                  <Route path='/explore' element={<Explore />} />
                  <Route path='/contact' element={<Contact />} />
                  <Route path='/privacy' element={<Privacy />} />
                  <Route path='/terms' element={<Terms />} />
                  <Route path='/create-listing' element={<CreateListing />} />
                  <Route path='/blog-posts' element={<BlogPosts />} />
                  <Route path='/create-posts' element={<CreatePost />} />
                  {/* <Route path='/nft-tokens' element={<NFTTokens />} /> */}
                  <Route path='/payment' element={<PaymentSuccess />} />
                  <Route path='/vip' element={<NoPage />} />
                  <Route path='/*' element={<NoPage />} />
                  <Route path='/cloudError' element={<CloudWebsiteError />} />
                </Routes>
              </BrowserRouter>
            </ThirdwebProvider>
            <ToastContainer
              position='top-center'
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme='light'
            />
          </ChainContext.Provider>
        )}
      </AuthContext.Provider>
    )
  )} ;
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
