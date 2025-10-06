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
import Pagination from "../../components/components/ui/pagination";
import useStoreallRole from "src/store/role/listRole";
import PaginationComponent from "../../components/components/ui/pagination";
import { Dialog, Transition } from "@headlessui/react";
import SearchComponent from "../../components/components/search";
import { FaEdit, FaTrash } from "react-icons/fa";
import { joinUrlWithParamsId } from "src/helpers/helpers";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useStoredeleteRoles from "src/store/role/deleteRole";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuthStore } from "src/store/authStore";
import { hasPermission } from "src/helpers/permissions";

const ListRole = () => {
  const { allRole, loadingallRole, fetchallRole, count } = useStoreallRole();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { fetchdeleteRoles, loadingdeleteRoles } = useStoredeleteRoles();

  const handleRowClick = (id: number) => {
    navigate(joinUrlWithParamsId("/updateroles/:id", id));
  };

  useEffect(() => {
    fetchallRole({ page, page_size: 7, search });
  }, [page, search]);

  const handleSearch = (e: string) => {
    setSearch(e);
    setPage(1);
  };

  const handleDeleteUser = async () => {
    if (selectedUser) fetchdeleteRoles(selectedUser);

    try {
      toast.success(t("roles.success_add"));
      setIsOpen(false);
      window.location.reload();
      fetchallRole();
    } catch (error) {
      toast.error(t("roles.error_add"));
    }
  };

  const user = useAuthStore((state) => state.user);
  const permissions: any[] = user?.permissions || [];

  const canDeleteGroups = hasPermission(permissions, "auth.delete_group");

  const canEditGroups = hasPermission(permissions, "auth.change_group");

  return (
    <div className="flex flex-col w-full h-full p-8">
      <div className="font-bold text-3xl my-4">{t("roles.title")}</div>

      <div className="flex justify-end  h-[40px]">
        {loadingallRole && <Loader />} <br />
        <div className="">
          <SearchComponent onSearch={handleSearch} />
        </div>
        <button
          className="bg-purple-600 text-white text-sm rounded-lg disabled:opacity-50"
          onClick={() => navigate("/addRole")}
        >
          Ajouter le role
        </button>
      </div>

      <Table className="bg-white mt-16 border rounded-lg shadow-md overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
              {t("roles.table.name")}
            </TableHead>
            <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
              {t("roles.table.permissions")}
            </TableHead>
            <TableHead className="w-[100px] font-[700] text-xs text-[#202224]">
              {t("roles.table.action")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingallRole ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <Loader />
              </TableCell>
            </TableRow>
          ) : allRole?.length > 0 ? (
            allRole?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-[#202224] text-xs font-[600]">
                  {item.name}
                </TableCell>
                <TableCell className="text-[#202224] text-xs font-[600]">
                  <div className="flex flex-wrap gap-2">
                    {item.permissions.map((per: any, indx: number) => (
                      <span
                        key={indx}
                        className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium after:content-[';'] last:after:content-none"
                      >
                        {per.name}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex w-[96px] justify-between border-[#D5D5D5] rounded-[10px] p-2">
                    {canDeleteGroups && (
                      <FaTrash
                        className="text-red-600 text-lg cursor-pointer"
                        onClick={() => {
                          setSelectedUser(item.id);
                          setIsOpen(true);
                        }}
                      />
                    )}

                    {canEditGroups && (
                      <FaEdit
                        className="text-green-600 text-lg cursor-pointer"
                        onClick={() => handleRowClick(item.id)}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                {t("roles.no_data")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <tr>
            <td colSpan={7}>
              <div className="flex justify-center my-4">
                <PaginationComponent
                  pages={Math.ceil((count || 1) / 7)} // 🔹 Fixe à 6 pour correspondre à page_size
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
                {t("roles.confirm_delete")}
              </Dialog.Title>
              <p className="mt-2">Voulez-vous vraiment supprimer ce role ?</p>
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
                  disabled={loadingdeleteRoles}
                >
                  {loadingdeleteRoles ? t("admin.deleting") : t("admin.delete")}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
      <ToastContainer />
    </div>
  );
};

export default ListRole;
