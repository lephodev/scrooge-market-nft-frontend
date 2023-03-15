import {useContext, useEffect, useState} from 'react';
import Axios from 'axios';
import AuthContext from '../context/authContext.ts';
import { marketPlaceInstance } from '../config/axios.js';

export default function AffiliateLeaderboard(){

   const { user } = useContext(AuthContext);
    const [leaderboard, setLeaderboard]=useState([]);
    const [showLeaderboards, setShowLeaderboards]=useState(true);
    const [leaderboardByCount, setLeaderboardByCount]=useState([]);
    const [leaderboardByTokens, setLeaderboardByTokens]=useState([]);
    const [leaderboardHottestNewcomers, setLeaderboardHottestNewcomers]=useState([]);
    const [leaderboardMonthlyMovers, setLeaderboardMonthlyMovers]=useState([]);
    const [leaderboardTopSales, setLeaderboardTopSales]=useState([]);
    const [leaderboardTopRegisters, setLeaderboardTopRegisters]=useState([]);

    async function getAffLeadersByCount(limit=10, days=0) {
        try {
            marketPlaceInstance().get(`/getAffLeadersByCount/${limit}/${days}`).then((data)=>{
                //console.log("getAffLeadersByCount: ", data.data);
                if(typeof data.data !== "string")
                setLeaderboardByCount(data.data);
                return data.data;
            });
        } catch (err) {
            console.error(err);
        };
    }

    async function getAffLeadersByTokens(limit=10, days=0) {
        try {
            marketPlaceInstance().get(`/getAffLeadersByTokens/${limit}/${days}`).then((data)=>{
                //console.log("getAffLeadersByTokens: ", data.data);
                if(typeof data.data !== "string")
                setLeaderboardByTokens(data.data);
                return data.data;
            });
        } catch (err) {
            console.error(err);
        };
    }

    async function getAffLeadersHottestNewcomers(limit=10, days=7) {
        try {
            marketPlaceInstance().get(`/getAffLeadersByTokens/${limit}/${days}`).then((data)=>{
                //console.log("getAffLeadersByTokens: ", data.data);
                if(typeof data.data !== "string")
                setLeaderboardHottestNewcomers(data.data);
                return data.data;
            });
        } catch (err) {
            console.error(err);
        };
    }

    async function getAffLeadersMonthlyMovers(limit=10, days=30) {
        try {
            marketPlaceInstance().get(`/getAffLeadersByTokens/${limit}/${days}`).then((data)=>{
                //console.log("getAffLeadersByTokens: ", data.data);
                if(typeof data.data !== "string")
                setLeaderboardMonthlyMovers(data.data);
                return data.data;
            });
        } catch (err) {
            console.error(err);
        };
    }




    async function getAffLeadersTopSales(type='order', limit=10, days=0) {
        try {
            marketPlaceInstance().get(`/getAffLeadersByType/${type}/${limit}/${days}`).then((data)=>{
                //console.log("getAffLeadersByTokens: ", data.data);
                if(typeof data.data !== "string")
                setLeaderboardTopSales(data.data);
                return data.data;
            });
        } catch (err) {
            console.error(err);
        };
    }

    async function getAffLeadersTopRegisters(type='register', limit=10, days=0) {
        try {
            marketPlaceInstance().get(`/getAffLeadersByType/${type}/${limit}/${days}`).then((data)=>{
                //console.log("getAffLeadersByTokens: ", data.data);
                if(typeof data.data !== "string")
                setLeaderboardTopRegisters(data.data);
                return data.data;
            });
        } catch (err) {
            console.error(err);
        };
    }

    
    
    useEffect(() => {
        //checkToken();
        getAffLeadersByCount();
        getAffLeadersByTokens();
        getAffLeadersHottestNewcomers();
        getAffLeadersMonthlyMovers();
        getAffLeadersTopRegisters();
        getAffLeadersTopSales();
      }, []);


    return (<>
    {(showLeaderboards)?(

    
    <div className="bordered-section">
        <div className="flex-row-no-margin">
            {(leaderboardByCount.length > 0)?(<>
                <div className='leaderboard-card-div'>
                    <div className="pageTitle" style={{marginBottom: "20px"}}>
                        <h1>Affiliate Sales Leaders</h1>
                    </div>
                    {leaderboardByCount.map((lead, index) => (
                        <div className='leaderboard-row' key={lead._id}>
                            <div>{index+1}.</div>
                            <div>Affiliate ID: {lead._id}</div>
                            <div># of Sales: {lead.count}</div>
                        </div>
                    ))}
                </div>
            </>):(<></>)}

            {(leaderboardByTokens.length > 0)?(<>
                <div className='leaderboard-card-div'>
                    <div className="pageTitle" style={{marginBottom: "20px"}}>
                        <h1>Affiliate Tokens Leaders</h1>
                    </div>
                    {leaderboardByTokens.map((lead, index) => (
                        <div className='leaderboard-row' key={lead._id}>
                            <div>{index+1}.</div>
                            <div>Affiliate ID: {lead._id}</div>
                            <div>Earned: {lead.totalCommission} Tokens</div>
                        </div>
                    ))}
                </div>
            </>):(<></>)}

            {(leaderboardHottestNewcomers.length > 0)?(<>
                <div className='leaderboard-card-div'>
                    <div className="pageTitle" style={{marginBottom: "20px"}}>
                        <h1>Hottest Newcomers</h1>
                    </div>
                    {leaderboardHottestNewcomers.map((lead, index) => (
                        <div className='leaderboard-row' key={lead._id}>
                            <div>{index+1}.</div>
                            <div>Affiliate ID: {lead._id}</div>
                            <div>Earned: {lead.totalCommission} Tokens</div>
                        </div>
                    ))}
                </div>
            </>):(<></>)}

            {(leaderboardMonthlyMovers.length > 0)?(<>
                <div className='leaderboard-card-div'>
                    <div className="pageTitle" style={{marginBottom: "20px"}}>
                        <h1>Monthly Movers</h1>
                    </div>
                    {leaderboardMonthlyMovers.map((lead, index) => (
                        <div className='leaderboard-row' key={lead._id}>
                            <div>{index+1}.</div>
                            <div>Affiliate ID: {lead._id}</div>
                            <div>Earned: {lead.totalCommission} Tokens</div>
                        </div>
                    ))}
                </div>
            </>):(<></>)}

            {(leaderboardTopRegisters.length > 0)?(<>
                <div className='leaderboard-card-div'>
                    <div className="pageTitle" style={{marginBottom: "20px"}}>
                        <h1>Top User Referrals</h1>
                    </div>
                    {leaderboardTopRegisters.map((lead, index) => (
                        <div className='leaderboard-row' key={lead._id}>
                            <div>{index+1}.</div>
                            <div>Affiliate ID: {lead._id}</div>
                            <div>Earned: {lead.totalCommission} Tokens</div>
                        </div>
                    ))}
                </div>
            </>):(<></>)}

            {(leaderboardTopSales.length > 0)?(<>
                <div className='leaderboard-card-div'>
                    <div className="pageTitle" style={{marginBottom: "20px"}}>
                        <h1>Top Product Sales</h1>
                    </div>
                    {leaderboardTopSales.map((lead, index) => (
                        <div className='leaderboard-row' key={lead._id}>
                            <div>{index+1}.</div>
                            <div>Affiliate ID: {lead._id}</div>
                            <div>Earned: {lead.totalCommission} Tokens</div>
                        </div>
                    ))}
                </div>
            </>):(<></>)}

        </div>
        

    </div>
    ):(<></>)}
    </>);
}