import {useEffect, useState} from 'react';
import Axios from 'axios';

export default function RaffleCard(){
    let raffle_id;
    const [raffle, setRaffle]=useState([]);
    const [leaderboard, setLeaderboard]=useState([]);
    const [showLeaderboards, setShowLeaderboards]=useState(true);
    const [leaderboardByCount, setLeaderboardByCount]=useState([]);
    const [leaderboardByTokens, setLeaderboardByTokens]=useState([]);

       
    
    useEffect(() => {

      }, []);


    return (<>
    {(raffle)?(

    
    <div className="bordered-section">
        <div className="flex-row-no-margin">
            
                <div className='leaderboard-card-div'>
                    <div className="pageTitle" style={{marginBottom: "20px"}}>
                        <h1>Raffle #1</h1>
                    </div>
                        <div className='leaderboard-row'>
                            <div>.</div>
                            <div>Affiliate ID: </div>
                            <div># of Sales: </div>
                        </div>
                </div>

        </div>
        

    </div>
    ):(<></>)}
    </>);
}