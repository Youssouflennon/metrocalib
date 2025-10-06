import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import Tree from "rc-tree";
import "rc-tree/assets/index.css";

import { useTranslation } from "src/hooks/useTranslation";
import useStoreOneRoleTree from "src/store/role/roleTree";
import useStoreAllPermissionTree from "src/store/permission/getAllTree";
import useStoreUpdateRole from "src/store/role/updateRole";

import Loader from "../../components/loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/components/ui/form";
import { Input } from "../../components/components/ui/input";
import { Button } from "../../components/components/ui/button";

// Validation avec Zod
const userSchema = z.object({
  name: z.string().min(1, "Le prénom est requis"),
  permissions: z.any().optional(),
});

const UpdateRole = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { OneRoleTree, fetchOneRoleTree } = useStoreOneRoleTree();
  const {
    AllPermissionTree,
    fetchAllPermissionTree,
    loadingAllPermissionTree,
  } = useStoreAllPermissionTree();
  const { updateRoles } = useStoreUpdateRole();

  const [loading, setLoading] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  // Appels API initiaux
  useEffect(() => {
    if (id) {
      fetchOneRoleTree(id);
    }
    fetchAllPermissionTree();
  }, [id, fetchOneRoleTree, fetchAllPermissionTree]);

  // Mise à jour du formulaire quand le rôle est chargé
  useEffect(() => {
    if (OneRoleTree) {
      const allPermissionIds = Object.values(OneRoleTree.permissions || {})
        .flat()
        .map((perm: any) => perm.id);

      form.reset({
        name: OneRoleTree.name || "",
        permissions: allPermissionIds,
      });

      setCheckedKeys(allPermissionIds.map((id: number) => id.toString()));
    }
  }, [OneRoleTree, form]);

  // Convertit les permissions groupées par module en structure exploitable par rc-tree
  const convertTree = (
    tree: Record<string, { id: number; name: string; code: string }[]>
  ) => {
    return Object.entries(tree).map(([category, permissions]) => ({
      key: category,
      title: category,
      children: permissions.map((perm) => ({
        key: perm.id.toString(),
        title: perm.name,
      })),
    }));
  };

  const treeData = useMemo(
    () => convertTree(AllPermissionTree || {}),
    [AllPermissionTree]
  );

  // Synchronise les permissions sélectionnées avec le formulaire
  useEffect(() => {
    const numericChecked: any = checkedKeys
      .filter((key) => !isNaN(Number(key)))
      .map((key) => Number(key));
    form.setValue("permissions", numericChecked);
  }, [checkedKeys, form]);

  // Soumission du formulaire
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (id) {
        await updateRoles(id, data);
        toast.success("Rôle mis à jour avec succès");
        navigate("/listRole");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[950px] mx-auto p-2 bg-white shadow-lg rounded-md m-8">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Modifier le Rôle</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-10 p-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {loadingAllPermissionTree ? (
              <Loader />
            ) : (
              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem className="w-full dark:text-[#1d0553]">
                    <FormLabel>{t("roles.form.permissions")}</FormLabel>
                    <FormControl>
                      <div className="border rounded-md p-2 max-h-80 overflow-auto">
                        <Tree
                          checkable
                          treeData={treeData}
                          checkedKeys={checkedKeys}
                          onCheck={(keys: any) =>
                            setCheckedKeys(keys as string[])
                          }
                          expandedKeys={expandedKeys}
                          onExpand={(keys: any) =>
                            setExpandedKeys(keys as string[])
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="flex justify-center pt-4">
            <Button
              disabled={loading}
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? "Chargement..." : "Modifier"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateRole;
