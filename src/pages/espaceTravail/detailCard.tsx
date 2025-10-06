import useStoreAllUsers from "src/store/Administration/getAll";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/components/ui/popover";
import React, { useEffect, useState } from "react";
import useStoreOneUser from "src/store/Administration/getOne";
import { useNavigate } from "react-router-dom";
import useAddessaddCardMemberStore from "src/store/cardMember/addCardMember";
import { ToastContainer, toast } from "react-toastify";
import TMModal from "../../components/components/ui/TM_Modal";
import DelaisTache from "./delaisTache";
import AddPriorite from "./addPriorite";
import useStoreAllCheckCard from "src/store/cardCheckList/getAll";
import useAddessaddCheckListStore from "src/store/cardCheckList/addChecklist";
import AddCheckCard from "./addCheckCard";
import Loader from "../../components/loader";
import useStoreAllActivityCard from "src/store/cardActivity/getAll";
import AddPiece from "./addPiece";
import useStoreOneCard from "src/store/cards/getOne";
import { useTranslation } from "src/hooks/useTranslation";
import { FaTrash } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import useStoredeleteCheck from "src/store/cardCheckList/delete";
import useStoregetExcluMemb from "src/store/cards/getExcluMember";
import useStoreOneDashboard from "src/store/dashboard/getOne";
import { getColorForLetter } from "src/helpers/helpers";
import AdddEtiquette from "./adddEtiquette";
import { useThemeStore } from "src/store/themeStore";

interface AddSectionProps {
  idcartes: any; // Ou 'number' selon le type attendu
  descriptions: any;
  nomCart: any;
}

