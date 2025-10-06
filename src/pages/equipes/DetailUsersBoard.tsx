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
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../components/card";
import TMModal from "../../components/components/ui/TM_Modal";
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
import useStoreGetUserDash from "src/store/dashboard/getUserDash";
import useStoreGetStateMember from "src/store/dashboard/getProjectStatMember";
import useStoreAllCards from "src/store/cards/getAll";
import { Avatar, AvatarFallback } from "../../components/components/ui/avatar";
import { cn } from "../../components/lib/utils";

const DetailUsersBoard = () => {
  const { id } = useParams();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpenCard, setIsOpenCard] = useState(false);

  const [isOpenCards, setIsOpenCards] = useState(false);

  const [idfilter, setIdFilter] = useState("");
  const user = useAuthStore((state) => state.user);

  const IdMember = user?.id || false;

  const [idDash, setIdDash] = useState("");

  const [idDashs, setIdDashs] = useState("");

  const {
    GetUserDash,
    loadingGetUserDash,
    fetchGetUserDash,
    count,
    userState,
  } = useStoreGetUserDash();

  const { AllCardMember, loadingAllCardMember, fetchAllCardMember } =
    useStoreAllCardMember();

  useEffect(() => {
    fetchAllCardMember({ member_id: IdMember });
  }, [IdMember, fetchAllCardMember]);

  console.log("AllCardMember", AllCardMember);

  const { AllCards, loadingAllCards, fetchAllCards } = useStoreAllCards();

  useEffect(() => {
    fetchAllCards({ members__member_id: id, section__dashboard_id: idDashs });
  }, [id, idDashs, fetchAllCards]);

  console.log("AllCards", AllCards);

  const { AllWorkSpace, loadingAllWorkSpace, fetchAllWorkSpace } =
    useStoreAllWorkSpace();

  useEffect(() => {
    fetchAllWorkSpace();
  }, [fetchAllWorkSpace]);

  useEffect(() => {
    fetchGetUserDash({ page, page_size: 3, member_id: id });

    if (GetUserDash && GetUserDash.length > 0) {
      setIdDashs(GetUserDash[0].id); // 👈 Récupère le premier élément de la page courante
    }
  }, [page, id, fetchGetUserDash]);

  const { GetStateMember, loadingGetStateMember, fetchGetStateMember } =
    useStoreGetStateMember();

  const handleNavigate = (itemId: any) => {
    // navigate(`/espace_travail/${itemId}`);

    setIdDash(itemId);
  };

  useEffect(() => {
    if (id && idDash) {
      fetchGetStateMember(idDash, { member_id: id });
    }
  }, [fetchGetStateMember, idDash, id]);

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
      <>
        <div className="font-bold text-2xl text-purple-600 md:text-3xl ml-4 md:ml-10 text-center md:text-left">
          <span className="text-gray-950">Tableau de board de :</span>{" "}
          {userState?.email} !!!
        </div>

        <div className="flex flex-col space-y-6 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow basis-2/3 text-white p-6 rounded-lg">
              <div className="flex flex-col my-10 p-6 text-black">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-xl md:text-2xl dark:text-white">
                    Espace de travail
                  </div>

                  {/*    <DropdownMenu>
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
                  </DropdownMenu> */}
                </div>
                <div className="overflow-x-auto">
                  <Table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md mt-6">
                    <TableHeader>
                      <TableRow className="bg-gray-100 dark:bg-gray-800 text-left">
                        <TableHead className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase px-6 py-3">
                          Projet
                        </TableHead>
                        <TableHead className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase px-6 py-3">
                          Description
                        </TableHead>
                        <TableHead className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase px-6 py-3">
                          Créé le
                        </TableHead>
                        <TableHead className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase px-6 py-3">
                          Dernière maj
                        </TableHead>
                        <TableHead className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase px-6 py-3">
                          Statut
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {loadingGetUserDash ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6">
                            <Loader />
                          </TableCell>
                        </TableRow>
                      ) : (
                        GetUserDash?.map((project) => (
                          <TableRow
                            key={project.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                            onClick={() => handleNavigate(project.id)}
                          >
                            <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                              {project.name}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                              {project.description || (
                                <em className="text-gray-400">Aucune</em>
                              )}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                              {new Date(
                                project.created_at
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                              {new Date(
                                project.updated_at
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
                                  project.is_done
                                    ? "bg-green-500"
                                    : "bg-yellow-500"
                                }`}
                              >
                                {project.is_done ? "Terminé" : "En cours"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>

                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="flex justify-center py-4">
                            <PaginationComponent
                              pages={Math.ceil((count || 1) / 3)}
                              currentPage={page}
                              onPageChange={setPage}
                              rangeLimit={5}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </div>
            </div>

            <div className="flex-grow basis-1/3  text-white p-6 rounded-lg gap-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Etat de statistique
              </h2>

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
                  {loadingGetStateMember ? (
                    <Loader />
                  ) : (
                    <p className="text-xl md:text-2xl font-bold">
                      {GetStateMember?.total_cards}
                    </p>
                  )}
                  <p className="text-lg font-bold">total_cards</p>
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
                  {loadingGetStateMember ? (
                    <Loader />
                  ) : (
                    <p className="text-white text-xl md:text-2xl font-bold">
                      {GetStateMember?.completed_cards}
                    </p>
                  )}

                  <p className="text-lg text-white font-bold">
                    completed_cards
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
                  {loadingGetStateMember ? (
                    <Loader />
                  ) : (
                    <p className="text-xl md:text-2xl font-bold text-white">
                      {GetStateMember?.not_completed_cards}
                    </p>
                  )}

                  <p className="text-lg text-white font-bold">
                    not_completed_cards
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
                  {loadingGetStateMember ? (
                    <Loader />
                  ) : (
                    <p className="text-xl md:text-2xl font-bold text-white">
                      {GetStateMember?.completed_percentage} %
                    </p>
                  )}

                  <p className="text-lg text-white font-bold">
                    completed_percentage
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>Liste des Taches de : {userState?.first_name} !!!</div>

          <div className="overflow-y-auto mt-6">
            <Table className="border rounded-lg shadow-sm bg-white dark:bg-gray-950">
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-800">
                  <TableHead className="w-[25%] font-semibold text-gray-700 dark:text-gray-100">
                    Tâche
                  </TableHead>
                  <TableHead className="w-[25%] font-semibold text-gray-700 dark:text-gray-100">
                    Membres
                  </TableHead>
                  <TableHead className="w-[20%] font-semibold text-gray-700 dark:text-gray-100">
                    Section
                  </TableHead>
                  <TableHead className="w-[15%] font-semibold text-gray-700 dark:text-gray-100">
                    Échéance
                  </TableHead>
                  <TableHead className="w-[15%] font-semibold text-gray-700 dark:text-gray-100">
                    État
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {AllCards.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {task.members.length > 0 ? (
                          task.members.map((m: any, idx: number) => {
                            const first = m?.member?.first_name?.[0] ?? "";
                            const last = m?.member?.last_name?.[0] ?? "";
                            return (
                              <Avatar
                                key={idx}
                                className="h-7 w-7 border border-gray-300 dark:border-gray-600"
                              >
                                <AvatarFallback className="text-xs text-white bg-purple-600">
                                  {first}
                                  {last}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })
                        ) : (
                          <span className="text-muted-foreground italic">
                            Aucun
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{task.section_name}</TableCell>
                    <TableCell>
                      {new Date(task.due_date).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          task.is_done
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        )}
                      >
                        {task.is_done ? "Terminée" : "En cours"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </>
    </div>
  );
};

export default DetailUsersBoard;
