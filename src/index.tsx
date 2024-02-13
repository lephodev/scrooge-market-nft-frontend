import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
//import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  ChainId,
  ThirdwebProvider /* coinbaseWallet */,
  metamaskWallet,
  walletConnect,
} from "@thirdweb-dev/react";
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
import AuthContext from "./context/authContext";
import { ToastContainer } from "react-toastify";
import { authInstance } from "./config/axios";
import LoadingPoker from "./images/scroogeHatLogo.png";
import PaymentSuccess from "./pages/PaymentSuccess.mjs";
import KycForm from "./pages/KycForm.mjs";
import BuyTokenFromOGJR from "./pages/BuyTokenFromOGJR.mjs";
import CloudWebsiteError from "./components/cloudWebsiteError.mjs";
import EarnFreeCoins from "./pages/EarnFreeCoins.mjs";
import scroogelogo from "./images/scroogeCasinoLogo.png";
import vpnbanner from "./images/vpn-banner.webp";
import notaccess from "./images/not-access.webp";

import PaymentCustom from "./pages/PaymentCustom.mjs";
// import { validateToken } from "./utils/dateUtils.mjs";

export default function App() {
  const [selectedChain, setSelectedChain] = useState<ChainId>(
    ChainId.BinanceSmartChainMainnet
  );
  const [user, setUser] = useState(null);
  const [spendedAmount, setSpendedAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateTimeNow, setDateTimeNow] = useState("");
  const [supportedWalletForMob, setSupportedWalletForMob] = useState(false);
  const [isVPNEnable, setIsVPNEnable] = useState(false);
  const [stateBlock, setStateBlock] = useState(false);

  const underMaintainance = false;

  useEffect(() => {
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (window.innerWidth <= 991 && window.innerWidth >= 768) {
      setSupportedWalletForMob(true);
    } else if (window.innerWidth <= 768) {
      setSupportedWalletForMob(true);
    } else {
      setSupportedWalletForMob(false);
    }
  }, []);
  // call this function when you want to authenticate the user
  const login = async () => {
    setLoading(true);
    // const basicAuthToken = validateToken();
    (await authInstance())
      .get("/auth/check-auth", {
        // headers: {
        //   Authorization: basicAuthToken,
        // },
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

  const getGeoLocationDetails = async () => {
    try {
      // const apiUrl = `http://api.vpnblocker.net/v2/json/${CurrentIp}`;
      const serverUrl = `/auth/getgeolocationDetails`;
      const response = await (await authInstance()).get(serverUrl);
      const ipAddressObject = {
        [Object.keys(response.data)[1]]:
          response.data[Object.keys(response.data)[1]],
      };
      const ipAddressss = Object.keys(ipAddressObject).find(
        (key) => key !== "status"
      );

      if (ipAddressss) {
        const { country, region, city } = ipAddressObject[ipAddressss];
        if (
          country.toString() !== "United States" &&
          country.toString() !== "Canada" &&
          country.toString() !== "India"
        ) {
          setStateBlock(true);
        }
        if (
          city.toString() === "Quebec" ||
          city.toString() === "Idaho" ||
          country.toString() === "Brazil" ||
          region.toString() === "Quebec" ||
          region.toString() === "Idaho" ||
          region.toString() === "Michigan" ||
          region.toString() === "Washington"
        ) {
          setStateBlock(true);
        }
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const checkVPN = async () => {
    try {
      if (localStorage.getItem("adminType") === "admin") return;
      const serverUrl = `/auth/validate_VPN`;
      const checkVPNRes = await (await authInstance()).get(serverUrl);
      setIsVPNEnable(checkVPNRes?.data?.vpnStatus);
    } catch (error) {
      console.log("err", error);
    }
  };

  useEffect(() => {
    (async () => {
      // const res = await axios.get("https://proxycheck.io/v2/");
      // const CurrentIp = res?.data;
      // console.log("res", res);

      // // eslint-disable-next-line no-console
      // console.log("CurrentIpAddress", CurrentIp);

      // const res1 = await axios.get(`https://ipapi.co/${CurrentIp}/city`);
      // // eslint-disable-next-line no-console
      // // console.log("city", res1?.data);
      // const reg = await axios.get(`https://ipapi.co/${CurrentIp}/region`);
      // console.log("reg", reg);
      // const countryName = res?.data?.country_name;
      // const region = reg?.data;
      // console.log("region", region);

      // const CurrentCity = res1?.data;
      // // eslint-disable-next-line no-constant-condition
      // if (
      //   CurrentCity.toString() === "Quebec" ||
      //   CurrentCity.toString() === "Washington" ||
      //   countryName.toString() === "Brazil" ||
      //   CurrentCity.toString() === "Idaho" ||
      //   region.toString() === "Quebec" ||
      //   region.toString() === "Idaho" ||
      //   region.toString() === "Michigan" ||
      //   region.toString() === "Washington"
      // ) {
      //   setStateBlock(true);
      // }
      await getGeoLocationDetails();
      await checkVPN();
    })();
  }, []);

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    return <Navigate to='/login' />;
  };
  if (underMaintainance) {
    return <UnderMaintenanceContent />;
  }

  return (
    <>
      {stateBlock || isVPNEnable ? (
        <div className='ip-block-content'>
          <div className='container'>
            <div className='ip-block-grid'>
              {isVPNEnable ? (
                <img
                  src={vpnbanner}
                  alt='Scrooge VPN'
                  loading='lazy'
                  className='img-fluid maintance-img'
                />
              ) : (
                <img
                  src={notaccess}
                  alt='Scrooge Access'
                  loading='lazy'
                  className='img-fluid maintance-img'
                />
              )}
            </div>
          </div>
        </div>
      ) : (
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
                supportedWallets={
                  supportedWalletForMob
                    ? [walletConnect()]
                    : [
                        metamaskWallet(),
                        walletConnect() /* ,coinbaseWallet() */,
                      ]
                }
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
                    <Route
                      path='/pay'
                      element={<ProtectedRoute component={<PaymentCustom />} />}
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
                      element={
                        <ProtectedRoute component={<BuyTokenFromOGJR />} />
                      }
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
      )}
    </>
  );
}

const UnderMaintenanceContent = () => {
  return (
    <div className='scrooge-under-content'>
      <img src={scroogelogo} alt='scrooge' />
      <h4>Under Maintainance</h4>
    </div>
  );
};

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
