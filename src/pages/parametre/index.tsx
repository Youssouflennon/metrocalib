import React, { useEffect } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuthStore } from "src/store/authStore";
import { useThemeStore } from "src/store/themeStore";

const Parametre = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);


  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Assure que la classe "dark" est appliquée au chargement
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="flex min-h-screen  p-8">
      {/* Sidebar */}
      <div className="w-1/3 max-w-sm pr-10">
        <div className="flex items-center gap-4 border rounded-md p-4 shadow-sm">
          <div className="w-12 h-12 bg-purple-600 text-white font-semibold rounded-full flex items-center justify-center">
            {user?.first_name?.charAt(0).toUpperCase()}{" "}
            {user?.last_name?.charAt(0).toUpperCase()}{" "}
          </div>
          <div>
            <p className="font-semibold">
              {" "}
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-sm text-gray-600 dark:text-white">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-12">
          {[
            "Changer de langue",
            "Autorisation des notifications  sur le bureau",
            "Gestion des mails",
            "Gérer les préférence en matière de cookies",
            "Sécurité",
            "Mon compte",
            "Suggestions",
          ].map((item, idx) => (
            <button
              key={idx}
              className="w-full text-left bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded-md"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Main Illustration */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-[500px] h-[400px]">
          {/* Background Panel */}
          <div className="absolute inset-0 bg-purple-100 rounded-md" />

          {/* Window Frame */}
          <div className="absolute top-10 left-10 w-[380px] h-[280px] bg-white rounded-md shadow-md p-4">
            {/* Toolbar */}
            <div className="w-24 h-5 bg-purple-400 rounded-md mb-4"></div>

            {/* Placeholder elements */}
            <div className="flex gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <div className="w-28 h-8 bg-blue-300 rounded-md relative">
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white border rounded-sm" />
                </div>
                <div className="w-28 h-8 bg-blue-300 rounded-md relative">
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white border rounded-sm">
                    <div className="bg-blue-600 w-2 h-2 m-1 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="w-32 h-20 border-2 border-dashed border-gray-400 rounded-md bg-purple-300"></div>
              </div>
            </div>

            <div className="w-40 h-16 bg-blue-200 rounded-md mt-4"></div>
            <div className="w-16 h-16 bg-blue-400 rounded-md absolute bottom-4 right-4"></div>
          </div>

          {/* Person Illustration (simplified) */}
          <div className="absolute bottom-0 left-[60px] flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-600 mb-2"></div>
            <div className="w-6 h-24 bg-blue-500"></div>
            <div className="flex gap-2 mt-2">
              <div className="w-4 h-16 bg-gray-700"></div>
              <div className="w-4 h-16 bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parametre;
