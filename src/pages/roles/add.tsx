import React, { useEffect, useState, useMemo } from "react";
import { Button } from "../../components/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/components/ui/form";
import { Input } from "../../components/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "rc-tree/assets/index.css";
import Tree from "rc-tree";
import useAddessAddRoleStore from "src/store/role/addRole";
import { useTranslation } from "../../hooks/useTranslation";
import { useThemeStore } from "src/store/themeStore";
import useStoreAllPermissionTree from "src/store/permission/getAllTree";
import "rc-tree/assets/index.css";
import Loader from "../../components/loader";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  permissions: z.array(z.number()),
});

const AddRole = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  const {
    AllPermissionTree,
    loadingAllPermissionTree,
    fetchAllPermissionTree,
  } = useStoreAllPermissionTree();

  const { AddRole } = useAddessAddRoleStore((state) => state);

  const { theme } = useThemeStore();

  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

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

  useEffect(() => {
    const numericChecked = checkedKeys
      .filter((key) => !isNaN(Number(key)))
      .map((key) => Number(key));
    form.setValue("permissions", numericChecked);
  }, [checkedKeys, form]);

  useEffect(() => {
    fetchAllPermissionTree();
  }, [fetchAllPermissionTree]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      data.permissions.forEach((id) =>
        formData.append("permissions", id.toString())
      );
      await AddRole(formData);
      toast.success(t("roles.success_add"));
      navigate("/listRole");
    } catch (error) {
      toast.error(t("roles.error_add"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[950px] mx-auto p-2 bg-white shadow-lg rounded-md m-8">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 dark:text-[#1d0553]">
        {t("roles.add_role")}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-10 p-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full dark:text-[#1d0553]">
                  <FormLabel>{t("roles.form.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("roles.form.name")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {loadingAllPermissionTree ? (
              <>
                <Loader />
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="w-full flex justify-center pt-4">
            <Button
              disabled={loading}
              type="submit"
              className="w-full p-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 mt-3"
            >
              {loading ? t("roles.loading") : t("button.add")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddRole;
