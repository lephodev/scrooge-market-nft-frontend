import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import Axios from "axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data) => {
    let access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Mzk5Y2IyMzU0YTFkZDhiZGQ4NDJhMWEiLCJpYXQiOjE2NzM2NjY4MjEsImV4cCI6MTY3Mzg0NjgyMSwidHlwZSI6ImFjY2VzcyJ9.5xrDX0mbq55s1pd7x5cM7GB_yBPkBnJBleCO-iD8MAI';
    fetch('https://api.scrooge.casino/v1/auth/check-auth',{
      headers:{
        Authorization: `Bearer ${access_token}`
      }
    }).then(user =>{ 
      // console.log(convertedData)
      if (typeof user.data.user.id !== "undefined") {
          setUser({
            id: user.data.user.id
            //isAdmin: convertedData.isAdmin
          });
         // console.log(user)
      } else {
        setUser(null);
        navigate("/", { replace: true });
      }
    });
    setUser({
      id: '51515'
      //isAdmin: convertedData.isAdmin
    });
    //return user;

    //setUser(user);
    //navigate("/explore");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};