import Loader from "../../components/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/components/ui/table";
import React, { useEffect, useState } from "react";
import useStoreAllUsers from "src/store/Administration/getAll";
import PaginationComponent from "../../components/components/ui/pagination";
import SearchComponent from "../../components/components/search";
import { FaEdit, FaTrash } from "react-icons/fa";
import useStoredeleteUsers from "src/store/Administration/deleteUser";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { getColorForLetter, joinUrlWithParamsId } from "src/helpers/helpers";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { hasPermission } from "src/helpers/permissions";
import { useAuthStore } from "src/store/authStore";

const List = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { AllUsers, loadingAllUsers, fetchAllUsers, count } =
    useStoreAllUsers();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { fetchdeleteUsers, loadingdeleteUsers } = useStoredeleteUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const permissions: any[] = user?.permissions || [];

  const handleRowClick = (id: number) => {
    navigate(joinUrlWithParamsId("/updateusers/:id", id));
  };

  const handleRowClicks = (id: number) => {
    navigate(joinUrlWithParamsId("/detail_users/:id", id));
  };

  // 🔹 Exécuter fetchAllUsers quand search ou page change
  useEffect(() => {
    fetchAllUsers({ page, page_size: 6, search }); // Fixe page_size à 6 pour correspondre à la pagination
  }, [page, search, fetchAllUsers]); // Ajout de search pour rafraîchir les données

  const handleSearch = (e: string) => {
    setSearch(e);
    setPage(1);
  };

  const handleDeleteUser = async () => {
    if (selectedUser) fetchdeleteUsers(selectedUser);

    try {
      toast.success(t("admin.success_add"));
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(t("admin.error_add"));
    }
  };

  const canDeleteUsers = hasPermission(permissions, "users.delete_user");

  const canEditUsers = hasPermission(permissions, "users.change_user");

  return (
    <div className="flex flex-col w-full h-full p-8">
      <div className="font-bold text-3xl my-4">{t("admin.title")}</div>

      <div className="flex justify-end h-[40px]">
        {loadingAllUsers && <Loader />} <br />
        <div className="">
          <SearchComponent onSearch={handleSearch} />
        </div>
        <button
          className="bg-purple-600 text-white text-sm rounded-lg disabled:opacity-50"
          onClick={() => navigate("/add")}
        >
          Ajouter utilisateur
        </button>
      </div>

      <Table className="bg-white mt-10 border rounded-lg shadow-md">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
              {t("admin.table.profile")}
            </TableHead>
            <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
              {t("admin.table.last_name")}
            </TableHead>
            <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
              {t("admin.table.first_name")}
            </TableHead>
            <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
              {t("admin.table.phone")}
            </TableHead>
            <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
              {t("admin.table.gender")}
            </TableHead>
            <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
              {t("admin.table.email")}
            </TableHead>
            <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
              {t("admin.table.active")}
            </TableHead>
            <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
              {t("admin.table.action")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingAllUsers ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <Loader />
              </TableCell>
            </TableRow>
          ) : AllUsers?.length > 0 ? (
            AllUsers?.map((item, index) => (
              <TableRow
                className="cursor-pointer"
                key={index}
                onClick={() => handleRowClicks(item.id)}
              >
                <TableCell className="font-medium">
                  <div className="flex w-full gap-2 items-center">
                    {item?.profile_picture_file ? (
                      <img
                        src={item?.profile_picture_file}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 flex items-center justify-center bg-gray-300 text-white font-bold rounded-full"
                        style={{
                          backgroundColor: getColorForLetter(
                            item.first_name?.charAt(0)
                          ),
                        }}
                      >
                        {item?.first_name
                          ?.split(" ")
                          .map((word: string) => word.charAt(0).toUpperCase())
                          .slice(0, 2)
                          .join("")}
                        {item?.last_name
                          ?.split(" ")
                          .map((word: string) => word.charAt(0).toUpperCase())
                          .slice(0, 2)
                          .join("")}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-[#202224] text-xs font-[600]">
                  {item.first_name}
                </TableCell>
                <TableCell className="text-[#202224] text-xs font-[600]">
                  {item.last_name}
                </TableCell>
                <TableCell className="text-[#202224] text-xs font-[600]">
                  {item.phone_number}
                </TableCell>
                <TableCell className="text-[#202224] text-xs font-[600]">
                  {item.gender}
                </TableCell>
                <TableCell className="text-[#202224] text-xs font-[600]">
                  {item.email}
                </TableCell>
                <TableCell className="text-[#202224] text-xs font-[600] flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.is_active ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                </TableCell>
                <TableCell>
                  <div className="flex w-[96px] justify-between border-[#D5D5D5] rounded-[10px] p-2">
                    {canDeleteUsers && (
                      <FaTrash
                        className="text-red-600 text-lg cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();

                          setSelectedUser(item.id);
                          setIsOpen(true);
                        }}
                      />
                    )}

                    {canEditUsers && (
                      <FaEdit
                        className="text-green-600 text-lg cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();

                          handleRowClick(item.id);
                        }}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                {t("admin.no_data")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <tr>
            <td colSpan={7}>
              <div className="flex justify-center my-4">
                <PaginationComponent
                  pages={Math.ceil((count || 1) / 6)}
                  currentPage={page}
                  onPageChange={setPage}
                  rangeLimit={5}
                />
              </div>
            </td>
          </tr>
        </TableFooter>
      </Table>

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
                  disabled={loadingdeleteUsers}
                >
                  {loadingdeleteUsers ? t("admin.deleting") : t("admin.delete")}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default List;
