import { Link } from "react-router-dom";
import WalletIcon from "../images/walletIcon.png";
import PokerChips from "../images/pokerChips.png";
import Casino from "../images/casino200.png";
import "../styles/Home.css";
import { scroogeClient } from "../config/keys.js";

export default function ShowBottomNavCards() {
  return (
    <div className='grid'>
      <Link to='/nft-tokens' className='card'>
        <h2>BUY CASINO NFTS &rarr;</h2>
        <p>
          Ready to step up to the table? Get everything you need to be a Scrooge
          Casino high roller.
        </p>
        <img
          className='card-img'
          src={Casino}
          alt='scrooge casino nft token packages'
        />
      </Link>

      <a href={scroogeClient} className='card' target='_blank' rel='noreferrer'>
        <h2>VISIT THE CASINO &rarr;</h2>
        <p>
          Have everything you need? Head on over to Scrooge Casino to get the
          party started.
        </p>
        <img
          className='card-img'
          src={PokerChips}
          alt='Redeem your token NFTs'
        />
      </a>

      <Link to='/my-wallet' className='card'>
        <h2>MY WALLET &rarr;</h2>
        <p>
          Peruse all of your digital goodies. You might just find that you need
          something new!
        </p>
        <img className='card-img' src={WalletIcon} alt='my wallet' />
      </Link>
    </div>
  );
}
