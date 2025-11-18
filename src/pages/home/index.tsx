import { Calendar } from "../../components/components/ui/calendar";
import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "../../components/components/ui/table";
import useStoreGetStat from "src/store/dashboard/getStatProjet";
import useStorelistCurrentProject from "src/store/dashboard/curentProject";
import Loader from "../../components/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/components/ui/tooltip";
import {
  getColorForLetter,
  getRandomImage,
  getRelativeTime,
} from "src/helpers/helpers";
import PaginationComponent from "../../components/components/ui/pagination";
import { useAuthStore } from "src/store/authStore";
import { hasPermission } from "src/helpers/permissions";
import { useTranslation } from "src/hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import Card from "../../components/card";
import TMModal from "../../components/components/ui/TM_Modal";
import ChangePass from "./changePassword";
import useStoreAllWorkSpace from "src/store/workPace/getAll";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/components/ui/dropdown-menu";
import useStoreAllCardMember from "src/store/cardMember/getAll";
import { format } from "date-fns";
import { useThemeStore } from "src/store/themeStore";
import ChangepasswordUser from "./changepasswordUser";

const Home = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpenCard, setIsOpenCard] = useState(false);

  const [isOpenCards, setIsOpenCards] = useState(false);

  const [idfilter, setIdFilter] = useState("");
  const user = useAuthStore((state) => state.user);

  const IdMember = user?.id || false;

  const {
    listCurrentProject,
    loadinglistCurrentProject,
    fetchlistCurrentProject,
    count,
  } = useStorelistCurrentProject();

  const { AllCardMember, loadingAllCardMember, fetchAllCardMember } =
    useStoreAllCardMember();

  useEffect(() => {
    fetchAllCardMember({ member_id: IdMember });
  }, [IdMember, fetchAllCardMember]);

  console.log("AllCardMember", AllCardMember);

  const { AllWorkSpace, loadingAllWorkSpace, fetchAllWorkSpace } =
    useStoreAllWorkSpace();

  useEffect(() => {
    fetchAllWorkSpace();
  }, [fetchAllWorkSpace]);

  useEffect(() => {
    fetchlistCurrentProject({ page, page_size: 4, workspace_id: idfilter });
  }, [page, idfilter, fetchlistCurrentProject]);

  const { GetStat, loadingGetStat, fetchGetStat } = useStoreGetStat();

  const handleNavigate = (itemId: any) => {
    navigate(`/espace_travail/${itemId}`);
  };
  useEffect(() => {
    fetchGetStat();
  }, [fetchGetStat]);

  console.log("user", user);

  const permissions: any[] = user?.permissions || [];

  const Is_superuser: boolean = user?.is_superuser || false;

  const canVieweDashboards = hasPermission(
    permissions,
    "workspaces.view_dashboard"
  );

  const [bgImage] = React.useState(getRandomImage());

  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Assure que la classe "dark" est appliquée au chargement
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="w-full h-full p-10 flex flex-col">
      {Is_superuser && (
        <>
          <div className="font-bold text-2xl text-purple-600 md:text-3xl ml-4 md:ml-10 text-center md:text-left">
            Bienvenue {user?.email} !!!
          </div>

          <div className="flex flex-col space-y-6 p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow basis-2/3 text-white p-6 rounded-lg">
                <div className="font-bold text-xl md:text-2xl my-4 md:my-8 text-black dark:text-white">
                  Projets
                </div>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div
                    className="text-white p-6 rounded-lg text-center w-full sm:w-[200px] md:w-[300px]"
                    style={{
                      backgroundImage: `url(${bgImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "#2563eb", // fallback: Tailwind's blue-600
                    }}
                  >
                    {loadingGetStat ? (
                      <Loader />
                    ) : (
                      <p className="text-xl md:text-2xl font-bold">
                        {GetStat?.current_projects}
                      </p>
                    )}
                    <p className="text-lg font-bold">en cours</p>
                  </div>
                  <div
                    className=" shadow p-6 rounded-lg text-center w-full sm:w-[200px] md:w-[300px]"
                    style={{
                      backgroundImage: `url(${bgImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "#2563eb", // fallback: Tailwind's blue-600
                    }}
                  >
                    {loadingGetStat ? (
                      <Loader />
                    ) : (
                      <p className="text-white text-xl md:text-2xl font-bold">
                        {GetStat?.assigned_task}
                      </p>
                    )}

                    <p className="text-lg text-white font-bold">
                      Tâche assignée
                    </p>
                  </div>
                  <div
                    className=" shadow p-6 rounded-lg text-center w-full sm:w-[200px] md:w-[300px]"
                    style={{
                      backgroundImage: `url(${bgImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "#2563eb", // fallback: Tailwind's blue-600
                    }}
                  >
                    {loadingGetStat ? (
                      <Loader />
                    ) : (
                      <p className="text-xl md:text-2xl font-bold text-white">
                        {GetStat?.completed_projects}
                      </p>
                    )}

                    <p className="text-lg text-white font-bold">
                      Projet Terminé
                    </p>
                  </div>
                </div>

                <div className="flex flex-col my-10 p-6 text-black">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-xl md:text-2xl dark:text-white">
                      Projets en-cours
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="bg-purple-300 text-purple-700 p-1 rounded-md cursor-pointer">
                          Filtrer
                        </div>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="bg-white text-black">
                        {loadingAllWorkSpace ? (
                          <DropdownMenuItem disabled>
                            Chargement...
                          </DropdownMenuItem>
                        ) : AllWorkSpace.length > 0 ? (
                          AllWorkSpace.map((workspace) => (
                            <DropdownMenuItem
                              key={workspace.id}
                              onClick={() => setIdFilter(workspace.id)} // ↩️ Fonction à définir
                            >
                              {workspace.name}
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem disabled>
                            Aucun espace trouvé
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="overflow-x-auto">
                    <Table className="bg-white border dark:bg-gray-900 dark:text-white rounded-lg shadow-md overflow-hidden mt-4 md:mt-8">
                      <TableCaption className="sr-only">
                        Liste des projets récents avec leur progression.
                      </TableCaption>
                      <TableHeader>
                        <TableRow></TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadinglistCurrentProject ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              <Loader />
                            </TableCell>
                          </TableRow>
                        ) : (
                          listCurrentProject?.map((project, index) => (
                            <TableRow
                              key={index}
                              className="cursor-pointer" // Fond bleu clair pour le premier projet
                              onClick={() => {
                                handleNavigate(project.id);
                              }}
                            >
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={project.logo || "/248.png"}
                                    alt={project.name}
                                    className="w-12 h-12 rounded-full"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium mb-2">
                                  {project.name}
                                </div>
                                <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                                  {getRelativeTime(project.created_at)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center -space-x-2">
                                  <TooltipProvider>
                                    {project.members
                                      .slice(0, 4)
                                      .map((member: any, idx: any) => {
                                        const firstLetter =
                                          member?.first_name?.charAt(0) || "";
                                        const lastLetter =
                                          member?.last_name?.charAt(0) || "";
                                        const backgroundColor =
                                          getColorForLetter(firstLetter);

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
                                              {member.first_name}{" "}
                                              {member.last_name}
                                            </TooltipContent>
                                          </Tooltip>
                                        );
                                      })}
                                  </TooltipProvider>

                                  {project.members.length > 4 && (
                                    <span className="w-8 h-8 bg-gray-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-white">
                                      +{project.members.length - 4}
                                    </span>
                                  )}
                                </div>
                                <span className="text-gray-500 ml-2 text-sm">
                                  Membres
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-500">
                                    progression
                                  </span>
                                  <div
                                    className={`w-16 h-6 flex items-center justify-center text-white text-xs font-bold rounded-full ${
                                      project.progress_percentage >= 75
                                        ? "bg-blue-500"
                                        : project.progress_percentage >= 50
                                        ? "bg-orange-500"
                                        : "bg-green-500"
                                    }`}
                                  >
                                    {project.progress_percentage}%
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                      <TableFooter>
                        <tr>
                          <td colSpan={7}>
                            <div className="flex justify-center my-4">
                              <PaginationComponent
                                pages={Math.ceil((count || 1) / 4)} // 🔹 Fixe à 6 pour correspondre à page_size
                                currentPage={page}
                                onPageChange={setPage} // 🔹 Met directement à jour page
                                rangeLimit={5}
                              />
                            </div>
                          </td>
                        </tr>
                      </TableFooter>
                    </Table>
                  </div>
                </div>
              </div>

              <div className="flex-grow basis-1/3  text-white p-6 rounded-lg gap-4">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Calendar
                  </h2>
                  <div className="flex justify-center">
                    <p className="text-gray-600">
                      {" "}
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border shadow"
                      />
                    </p>
                  </div>
                </div>

                <div
                  className="inline-block bg-purple-300 text-purple-700 rounded-md p-1 cursor-pointer mt-5 "
                  onClick={() => setIsOpenCards(true)}
                >
                  Modifier mot de passe
                </div>
                <div className="bg-white shadow rounded-lg p-6 mt-9">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Notification
                  </h2>
                  <div>
                    <p className="text-gray-600">No notifications available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!Is_superuser && (
        <>
          <div className="font-bold text-2xl text-purple-600 md:text-3xl ml-4 md:ml-10 text-center md:text-left">
            Bienvenue {user?.email} !!!
          </div>

          <div className="flex flex-col space-y-6 p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow basis-2/3 text-white p-6 rounded-lg">
                <div className="font-bold text-xl md:text-2xl my-4 md:my-8 text-black dark:text-white">
                  Projets
                </div>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div
                    className="text-white p-6 rounded-lg text-center w-full sm:w-[200px] md:w-[300px]"
                    style={{
                      backgroundImage: `url(${bgImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "#2563eb", // fallback: Tailwind's blue-600
                    }}
                  >
                    {loadingGetStat ? (
                      <Loader />
                    ) : (
                      <p className="text-xl md:text-2xl font-bold">
                        {GetStat?.current_projects}
                      </p>
                    )}
                    <p className="text-lg font-bold">en cours</p>
                  </div>
                  <div
                    className=" shadow p-6 rounded-lg text-center w-full sm:w-[200px] md:w-[300px]"
                    style={{
                      backgroundImage: `url(${bgImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "#2563eb", // fallback: Tailwind's blue-600
                    }}
                  >
                    {loadingGetStat ? (
                      <Loader />
                    ) : (
                      <p className="text-white text-xl md:text-2xl font-bold">
                        {GetStat?.assigned_task}
                      </p>
                    )}

                    <p className="text-lg text-white font-bold">
                      Tâche assignée
                    </p>
                  </div>
                  <div
                    className=" shadow p-6 rounded-lg text-center w-full sm:w-[200px] md:w-[300px]"
                    style={{
                      backgroundImage: `url(${bgImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "#2563eb", // fallback: Tailwind's blue-600
                    }}
                  >
                    {loadingGetStat ? (
                      <Loader />
                    ) : (
                      <p className="text-xl md:text-2xl font-bold text-white">
                        {GetStat?.completed_projects}
                      </p>
                    )}

                    <p className="text-lg text-white font-bold">
                      Projet Terminé
                    </p>
                  </div>
                </div>

                <div className="flex flex-col my-10 p-6 text-black">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-xl md:text-2xl dark:text-white">
                      Espace de travail
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="bg-purple-300 text-purple-700 p-1 rounded-md cursor-pointer">
                          Filtrer
                        </div>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="bg-white text-black">
                        {loadingAllWorkSpace ? (
                          <DropdownMenuItem disabled>
                            Chargement...
                          </DropdownMenuItem>
                        ) : AllWorkSpace.length > 0 ? (
                          AllWorkSpace.map((workspace) => (
                            <DropdownMenuItem
                              key={workspace.id}
                              onClick={() => setIdFilter(workspace.id)} // ↩️ Fonction à définir
                            >
                              {workspace.name}
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem disabled>
                            Aucun espace trouvé
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="overflow-x-auto">
                    <Table className="bg-white border rounded-lg shadow-md overflow-hidden mt-4 md:mt-8">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
                            {t("Tableaux")}
                          </TableHead>
                          <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
                            {t("Taches")}
                          </TableHead>
                          <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
                            {t("Membres")}
                          </TableHead>
                          <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
                            {t("Evolution")}
                          </TableHead>
                          <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
                            {t("Echéance")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadinglistCurrentProject ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              <Loader />
                            </TableCell>
                          </TableRow>
                        ) : (
                          listCurrentProject?.map((project, index) => (
                            <TableRow
                              key={index}
                              className="cursor-pointer" // Fond bleu clair pour le premier projet
                              onClick={() => {
                                handleNavigate(project.id);
                              }}
                            >
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Card
                                    key={project.id}
                                    text={project.name}
                                    bgColor="bg-purple-500"
                                    bgImage={getRandomImage()}
                                    /*     onClick={() => {
                              handleNavigate(mbe.id);
                              setSelectedProject(mbe.id);
                            }} */
                                    /*    onDelete={() => {
                              setSelectedProject(mbe.id);
                              setIsOpen(true); // 👉 Ouvre le dialog
                            }} */
                                    /*   onEdit={() => {
                              setSelectedEditId(mbe.id);
                              handleOpenModalss();
                            }} */
                                    //    loading={loadingAllWorkSpace}
                                    showDeleteIcon={true}
                                    //  permission={canDeleteDashboard}
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-md ml-6 font-bold">
                                  {project.number_of_cards}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center -space-x-2">
                                  <TooltipProvider>
                                    {project.members
                                      .slice(0, 4)
                                      .map((member: any, idx: any) => {
                                        const firstLetter =
                                          member?.first_name?.charAt(0) || "";
                                        const lastLetter =
                                          member?.last_name?.charAt(0) || "";
                                        const backgroundColor =
                                          getColorForLetter(firstLetter);

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
                                              {member.first_name}{" "}
                                              {member.last_name}
                                            </TooltipContent>
                                          </Tooltip>
                                        );
                                      })}
                                  </TooltipProvider>

                                  {project.members.length > 4 && (
                                    <span className="w-8 h-8 bg-gray-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-white">
                                      +{project.members.length - 4}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`w-16 h-6 flex items-center justify-center text-white text-xs font-bold rounded-full ${
                                      project.progress_percentage >= 75
                                        ? "bg-blue-500"
                                        : project.progress_percentage >= 50
                                        ? "bg-orange-500"
                                        : "bg-green-500"
                                    }`}
                                  >
                                    {project.progress_percentage}%
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <div className="font-bold text-md">
                                    Echeance
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                      <TableFooter>
                        <tr>
                          <td colSpan={7}>
                            <div className="flex justify-center my-4">
                              <PaginationComponent
                                pages={Math.ceil((count || 1) / 4)} // 🔹 Fixe à 6 pour correspondre à page_size
                                currentPage={page}
                                onPageChange={setPage} // 🔹 Met directement à jour page
                                rangeLimit={5}
                              />
                            </div>
                          </td>
                        </tr>
                      </TableFooter>
                    </Table>
                  </div>

                  <div className="flex justify-between items-center mt-8">
                    <div className="font-bold text-xl md:text-2xl dark:text-white">
                      Taches recentes
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="bg-purple-300 text-purple-700 p-1 rounded-md cursor-pointer">
                          Filtrer
                        </div>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="bg-white text-black">
                        {loadingAllWorkSpace ? (
                          <DropdownMenuItem disabled>
                            Chargement...
                          </DropdownMenuItem>
                        ) : AllWorkSpace.length > 0 ? (
                          AllWorkSpace.map((workspace) => (
                            <DropdownMenuItem
                              key={workspace.id}
                              onClick={() => setIdFilter(workspace.id)} // ↩️ Fonction à définir
                            >
                              {workspace.name}
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem disabled>
                            Aucun espace trouvé
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="overflow-x-auto">
                    <Table className="bg-white border rounded-lg shadow-md overflow-hidden mt-4 md:mt-8">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
                            {t("Carte")}
                          </TableHead>
                          <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
                            {t("list")}
                          </TableHead>
                          <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
                            {t("Date limite")}
                          </TableHead>
                          <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
                            {t("Tableau")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingAllCardMember ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              <Loader />
                            </TableCell>
                          </TableRow>
                        ) : (
                          AllCardMember?.slice(0, 9).map((project, index) => (
                            <TableRow
                              key={index}
                              // className="cursor-pointer" // Fond bleu clair pour le premier projet
                              /*      onClick={() => {
                                handleNavigate(project.id);
                              }} */
                            >
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <div className="font-bold text-md">
                                    {" "}
                                    {project?.title}
                                  </div>{" "}
                                </div>
                              </TableCell>
                              <TableCell> {project?.section.name}</TableCell>
                              <TableCell>
                                <div className="inline-flex items-center space-x-2 bg-purple-300 text-purple-600 rounded-md p-1">
                                  {format(
                                    new Date(project?.due_date),
                                    "dd MMMM yyyy"
                                  )}
                                </div>
                              </TableCell>

                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Card
                                    key={project.id}
                                    text={project.dashboard.name}
                                    bgColor="bg-purple-500"
                                    bgImage={getRandomImage()}
                                    /*     onClick={() => {
                              handleNavigate(mbe.id);
                              setSelectedProject(mbe.id);
                            }} */
                                    /*    onDelete={() => {
                              setSelectedProject(mbe.id);
                              setIsOpen(true); // 👉 Ouvre le dialog
                            }} */
                                    /*   onEdit={() => {
                              setSelectedEditId(mbe.id);
                              handleOpenModalss();
                            }} */
                                    //    loading={loadingAllWorkSpace}
                                    showDeleteIcon={true}
                                    //  permission={canDeleteDashboard}
                                  />{" "}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                      {/*   <TableFooter>
                        <tr>
                          <td colSpan={7}>
                            <div className="flex justify-center my-4">
                              <PaginationComponent
                                pages={Math.ceil((count || 1) / 4)} // 🔹 Fixe à 6 pour correspondre à page_size
                                currentPage={page}
                                onPageChange={setPage} // 🔹 Met directement à jour page
                                rangeLimit={5}
                              />
                            </div>
                          </td>
                        </tr>
                      </TableFooter> */}
                    </Table>
                  </div>
                </div>
              </div>

              <div className="flex-grow basis-1/3  text-white p-6 rounded-lg gap-4">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Calendar
                  </h2>
                  <div className="flex justify-center">
                    <p className="text-gray-600">
                      {" "}
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border shadow"
                      />
                    </p>
                  </div>
                </div>

                <div
                  className="inline-block bg-purple-300 text-purple-700 rounded-md p-1 cursor-pointer mt-5 "
                  onClick={() => setIsOpenCard(true)}
                >
                  Modifier votre mot de passe
                </div>
                <div className="bg-white shadow rounded-lg p-6 mt-9">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Notification
                  </h2>
                  <div>
                    <p className="text-gray-600">No notifications available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <TMModal
        isOpen={isOpenCard}
        onClose={() => setIsOpenCard(false)}
        title={t("change.password")}
        size="full"
        height={70}
      >
        <ChangePass />
      </TMModal>

      <TMModal
        isOpen={isOpenCards}
        onClose={() => setIsOpenCards(false)}
        title={t("change.password")}
        size="sm"
        height={70}
      >
        <ChangepasswordUser IdMember={IdMember} />
      </TMModal>
    </div>
  );
};

export default Home;
