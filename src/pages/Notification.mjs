/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import PropsTypes from "prop-types";
import { Spinner } from "react-bootstrap";
import AuthContext from "../context/authContext.ts";
import { notificationInstance } from "../config/axios.js";
// import { notificationInstance } from "../../config/axios";

function Notification({ setNotificationCount }) {
  const [notifications, setNotifications] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const { user } = useContext(AuthContext);

  const getAllNotifications = async () => {
    if (user?.id) {
      setShowSpinner(true);
      const res = await (
        await notificationInstance()
      ).get(`/notifications?userId=${user?.id}`, {
        withCredentials: true,
        credentials: "include",
      });
      if (res?.status === 200) {
        setNotifications(res?.data?.resData); // check
      }
      setShowSpinner(false);
    }
  };

  //   const handleDelete = async (id) => {
  //     if (id) {
  //       const res = await (
  //         await notificationInstance()
  //       ).delete(`/notifications?id=${id}`, {
  //         withCredentials: true,
  //         credentials: "include",
  //       });
  //       if (res?.status === 200) {
  //         setNotifications((old) => old.filter((item) => item?._id !== id));
  //       }
  //     }
  //   };

  const handleViewNotification = async (id) => {
    if (id) {
      const res = await (
        await notificationInstance()
      ).put(
        `/notifications?id=${id}`,
        {},
        { withCredentials: true, credentials: "include" }
      );
      if (res?.status === 200) {
        getAllNotifications();
      }
    }
  };

  const getNotificationsCount = async () => {
    if (user?.id) {
      const res = await (
        await notificationInstance()
      ).get(`/notificationsCount?id=${user?.id}`, {
        withCredentials: true,
        credentials: "include",
      });
      const count = res?.data?.resData;
      setNotificationCount(count);
    }
  };

  useEffect(() => {
    getNotificationsCount();
  }, [notifications]);

  useEffect(() => {
    getAllNotifications();
  }, [user?.id]);

  return (
    <div className="notificationPage">
      <div className="notificationHeader">
        <h4>Notification</h4>
      </div>
      <div className="notificationMssg">
        {notifications?.length > 0 ? (
          notifications.map((item) => {
            if (item?.isRead) {
              return (
                <div
                  className="notificationmssgBox"
                  onClick={() => handleViewNotification(item?._id)}
                  role="presentation"
                  key={item?._id}
                >
                  {/* <img src={item?.sender?.profile} alt="" /> */}
                  <p>
                    {item.message.startsWith("Your")
                      ? ""
                      : item?.sender?.firstName}
                    {item?.url ? (
                      <a href={item.url}>{item?.message}</a>
                    ) : item.message.startsWith("Your") ? (
                      <a href="/en/profile?active=redemption">
                        {item?.message}
                      </a>
                    ) : (
                      item?.message
                    )}{" "}
                    {item?.message === "has send you friend request" ? (
                      <Link to="/friends"> go to friends</Link>
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              );
            }
            return (
              <div
                className="notificationmssgBox"
                onClick={() => handleViewNotification(item?._id)}
                role="presentation"
              >
                <img src={""} alt="" />
                <p>
                  {item?.sender?.firstName} {item?.message}{" "}
                  {item?.message === "has send you friend request" ? (
                    <Link to="/friends"> go to friends</Link>
                  ) : (
                    ""
                  )}
                </p>
              </div>
            );
          })
        ) : showSpinner ? (
          <Spinner animation="border" />
        ) : (
          <div className="noNotification">You have no notifications</div>
        )}
      </div>
    </div>
  );
}
Notification.propTypes = {
  setNotificationCount: PropsTypes.any.isRequired,
};
export default Notification;
