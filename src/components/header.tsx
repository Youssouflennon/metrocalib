import React, { useEffect, useState } from "react";
import { FaBell, FaEnvelope, FaSignOutAlt, FaLanguage } from "react-icons/fa";
import { Input } from "./components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import TMModal from "./components/ui/TM_Modal";
import NotificationComponent from "./components/ui/TM_Notification/Notification";
import { Notifications } from "./components/ui/TM_Notification/types";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useI18nStore } from "../store/i18n/i18nStore";
import { useTranslation } from "../hooks/useTranslation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import {
  CardActivity,
  CardActivityResponse,
  getCardActivities,
} from "src/store/notification/getNotifications";
import Profil from "./profil";
import { useThemeStore } from "src/store/themeStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [notifications, setNotifications] = useState<CardActivity[]>([]);
  const { language, setLanguage } = useI18nStore();
  const { t } = useTranslation();

  const { theme, toggleTheme } = useThemeStore();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
    handleCloseModal();
    navigate("/notificationdetail", {
      state: { notification: detailNotification },
    });
  };
  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response: CardActivityResponse = await getCardActivities(1, 5);
        setNotifications(response.results);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des notifications:",
          error
        );
      }
    };

    fetchNotifications();
  }, []);

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };



  return (
    <div className="h-full w-full flex flex-col  md:flex-row justify-between items-center p-4 md:p-8 space-y-4 md:space-y-0">
      <div className="flex items-center gap-4">
        <div>
          <img
            className="h-[40px] w-[60px] md:h-[50px] md:w-[75px] cursor-pointer"
            src="/logo.png"
            alt="logo"
          />
        </div>
        <div className="text-xl md:text-2xl mt-1 md:mt-2 dark:text-white-900">
          {t("app.name")}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 px-2 w-full md:w-auto">

        <div>
        <button
      onClick={toggleTheme}
      className="w-full flex items-center justify-center gap-2 text-sm text-purple-700 bg-purple-100 hover:bg-purple-200 font-medium py-1.5 px-3 rounded-lg transition-colors"
    >
      <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} className="h-4 w-4" />
      {theme === "dark" ? "Light" : "Dark"}
    </button>
        </div>
        <div className="w-full md:w-auto flex gap-2">
          <Input
            type="text"
            placeholder={t("header.search")}
            className="w-full md:w-auto dark:bg-white"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors">
                <FaLanguage className="text-lg" />
                <span className="uppercase">{language}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage("fr")}>
                <span className={`${language === "fr" ? "font-bold" : ""}`}>
                  {t("header.languages.fr")}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                <span className={`${language === "en" ? "font-bold" : ""}`}>
                  {t("header.languages.en")}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <FaEnvelope className="text-blue-500 text-xl md:text-2xl cursor-pointer hover:text-blue-600" />
        </div>

        <div>
          <FaBell
            className="text-yellow-500 text-xl md:text-2xl cursor-pointer hover:text-yellow-600"
            onClick={handleOpenModal}
          />
        </div>

        <TMModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={t("header.notifications")}
          position="right"
          size="sm"
          height={70}
        >
          <NotificationComponent
            notifications={notifications}
            onViewDetails={handleViewDetails}
            currentUser={user ? { username: user.email } : { username: "" }}
          />
        </TMModal>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer">
              <Avatar>
                {user?.email ? (
                  <AvatarFallback className="bg-purple-600 text-white">
                    {getInitials(user.email)}
                  </AvatarFallback>
                ) : (
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Default avatar"
                  />
                )}
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem className="flex items-center gap-2">
              <Profil onLogout={handleLogout} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
