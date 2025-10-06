import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Icônes de react-icons
import Header from "../header";
import SideBar from "../sideBar";
import { useThemeStore } from "src/store/themeStore";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Assure que la classe "dark" est appliquée au chargement
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header */}
      <header className="w-full h-[70px] border-b border-gray-200 shadow-lg fixed top-0 z-20 bg-white dark:bg-[#1d0553] flex items-center px-4">
        {/* Bouton hamburger pour ouvrir le menu en mobile */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-200 transition bg-white"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FaBars size={24} />
        </button>
        <div className="flex-grow ">
          <Header />
        </div>
      </header>

      <main className="flex flex-grow pt-[70px]">
        {/* Sidebar pour écran large */}
        <div
          className="hidden md:block w-[250px] h-[calc(120vh-70px)] fixed top-[70px] z-10 bg-white border-r border-gray-200"
          style={{
            marginTop: "-4rem",
          }}
        >
          <SideBar />
        </div>

        {/* Sidebar Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div
              className="w-[250px] h-full bg-white shadow-lg p-4 absolute left-0 top-0 transition-transform transform"
              onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique dedans
            >
              {/* Bouton de fermeture */}
              <button
                className="p-2 rounded-md hover:bg-gray-200 transition bg-white"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaTimes size={24} />
              </button>
              <SideBar />
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <div className="flex-grow bg-[#F5F6FA] dark:bg-[#1d0553] overflow-y-auto ml-[0px] md:ml-[250px] h-[calc(100vh-70px)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
