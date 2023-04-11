/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAddress, useSDK } from "@thirdweb-dev/react";
import OG_ABI from "../config/OG_ABI.json";
import Countdown from "react-countdown";
import LoadingPoker from "../images/scroogeHatLogo.png";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useReward } from "react-rewards";

export default function ClaimOGPending() {
  const [contractObj, setContractObj] = useState("");
  const [claimableAmount, setClaimableAmount] = useState("");
  const [totalClaimed, setTotalClaimed] = useState("");
  const [secondsUntilClaim, setSecondsUntilClaim] = useState("");
  const [/* claimableIn */, setClaimableIn] = useState("");
  const [claimableInTime, setClaimableInTime] = useState();
  const [isClaiming, setIsClaiming] = useState(false);

  const { reward } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });
  const sdk = useSDK();
  const address = useAddress();
  console.log("addedee24", address);
  const OGContractAddress = process.env.REACT_APP_OGCONTRACT_ADDRESS;
  console.log("OGContractAddressOGContractAddress25", OGContractAddress);
  const contractClaim = async () =>
    await sdk
      .getContractFromAbi(OGContractAddress, OG_ABI)
      .then(async (contract) => {
        console.log("contract29", contract);
        setContractObj(contract);
       await contract
          .call("getAccountDividendsInfo", [address])
          .then((divInfo) => {
            console.log("divInfo", divInfo);
            setClaimableAmount((parseInt(divInfo[3]) / 10 ** 18).toFixed(4));
            setSecondsUntilClaim(parseInt(divInfo[7]));
            var t = new Date();
            /*if(parseInt(divInfo[7]) > 0){
                t.setSeconds(t.getSeconds() + parseInt(divInfo[7]));
            }*/
            t.setSeconds(t.getSeconds() + parseInt(divInfo[7]));
            setClaimableIn(t.toString());
            setClaimableInTime(t.getTime());
            console.log("divInfo[4]", divInfo[4]);
            setTotalClaimed((parseInt(divInfo[4]) / 10 ** 18).toFixed(4));
          });
      });

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      await contractObj.call("claim");
      setIsClaiming(false);
      notify("Your pending BUSD rewards have been successfully claimed!");
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
  console.log("claimableAmount", claimableAmount, "totalClaimed", totalClaimed);
  return (
    <>
      {!isClaiming ? (
        <div>
          <span className='yellow'>
            <strong>BUSD REWARDS</strong>
          </span>
          <br></br>
          Claimable Amount: {claimableAmount} BUSD<br></br>
          Total Rewards Claimed: {totalClaimed} BUSD<br></br>
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
              )}
            </div>
          )}
          <div style={{ width: "100%", textAlign: "center" }}>
            <div id='rewardId' style={{ margin: "0 auto" }} />
          </div>
        </div>
      ) : (
        <>
          <img src={LoadingPoker} alt='game' className='imageAnimation' />
        </>
      )}
    </>
  );
}

/*{(secondsUntilClaim === 0 && claimableAmount > 0 && claimableIn)?(<button className="claim-btn" onClick={()=>handleClaim()}>Claim Pending Rewards</button>)
            :(
                <>Claim in:{(claimableIn)?(<div>ClaimableIn: <Countdown date={claimableIn}>Claim Now</Countdown></div>):(<>Here</>)} </>)}
        */
