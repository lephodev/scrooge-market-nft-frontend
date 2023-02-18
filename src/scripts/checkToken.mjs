import { Navigate, useNavigate } from "react-router-dom";
import Axios from "axios";
import {useState} from 'react';
import getUserCookie from "../config/cookie.mjs";

export async function getCheckToken() {
  let resp;
  let user_id;
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
              resp = res;
              //console.log('in check: ',resp);
              //return resp;
              } else {
                //navigate("/login", { replace: true });
              }
            });
      } catch (error) {
        //navigate("/login", { replace: true });
      }
    } else {
      //navigate("/login", { replace: true });
    }
  
  //console.log('b4 return: ',resp);
  return resp;
}