import React from "react";
import { FaBell, FaCircle } from "react-icons/fa";
import { CardActivity } from "src/store/notification/getNotifications";
import { useTranslation } from "../../../../hooks/useTranslation";

interface NotificationComponentProps {
  notifications: CardActivity[] | null;
  onViewDetails: (notification: CardActivity) => void;
  currentUser: { username: string };
  emptyMessage?: string;
}
const NotificationComponent: React.FC<NotificationComponentProps> = ({
  notifications,
  onViewDetails,
  currentUser,
  emptyMessage = "Vous n'avez pas de nouvelles notifications.",
}) => {
  if (!notifications || notifications.length === 0) {
    return <div className="text-center text-gray-500">{emptyMessage}</div>;
  }
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <p className="font-bold text-start ml-4 flex items-center space-x-4 justify-between">
        {t("notifications.you.received")} {notifications.length}{" "}
        {t("notifications.new")}
        {notifications.length > 1 ? "" : ""} {t("notifications.message")}
        {notifications.length > 1 ? "s" : ""}
        <div className="text-2xl">
          <i className="text-xl md:text-2xl cursor-pointer text-[rgb(116,53,139)] hover:text-red-600">
            <FaBell />
          </i>
        </div>
      </p>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white shadow-md p-4 text-justify cursor-pointer"
          onClick={() => onViewDetails(notification)}>
          <div className="flex items-center space-x-4">
            <div className="text-2xl">
              <FaCircle
                className={
                  notification.member.is_active
                    ? "text-[rgb(116,53,139)]"
                    : "text-gray-400"
                }
              />
            </div>
            <h4 className="text-lg font-medium">
              {notification.member.first_name ||
                notification.member.last_name ||
                "Inconnu"}
            </h4>{" "}
          </div>
          <p className="mt-2">
            Bonjour{" "}
            <span>
              {" "}
              <strong>
                {notification.activity.split(" ")[0].charAt(0).toUpperCase() +
                  notification.activity.split(" ")[0].slice(1)}
              </strong>
              {notification.activity.slice(notification.activity.indexOf(" "))}
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {(() => {
              const createdAt = new Date(notification.created_at);
              const now = new Date();
              const diffInMs = now.getTime() - createdAt.getTime();

              const diffInSeconds = Math.floor(diffInMs / 1000);
              const diffInMinutes = Math.floor(diffInSeconds / 60);
              const diffInHours = Math.floor(diffInMinutes / 60);
              const diffInDays = Math.floor(diffInHours / 24);
              const diffInWeeks = Math.floor(diffInDays / 7);

              const diffInMonths = Math.floor(diffInDays / 30);
              const diffInYears = Math.floor(diffInDays / 365);

              const dayOfWeek = createdAt.getDay();
              const daysOfWeek = [
                t("notifications.sunday"),
                t("notifications.monday"),
                t("notifications.tuesday"),
                t("notifications.wednesday"),
                t("notifications.thursday"),
                t("notifications.friday"),
                t("notifications.saturday"),
              ];
              const dayName = daysOfWeek[dayOfWeek];

              if (diffInYears > 0) {
                return `${diffInYears} ${t("notifications.years")}`;
              } else if (diffInMonths > 0) {
                return `${diffInMonths} ${t("notifications.months")}`;
              } else if (diffInWeeks > 0) {
                return `${diffInWeeks} ${t("notifications.weeks")}`;
              } else if (diffInDays > 7) {
                return `${createdAt.toLocaleDateString()}`;
              } else if (diffInDays === 1) {
                return `${t("notifications.yesterday")}`; 
              } else if (diffInDays > 1) {
                return `${dayName}`;
              } else if (diffInHours > 0) {
                return `${diffInHours} ${t("notifications.hours")}`;
              } else if (diffInMinutes > 0) {
                return `${diffInMinutes} ${t("notifications.minutes")}`;
              } else {
                return `${diffInSeconds} ${t("notifications.seconds")}`;
              }
            })()}
          </p>
          {/* Formatage de la date */}
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent;
