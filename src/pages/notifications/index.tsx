import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../store/notification/notificationStore";
import { Loader2, User } from "lucide-react";
import { CardActivity } from "../../store/notification/getNotifications";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/components/ui/avatar";
import axios from "axios";
import config from "../../config/config.dev";
import {
  MemberWorkspaces,
  Notifications,
  Workspace,
} from "../../components/components/ui/TM_Notification/types";
import { useTranslation } from "../../hooks/useTranslation";
import Pagination from "../../components/components/ui/pagination";

const Notification = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [memberWorkspaces, setMemberWorkspaces] = useState<MemberWorkspaces>(
    {}
  );
  const {
    data: notifications,
    count,
    loading,
    error,
    currentPage,
    pageSize,
    fetchNotifications,
    setPage,
    setPageSize,
  } = useNotifications();

  const getAuthToken = () => {
    const savedState = JSON.parse(
      localStorage.getItem("Task-Manager-auth-data") || "{}"
    );
    return savedState.accessToken;
  };

  const fetchMemberWorkspaces = async (memberId: string) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("User is not authenticated");

      const response = await axios.get(`${config.mintClient}workspaces/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          member: memberId,
        },
      });

      setMemberWorkspaces((prev) => ({
        ...prev,
        [memberId]: response.data.results,
      }));
    } catch (error) {
      console.error("Error fetching member workspaces:", error);
    }
  };

  useEffect(() => {
    console.log("Current state:", {
      notifications,
      count,
      currentPage,
      pageSize,
    });
    const loadNotifications = async () => {
      try {
        await fetchNotifications(currentPage, pageSize);
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };
    loadNotifications();
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (notifications) {
      notifications.forEach((notification) => {
        if (
          notification.member.id &&
          !memberWorkspaces[notification.member.id]
        ) {
          fetchMemberWorkspaces(notification.member.id);
        }
      });
    }
  }, [notifications]);

  const totalPages = Math.ceil((count || 0) / pageSize);

  console.log("Rendering with:", {
    notifications,
    count,
    currentPage,
    pageSize,
    totalPages,
    loading,
    error,
  });

  const handlePageChange = (pageNumber: number) => {
    console.log("Changing page to:", pageNumber);
    setPage(pageNumber);
  };

  const getInitials = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const handleViewDetails = (notification: CardActivity) => {
    const detailNotification: Notifications = {
      id: notification.id,
      icon: "fas fa-info-circle",
      title: t("header.notification_details"),
      message: notification.activity,
      time: new Date(notification.created_at).toLocaleDateString(),
      username: notification.member.email,
      isRead: false,
    };

    navigate("/notificationdetail", {
      state: { notification: detailNotification },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 w-[80%]">
      <h2 className="text-2xl font-bold mb-6">
        {t("notifications.all_notifications")} ({count || 0})
      </h2>

      {/* entête du tableau */}
      <div className="bg-white rounded-lg shadow">
        <div className="border border-gray-200 overflow-hidden">
          {/* En-têtes du tableau */}
          <div className="flex items-center p-8 bg-gray-50 border-b border-gray-200 font-bold">
            <div className="w-12"></div>
            <div className="flex-1 ml-4">{t("notifications.description")}</div>
            <div className="mr-0 w-[100px]">{t("notifications.projects")}</div>
            <div className="w-[200px] text-center mr-0">
              {t("notifications.date")}
            </div>
            <div className="w-[50px]"></div>
          </div>

          {!notifications || notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {t("notifications.no_notifications")}
            </div>
          ) : (
            notifications.map((notification: CardActivity) => (
              <div
                key={notification.id}
                className="flex items-center p-4 hover:bg-gray-50 border-b border-gray-200">
                <div className="w-12 flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        notification.member.profile_picture_file || undefined
                      }
                      alt={notification.member.email}
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-700 ">
                      {getInitials(notification.member.email)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 ml-4">
                  <span className="text-gray-900">
                    <strong>
                      {notification.activity
                        .split(" ")[0]
                        .charAt(0)
                        .toUpperCase() +
                        notification.activity.split(" ")[0].slice(1)}
                    </strong>
                    {notification.activity.slice(
                      notification.activity.indexOf(" ")
                    )}
                  </span>
                </div>

                <div>
                  <div className="flex -space-x-1.5 transition-all duration-300">
                    {memberWorkspaces[notification.member.id] &&
                      memberWorkspaces[notification.member.id].map(
                        (workspace) => {
                          const dashboards = workspace.dashboards;
                          const maxVisible = 3;
                          const remainingCount = dashboards.length - maxVisible;
                          const colors = [
                            "bg-purple-100 text-purple-700",
                            "bg-blue-100 text-blue-700",
                            "bg-green-100 text-green-700",
                            "bg-yellow-100 text-yellow-700",
                            "bg-red-100 text-red-700",
                            "bg-pink-100 text-pink-700",
                            "bg-indigo-100 text-indigo-700",
                          ];

                          return (
                            <div
                              key={workspace.id}
                              className="flex items-center">
                              {dashboards
                                .slice(0, maxVisible)
                                .map((dashboard, index) => (
                                  <Avatar
                                    key={dashboard.id}
                                    className={`h-8 w-8 border-2 border-white ${
                                      colors[index % colors.length]
                                    }`}
                                    title={dashboard.name}>
                                    <AvatarFallback
                                      className={`${
                                        colors[index % colors.length]
                                      } text-sm font-medium`}>
                                      {dashboard.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              {remainingCount > 0 && (
                                <div
                                  className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600 border-2 border-white transition-transform hover:scale-110"
                                  style={{ marginLeft: "-0.5rem", zIndex: 0 }}
                                  title={`${remainingCount} ${t(
                                    "notifications.other_projects"
                                  )}`}>
                                  +{remainingCount}
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                  </div>
                </div>

                <div className="w-[200px] text-center mr-0">
                  <span className="text-gray-600">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="w-[50px] flex justify-end">
                  <button
                    onClick={() => handleViewDetails(notification)}
                    className="bg-gray-50 hover:bg-gray-100 p-2 rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {notifications && notifications.length > 0 && totalPages > 1 && (
        <div className="sticky bottom-0 mt-8 border-t  backdrop-blur-sm">
          <div className="py-4 sm:py-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              pages={totalPages}
              rangeLimit={5}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
