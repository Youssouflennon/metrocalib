import React, { useEffect, useRef, useState } from "react";
import TMModal from "../../components/components/ui/TM_Modal";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useNavigate, useParams } from "react-router-dom";
import AddCard from "./addCard";
import AddSection from "./addSection";
import useStoreGetSection from "src/store/section/getSection";
import { format } from "date-fns";
import useStoreOneDashboard from "src/store/dashboard/getOne";
import DetailCard from "./detailCard";
import Loader from "../../components/loader";
import { getColorForLetter } from "src/helpers/helpers";
import useStoreAllCheckCard from "src/store/cardCheckList/getAll";
import {
  FaEdit,
  FaFilter,
  FaPaperclip,
  FaThLarge,
  FaThList,
  FaTrash,
} from "react-icons/fa";
import { useTranslation } from "src/hooks/useTranslation";
import { Dialog, Transition } from "@headlessui/react";
import useAddessremoveCardMembeStore from "src/store/cardMember/removeCardMember";
import { ToastContainer, toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "../../components/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import useStoredeleteSection from "src/store/section/delete";
import UpdateSection from "./updateSection";
import UpdateCarte from "./updateCarte";
import useStoredeleteCard from "src/store/cards/delete";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/components/ui/table";
import { Input } from "../../components/components/ui/input";
import useStoreAllCards from "src/store/cards/getAll";
import { Avatar, AvatarFallback } from "../../components/components/ui/avatar";
import SearchComponent from "../../components/components/search";
import PaginationComponent from "../../components/components/ui/pagination";

const EspaceTravail = () => {
  const { t } = useTranslation();
  const idParam = useParams().id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenCard, setIsOpenCard] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [loadings, setLoadings] = useState(false);

  const [loadingss, setLoadingss] = useState(false);

  const [members, setMembers] = useState<any[]>([]);

  const [nomespa, setNomesp] = useState<any[]>([]);

  const navigate = useNavigate();
  const selectedCardIdRef = useRef<string | null>(null);

  const [sectionsId, setSectionsId] = useState();

  const [detailCard, setDetailCard] = useState(false);

  const [idCarte, setIdCartes] = useState("");
  const [descriptions, setDescription] = useState("");

  const [nomCart, setNomCarte] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const [isOpens, setIsOpens] = useState(false);

  const [isOpenss, setIsOpenss] = useState(false);

  const [selectedUser, setSelectedUser] = useState<string[]>([]);

  const { removeCardMembe, removeCardMembeResponse } =
    useAddessremoveCardMembeStore((state: any) => state);

  const [cardIds, setCardIds] = useState<string[]>([]);

  const [cardId, setCartId] = useState<string>("");

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<any>(null);
  const [memberId, setMemberId] = useState<any>(null);

  const [sectionDash, setSectionDash] = useState<any>(null);

  const [etiquette, setEtiquette] = useState<any>(null);

  const {
    OneDashboard,
    loadingOneDashboard,
    fetchOneDashboard,
    updateCardSection,
    updateCard,
    updateSection,
  } = useStoreOneDashboard();

  // Récupérer les données du dashboard uniquement lorsque idParam change
  useEffect(() => {
    if (idParam) {
      fetchOneDashboard(idParam);
    }
  }, [idParam, fetchOneDashboard]);

  // Mettre à jour les sections lorsque OneDashboard est disponible et a des sections valides
  useEffect(() => {
    if (OneDashboard && Array.isArray(OneDashboard.sections)) {
      setSections(OneDashboard?.sections);
      setMembers(OneDashboard?.members);
      setNomesp(OneDashboard?.name);
    } else {
      setSections([]); // S'assurer que sections est vide si OneDashboard.sections est null
      setMembers([]); // S'assurer que sections est vide si OneDashboard.sections est null
    }
  }, [OneDashboard]);

  const handleCheckboxChange = async (id: string, is_done: boolean) => {
    try {
      await updateCard(id, !is_done);

      // Mettre à jour l'état local pour refléter le changement immédiatement
      setSections((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          cards: section.cards.map((card: any) =>
            card.id === id ? { ...card, is_done: !is_done } : card
          ),
        }))
      );
    } catch (error) {
      console.error(t("workspace.error_update"), error);
    }
  };

  console.log("OneDashboard", OneDashboard);
  console.log("Sections", sections);

  // Charger les sections dans le state local au montage

  // 🏆 Fonction pour gérer le déplacement des cartes
  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === "SECTION") {
      const updatedSections = Array.from(sections);
      const [movedSection] = updatedSections.splice(source.index, 1);
      updatedSections.splice(destination.index, 0, movedSection);
      setSections(updatedSections);

      // Générer le tableau à envoyer à l'API
      const sectionsList = updatedSections.map((section, index) => ({
        section_id: section.id,
        order_number: index,
      }));

      updateSection(sectionsList);
      return;
    }

    const sourceColumnIndex = sections.findIndex(
      (col: any) => col.id === source.droppableId
    );
    const destinationColumnIndex = sections.findIndex(
      (col: any) => col.id === destination.droppableId
    );

    if (sourceColumnIndex === -1 || destinationColumnIndex === -1) return;

    const updatedSections = [...sections];
    const [movedCard] = updatedSections[sourceColumnIndex].cards.splice(
      source.index,
      1
    );

    movedCard.section = destination.droppableId;

    updatedSections[destinationColumnIndex].cards.splice(
      destination.index,
      0,
      movedCard
    );

    setSections(updatedSections);

    updateCardSection(movedCard.id, destination.droppableId);
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      // Appel pour ajouter l'adresse de livraison
      await removeCardMembe({
        user_ids: selectedUser,
        card_id: cardIds,
      });

      toast.success(t("users.delete_success"));

      navigate(0);
      setLoading(false);
      //  fetchGetSection();
    } catch (error) {
      console.error(t("users.card_error"), error);
      setLoading(false);
    }
  };

  const { loadingdeleteSection, fetchdeleteSection } = useStoredeleteSection();

  const handleDeleteSection = async () => {
    setLoadings(true);

    if (sectionsId) fetchdeleteSection(sectionsId);

    try {
      toast.success(t("section.success_delete"));
      setLoadings(false);
      window.location.reload();
    } catch (error) {
      toast.error(t("section.error_delete"));
      setLoadings(false);
    }
  };

  const { loadingdeleteCard, fetchdeleteCard } = useStoredeleteCard();

  const handleDeleteCart = async () => {
    setLoadingss(true);

    if (cardId) fetchdeleteCard(cardId);

    try {
      toast.success(t("cart.success_delete"));
      setLoadingss(false);
      // window.location.reload();
    } catch (error) {
      toast.error(t("cart.error_delete"));
      setLoadingss(false);
    }
  };

  const [isModalOpens, setIsModalOpens] = useState(false);
  const [isModalOpenss, setIsModalOpenss] = useState(false);

  const handleOpenModals = () => {
    setIsModalOpens(true);
  };

  const handleOpenModalss = () => {
    setIsModalOpenss(true);
  };

  const handleCloseModals = () => {
    setIsModalOpens(false);
  };

  const handleCloseModalss = () => {
    setIsModalOpenss(false);
  };

  const [isGrid, setIsGrid] = useState(false);

  const [page, setPage] = useState(1);


  const { AllCards, loadingAllCards, fetchAllCards, count } =
    useStoreAllCards();

  useEffect(() => {
    fetchAllCards({
      priority: priority,
      search,
      members__member_id: memberId,
      tags__id: etiquette,
      section__dashboard_id: idParam,
      page,
      page_size: 10,
    }); // Fixe page_size à 6 pour correspondre à la pagination
  }, [idParam, etiquette, priority, memberId, search, fetchAllCards]);

  const handleSearch = (e: string) => {
    setSearch(e);
     setPage(1);
  };

  const uniqueDates = Array.from(
    new Set(
      AllCards.map((card) => format(new Date(card.due_date), "yyyy-MM-dd"))
    )
  );

  const uniquePriorities = Array.from(
    new Set(AllCards.map((card) => card.priority))
  );

  const uniqueTags = Array.from(
    new Set(AllCards.flatMap((card) => card.tags || []))
  );

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full flex flex-col">
        <DragDropContext onDragEnd={onDragEnd}>
          <ToastContainer />

          <div
            className="bg-cover bg-center p-6 h-full"
            style={{ backgroundImage: "url('/248.png')" }}
          >
            {/* Header */}
            <div className="flex bg-purple-300 justify-between mb-2 p-2 rounded-sm items-center">
              <div>
                <h1 className="text-2xl text-white font-bold">
                  {t("workspace.organization")} :{" "}
                  <span className="text-purple-700">{nomespa}</span>
                </h1>
              </div>
              {isGrid && (
                <>
                  <div>
                    <div className="w-full md:w-auto flex gap-2 items-center">
                      <SearchComponent onSearch={handleSearch} />

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center gap-2 px-3 py-1 rounded-md bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors">
                            <FaFilter className="text-lg" />
                            <span className="uppercase">Filtrer</span>
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                          {/* Sous-menu Date */}
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Date
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {uniqueDates.map((date) => (
                                <DropdownMenuItem key={date}>
                                  {date}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>

                          {/* Sous-menu Priorité */}
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Priorité
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {uniquePriorities.map((priority) => (
                                <DropdownMenuItem
                                  key={priority}
                                  onClick={() => {
                                    setPriority(priority);
                                  }}
                                >
                                  Priorité {priority}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>

                          {/* Sous-menu Étiquette */}
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Étiquette
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {uniqueTags.length > 0 ? (
                                uniqueTags.map((tag) => (
                                  <DropdownMenuItem
                                    key={tag}
                                    onClick={() => {
                                      setEtiquette(tag.id);
                                    }}
                                  >
                                    {tag.tag}
                                  </DropdownMenuItem>
                                ))
                              ) : (
                                <DropdownMenuItem disabled>
                                  Aucune étiquette
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>

                          {/* Bouton réinitialisation */}
                          <DropdownMenuItem
                            className="text-red-600 font-semibold hover:bg-red-100 dark:hover:bg-red-800 mt-2"
                            onClick={() => {
                              setPriority(null);
                              setEtiquette(null);
                              //   setSelectedDate(null); // ou un équivalent selon ta logique
                              setSearch(""); // si tu filtres aussi avec une barre de recherche
                            }}
                          >
                            Réinitialiser les filtres
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsGrid((prev) => !prev)}
                  className="p-2 rounded-md border bg-purple-500 hover:bg-purple-/00 dark:hover:bg-gray-700 transition"
                >
                  {isGrid ? (
                    <FaThLarge className="text-white" size={20} />
                  ) : (
                    <FaThList size={20} className="text-white bg-purple-500" />
                  )}
                </button>
                <div className="flex">
                  {members?.map((member: any, index: number) => (
                    <DropdownMenu key={member.id}>
                      <DropdownMenuTrigger asChild>
                        <div
                          className={`w-8 h-8 rounded-full text-white text-sm flex items-center justify-center border-2 border-white 
            cursor-pointer ${
              index !== 0 ? "-ml-2" : ""
            } relative z-10 hover:z-20`}
                          style={{
                            backgroundColor: getColorForLetter(
                              member.first_name?.charAt(0)
                            ),
                          }}
                        >
                          {member.first_name?.charAt(0).toUpperCase()}
                          {member.last_name?.charAt(0).toUpperCase()}
                        </div>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="bg-gray-800 text-white">
                        <DropdownMenuLabel>Filtrer</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setMemberId(member.id);
                            setSectionDash(idParam);
                          }}
                        >
                          Tache de {member.first_name} {member.last_name}
                        </DropdownMenuItem>
                        {/*                         <DropdownMenuItem>Envoyer un message</DropdownMenuItem>
                         */}{" "}
                        {/*    <DropdownMenuItem className="text-red-400">
                          Retirer du projet
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ))}
                </div>

                <div
                  className="font-bold text-md text-white bg-purple-500 rounded-full px-3 py-2 cursor-pointer"
                  onClick={() => setIsOpenCard(true)}
                >
                  {t("workspace.create_section")}
                </div>
              </div>
            </div>

            {isGrid ? (
              <>
                <div className="max-w-full max-h-full overflow-auto rounded-lg border border-gray-700 text-white">
                  <Table className="w-full border rounded-md overflow-hidden text-sm">
                    <TableHeader className="bg-purple-700 text-white">
                      <TableRow>
                        <TableHead className="w-[35%] text-white">
                          Tâche
                        </TableHead>
                        <TableHead className="w-[25%] text-white">
                          Membres
                        </TableHead>
                        <TableHead className="w-[20%] text-white">
                          Section
                        </TableHead>
                        <TableHead className="w-[20%] text-white">
                          Échéance
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {AllCards?.map((card) => (
                        <TableRow
                          key={card.id}
                          className="hover:bg-purple-500 dark:hover:bg-gray-800 even:bg-muted transition-colors text-gray-950 bg-purple-200"
                        >
                          <TableCell className="font-medium">
                            {card.title}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2 items-center">
                              {card?.members?.length > 0 ? (
                                card?.members?.map((m: any, idx: number) => (
                                  <Avatar
                                    key={idx}
                                    className="h-7 w-7 border  border-gray-300 dark:border-gray-600"
                                  >
                                    <AvatarFallback
                                      className="text-xs text-white"
                                      style={{
                                        backgroundColor: getColorForLetter(
                                          m?.member?.first_name?.charAt(0) ||
                                            "?"
                                        ),
                                      }}
                                    >
                                      {m?.member?.first_name?.charAt(0) ?? "?"}
                                      {m?.member?.last_name?.charAt(0) ?? ""}
                                    </AvatarFallback>
                                  </Avatar>
                                ))
                              ) : (
                                <span className="text-muted-foreground italic">
                                  Aucun
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">
                            {card?.section_name}
                          </TableCell>
                          <TableCell>
                            {new Date(card.due_date).toLocaleDateString(
                              "fr-FR",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter className="bg-white">
                      <tr>
                        <td colSpan={7}>
                          <div className="flex justify-center my-4">
                            <PaginationComponent
                              pages={Math.ceil((count || 1) / 10)}
                              currentPage={page}
                              onPageChange={setPage}
                              rangeLimit={5}
                            />
                          </div>
                        </td>
                      </tr>
                    </TableFooter>
                  </Table>
                </div>
              </>
            ) : (
              <>
                {/* Conteneur principal */}
                <div className="rounded-xl p-1 overflow-x-auto max-w-full">
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable
                      droppableId="all-sections"
                      direction="horizontal"
                      type="SECTION"
                    >
                      {(provided) => (
                        <div
                          className="flex gap-6 w-max"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {loadingOneDashboard ? (
                            <div className="flex justify-center text-center">
                              <Loader />
                            </div>
                          ) : sections?.length > 0 ? (
                            sections.map((column: any, colIndex: number) => (
                              <Draggable
                                key={column.id}
                                draggableId={column.id}
                                index={colIndex}
                              >
                                {(provided) => (
                                  <div
                                    className="flex flex-col"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                  >
                                    <div {...provided.dragHandleProps}>
                                      <div
                                        className={`bg-purple-300 p-2 rounded-lg w-[340px] ${
                                          column.cards &&
                                          column.cards.length > 4
                                            ? "h-[550px] overflow-y-auto"
                                            : ""
                                        } flex flex-col`}
                                      >
                                        <div className="flex items-center justify-between mb-4">
                                          <h2 className="text-lg font-bold mb-4 text-white">
                                            {column.name}
                                          </h2>
                                          <div className="flex items-center justify-between mb-4">
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <button
                                                  onClick={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                  className="text-white hover:text-gray-300 bg-transparent p-1 rounded"
                                                >
                                                  <BsThreeDotsVertical />
                                                </button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent
                                                side="bottom"
                                                align="end"
                                                className="bg-white text-red-500"
                                                onClick={(e) =>
                                                  e.stopPropagation()
                                                }
                                              >
                                                <DropdownMenuItem
                                                  onClick={(event) => {
                                                    event.stopPropagation();
                                                    setIsOpens(true);
                                                    setSectionsId(column.id);
                                                  }}
                                                  className="hover:text-gray-400 cursor-pointer flex items-center gap-2"
                                                >
                                                  <FaTrash className="text-red-600 text-lg" />
                                                  Supprimer
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                  onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleOpenModals();
                                                    setSectionsId(column.id);
                                                  }}
                                                  className="hover:text-gray-400 cursor-pointer flex items-center gap-2"
                                                >
                                                  <FaEdit className="text-green-600 text-lg cursor-pointer" />
                                                  <span className="text-green-600">
                                                    Editer
                                                  </span>
                                                </DropdownMenuItem>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </div>
                                        </div>

                                        <Droppable
                                          droppableId={column.id}
                                          type="CARD"
                                        >
                                          {(provided) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.droppableProps}
                                              className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[50px]"
                                            >
                                              {column.cards.length > 0 ? (
                                                column.cards.map(
                                                  (
                                                    item: any,
                                                    index: number
                                                  ) => (
                                                    <Draggable
                                                      key={item.id}
                                                      draggableId={item.id}
                                                      index={index}
                                                    >
                                                      {(provided) => (
                                                        <div
                                                          ref={
                                                            provided.innerRef
                                                          }
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          className=" p-1 rounded-lg shadow-md mb-4 group bg-white mx-6 dark:bg-[#1d0553] dark:text-white"
                                                          onClick={() => {
                                                            selectedCardIdRef.current =
                                                              item.id;
                                                            setDetailCard(true);
                                                            setIdCartes(
                                                              item.id
                                                            );
                                                            setDescription(
                                                              item.description
                                                            );
                                                            setNomCarte(
                                                              item.title
                                                            );
                                                          }}
                                                        >
                                                          <div className="flex justify-between items-center mt-2">
                                                            <div className="flex items-center gap-x-2">
                                                              <div className="relative group/checkbox">
                                                                <input
                                                                  type="checkbox"
                                                                  checked={
                                                                    item.is_done
                                                                  }
                                                                  onClick={(
                                                                    event
                                                                  ) =>
                                                                    event.stopPropagation()
                                                                  }
                                                                  onChange={() =>
                                                                    handleCheckboxChange(
                                                                      item.id,
                                                                      item.is_done
                                                                    )
                                                                  }
                                                                  className={`h-5 w-5 cursor-pointer rounded-full border border-gray-300 bg-gray-200 accent-red-500 
                          checked:bg-red-500 checked:border-red-500 transition-all duration-300 shadow-sm 
                          hover:scale-105 focus:ring-2 focus:ring-red-400 focus:outline-none
                          ${
                            item.is_done
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                                                                />
                                                                <span className="absolute bottom-10 left-20 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/checkbox:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                                  {item.is_done
                                                                    ? "Marquer comme non terminée"
                                                                    : "Marquer comme terminée"}
                                                                </span>
                                                              </div>
                                                              <p className="text-gray-800 text-sm cursor-pointer w-[135px] overflow-x-auto text-justify dark:text-white">
                                                                {item.title}
                                                              </p>
                                                            </div>
                                                            <p
                                                              className={`text-white rounded-full font-semibold text-[13px] p-1
                      ${
                        item.priority === 0
                          ? "bg-gray-400"
                          : item.priority === 1
                          ? "bg-blue-400"
                          : item.priority === 2
                          ? "bg-yellow-400"
                          : item.priority === 3
                          ? "bg-orange-500"
                          : "bg-red-600"
                      }`}
                                                            >
                                                              Priorité :{" "}
                                                              {item.priority}
                                                            </p>
                                                          </div>

                                                          <div className="flex justify-between items-center mt-5">
                                                            <div className="flex items-center gap-x-1">
                                                              <span
                                                                className={`text-sm ${
                                                                  item.is_done
                                                                    ? "text-green-600 bg-green-200 p-1 rounded-md"
                                                                    : "text-red-600 bg-red-200 p-1 rounded-md"
                                                                }`}
                                                              >
                                                                {item.due_date &&
                                                                  new Date(
                                                                    item.due_date
                                                                  ).getTime() !==
                                                                    0 &&
                                                                  format(
                                                                    new Date(
                                                                      item.due_date
                                                                    ),
                                                                    "dd MMMM yyyy"
                                                                  )}
                                                              </span>
                                                              <span>
                                                                <FaPaperclip className="text-gray-600 text-xl cursor-pointer hover:text-gray-900" />
                                                              </span>
                                                              <span></span>
                                                              <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                  asChild
                                                                >
                                                                  <p className="text-gray-800 text-sm cursor-pointer  text-justify">
                                                                    <BsThreeDotsVertical
                                                                      className="text-gray-600 text-xl cursor-pointer hover:text-gray-900"
                                                                      onClick={(
                                                                        e
                                                                      ) =>
                                                                        e.stopPropagation()
                                                                      }
                                                                    />
                                                                  </p>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent
                                                                  side="bottom"
                                                                  align="end"
                                                                  className="bg-white text-red-500"
                                                                  onClick={(
                                                                    e
                                                                  ) =>
                                                                    e.stopPropagation()
                                                                  }
                                                                >
                                                                  <DropdownMenuItem
                                                                    onClick={(
                                                                      event
                                                                    ) => {
                                                                      event.stopPropagation();
                                                                      setIsOpenss(
                                                                        true
                                                                      );
                                                                      setCartId(
                                                                        item.id
                                                                      );
                                                                    }}
                                                                    className="hover:text-gray-400 cursor-pointer flex items-center gap-2"
                                                                  >
                                                                    <FaTrash className="text-red-600 text-lg" />
                                                                    Supprimer
                                                                  </DropdownMenuItem>

                                                                  <DropdownMenuItem
                                                                    onClick={(
                                                                      event
                                                                    ) => {
                                                                      event.stopPropagation();
                                                                      handleOpenModalss();
                                                                      setCartId(
                                                                        item.id
                                                                      );
                                                                    }}
                                                                    className="hover:text-gray-400 cursor-pointer flex items-center gap-2"
                                                                  >
                                                                    <FaEdit className="text-green-600 text-lg cursor-pointer" />
                                                                    <span className="text-green-600">
                                                                      Editer
                                                                    </span>
                                                                  </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                              </DropdownMenu>

                                                              {/*     <div>
                                                            {" "}
                                                            <div className="inline-flex items-center justify-center px-2 py-1 text-sm font-semibold text-purple-800 border border-purple-800 rounded-md w-fit shadow-sm">
                                                              2/3
                                                            </div>
                                                          </div> */}
                                                            </div>

                                                            <div className="flex items-center">
                                                              {item.members
                                                                .slice(0, 4)
                                                                .map(
                                                                  (
                                                                    member: any,
                                                                    index: number
                                                                  ) => {
                                                                    const firstLetter =
                                                                      member?.member?.first_name?.charAt(
                                                                        0
                                                                      ) || "U";
                                                                    const lastLetter =
                                                                      member?.member?.last_name?.charAt(
                                                                        0
                                                                      ) || "U";
                                                                    const backgroundColor =
                                                                      getColorForLetter(
                                                                        firstLetter
                                                                      );
                                                                    return (
                                                                      <div
                                                                        key={
                                                                          index
                                                                        }
                                                                        className="relative group/avatar"
                                                                      >
                                                                        <div
                                                                          className={`w-7 h-7 rounded-full text-white text-xs flex items-center justify-center border-2 border-white 
                              ${
                                index !== 0 ? "-ml-2" : ""
                              } relative z-10 hover:z-20`}
                                                                          style={{
                                                                            backgroundColor,
                                                                          }}
                                                                          onClick={(
                                                                            event
                                                                          ) => {
                                                                            event.stopPropagation();
                                                                            setSelectedUser(
                                                                              [
                                                                                member
                                                                                  ?.member
                                                                                  ?.id,
                                                                              ]
                                                                            );
                                                                            setCardIds(
                                                                              member?.card
                                                                            );
                                                                            setIsOpen(
                                                                              true
                                                                            );
                                                                          }}
                                                                        >
                                                                          {
                                                                            firstLetter
                                                                          }
                                                                          {
                                                                            lastLetter
                                                                          }
                                                                        </div>
                                                                        <div
                                                                          className="absolute left-1/2 -translate-x-1/2 -top-8 opacity-0 group-hover/avatar:opacity-100 
                            bg-gray-800 text-white text-xs px-2 py-1 rounded-md transition-opacity duration-200"
                                                                        >
                                                                          {
                                                                            member
                                                                              ?.member
                                                                              ?.first_name
                                                                          }{" "}
                                                                          {
                                                                            member
                                                                              ?.member
                                                                              ?.last_name
                                                                          }
                                                                        </div>
                                                                      </div>
                                                                    );
                                                                  }
                                                                )}
                                                              {item.members
                                                                .length > 4 && (
                                                                <div className="w-7 h-7 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center border-2 border-white -ml-2">
                                                                  +
                                                                  {item.members
                                                                    .length - 4}
                                                                </div>
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  )
                                                )
                                              ) : (
                                                <div className="text-white text-sm italic opacity-70 text-center">
                                                  {t("workspace.empty_section")}
                                                </div>
                                              )}
                                              {provided.placeholder}
                                            </div>
                                          )}
                                        </Droppable>

                                        <button
                                          className="mt-1 w-full text-sm text-white bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg"
                                          onClick={() => {
                                            setIsModalOpen(true);
                                            setSectionsId(column.id);
                                          }}
                                        >
                                          {t("workspace.add_card")}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <div className="text-white flex items-center justify-center h-full">
                              {t("workspace.no_section")}
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </>
            )}
          </div>

          {/* Modals */}
          <TMModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={t("workspace.add_card")}
            size="sm"
            height={70}
          >
            <AddCard sectionsIds={sectionsId} />
          </TMModal>

          <TMModal
            isOpen={detailCard}
            onClose={() => {
              setDetailCard(false);
              // window.location.reload();
              if (idParam) {
                fetchOneDashboard(idParam);
              }
            }}
            // title="Detail carte"
            size="lg"
            height={70}
          >
            <DetailCard
              idcartes={idCarte}
              descriptions={descriptions}
              nomCart={nomCart}
            />
          </TMModal>

          <TMModal
            isOpen={isOpenCard}
            onClose={() => setIsOpenCard(false)}
            title={t("workspace.add_section")}
            size="sm"
            height={70}
          >
            <AddSection id={idParam} />
          </TMModal>

          <Transition show={isOpen} as={React.Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              onClose={() => setIsOpen(false)}
            >
              <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center">
                <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl">
                  <Dialog.Title className="text-lg font-bold">
                    {t("admin.confirm_delete")}
                  </Dialog.Title>
                  <p className="mt-2">{t("admin.confirm_delete_message")}</p>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      className="bg-gray-300 px-4 py-2 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      {t("admin.cancel")}
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-md"
                      onClick={handleDeleteUser}
                      disabled={loading}
                    >
                      {loading ? t("admin.deleting") : t("admin.delete")}
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          </Transition>

          <Transition show={isOpens} as={React.Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              onClose={() => setIsOpens(false)}
            >
              <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center">
                <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl">
                  <Dialog.Title className="text-lg font-bold">
                    {t("section.confirm_delete")}
                  </Dialog.Title>
                  <p className="mt-2">{t("section.confirm_delete_message")}</p>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      className="bg-gray-300 px-4 py-2 rounded-md"
                      onClick={() => setIsOpens(false)}
                    >
                      {t("section.cancel")}
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-md"
                      onClick={handleDeleteSection}
                      disabled={loadings}
                    >
                      {loadings ? t("section.deleting") : t("section.delete")}
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          </Transition>

          <Transition show={isOpenss} as={React.Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              onClose={() => setIsOpenss(false)}
            >
              <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center">
                <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl">
                  <Dialog.Title className="text-lg font-bold">
                    {t("card.confirm_delete")}
                  </Dialog.Title>
                  <p className="mt-2">{t("card.confirm_delete_message")}</p>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      className="bg-gray-300 px-4 py-2 rounded-md"
                      onClick={() => setIsOpenss(false)}
                    >
                      {t("card.cancel")}
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-md"
                      onClick={handleDeleteCart}
                      disabled={loadingss}
                    >
                      {loadingss ? t("card.deleting") : t("card.delete")}
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          </Transition>

          <TMModal
            isOpen={isModalOpens}
            onClose={handleCloseModals}
            title="Modifier la section"
            size="sm"
            height={70}
          >
            <div className="flex items-center justify-center">
              <UpdateSection idEdit={sectionsId} />
            </div>
          </TMModal>

          <TMModal
            isOpen={isModalOpenss}
            onClose={handleCloseModalss}
            title="Modifier la carte"
            size="sm"
            height={70}
          >
            <div className="flex items-center justify-center">
              <UpdateCarte idEdit={cardId} />
            </div>
          </TMModal>
        </DragDropContext>
      </div>
    </div>
  );
};

export default EspaceTravail;
