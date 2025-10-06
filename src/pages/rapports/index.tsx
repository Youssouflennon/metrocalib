import React, { useEffect } from "react";
import useStoreAllWorkSpace from "src/store/workPace/getAll";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip, // ✅ renommé
  Legend,
  ResponsiveContainer,
} from "recharts";
import useStoreAllUsers from "src/store/Administration/getAll";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/components/ui/tooltip";
import { getColorForLetter } from "src/helpers/helpers";
import useStoreAllActivityCard from "src/store/cardActivity/getAll";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import useStoreAdvanceStat from "src/store/dashboard/advanceStat";
import { useThemeStore } from "src/store/themeStore";

const Rapport = () => {
  const { AllWorkSpace, loadingAllWorkSpace, fetchAllWorkSpace } =
    useStoreAllWorkSpace();

  useEffect(() => {
    fetchAllWorkSpace();
  }, [fetchAllWorkSpace]);

  const { AllUsers, loadingAllUsers, fetchAllUsers } = useStoreAllUsers();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const { AllActivityCard, loadingAllActivityCard, fetchAllActivityCard } =
    useStoreAllActivityCard();

  useEffect(() => {
    fetchAllActivityCard();
  }, [fetchAllActivityCard]);

  const { AdvanceStat, loadingAdvanceStat, fetchAdvanceStat } =
    useStoreAdvanceStat();

  useEffect(() => {
    fetchAdvanceStat();
  }, [fetchAdvanceStat]);

  console.log("AdvanceStat", AdvanceStat?.completed_percentage);

  const data = [
    { name: "Complet", value: AdvanceStat?.completed_percentage },
    { name: "incomplet", value: AdvanceStat?.incompleted_percentage },
  ];

  const COLORS = ["#0088FE", "#FF8042"];

  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Assure que la classe "dark" est appliquée au chargement
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen p-6  text-gray-800 font-sans">
      <div className="flex justify-end items-center border p-4 rounded-lg">
        {/*  <div className="flex space-x-6">
          <button className="text-black-700 font-medium bg-white pb-1">
            Rapports
          </button>
          <button className="text-black-700 bg-white font-medium">
            Tableaux
          </button>
        </div> */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center -space-x-2">
            <TooltipProvider>
              {AllUsers?.slice(0, 4).map((member: any, idx: any) => {
                const firstLetter = member?.first_name?.charAt(0) || "";
                const lastLetter = member?.last_name?.charAt(0) || "";
                const backgroundColor = getColorForLetter(firstLetter);

                return (
                  <Tooltip key={idx}>
                    <TooltipTrigger asChild>
                      <div
                        className="w-8 h-8 rounded-full text-white text-sm flex items-center justify-center border-2 border-white relative z-10 hover:z-20"
                        style={{ backgroundColor }}
                      >
                        {firstLetter}
                        {lastLetter}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {member.first_name} {member.last_name}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>

            {AllUsers?.length > 4 && (
              <span className="w-8 h-8 bg-gray-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-white">
                +{AllUsers?.length - 4}
              </span>
            )}
          </div>
          <button className="bg-purple-200 text-purple-800 px-4 py-1 rounded-lg">
            Partager
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        {/* Sidebar */}
        <div className="col-span-1 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Espace de travail</h2>
            {AllWorkSpace?.map((member: any) => (
              <ul className="space-y-6" key={member.id}>
                <li className="flex items-center space-x-4">
                  <div className="bg-gray-400 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-black my-4 dark:text-white">{member.name}</span>
                </li>
              </ul>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2 dark:text-white">Bilan du projet</h2>
            <div className="w-full h-[400px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Activités */}
        <div className="col-span-1 bg-white rounded-lg ">
          <h3 className="text-center font-bold text-lg mb-4">Activités</h3>
          <div className="space-y-4 shadow-lg p-6">
            {AllActivityCard?.map((activity, i) => (
              <div key={activity.id} className="border-b pb-2">
                <div className="flex items-start space-x-2">
                  <div className="w-3 h-3 mt-1 rounded-full bg-purple-700" />
                  <div>
                    <p className="text-sm">
                      <strong>
                        Bonjour{" "}
                        {activity.member?.first_name ?? activity.member?.email}
                      </strong>{" "}
                      {activity.activity}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Il y a{" "}
                      {formatDistanceToNow(new Date(activity.created_at), {
                        addSuffix: false,
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rapport;
