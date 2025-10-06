import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronRight,
  FaHome,
  FaUsers,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaBell,
  FaUser,
  FaUserCog,
} from "react-icons/fa";
import { useTranslation } from "../hooks/useTranslation";
import { useAuthStore } from "src/store/authStore";
import { hasPermission } from "src/helpers/permissions";
import { useThemeStore } from "src/store/themeStore";

const SideBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const user = useAuthStore((state) => state.user);
  const permissions: any = user?.permissions;

  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Assure que la classe "dark" est appliquée au chargement
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const items = [
    {
      name: t("menu.manage.board"),
      pathname: "/",
      icon: <FaHome />,
      //   permission: "workspaces.view_dashboard", // exemple
      subItems: [],
    },
    {
      name: t("menu.manage.administrator"),
      pathname: "/admin",
      icon: <FaUsers />,
      permission: "users.add_user", // exemple
      subItems: [
        { name: t("button.add"), pathname: "/add" },
        { name: t("button.list"), pathname: "/list" },
      ],
    },
    {
      name: t("menu.manage.role"),
      pathname: "/role",
      icon: <FaUserCog />,
      permission: "auth.add_group",
      subItems: [
        { name: t("button.add"), pathname: "/addRole" },
        { name: t("button.list"), pathname: "/listRole" },
      ],
    },
    {
      name: t("menu.manage.workspace"),
      pathname: "/menu",
      icon: <FaClipboardList />,
      //  permission: "workspaces.view_workspace",
      subItems: [],
    },
    {
      name: t("menu.manage.Rapports"),
      pathname: "/rapport",
      icon: <FaChartBar />,
      //   permission: "workspaces.view_dashboard",
      subItems: [],
    },
    {
      name: t("menu.manage.team"),
      pathname: "/equipe",
      icon: <FaUsers />,
      //   permission: "workspaces.view_teammember",
      subItems: [],
    },
    {
      name: t("menu.manage.notification"),
      pathname: "/notification",
      icon: <FaBell />,
      subItems: [],
    },
    {
      name: t("menu.manage.settings"),
      pathname: "/parametre",
      icon: <FaCog />,
      subItems: [],
    },
  ];

  return (
    <div className="h-full w-full flex flex-col bg-purple-700 py-6 px-4 dark:bg-[#1d0553]">
      <div className="h-full w-full flex flex-col py-6 px-4">
        <div
          className="flex-1 flex flex-col gap-4 overflow-y-auto"
          style={{ marginTop: "70%" }}
        >
          {items.map((item, index) => {
            if (
              item.permission &&
              !hasPermission(permissions, item.permission)
            ) {
              return null;
            }

            return (
              <div key={index} className="flex flex-col">
                <div
                  onClick={() => {
                    if (item.subItems.length > 0) {
                      toggleMenu(item.name);
                    } else {
                      navigate(item.pathname);
                    }
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-md cursor-pointer ${
                    location.pathname === item.pathname
                      ? "bg-white text-purple-700"
                      : "hover:bg-gray-100 text-white hover:text-purple-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon} <span className="text-md">{item.name}</span>
                  </div>
                  {item.subItems.length > 0 && (
                    <span className="text-sm">
                      {openMenus[item.name] ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                    </span>
                  )}
                </div>

                {item.subItems.length > 0 && openMenus[item.name] && (
                  <div className="ml-6 mt-2 flex flex-col gap-2">
                    {item.subItems.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        onClick={() => navigate(subItem.pathname)}
                        className={`px-4 py-2 rounded-md cursor-pointer ${
                          location.pathname === subItem.pathname
                            ? "bg-white text-purple-700"
                            : "hover:bg-gray-100 text-white hover:text-purple-700"
                        }`}
                      >
                        {subItem.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
