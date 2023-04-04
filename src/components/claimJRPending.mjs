import { useContext, useEffect, useState } from "react";
import { useAddress, useSDK, useSDKContext } from "@thirdweb-dev/react";
import JR_ABI from "../config/JR_ABI.json";
import Countdown from "react-countdown";
import LoadingPoker from "../images/scroogeHatLogo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useReward } from "react-rewards";

export default function ClaimJRPending() {
  const [contractObj, setContractObj] = useState("");
  const [claimableAmount, setClaimableAmount] = useState("");
  const [totalClaimed, setTotalClaimed] = useState("");
  const [secondsUntilClaim, setSecondsUntilClaim] = useState("");
  const [claimableIn, setClaimableIn] = useState("");
  const [claimableInTime, setClaimableInTime] = useState();
  const [isClaiming, setIsClaiming] = useState(false);

  const { reward, isAnimating } = useReward("rewardId", "confetti", {
    colors: ["#D2042D", "#FBFF12", "#AD1927", "#E7C975", "#FF0000"],
  });
  const sdk = useSDK();
  const address = useAddress();
  const JRContractAddress = "0x2e9F79aF51dD1bb56Bbb1627FBe4Cc90aa8985Dd";

  const contractClaim = async () => {
    try {
      console.log("contractClaimcalled");
      const contract = await sdk.getContractFromAbi(JRContractAddress, JR_ABI);
      console.log("claimJRPEnding contract", contract);
      setContractObj(contract);
      const divInfo = await contract.call("getAccountDividendsInfo", address);
      // const divInfo = await contract.call("getAccountDividendsInfo", address);
      console.log("claimjrpending divInfo", divInfo);
      setClaimableAmount((parseInt(divInfo[3]) / 10 ** 18).toFixed(4));
      setSecondsUntilClaim(parseInt(divInfo[7]));
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
      const claimCall = await contractObj.call("claim");
      setIsClaiming(false);
      //console.log('claimed');
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
