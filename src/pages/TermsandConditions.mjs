import {useEffect} from 'react';
//import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function TermsandConditions() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);
  return (
    <div className="container">
      <main className="main">
      <h1 className="title">
          TERMS AND CONDITIONS
        </h1>
       
        
        <div className="contact-div">
        PLEASE CONSIDER THE FOLLOWING RISKS WHEN PURCHASING ANY DIGITAL ASSET INCLUDING BUT NOT LIMITED TO SCROOGE COIN. PLEASE NOTE THAT THE RISK DISCLAIMER IS NOT EXHAUSTIVE AND THERE MAY BE MORE RISKS.
        <br></br><br></br>
1. Price volatility and profitability- Scrooge Coin creator is in no way responsible for the increase or decrease of the coin. There is no guarantee in profits from said coin. The value of Scrooge Coin will be determined by the community whom buys/sells Scrooge Coin. 
<br></br><br></br>
2. Crypto wallets- Scrooge Coin must be held in a cryptographic wallet. The creator is in no way responsible for that wallet. You are solely responsible for your wallet and any information deemed necessary for the upkeep of said wallet. We do not hold keys to your wallet and will not be responsible for any loss if you lose your wallet.
<br></br><br></br>
3. Protocols- Tokens may be subject to theft/hacking. We cannot be held responsible for your personal frame work or security weaknesses. 
<br></br><br></br>
4. Laws and regulations- This token is not a security and is simply a digital property. We cannot and will not be held liable for any jurisdictional law changes or new regulatory frameworks. 
<br></br><br></br>
5. Taxation- If you make money off cryptocurrency, it is your responsibility to properly file the required tax information. We will not be held liable for any person or entity who does not pay taxes on the gains from any crypto asset they hold.
<br></br><br></br>
6. Unanticipated Risks- In addition to the risks outlined above, there are further risks when buying digital property. Such risks may further materialize and we cannot be held liable.
        </div>
        
        <br></br><br></br>        
      </main>
    </div>
  );
}
