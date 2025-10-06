import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "src/hooks/useTranslation";
import { useAuthStore } from "src/store/authStore";
import { useThemeStore } from "src/store/themeStore";

type ProfilProps = {
  onLogout: () => void;
};

const Profil = ({ onLogout }: ProfilProps) => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();

  const { theme, toggleTheme } = useThemeStore();

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="text-lg font-semibold text-gray-800">Compte</div>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
            {user?.first_name?.charAt(0).toUpperCase()}{" "}
            {user?.last_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {user?.first_name}
            </div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        </div>

        <div className="space-y-2">
          <button className="w-full text-sm text-purple-700 bg-purple-100 hover:bg-purple-200 font-medium py-1.5 px-3 rounded-lg">
            Changer de compte
          </button>
          <ul className="text-sm text-gray-800 space-y-1">
            {/*    <li>
              <button className="w-full text-sm text-purple-700 bg-purple-100 hover:bg-purple-200 font-medium py-1.5 px-3 rounded-lg">
                Activité
              </button>
            </li> */}
            <li>
              <button
                className="w-full text-sm text-purple-700 bg-purple-100 hover:bg-purple-200 font-medium py-1.5 px-3 rounded-lg"
                onClick={() => {
                  navigate("/");
                }}
              >
                Tableaux
              </button>
            </li>
            <li>
              <button
                className="w-full text-sm text-purple-700 bg-purple-100 hover:bg-purple-200 font-medium py-1.5 px-3 rounded-lg"
                onClick={toggleTheme}
              >
                {theme === "dark" ? " Light" : "Dark"}
              </button>
            </li>
            <li>
              <button
                className="w-full text-sm text-purple-700 bg-purple-100 hover:bg-purple-200 font-medium py-1.5 px-3 rounded-lg"
                onClick={() => {
                  navigate("/menu");
                }}
              >
                Espace de travail
              </button>
            </li>
            {/*   <li>
              <button className="w-full text-sm text-purple-700 bg-purple-100 hover:bg-purple-200 font-medium py-1.5 px-3 rounded-lg">
                Aide
              </button>
            </li> */}
            <li>
              <button
                className="w-full text-sm text-purple-700 bg-purple-100 hover:bg-purple-200 font-medium py-1.5 px-3 rounded-lg"
                onClick={() => {
                  navigate("/parametre");
                }}
              >
                Paramètres
              </button>
            </li>
          </ul>
        </div>

        <div
          className="flex items-center gap-2 mt-4 cursor-pointer"
          onClick={onLogout}
        >
          <FaSignOutAlt className="text-red-500" />
          <span className="text-red-500">{t("header.logout")}</span>
        </div>
      </div>
    </div>
  );
};

export default Profil;
