import { useEffect, useState } from 'react';
import Axios from 'axios';

export default function AffiliateLeaderboard() {
  let user_id;
  const [user, setUser] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboards, setShowLeaderboards] = useState(true);
  const [leaderboardByCount, setLeaderboardByCount] = useState([]);
  const [leaderboardByTokens, setLeaderboardByTokens] = useState([]);
  const [leaderboardHottestNewcomers, setLeaderboardHottestNewcomers] =
    useState([]);
  const [leaderboardMonthlyMovers, setLeaderboardMonthlyMovers] = useState([]);
  const [leaderboardTopSales, setLeaderboardTopSales] = useState([]);
  const [leaderboardTopRegisters, setLeaderboardTopRegisters] = useState([]);

  async function getAffLeadersByCount(limit = 10, days = 0) {
    Axios.get(`http://localhost:9001/api/getAffLeadersByCount/${limit}/${days}`)
      .then((data) => {
        console.log('getAffLeadersByCount: ', data);
        setLeaderboardByCount(data.data);
        return data.data;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function getAffLeadersByTokens(limit = 10, days = 0) {
    Axios.get(
      `http://localhost:9001/api/getAffLeadersByTokens/${limit}/${days}`
    )
      .then((data) => {
        //console.log("getAffLeadersByTokens: ", data.data);
        console.log('getAffLeadersBytoken', data);
        setLeaderboardByTokens(data.data);
        return data.data;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function getAffLeadersHottestNewcomers(limit = 10, days = 7) {
    try {
      Axios.get(
        `http://localhost:9001/api/getAffLeadersByTokens/${limit}/${days}`
      ).then((data) => {
        //console.log("getAffLeadersByTokens: ", data.data);
        setLeaderboardHottestNewcomers(data.data);
        return data.data;
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function getAffLeadersMonthlyMovers(limit = 10, days = 30) {
    try {
      Axios.get(
        `http://localhost:9001/api/getAffLeadersByTokens/${limit}/${days}`
      ).then((data) => {
        //console.log("getAffLeadersByTokens: ", data.data);
        setLeaderboardMonthlyMovers(data.data);
        return data.data;
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function getAffLeadersTopSales(type = 'order', limit = 10, days = 0) {
    try {
      Axios.get(
        `http://localhost:9001/api/getAffLeadersByType/${type}/${limit}/${days}`
      ).then((data) => {
        //console.log("getAffLeadersByTokens: ", data.data);
        setLeaderboardTopSales(data.data);
        return data.data;
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function getAffLeadersTopRegisters(
    type = 'register',
    limit = 10,
    days = 0
  ) {
    try {
      Axios.get(
        `http://localhost:9001/api/getAffLeadersByType/${type}/${limit}/${days}`
      ).then((data) => {
        //console.log("getAffLeadersByTokens: ", data.data);
        setLeaderboardTopRegisters(data.data);
        return data.data;
      });
    } catch (err) {
      console.error(err);
    }
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

  return (
    <>
      {showLeaderboards ? (
        <div className='bordered-section'>
          <div className='flex-row-no-margin'>
            {leaderboardByCount.length > 0 ? (
              <>
                <div className='leaderboard-card-div'>
                  <div className='pageTitle' style={{ marginBottom: '20px' }}>
                    <h1>Affiliate Sales Leaders</h1>
                  </div>
                  {leaderboardByCount.map((lead, index) => (
                    <div className='leaderboard-row' key={lead._id}>
                      <div>{index + 1}.</div>
                      <div>Affiliate ID: {lead._id}</div>
                      <div># of Sales: {lead.count}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}

            {leaderboardByTokens.length > 0 ? (
              <>
                <div className='leaderboard-card-div'>
                  <div className='pageTitle' style={{ marginBottom: '20px' }}>
                    <h1>Affiliate Tokens Leaders</h1>
                  </div>
                  {leaderboardByTokens.map((lead, index) => (
                    <div className='leaderboard-row' key={lead._id}>
                      <div>{index + 1}.</div>
                      <div>Affiliate ID: {lead._id}</div>
                      <div>Earned: {lead.totalCommission} Tokens</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}

            {leaderboardHottestNewcomers.length > 0 ? (
              <>
                <div className='leaderboard-card-div'>
                  <div className='pageTitle' style={{ marginBottom: '20px' }}>
                    <h1>Hottest Newcomers</h1>
                  </div>
                  {leaderboardHottestNewcomers.map((lead, index) => (
                    <div className='leaderboard-row' key={lead._id}>
                      <div>{index + 1}.</div>
                      <div>Affiliate ID: {lead._id}</div>
                      <div>Earned: {lead.totalCommission} Tokens</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}

            {leaderboardMonthlyMovers.length > 0 ? (
              <>
                <div className='leaderboard-card-div'>
                  <div className='pageTitle' style={{ marginBottom: '20px' }}>
                    <h1>Monthly Movers</h1>
                  </div>
                  {leaderboardMonthlyMovers.map((lead, index) => (
                    <div className='leaderboard-row' key={lead._id}>
                      <div>{index + 1}.</div>
                      <div>Affiliate ID: {lead._id}</div>
                      <div>Earned: {lead.totalCommission} Tokens</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}

            {leaderboardTopRegisters.length > 0 ? (
              <>
                <div className='leaderboard-card-div'>
                  <div className='pageTitle' style={{ marginBottom: '20px' }}>
                    <h1>Top User Referrals</h1>
                  </div>
                  {leaderboardTopRegisters.map((lead, index) => (
                    <div className='leaderboard-row' key={lead._id}>
                      <div>{index + 1}.</div>
                      <div>Affiliate ID: {lead._id}</div>
                      <div>Earned: {lead.totalCommission} Tokens</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}

            {leaderboardTopSales.length > 0 ? (
              <>
                <div className='leaderboard-card-div'>
                  <div className='pageTitle' style={{ marginBottom: '20px' }}>
                    <h1>Top Product Sales</h1>
                  </div>
                  {leaderboardTopSales.map((lead, index) => (
                    <div className='leaderboard-row' key={lead._id}>
                      <div>{index + 1}.</div>
                      <div>Affiliate ID: {lead._id}</div>
                      <div>Earned: {lead.totalCommission} Tokens</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
