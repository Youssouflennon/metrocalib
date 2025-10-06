import React from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";

const NotificationDetail = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const notification = location.state?.notification;

  if (!notification) {
    return <div>{t("notifications.not_found")}</div>;
  }

  return (
    <div className="bg-white rounded-md shadow-sm p-8">
      <div className="flex items-center space-x-4 mb-4 ">
        <div className="text-2xl">
          <i className={notification.icon}></i>
        </div>
        <h4 className="text-lg font-medium">{notification.title}</h4>
      </div>
      <p className="mt-2 ml-4">
        {t("notifications.hello")}{" "}
        <span className="font-bold">
          {notification.username === "currentuser"
            ? t("notifications.you")
            : notification.username}
        </span>
        , {notification.message}
      </p>
      <p className="text-sm text-gray-500 mt-2 ml-4">{notification.time}</p>
    </div>
  );
};

export default NotificationDetail;