const DetailCard: React.FC<AddSectionProps> = ({
  idcartes,
  descriptions,
  nomCart,
}) => {
  const { AllUsers, loadingAllUsers, fetchAllUsers } = useStoreAllUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalOpens, setIsModalOpens] = useState(false);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const [selectCheck, setSelectCheck] = useState<string | null>(null);

  const [isModalOpenJoin, setIsModalOpenJoin] = useState(false);

  const [checkOpen, setCheckOpen] = useState(false);

  const [isPrioOpen, setIsPrioOpen] = useState(false);

  const { OneUser, loadingOneUser, fetchOneUser } = useStoreOneUser();

  const [loading, setLoading] = useState(false);

  const [idUsers, setIdUsers] = useState("");

  const [displayedUsers, setDisplayedUsers] = useState<any[]>([]);

  const { addCardMember, addCardMemberResponse } = useAddessaddCardMemberStore(
    (state: any) => state
  );

  const {
    AllCheckCard,
    loadingAllCheckCard,
    fetchAllCheckCard,
    updateCardCheck,
  } = useStoreAllCheckCard();

  const [sections, setSections] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  const {
    OneDashboard,
    loadingOneDashboard,
    fetchOneDashboard,
    updateCardSection,
    updateCard,
  } = useStoreOneDashboard();

  // Récupérer les données du dashboard uniquement lorsque idParam change
  useEffect(() => {
    if (idcartes) {
      fetchOneDashboard(idcartes);
    }
  }, [idcartes, fetchOneDashboard]);

  // Mettre à jour les sections lorsque OneDashboard est disponible et a des sections valides
  useEffect(() => {
    if (
      OneDashboard &&
      Array.isArray(OneDashboard.sections) &&
      OneDashboard.sections.length > 0
    ) {
      setSections(OneDashboard.sections);
      setMembers(OneDashboard.members);
    } else {
      setSections([]); // S'assurer que sections est vide si OneDashboard.sections est null
      setMembers([]); // S'assurer que sections est vide si OneDashboard.sections est null
    }
  }, [OneDashboard]);

  const { AllActivityCard, loadingAllActivityCard, fetchAllActivityCard } =
    useStoreAllActivityCard();

  const { OneCard, loadingOneCard, fetchOneCard } = useStoreOneCard();

  const { getExcluMemb, loadinggetExcluMemb, fetchgetExcluMemb } =
    useStoregetExcluMemb();

  useEffect(() => {
    if (idcartes) {
      fetchgetExcluMemb(idcartes);
    }
  }, [fetchgetExcluMemb, idcartes]);

  console.log("getExcluMemb", getExcluMemb);

  const { t } = useTranslation();

  const { fetchdeleteCheck, loadingdeleteCheck } = useStoredeleteCheck();

  useEffect(() => {
    fetchAllCheckCard({
      card_id: idcartes,
    });
  }, [fetchAllCheckCard, idcartes]);

  const handleDeleteCheck = async () => {
    if (selectCheck) fetchdeleteCheck(selectCheck);

    try {
      toast.success(t("tache.success.delete"));
      setIsOpen(false);
      //  navigate(0);
      if (idcartes)
        fetchAllCheckCard({
          card_id: idcartes,
        });

      // window.location.reload();
    } catch (error) {
      toast.error(t("tache.error_add"));
    }
  };

  useEffect(() => {
    if (idcartes) fetchOneCard(idcartes);
  }, [fetchOneCard, idcartes]);

  useEffect(() => {
    fetchAllActivityCard({
      card_id: idcartes,
    });
  }, [fetchAllActivityCard, idcartes]);

  console.log("AllCheckCard", AllCheckCard);

  const onSubmit = async (userId: string) => {
    if (!idcartes || !userId) return;
    setLoading(true);
    try {
      await addCardMember({ card: idcartes, member: userId });
      toast.success("Membre ajouté avec succès");

      if (idcartes) {
        fetchOneCard(idcartes);
        fetchgetExcluMemb(idcartes);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Erreur lors de l'ajout du membre");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (idUsers) {
      fetchOneUser(idUsers);
    }
  }, [idUsers, fetchOneUser]);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fonction pour gérer la sélection
  const handleCheckboxChange = async (id: string, is_done: boolean) => {
    try {
      await updateCardCheck(id, !is_done);

      // Mettre à jour l'état local sans refetch
      useStoreAllCheckCard.setState((state) => ({
        AllCheckCard: state.AllCheckCard.map((item) =>
          item.id === id ? { ...item, is_done: !is_done } : item
        ),
      }));
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  useEffect(() => {
    // N'initialiser que si displayedUsers est encore vide (au 1er rendu)
    if (AllUsers.length > 0 && displayedUsers.length === 0) {
      setDisplayedUsers(AllUsers);
    }
  }, [AllUsers]);

  const handleUserClick = (id: any) => {
    setIdUsers(id);
    setDisplayedUsers((prev) => prev.filter((user: any) => user.id !== id));
  };

  const handleFileClick = (fileUrl: string) => {
    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileUrl);
    if (isImage) {
      setPreviewImage(fileUrl);
    } else {
      window.open(fileUrl, "_blank");
    }
  };

  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Assure que la classe "dark" est appliquée au chargement
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="flex flex-col max-w-2xl mx-auto bg-white p-1 rounded-xl justify-start overflow-y-auto dark:text-gray-950">
      <ToastContainer />

      {/* Titre */}
      {/*    <h2 className="text-md text-justify">
        Développer l'architecture backend de l'application
      </h2> */}

      {/* Description */}
      <div className="flex justify-between  gap-5 mt-8">
        <div className=" flex flex-col justify-start w-[450px]">
          <h3 className="flex text-sm font-bold text-gray-700  justify-start">
            Nom de la carte :
          </h3>

          <p className="flex justify-start text-sm text-gray-700 text-justify mt-5">
            {nomCart}
          </p>
          <h3 className="flex text-sm font-bold text-gray-700  justify-start mt-5">
            Description de la carte :
          </h3>

          <p className="flex justify-start text-sm text-gray-700 text-justify mt-5">
            {descriptions}
          </p>
          <div className="text-lg font-semibold my-5">
            Liste des sous taches
          </div>
          <div className="flex flex-col  ">
            {loadingAllCheckCard ? (
              <div className="flex justify-center text-center">
                <Loader />
              </div>
            ) : AllCheckCard.length > 0 ? (
              <ul className="space-y-2">
                {AllCheckCard.map((item) => (
                  <li
                    key={item.id}
                    className="border p-2 rounded-md bg-gray-100 flex justify-between items-center"
                  >
                    {/* Checkbox qui met à jour l'état */}

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.is_done}
                        onChange={() =>
                          handleCheckboxChange(item.id, item.is_done)
                        }
                        className="h-4 w-4 rounded-full"
                      />
                      <span>{item.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // 🔥 Empêche la propagation du clic
                          setIsOpen(true); // 👉 Ouvre le dialog
                          setSelectCheck(item.id);
                        }}
                        className=" flex justify-end text-red-600 bg-red-200 hover:text-red-400"
                      >
                        <FaTrash />
                      </button>

                      <span
                        className={`text-sm ${
                          item.is_done
                            ? "text-green-600 bg-green-200 p-1 rounded-md"
                            : "text-red-600 bg-red-200 p-1 rounded-md"
                        }`}
                      >
                        {item.is_done ? "Terminée" : "En cours"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-Black font-bold flex items-center justify-center h-full bg-yellow-200 rounded-md ">
                {t("workspace.no_task_available")}
              </div>
            )}
          </div>

          <button
            className="ml-auto px-4 my-4 py-1 text-sm text-gray-700 border bg-gray-300 rounded-md hover:bg-gray-100"
            onClick={() => {
              setCheckOpen(true);
            }}
          >
            {t("workspace.add_task")}
          </button>
        </div>

        {/*  <div className="">
          <button className="px-4 py-1 text-sm text-gray-700 bg-gray-300 border rounded-md hover:bg-gray-100">
            {t("workspace.modify")}
          </button>
        </div> */}

        <div>
          <div className=" flex flex-col gap-2">
            <button className="w-full text-left px-4 py-1 text-sm bg-gray-300 text-gray-700 border rounded-md hover:bg-gray-100">
              {t("workspace.join")}
            </button>

            <Popover>
              <PopoverTrigger className="w-full text-left px-4 py-1 text-sm bg-gray-300 text-gray-700 border rounded-md hover:bg-gray-100">
                {t("workspace.member")}
              </PopoverTrigger>
              <PopoverContent className="p-4 w-full">
                {loadinggetExcluMemb ? (
                  <p className="text-sm text-gray-500">
                    {t("workspace.loading")}
                  </p>
                ) : (
                  <ul className="space-y-2 cursor-pointer">
                    {getExcluMemb.length > 0 ? (
                      getExcluMemb?.map((user) => (
                        <li
                          key={user.id}
                          className="flex items-center gap-2 p-2 border-b last:border-none"
                          onClick={() => {
                            handleUserClick(user.id);
                            setIdUsers(user.id);

                            onSubmit(user.id); // passer l'ID directement ici
                          }}

                          // navigate(0);
                        >
                          <span className="font-medium text-gray-800 text-sm hover:text-purple-600 transition-colors duration-200">
                            {user.first_name} {user.last_name}
                          </span>
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        {t("workspace.no_member_found")}
                      </p>
                    )}
                  </ul>
                )}
              </PopoverContent>
            </Popover>

            <button
              className="w-full text-left px-4 py-1 text-sm bg-gray-300 text-gray-700 border rounded-md hover:bg-gray-100"
              onClick={() => {
                setIsModalOpens(true);
              }}
            >
              {t("workspace.labels")}
            </button>

            <button
              className="w-full text-left px-4 py-1 text-sm bg-gray-300 text-gray-700 border rounded-md hover:bg-gray-100"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              {t("workspace.dates")}
            </button>

            <button
              className="w-full text-left px-4 py-1 text-sm bg-gray-300 text-gray-700 border rounded-md hover:bg-gray-100"
              onClick={() => {
                setIsPrioOpen(true);
              }}
            >
              {t("workspace.priority")}
            </button>
          </div>
        </div>
      </div>

      {/* Invitation */}
      <div className="mt-4">
        <h3 className="flex text-sm font-semibold text-gray-600 justify-start mt-4">
          Membres:
        </h3>

        <div className="flex  justify-start m4-5">
          <div>
            <div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                  {OneCard?.members.map((member: any, index: number) => {
                    const firstLetter =
                      member?.member?.first_name?.charAt(0) || "U";
                    const lastLetter =
                      member?.member?.last_name?.charAt(0) || "U";
                    const backgroundColor = getColorForLetter(firstLetter);

                    return (
                      <div key={index} className="relative group">
                        <div
                          className={`w-8 h-8 rounded-full text-white text-xs flex items-center justify-center border-2 border-white 
          ${index !== 0 ? "-ml-2" : ""} relative z-10 hover:z-20`}
                          style={{ backgroundColor }}
                        >
                          {firstLetter}
                          {lastLetter}
                        </div>

                        {/* Tooltip au survol */}
                        <div
                          className="absolute left-1/2 -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 
          bg-gray-800 text-white text-xs px-2 py-1 rounded-md transition-opacity duration-200"
                        >
                          {member?.member?.first_name}{" "}
                          {member?.member?.last_name}
                        </div>
                      </div>
                    );
                  })}

                  {/* Affichage du +X si plus de 4 membres */}
                  {/*   {item.members.length > 4 && (
                        <div className="w-6 h-6 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center border-2 border-white -ml-2">
                          +{item.members.length - 4}
                        </div>
                      )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pièce Jointe */}
      <div className="mt-10">
        <div className="flex justify-end">
          <div>
            <button
              className="ml-auto px-4 py-1 text-sm text-gray-700 border bg-gray-300 rounded-md hover:bg-gray-100"
              onClick={() => {
                setIsModalOpenJoin(true);
              }}
            >
              pièce jointe
            </button>
          </div>
        </div>

        <div className="mt-4">
          {loadingAllUsers ? (
            <Loader />
          ) : (
            <>
              {OneCard?.join_files?.map((file: any) => {
                const fileName = file.file.split("/").pop();
                const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(
                  fileName
                );

                return (
                  <div>
                    {OneCard?.join_files?.map((file: any) => {
                      const fileName = file.file.split("/").pop();
                      const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(
                        fileName
                      );

                      return (
                        <div
                          key={file.id}
                          onClick={() => handleFileClick(file.file)}
                          className="flex items-center gap-3 mt-2 border p-2 rounded-md cursor-pointer hover:bg-gray-100 transition"
                        >
                          <img
                            src={file.file}
                            alt="Pièce jointe"
                            className="w-24 h-16 object-cover rounded-md border"
                          />
                          <div>
                            <p className="text-xs text-gray-700 font-medium truncate w-40">
                              {fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Ajout :{" "}
                              {new Date(file.created_at).toLocaleString(
                                "fr-FR",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                            <span className="text-xs font-semibold text-gray-700">
                              {isImage ? "Image de couverture" : "Document"}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Modal d'image */}
                    {previewImage && (
                      <div
                        className="fixed inset-0 bg-black bg-opacity-60  flex items-center justify-center z-50"
                        onClick={() => setPreviewImage(null)}
                      >
                        <div
                          className="bg-white p-4 rounded-md max-w-2xl w-full max-h-[90vh] overflow-auto relative"
                          onClick={(e) => e.stopPropagation()} // empêche la fermeture si on clique sur l'image
                        >
                          <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
                          >
                            &times;
                          </button>
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-auto max-h-[80vh] object-contain rounded"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {previewImage && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 h-[100px]"
                  onClick={() => setPreviewImage(null)}
                >
                  <div className="bg-white p-4 rounded-md max-w-2xl w-full max-h-[90vh] overflow-auto relative">
                    <button
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
                    >
                      &times;
                    </button>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-auto max-h-[80vh] object-contain rounded"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Boutons Actions */}

      <div className="flex flex-col justify-start mt-2">
        <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            {t("workspace.recent_activities")}
          </h2>
          {AllActivityCard.length === 0 ? (
            <p className="text-gray-500 text-center">
              {t("workspace.no_activity_recorded")}
            </p>
          ) : (
            <ul className="space-y-4">
              {AllActivityCard?.map((activity) => (
                <li
                  key={activity.id}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {activity.member.profile_picture_file ? (
                        <img
                          src={activity.member.profile_picture_file}
                          alt="Profil"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">👤</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {activity.member.email || "Utilisateur inconnu"}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {activity.activity}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.created_at).toLocaleString("fr-FR")}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <TMModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("workspace.task_deadline")}
        size="sm"
        height={70}
      >
        <DelaisTache
          idcartes={idcartes}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
        />
      </TMModal>

      <TMModal
        isOpen={isModalOpens}
        onClose={() => setIsModalOpens(false)}
        title={t("etiquette.task_deadline")}
        size="sm"
        height={70}
      >
        <AdddEtiquette
          idcartes={idcartes}
          isOpen={isModalOpens}
          setIsOpen={setIsModalOpens}
        />
      </TMModal>

      <TMModal
        isOpen={isModalOpenJoin}
        onClose={() => setIsModalOpenJoin(false)}
        title="Ajout piece jointe"
        size="sm"
        height={70}
      >
        <AddPiece
          idcartes={idcartes}
          isOpen={isModalOpenJoin}
          setIsOpen={setIsModalOpenJoin}
        />
      </TMModal>

      <TMModal
        isOpen={isPrioOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("workspace.add_priority")}
        size="sm"
        height={70}
      >
        <AddPriorite idcartes={idcartes} />
      </TMModal>

      <TMModal
        isOpen={checkOpen}
        onClose={() => setCheckOpen(false)}
        title={t("workspace.add_task")}
        size="sm"
        height={70}
      >
        <AddCheckCard
          idcartes={idcartes}
          isOpen={checkOpen}
          setIsOpen={setCheckOpen}
        />
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
                {t("task.confirm_delete")}
              </Dialog.Title>
              <p className="mt-2">{t("task.confirm_delete_message")}</p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {t("task.cancel")}
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                  onClick={handleDeleteCheck}
                  disabled={loadingdeleteCheck}
                >
                  {loadingdeleteCheck ? t("task.deleting") : t("task.delete")}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default DetailCard;
