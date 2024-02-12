import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/authContext.ts";
import { marketPlaceInstance } from "../config/axios.js";
import { Button, Collapse } from "react-bootstrap";

export default function AffiliateLeaderboard() {
  const { user } = useContext(AuthContext);
  // const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboards] = useState(true);
  const [leaderboardByCount, setLeaderboardByCount] = useState([]);
  const [leaderboardByTokens, setLeaderboardByTokens] = useState([]);
  const [leaderboardHottestNewcomers, setLeaderboardHottestNewcomers] =
    useState([]);
  const [leaderboardMonthlyMovers, setLeaderboardMonthlyMovers] = useState([]);
  const [leaderboardTopSales, setLeaderboardTopSales] = useState([]);
  const [leaderboardTopRegisters, setLeaderboardTopRegisters] = useState([]);
  const [openSales, setOpenSales] = useState(false);
  const [openTokens, setOpenTokens] = useState(false);
  const [openhottest, setOpenhottest] = useState(false);
  const [openMovers, setOpenMovers] = useState(false);
  const [openUserReferals, setOpenUserReferals] = useState(false);
  const [openProductSales, setOpenProductSales] = useState(false);

  const getAffLeadersByCount = async (limit = 10, days = 0) => {
    try {
      const data = await (await marketPlaceInstance()).get(
        `/getAffLeadersByCount/${limit}/${days}`
      );
      // console.log("getbycount", data);
      if (data.data.success) {
        setLeaderboardByCount(data.data.data);
      } else {
        setLeaderboardByCount(data.data.message);
      }
    } catch (err) {
      setLeaderboardByCount("Error");
      // console.error("bycount", err);
    }
  };

  const getAffLeadersByTokens = async (limit = 10, days = 0) => {
    try {
      const data = await (await marketPlaceInstance()).get(
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
      const data = await (await marketPlaceInstance()).get(
        `/getAffLeadersByTokens/${limit}/${days}`
      );

      // console.log("getAffLeadersByTokens: ", data.data);
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
      const data = await (await marketPlaceInstance()).get(
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
      (await marketPlaceInstance())
        .get(`/getAffLeadersByType/${type}/${limit}/${days}`)
        .then((data) => {
          if (typeof data.data !== "string")
            setLeaderboardTopSales(data?.data?.data);
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
      const data = await (await marketPlaceInstance()).get(
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
      // getAffLeadersTopSales
      await getAffLeadersTopSales();
    };
    getData();
  }, []);

  console.log("userrr", user);
  return (
    <>
      {showLeaderboards ? (
        <div className="bordered-section">
          <div className="text-animate">
            <h1>LEADERBOARDS</h1>
          </div>
          <div className="flex-row-no-margin">
            {leaderboardByCount !== "Error" ? (
              <>
                <div className="leaderboard-card-div">
                  <div
                    className="pageTitless text-animate"
                    style={{ marginBottom: "20px" }}
                  >
                    <h4>Affiliate Sales Leaders</h4>
                  </div>
                  {leaderboardByCount !== "No Entries Found For User" &&
                  leaderboardByCount !== "Error in Request Process" &&
                  leaderboardByCount.length ? (
                    <>
                      <div
                        className="leaderboard-row"
                        key={leaderboardByCount[0]?._id}
                      >
                        <div className="leaderboard-left">
                          <p>1.</p>
                          <p>Affiliate ID: {leaderboardByCount[0]?._id}</p>
                        </div>
                        <div className="leaderboard-right">
                          <p># of Sales: {leaderboardByCount[0]?.count}</p>
                        </div>
                      </div>
                      <div className="affiliate-dropdown">
                        <Collapse in={openSales}>
                          <div id="example-collapse-text">
                            {leaderboardByCount
                              ?.slice(1)
                              ?.map((lead, index) => (
                                <div className="leaderboard-row" key={lead._id}>
                                  <div className="leaderboard-left">
                                    <p>{index + 2}.</p>
                                    <p>Affiliate ID: {lead._id}</p>
                                  </div>
                                  <div className="leaderboard-right">
                                    <p># of Sales: {lead.count}</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </Collapse>
                        <Button
                          className={`affiliate-dropdownBtn ${
                            openSales ? "close" : "open"
                          } `}
                          onClick={() => setOpenSales(!openSales)}
                          aria-controls="example-collapse-text"
                          aria-expanded={openSales}
                        >
                          See {openSales ? "Less" : "More"} ...
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="no-data">No Data Found</div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

            {leaderboardByTokens !== "Error" ? (
              <>
                <div className="leaderboard-card-div">
                  <div
                    className="pageTitless text-animate"
                    style={{ marginBottom: "20px" }}
                  >
                    <h4>Affiliate Tokens Leaders</h4>
                  </div>
                  {leaderboardByTokens !== "No Entries Found For User" &&
                  leaderboardByTokens !== "Error in Request Process" &&
                  leaderboardByTokens.length ? (
                    <>
                      <div
                        className="leaderboard-row"
                        key={leaderboardByTokens[0]?._id}
                      >
                        <div className="leaderboard-left">
                          <p>1.</p>
                          <p>Affiliate ID: {leaderboardByTokens[0]?._id}</p>
                        </div>
                        <div className="leaderboard-right">
                          <p>
                            Earned: {leaderboardByTokens[0]?.totalCommission}{" "}
                            Tokens
                          </p>
                        </div>
                      </div>
                      <div className="affiliate-dropdown">
                        <Collapse in={openTokens}>
                          <div id="example-collapse-text">
                            {leaderboardByTokens
                              ?.slice(1)
                              ?.map((lead, index) => (
                                <div className="leaderboard-row" key={lead._id}>
                                  <div className="leaderboard-left">
                                    <p>{index + 2}.</p>
                                    <p>Affiliate ID: {lead._id}</p>
                                  </div>
                                  <div className="leaderboard-right">
                                    <p>Earned: {lead.totalCommission} Tokens</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </Collapse>
                        <Button
                          className={`affiliate-dropdownBtn ${
                            openTokens ? "close" : "open"
                          } `}
                          onClick={() => setOpenTokens(!openTokens)}
                          aria-controls="example-collapse-text"
                          aria-expanded={openTokens}
                        >
                          See {openTokens ? "Less" : "More"} ...
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="">
                      {" "}
                      <div className="no-data">No Data Found</div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

            {leaderboardHottestNewcomers !== "Error" ? (
              <>
                <div className="leaderboard-card-div">
                  <div
                    className="pageTitlesss text-animate"
                    style={{ marginBottom: "20px" }}
                  >
                    <h4>Hottest Newcomers</h4>
                  </div>
                  {leaderboardHottestNewcomers !==
                    "No Entries Found For User" &&
                  leaderboardHottestNewcomers !== "Error in Request Process" &&
                  leaderboardHottestNewcomers.length ? (
                    <>
                      <div
                        className="leaderboard-row"
                        key={leaderboardHottestNewcomers[0]?._id}
                      >
                        <div className="leaderboard-left">
                          <p>1.</p>
                          <p>
                            Affiliate ID: {leaderboardHottestNewcomers[0]?._id}
                          </p>
                        </div>
                        <div className="leaderboard-right">
                          <p>
                            <p>
                              Earned:{" "}
                              {leaderboardHottestNewcomers[0]?.totalCommission}{" "}
                              Tokens
                            </p>
                          </p>
                        </div>
                      </div>
                      <div className="affiliate-dropdown">
                        <Collapse in={openhottest}>
                          <div id="example-collapse-text">
                            {leaderboardHottestNewcomers
                              ?.slice(1)
                              ?.map((lead, index) => (
                                <div className="leaderboard-row" key={lead._id}>
                                  <div className="leaderboard-left">
                                    <p>{index + 2}.</p>
                                    <p>Affiliate ID: {lead._id}</p>
                                  </div>
                                  <div className="leaderboard-right">
                                    <p>Earned: {lead.totalCommission} Tokens</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </Collapse>
                        <Button
                          className={`affiliate-dropdownBtn ${
                            openhottest ? "close" : "open"
                          } `}
                          onClick={() => setOpenhottest(!openhottest)}
                          aria-controls="example-collapse-text"
                          aria-expanded={openhottest}
                        >
                          See {openhottest ? "Less" : "More"} ...
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="">
                      {" "}
                      <div className="no-data">No Data Found</div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

            {leaderboardMonthlyMovers !== "Error" ? (
              <>
                <div className="leaderboard-card-div">
                  <div
                    className="pageTitless text-animate"
                    style={{ marginBottom: "20px" }}
                  >
                    <h4>Monthly Movers</h4>
                  </div>
                  {leaderboardMonthlyMovers !== "No Entries Found For User" &&
                  leaderboardMonthlyMovers !== "Error in Request Process" &&
                  leaderboardMonthlyMovers.length ? (
                    <>
                      <div
                        className="leaderboard-row"
                        key={leaderboardMonthlyMovers[0]?._id}
                      >
                        <div className="leaderboard-left">
                          <p>1.</p>
                          <p>
                            Affiliate ID: {leaderboardMonthlyMovers[0]?._id}
                          </p>
                        </div>
                        <div className="leaderboard-right">
                          <p>
                            Earned:{" "}
                            {leaderboardMonthlyMovers[0]?.totalCommission}{" "}
                            Tokens
                          </p>
                        </div>
                      </div>
                      <div className="affiliate-dropdown">
                        <Collapse in={openMovers}>
                          <div id="example-collapse-text">
                            {leaderboardMonthlyMovers
                              ?.slice(1)
                              ?.map((lead, index) => (
                                <div className="leaderboard-row" key={lead._id}>
                                  <div className="leaderboard-left">
                                    <p>{index + 2}.</p>
                                    <p>Affiliate ID: {lead._id}</p>
                                  </div>
                                  <div className="leaderboard-right">
                                    <p>Earned: {lead.totalCommission} Tokens</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </Collapse>
                        <Button
                          className={`affiliate-dropdownBtn ${
                            openMovers ? "close" : "open"
                          } `}
                          onClick={() => setOpenMovers(!openMovers)}
                          aria-controls="example-collapse-text"
                          aria-expanded={openMovers}
                        >
                          See {openMovers ? "Less" : "More"} ...
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="">
                      <div className="no-data">No Data Found</div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

            {leaderboardTopRegisters !== "Error" ? (
              <>
                <div className="leaderboard-card-div">
                  <div
                    className="pageTitless text-animate"
                    style={{ marginBottom: "20px" }}
                  >
                    <h4>Top User Referrals</h4>
                  </div>
                  {leaderboardTopRegisters !== "No Entries Found For User" &&
                  leaderboardTopRegisters !== "Error in Request Process" &&
                  leaderboardTopRegisters.length ? (
                    <>
                      <div
                        className="leaderboard-row"
                        key={leaderboardTopRegisters[0]?._id}
                      >
                        <div className="leaderboard-left">
                          <p>1.</p>
                          <p>Affiliate ID: {leaderboardTopRegisters[0]?._id}</p>
                        </div>
                        <div className="leaderboard-right">
                          <p>
                            Earned:{" "}
                            {leaderboardTopRegisters[0]?.totalCommission} Tokens
                          </p>
                        </div>
                      </div>
                      <div className="affiliate-dropdown">
                        <Collapse in={openUserReferals}>
                          <div id="example-collapse-text">
                            {leaderboardTopRegisters
                              ?.slice(1)
                              ?.map((lead, index) => (
                                <div className="leaderboard-row" key={lead._id}>
                                  <div className="leaderboard-left">
                                    <p>{index + 2}.</p>
                                    <p>Affiliate ID: {lead._id}</p>
                                  </div>
                                  <div className="leaderboard-right">
                                    <p>Earned: {lead.totalCommission} Tokens</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </Collapse>
                        <Button
                          className={`affiliate-dropdownBtn ${
                            openUserReferals ? "close" : "open"
                          } `}
                          onClick={() => setOpenUserReferals(!openUserReferals)}
                          aria-controls="example-collapse-text"
                          aria-expanded={openUserReferals}
                        >
                          See {openUserReferals ? "Less" : "More"} ...
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="">
                      {" "}
                      <div className="no-data">No Data Found</div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

            {leaderboardTopSales !== "Error" ? (
              <>
                <div className="leaderboard-card-div">
                  <div
                    className="pageTitless text-animate"
                    style={{ marginBottom: "20px" }}
                  >
                    <h4>Top Product Sales</h4>
                  </div>
                  {leaderboardTopSales !== "No Entries Found For User" &&
                  leaderboardTopSales !== "Error in Request Process" &&
                  leaderboardTopSales.length ? (
                    <>
                      <div
                        className="leaderboard-row"
                        key={leaderboardTopSales[0]?._id}
                      >
                        <div className="leaderboard-left">
                          <p>1.</p>
                          <p>Affiliate ID: {leaderboardTopSales[0]?._id}</p>
                        </div>
                        <div className="leaderboard-right">
                          <p>
                            Earned: {leaderboardTopSales[0]?.totalCommission}{" "}
                            Tokens
                          </p>
                        </div>
                      </div>
                      <div className="affiliate-dropdown">
                        <Collapse in={openProductSales}>
                          <div id="example-collapse-text">
                            {leaderboardTopSales
                              ?.slice(1)
                              ?.map((lead, index) => (
                                <div className="leaderboard-row" key={lead._id}>
                                  <div className="leaderboard-left">
                                    <p>{index + 2}.</p>
                                    <p>Affiliate ID: {lead._id}</p>
                                  </div>
                                  <div className="leaderboard-right">
                                    <p>Earned: {lead.totalCommission} Tokens</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </Collapse>
                        <Button
                          className={`affiliate-dropdownBtn ${
                            openProductSales ? "close" : "open"
                          } `}
                          onClick={() => setOpenProductSales(!openProductSales)}
                          aria-controls="example-collapse-text"
                          aria-expanded={openProductSales}
                        >
                          See {openProductSales ? "Less" : "More"} ...
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="">
                      {" "}
                      <div className="no-data">No Data Found</div>
                    </div>
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
