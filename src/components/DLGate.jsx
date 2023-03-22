import {useEffect} from "react"
import {useAddress} from "@thirdweb-dev/react"
import {marketPlaceInstance} from "../config/axios"

export const DLGate = ({children}) => {
  const address = useAddress()

  useEffect(() => {
    //console.log('use effect: ', address);
    if (address) {
      //CheckDL();
    }
  }, [address])
  return children
}

export async function CheckDLOnPage(address) {
  //check if user has DL (send to backend)
  console.log("abba")
  let bal = 0
  try {
    await marketPlaceInstance()
      .get(`/getWalletDLBalance/${address}`)
      .then(res => {
        if (res.data >= 0) {
          bal = res.data
        } else {
          bal = 0
        }
      })
    console.log("hgfg")
  } catch (error) {
    console.log(error)
    bal = 0
  }
  console.log("aafgafa")
  return bal
}
