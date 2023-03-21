import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/authContext.ts";
import { marketPlaceInstance } from "../config/axios.js";

export default function AffiliateLeaderboard() {
  const { user } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboards, setShowLeaderboards] = useState(true);
  const [leaderboardByCount, setLeaderboardByCount] = useState([]);
  const [leaderboardByTokens, setLeaderboardByTokens] = useState([]);
  const [leaderboardHottestNewcomers, setLeaderboardHottestNewcomers] =
    useState([]);
  const [leaderboardMonthlyMovers, setLeaderboardMonthlyMovers] = useState([]);
  const [leaderboardTopSales, setLeaderboardTopSales] = useState([]);
  const [leaderboardTopRegisters, setLeaderboardTopRegisters] = useState([]);

  const getAffLeadersByCount = async (limit = 10, days = 0) => {
    try {
      const data = await marketPlaceInstance().get(
        `/getAffLeadersByCount/${limit}/${days}`
      );
      console.log("getbycount", data);
      if (data.data.success) {
        setLeaderboardByCount(data.data.data);
      } else {
        setLeaderboardByCount(data.data.message);
      }
    } catch (err) {
      setLeaderboardByCount("Error");
      console.error("bycount", err);
    }
  };

  const getAffLeadersByTokens = async (limit = 10, days = 0) => {
    try {
      const data = await marketPlaceInstance().get(
        `/getAffLeadersByTokens/${limit}/${days}`
      );
      if (data.data.success) {
        setLeaderboardByTokens(data.data.data);
      } else {
        setLeaderboardByTokens(data.data.message);
      }
    } catch (err) {
      setLeaderboardByTokens("Error");
      console.error("error", err);
    }
  };

  const getAffLeadersHottestNewcomers = async (limit = 10, days = 7) => {
    try {
      const data = await marketPlaceInstance().get(
        `/getAffLeadersByTokens/${limit}/${days}`
      );

      console.log("getAffLeadersByTokens: ", data.data);
      if (data.data.success) {
        setLeaderboardHottestNewcomers(data.data.data);
      } else {
        setLeaderboardHottestNewcomers(data.data.message);
      }
    } catch (err) {
      setLeaderboardHottestNewcomers("Error");
      console.error(err);
    }
  };

  const getAffLeadersMonthlyMovers = async (limit = 10, days = 30) => {
    try {
      const data = await marketPlaceInstance().get(
        `/getAffLeadersByTokens/${limit}/${days}`
      );
      if (data.data.success) {
        setLeaderboardMonthlyMovers(data.data.data);
      } else {
        setLeaderboardMonthlyMovers(data.data.message);
      }
    } catch (err) {
      setLeaderboardMonthlyMovers("Error");
      console.error(err);
    }
  };

  async function getAffLeadersTopSales(type = "order", limit = 10, days = 0) {
    try {
      marketPlaceInstance()
        .get(`/getAffLeadersByType/${type}/${limit}/${days}`)
        .then((data) => {
          //console.log("getAffLeadersByTokens: ", data.data);
          if (typeof data.data !== "string") setLeaderboardTopSales(data.data);
          return data.data;
        });
    } catch (err) {
      console.error(err);
    }
  }

  async function getAffLeadersTopRegisters(
    type = "register",
    limit = 10,
    days = 0
  ) {
    try {
      const data = await marketPlaceInstance().get(
        `/getAffLeadersByType/${type}/${limit}/${days}`
      );
      //console.log("getAffLeadersByTokens: ", data.data);
      if (data.data.success) {
        setLeaderboardTopRegisters(data.data.data);
      } else {
        setLeaderboardTopRegisters(data.data.message);
      }
    } catch (err) {
      setLeaderboardTopRegisters("Error");
      console.error(err);
    }
  }

  useEffect(() => {
    //checkToken();
    const getData = async () => {
      await getAffLeadersByCount();
      await getAffLeadersByTokens();
      await getAffLeadersHottestNewcomers();
      await getAffLeadersMonthlyMovers();
      await getAffLeadersTopRegisters();
      // getAffLeadersTopSales();
    };
    getData();
  }, []);

  return (
    <>
      {showLeaderboards ? (
        <div className='bordered-section'>
          <div className='flex-row-no-margin'>
            {leaderboardByCount !== "Error" ? (
              <>
                <div className='leaderboard-card-div'>
                  <div className='pageTitle' style={{ marginBottom: "20px" }}>
                    <h1>Affiliate Sales Leaders</h1>
                  </div>
                  {leaderboardByCount !== "No Entries Found For User" &&
                  leaderboardByCount !== "Error in Request Process" &&
                  leaderboardByCount.length ? (
                    leaderboardByCount.map((lead, index) => (
                      <div className='leaderboard-row' key={lead._id}>
                        <div>{index + 1}.</div>
                        <div>Affiliate ID: {lead._id}</div>
                        <div># of Sales: {lead.count}</div>
                      </div>
                    ))
                  ) : (
                    <div>
                      <div className='leaderboard-row'>
                        <div>No Data Found</div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

            {leaderboardByTokens !== "Error" ? (
              <>
                <div className='leaderboard-card-div'>
                  <div className='pageTitle' style={{ marginBottom: "20px" }}>
                    <h1>Affiliate Tokens Leaders</h1>
                  </div>
                  {leaderboardByTokens !== "No Entries Found For User" &&
                  leaderboardByTokens !== "Error in Request Process" &&
                  leaderboardByTokens.length ? (
                    leaderboardByTokens.map((lead, index) => (
                      <div className='leaderboard-row' key={lead._id}>
                        <div>{index + 1}.</div>
                        <div>Affiliate ID: {lead._id}</div>
                        <div>Earned: {lead.totalCommission} Tokens</div>
                      </div>
                    ))
                  ) : (
                    <div className='leaderboard-row'>No Data Found</div>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

            {leaderboardHottestNewcomers !== "Error" ? (
              <>
                <div className='leaderboard-card-div'>
                  <div className='pageTitle' style={{ marginBottom: "20px" }}>
                    <h1>Hottest Newcomers</h1>
                  </div>
                  {leaderboardHottestNewcomers !==
                    "No Entries Found For User" &&
                  leaderboardHottestNewcomers !== "Error in Request Process" &&
                  leaderboardHottestNewcomers.length ? (
                    leaderboardHottestNewcomers.map((lead, index) => (
                      <div className='leaderboard-row' key={lead._id}>
                        <div>{index + 1}.</div>
                        <div>Affiliate ID: {lead._id}</div>
                        <div>Earned: {lead.totalCommission} Tokens</div>
                      </div>
                    ))
                  ) : (
                    <div className='leaderboard-row'>No Data Found</div>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

            {leaderboardMonthlyMovers !== "Error" ? (
              <>
                <div className='leaderboard-card-div'>
                  <div className='pageTitle' style={{ marginBottom: "20px" }}>
                    <h1>Monthly Movers</h1>
                  </div>
                  {leaderboardMonthlyMovers !== "No Entries Found For User" &&
                  leaderboardMonthlyMovers !== "Error in Request Process" &&
                  leaderboardMonthlyMovers.length ? (
                    leaderboardMonthlyMovers.map((lead, index) => (
                      <div className='leaderboard-row' key={lead._id}>
                        <div>{index + 1}.</div>
                        <div>Affiliate ID: {lead._id}</div>
                        <div>Earned: {lead.totalCommission} Tokens</div>
                      </div>
                    ))
                  ) : (
                    <div className='leaderboard-row'>No Data Found</div>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

            {leaderboardTopRegisters !== "Error" ? (
              <>
                <div className='leaderboard-card-div'>
                  <div className='pageTitle' style={{ marginBottom: "20px" }}>
                    <h1>Top User Referrals</h1>
                  </div>
                  {leaderboardTopRegisters !== "No Entries Found For User" &&
                  leaderboardTopRegisters !== "Error in Request Process" &&
                  leaderboardTopRegisters.length ? (
                    leaderboardTopRegisters.map((lead, index) => (
                      <div className='leaderboard-row' key={lead._id}>
                        <div>{index + 1}.</div>
                        <div>Affiliate ID: {lead._id}</div>
                        <div>Earned: {lead.totalCommission} Tokens</div>
                      </div>
                    ))
                  ) : (
                    <div className='leaderboard-row'>No Data Found</div>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

            {leaderboardTopSales !== "Error" ? (
              <>
                <div className='leaderboard-card-div'>
                  <div className='pageTitle' style={{ marginBottom: "20px" }}>
                    <h1>Top Product Sales</h1>
                  </div>
                  {leaderboardTopSales !== "No Entries Found For User" &&
                  leaderboardTopSales !== "Error in Request Process" &&
                  leaderboardTopSales.length ? (
                    leaderboardTopSales.map((lead, index) => (
                      <div className='leaderboard-row' key={lead._id}>
                        <div>{index + 1}.</div>
                        <div>Affiliate ID: {lead._id}</div>
                        <div>Earned: {lead.totalCommission} Tokens</div>
                      </div>
                    ))
                  ) : (
                    <div className='leaderboard-row'>No Data Found</div>
                  )}
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
