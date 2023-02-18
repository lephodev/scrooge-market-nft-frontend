import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Axios from "axios";
import getUserCookie from "../config/cookie.mjs";
export const AuthContext = createContext();

export const AuthProvider = function({ user, children }) {
  const [currentUser, setCurrentUser] = useState(user);

  const setAuth = (data) => {
      sessionStorage.setItem('username', data.data.user.username);
      sessionStorage.setItem('id', data.data.user.id);
      sessionStorage.setItem('firstName', data.data.user.username);
      sessionStorage.setItem('lastName', data.data.user.id);
      sessionStorage.setItem('profile', data.data.user.profile);
      sessionStorage.setItem('ticket', data.data.user.ticket);
      sessionStorage.setItem('wallet', data.data.user.wallet);
      setCurrentUser(data.user);
  }

  return (
      <AuthContext.Provider value={{ currentUser, setCurrentUser: setAuth }}>
          {children}
      </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}

export const ProtectedRoute = ({ children }) => {
  
  //const [user, setUser] = useLocalStorage("user", null);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  
   
  useEffect(() => {
    window.scrollTo(0, 0);
    checkToken();
  }, []);

  async function checkToken() {
    //let access_token = Cookies.get('token', { domain: 'scrooge.casino' });
    let access_token = getUserCookie();
   
    if (access_token){
      try {
        const userRes = await Axios.get(`https://api.scrooge.casino/v1/auth/check-auth`, {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        }).then((res) =>{ 
          //console.log('resy: ',res);
          if (typeof res.data.user.id !== "undefined") {
              setUser({
                id: res.data.user.id,
                username: res.data.user.username,
                firstName: res.data.user.firstName,
                lastName: res.data.user.lastName,
                profile: res.data.user.profile,
                ticket: res.data.user.ticket,
                wallet: res.data.user.wallet
              });
                //console.log('Usera: ',user);
              } else {
                setUser(null);
                //console.log('Userx: ',user);
                navigate("/login", { replace: true });
              }
            });
      } catch (error) {
        setUser(null);
        //console.log('User4: ',user);
        navigate("/login", { replace: true });
      }
        
    } else {
      setUser(null);
      navigate("/login", { replace: true });
      //console.log('else statement');
    }
  }
  
    
  return children;
};