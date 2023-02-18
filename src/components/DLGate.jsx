import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useAddress } from "@thirdweb-dev/react";

export const DLGate = ({ children }) => {
  const navigate = useNavigate();
  const address = useAddress();
  
  useEffect(() => {
    //console.log('use effect: ', address);
    if(address){
      //CheckDL();
    }
    
  }, [address]);

  async function CheckDL() {
    //check if user has DL (send to backend)
    
    /*console.log('gate address: ', address);
    try {
      const userRes = await Axios.get(`https://34.237.237.45:9001/api/getWalletDLBalance/${address}`).then((res) =>{ 
        console.log('DLgate: ',res);
        if (res.data >= 0) {
          console.log('Has DL');
        } else {
          console.log('Does not have DL');
          navigate("/", { replace: true });
        }
      });
    } catch (error) {
      console.log(error);
      navigate("/", { replace: true });
    } */
  };
  
  return children;
    
  
};

export async function CheckDLOnPage(address) {
  //check if user has DL (send to backend)
  let bal=0;
  //const navigate = useNavigate();
  //console.log('gate address: ', address);
  try {
    const userRes = await Axios.get(`https://34.237.237.45:9001/api/getWalletDLBalance/${address}`).then((res) =>{ 
      //console.log('DLgate: ',res);
      //console.log('res.data', res.data);
      if (res.data >= 0) {
        //console.log('Has DL');
        bal = res.data;
      } else {
        //console.log('Does not have DL');
        //navigate("/", { replace: true });
        bal = 0;
      }
    });
  } catch (error) {
    console.log(error);
    //navigate("/", { replace: true });
    bal = 0;
  } 
  return bal;
};