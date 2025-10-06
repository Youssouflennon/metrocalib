import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStorelistCurrentProject from "src/store/dashboard/curentProject";
import useStoreAllWorkSpace from "src/store/workPace/getAll";

import Card from "../../components/card";
import TMModal from "../../components/components/ui/TM_Modal";
import AddProject from "./addProject";
import { useAuthStore } from "src/store/authStore";
import { hasPermission } from "src/helpers/permissions";
import { useTranslation } from "src/hooks/useTranslation";
import useStoredeleteProjects from "src/store/dashboard/deleteProject";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import AddEspace from "./addEspace";
import { FaEdit, FaTrash } from "react-icons/fa";
import useStoredeleteWorkSpace from "src/store/workPace/deleteWorkSpace";
import UpdateDashboard from "./updateDashboard";
import UpdateWork from "./updateWork";
import { getRandomImage } from "src/helpers/helpers";
import { useThemeStore } from "src/store/themeStore";

const Menu = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalOpens, setIsModalOpens] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [isOpens, setIsOpens] = useState(false);

  const [isOpenss, setIsOpenss] = useState(false);

  const [isOpensss, setIsOpensss] = useState(false);

  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const [selectedEditId, setSelectedEditId] = useState<string | null>(null);

  const [selectedWorkTeam, setSelectedWorkTeam] = useState<string | null>(null);

  const { fetchdeleteProjects, loadingdeleteProjects } =
    useStoredeleteProjects();

  const { fetchdeleteWorkSpace, loadingdeleteWorkSpace } =
    useStoredeleteWorkSpace();

  const handleDeleteWorkSpace = async () => {
    if (selectedWorkTeam) fetchdeleteWorkSpace(selectedWorkTeam);

    try {
      toast.success(t("workSpace.success_delete"));
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(t("workSpace.error_delete"));
    }
  };

  const handleDeleteProject = async () => {
    if (selectedProject) fetchdeleteProjects(selectedProject);

    try {
      toast.success(t("project.success_delete"));
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(t("project.error_deleet"));
    }
  };

  const { t } = useTranslation();

  const {
    listCurrentProject,
    loadinglistCurrentProject,
    fetchlistCurrentProject,
  } = useStorelistCurrentProject();
  const { AllWorkSpace, loadingAllWorkSpace, fetchAllWorkSpace } =
    useStoreAllWorkSpace();

  const user = useAuthStore((state) => state.user);
  const permissions: any[] = user?.permissions || [];

  const canAddWorkSpace = hasPermission(
    permissions,
    "workspaces.add_workspace"
  );

  const canAddDashboard = hasPermission(
    permissions,
    "workspaces.add_dashboard"
  );

  const canDeleteDashboard = hasPermission(
    permissions,
    "workspaces.delete_dashboard"
  );

  const canDeleteWorkSpace = hasPermission(
    permissions,
    "workspaces.delete_workspace"
  );

  useEffect(() => {
    fetchAllWorkSpace();
  }, [fetchAllWorkSpace]);

  useEffect(() => {
    fetchlistCurrentProject();
  }, [fetchlistCurrentProject]);

  const handleNavigate = (itemId: any) => {
    navigate(`/espace_travail/${itemId}`);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenModalss = () => {
    setIsOpenss(true);
  };

  const handleCloseModalss = () => {
    setIsOpenss(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModals = () => {
    setIsModalOpens(true);
  };

  const handleCloseModals = () => {
    setIsModalOpens(false);
  };

  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Assure que la classe "dark" est appliquée au chargement
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div>
      <div className=" p-6 space-y-8 mx-12">
        <div className="flex justify-end items-center">
          {canAddWorkSpace && (
            <div className="flex items-center gap-3">
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                onClick={handleOpenModal}
              >
                Créer un projet
              </button>

              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                onClick={handleOpenModals}
              >
                Ajouter espace de travail
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow basis-2/3 text-white p-6 rounded-lg">
            <section>
              <h2 className="text-lg font-semibold text-black my-10 dark:text-white">
                {t("workspace.recently_consulted")}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {listCurrentProject?.length > 0 ? (
                  <>
                    {listCurrentProject?.slice(0, 3).map((member: any) => (
                      <Card
                        key={member.id}
                        text={member.name}
                        bgColor="bg-blue-600"
                        bgImage={getRandomImage()}
                        onClick={() => {
                          handleNavigate(member.id);
                        }}
                        onDelete={() => {
                          setSelectedProject(member.id);
                          setIsOpen(true); // 👉 Ouvre le dialog
                        }}
                        onEdit={() => {
                          setSelectedEditId(member.id);
                          handleOpenModalss();
                        }}
                        loading={loadinglistCurrentProject}
                        showDeleteIcon={true}
                        permission={canDeleteDashboard}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    <div className="text-Black font-bold flex items-center justify-center h-full bg-yellow-200 rounded-md dark:text-white">
                      Espace de travail recente non disponible !!!
                    </div>
                  </>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-black my-8 dark:text-white">
                Espace de travail
              </h2>

              {AllWorkSpace?.length > 0 ? (
                <>
                  {AllWorkSpace?.map((member: any) => (
                    <div className="space-y-6" key={member.id}>
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-400 w-10 h-10 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-black my-4 dark:text-white">{member.name}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {member.dashboards.map((mbe: any) => (
                          <Card
                            key={mbe.id}
                            text={mbe.name}
                            bgColor="bg-purple-500"
                            bgImage={getRandomImage()}
                            onClick={() => {
                              handleNavigate(mbe.id);
                              setSelectedProject(mbe.id);
                            }}
                            onDelete={() => {
                              setSelectedProject(mbe.id);
                              setIsOpen(true); // 👉 Ouvre le dialog
                            }}
                            onEdit={() => {
                              setSelectedEditId(mbe.id);
                              handleOpenModalss();
                            }}
                            loading={loadingAllWorkSpace}
                            showDeleteIcon={true}
                            permission={canDeleteDashboard}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="text-Black font-bold flex items-center justify-center h-full bg-yellow-200 rounded-md dark:text-white">
                    Espace de travail non disponible !!!
                  </div>
                </>
              )}
            </section>
          </div>

          <div className="flex-grow basis-1/3 text-white p-6 rounded-lg gap-4">
            <aside>
              <h2 className="text-lg font-semibold text-black my-10 dark:text-white">
                {t("workspace.work_space")}
              </h2>
              {AllWorkSpace?.map((member: any) => (
                <ul className="space-y-4" key={member.id}>
                  <li className="flex items-center space-x-4">
                    <div className="bg-gray-400 w-10 h-10 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-black my-4 dark:text-white">
                      {member.name}
                    </span>

                    {canDeleteWorkSpace && (
                      <>
                        <FaTrash
                          className="mr-2 text-red-500 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();

                            setSelectedWorkTeam(member.id);
                            setIsOpens(true);
                          }}
                        />

                        <FaEdit
                          className="hover:text-green-400 mr-2 text-green-500 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();

                            setSelectedWorkTeam(member.id);
                            setIsOpensss(true);
                          }}
                        />
                      </>
                    )}
                  </li>
                </ul>
              ))}
            </aside>
          </div>
        </div>
      </div>

      {/* Modal création de projet */}
      {canAddDashboard && (
        <TMModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Creer un tableau"
          size="sm"
          height={70}
        >
          <div className="flex items-center justify-center">
            <AddProject />
          </div>
        </TMModal>
      )}

      {canAddDashboard && (
        <TMModal
          isOpen={isOpenss}
          onClose={handleCloseModalss}
          title="Modifier Tableau de board"
          size="sm"
          height={70}
        >
          <div className="flex items-center justify-center">
            <UpdateDashboard idEdit={selectedEditId} />
          </div>
        </TMModal>
      )}

      {canAddDashboard && (
        <TMModal
          isOpen={isOpensss}
          onClose={handleCloseModalss}
          title="Modifier l'espace de travail"
          size="lg"
          height={70}
        >
          <div className="flex items-center justify-center">
            <UpdateWork selectedWorkTeam={selectedWorkTeam} />
          </div>
        </TMModal>
      )}

      {canAddWorkSpace && (
        <TMModal
          isOpen={isModalOpens}
          onClose={handleCloseModals}
          title="Creer votre espacede travail"
          size="sm"
          height={70}
        >
          <div className="flex items-center justify-center">
            <AddEspace />
          </div>
        </TMModal>
      )}

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
              <p className="mt-2">{t("project.confirm_delete_message")}</p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {t("admin.cancel")}
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                  onClick={handleDeleteProject}
                  disabled={loadingdeleteProjects}
                >
                  {loadingdeleteProjects
                    ? t("admin.deleting")
                    : t("admin.delete")}
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
                {t("workSpaceTeam.confirm_delete")}
              </Dialog.Title>
              <p className="mt-2">
                {t("workSpaceTeam.confirm_delete_message")}
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-md"
                  onClick={() => setIsOpens(false)}
                >
                  {t("workSpaceTeam.cancel")}
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                  onClick={handleDeleteWorkSpace}
                  disabled={loadingdeleteWorkSpace}
                >
                  {loadingdeleteWorkSpace
                    ? t("workSpaceTeam.deleting")
                    : t("workSpaceTeam.delete")}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Menu;
