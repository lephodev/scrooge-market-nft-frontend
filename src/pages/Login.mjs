import {useContext, useEffect} from 'react';
import ScroogeCasino from '../images/scroogeCasinoLogo.png';
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/authContext.ts';
import Layout from './Layout.mjs';

export default function Login() {
  const { user } = useContext(AuthContext);
 const navigate = useNavigate();
 useEffect(() => {
  console.log("login", user)
  if(user){
    navigate('/')
  }
 },[user, navigate]);

  return (
    <Layout>
    <div className="container">
      <main className="main">
      
        <div className="login-page-body">
          <div>
            <img className="login-page-img" src={ScroogeCasino} alt="Everything you need for Scrooge Casino" />
          </div>
          <div className="login-page-desc">
            You must be logged into your Scrooge Casino player account in order to access several areas of this marketplace. 
            Please <a href="https://scrooge.casino/login" target="_blank" rel="noreferrer" alt="Login to Scrooge Casino">LOG IN</a> and then return to the marketplace.
          </div>
          <a href="https://scrooge.casino/login" target="_blank" rel="noreferrer" alt="Login to Scrooge Casino"><button className="submit-btn">LOGIN TO YOUR SCROOGE CASINO ACCOUNT</button></a>
        </div>
        


      </main>
    </div>
    </Layout>
  );
}
