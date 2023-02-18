import {useEffect} from 'react';
import SharableData from '../components/SharableData.mjs';
import ShowBottomNavCards from "../scripts/showBottomNavCards.mjs";



export default function EarnTokens() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <div className="">
      <main className="main">
        
        
        
        <SharableData />
        
        <div style={{height: '100px'}}></div>
        <ShowBottomNavCards />

      </main>
    </div>
  );
}
