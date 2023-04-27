import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import HolderClaimChips from './HolderClaimChips.mjs';
import { DLGate } from '../components/DLGate.jsx';
import DLClaimTokens from './DLClaimTokens.mjs';
import Layout from './Layout.mjs';
import ShowBottomNavCards from '../scripts/showBottomNavCards.mjs';
import DailyRewards from '../components/DailyRewards.mjs';

const EarnFreeCoins = () => {
    const [key, setKey] = useState('dailyClaims');
  return (
    <Layout>
    <div>
        <div className='tab-btn'>
            <Button className={`${key === 'dailyClaims' ? 'active-btn' : ''}`} onClick={ () => setKey("dailyClaims")}>Daily Claims</Button>
            <Button className={`${key === 'monthlyClaims' ? 'active-btn' : ''}`} onClick={ () => setKey("monthlyClaims")}>Monthly Claims</Button>
            <Button className={`${key === 'duckyLuckClaims' ? 'active-btn' : ''}`} onClick={ () => setKey("duckyLuckClaims")}>Ducky Luck Claims</Button>
        </div>
    <div className='tabs-claim'>
      { key ==="dailyClaims" ? (
      <div className='tab-claims'>
          <DailyRewards />
      </div>): key === "monthlyClaims" ? (
        <div className='tab-claims'>
            <HolderClaimChips />
        </div>
      ) : key === "duckyLuckClaims" ?(
        <div>
        <DLGate>
        <DLClaimTokens />
    </DLGate>
    </div>
      ) : ""}
      </div>
    <div className='flex-row' style={{ margin: "50px auto 0px" }}>
            <ShowBottomNavCards />
          </div>
    </div>
    </Layout>
  )
}

export default EarnFreeCoins