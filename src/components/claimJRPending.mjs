/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAddress, useSDK } from "@thirdweb-dev/react";
import JR_ABI from "../config/JR_ABI.json";
import Countdown from "react-countdown";
import LoadingPoker from "../images/scroogeHatLogo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useReward } from "react-rewards";

export default function ClaimJRPending() {
  const [contractObj, setContractObj] = useState("");
  const [claimableAmount, setClaimableAmount] = useState("");
  const [totalClaimed, setTotalClaimed] = useState("");
  const [secondsUntilClaim, setSecondsUntilClaim] = useState("");
  const [/* claimableIn */,setClaimableIn] = useState("");
  const [claimableInTime, setClaimableInTime] = useState();
  const [isClaiming, setIsClaiming] = useState(false);

  const { reward } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });
  const sdk = useSDK();
  const address = useAddress();
  const JRContractAddress = process.env.REACT_APP_JRCONTRACT_ADDRESS;

  const contractClaim = async () => {
    try {
      const contract = await sdk.getContractFromAbi(JRContractAddress, JR_ABI);
      setContractObj(contract);
      const divInfo = await contract.call("getAccountDividendsInfo", [address]);
      // const divInfo = await contract.call("getAccountDividendsInfo", address);
      setClaimableAmount((parseInt(divInfo[3]) / 10 ** 18).toFixed(4));
      setSecondsUntilClaim(parseInt(divInfo[7]));
      console.log("parseInt(divInfo[7]",parseInt(divInfo[7]));
      var t = new Date();
      /*if(parseInt(divInfo[7]) > 0){
              t.setSeconds(t.getSeconds() + parseInt(divInfo[7]));
          }*/
      t.setSeconds(t.getSeconds() + parseInt(divInfo[7]));
      setClaimableIn(t.toString());
      setClaimableInTime(t.getTime());
      setTotalClaimed((parseInt(divInfo[4]) / 10 ** 18).toFixed(4));
    } catch (error) {
      console.log("errrrr", error);
    }
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      await contractObj.call("claim");
      setIsClaiming(false);
      //console.log('claimed');
      notify("Your pending USDT rewards have been successfully claimed!");
      reward();
      contractClaim();
    } catch (error) {
      toast.error("Error claiming rewards. Please try again.");
      setIsClaiming(false);
    }
  };

  function getCountdown(claimableIn) {
    return <Countdown date={claimableIn}></Countdown>;
  }

  function notify(message) {
    toast(message);
  }

  useEffect(() => {
    contractClaim();
  }, [address]);

  return (
    <>
      {!isClaiming ? (
        <div>
          <span className="yellow">
            <strong>USDT REWARDS</strong>
          </span>
          <br></br>
          Claimable Amount: {claimableAmount} USDT<br></br>
          Total Rewards Claimed: {totalClaimed} USDT<br></br>
          <br />
          {address &&
          (secondsUntilClaim === 0 || { claimableInTime } >= Date.now()) ? (
            <div className='new-btn'>
              <button
                // className='claim-btn'
                onClick={() => handleClaim()}>
                Claim Pending Rewards
              </button>
            </div>
          ) : (
            <div className='claim-countdown'>
              Next Claim Available:<br></br>
              {claimableInTime ? (
                getCountdown(claimableInTime)
              ) : (
                <>Unavailable</>
              )}</div>
          )}
          <div style={{ width: "100%", textAlign: "center" }}>
            <div id="rewardId" style={{ margin: "0 auto" }} />
          </div>
        </div>
      ) : (
        <>
          <img src={LoadingPoker} alt="game" className="imageAnimation" />
        </>
      )}
    </>
  );
}

/*{(secondsUntilClaim === 0 && claimableAmount > 0 && claimableIn)?(<button className="claim-btn" onClick={()=>handleClaim()}>Claim Pending Rewards</button>)
            :(
                <>Claim in:{(claimableIn)?(<div>ClaimableIn: <Countdown date={claimableIn}>Claim Now</Countdown></div>):(<>Here</>)} </>)}
        */
