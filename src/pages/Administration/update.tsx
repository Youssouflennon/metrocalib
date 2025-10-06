import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useStoreOneUser from "src/store/Administration/getOne";
import { toast, ToastContainer } from "react-toastify";
import { MultiSelect } from "react-multi-select-component";
import useStoreAllPermission from "src/store/permission/getAll";
import useStoreAllGroup from "src/store/group/getAll";
/* import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
 */ import { Switch } from "../../components/components/ui/switch";
import useStoreUpdateUser from "src/store/Administration/update";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/components/ui/form";
import { Input } from "../../components/components/ui/input";
import { Button } from "../../components/components/ui/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../components/components/ui/radio-group";
import { useTranslation } from "../../hooks/useTranslation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Schéma de validation avec zod
const userSchema = z.object({
  first_name: z.string().min(1, "Le prénom est requis"),
  last_name: z.string().min(1, "Le nom est requis"),
  phone_number: z.string().min(9, "Numéro invalide"),
  email: z.string().email("Email invalide"),
  password: z.string().optional(),
  gender: z.enum(["M", "F"]),
  is_active: z.boolean(),
  user_permissions: z.array(z.number()).optional(),
  groups: z.array(z.number()).optional(),
  profile_picture_file: z.any().optional(),
});

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { OneUser, fetchOneUser } = useStoreOneUser();
  const { AllPermission, fetchAllPermission } = useStoreAllPermission();
  const { AllGroup, fetchAllGroup } = useStoreAllGroup();
  const { updateUsers } = useStoreUpdateUser();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      password: "",
      gender: "M",
      is_active: true,
      user_permissions: [],
      groups: [],
      profile_picture_file: null,
    },
  });

  useEffect(() => {
    if (id) {
      fetchOneUser(id);
    }
    fetchAllPermission({ page, page_size: 156, search });
    fetchAllGroup({ page, page_size: 123, search });
  }, [id, page, search, fetchOneUser, fetchAllPermission, fetchAllGroup]);

  useEffect(() => {
    if (OneUser) {
      form.reset({
        first_name: OneUser.first_name || "",
        last_name: OneUser.last_name || "",
        phone_number: OneUser.phone_number || "",
        password: OneUser.password || "",
        profile_picture_file: null,
        email: OneUser?.email || "",
        gender: OneUser.gender || "M",
        is_active: OneUser.is_active || true,
        user_permissions: OneUser.user_permissions?.map((g: any) => g.id) || [],
        groups: OneUser.groups?.map((g: any) => g.id) || [],
      });
    }
  }, [OneUser, form]);

  const onSubmit = async (data: any) => {
    console.log("data", data);
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("phone_number", data.phone_number);
      formData.append("email", data.email);
      if (data.password) {
        formData.append("password", data.password);
      }
      formData.append("gender", data.gender);
      formData.append("is_active", data.is_active.toString());

      // Append file if it exists
      if (data.profile_picture_file instanceof File) {
        formData.append("profile_picture_file", data.profile_picture_file);
      }

      data?.user_permissions?.forEach((permId: any) =>
        formData.append("user_permissions", permId)
      );

      data?.groups?.forEach((groupId: any) =>
        formData.append("groups", groupId)
      );

      if (id) await updateUsers(id, formData); // ton action doit gérer l'envoi de FormData
      navigate("/list");
    } catch (error) {
      toast.error(t("admin.error_add"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[950px] mx-auto p-2 bg-white shadow-lg rounded-md m-8">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">{t("admin.update_user")}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-10 p-6">
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.form.last_name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.form.first_name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.form.phone")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.form.email")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.form.password")}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                        className="pr-10"
                      />
                    </FormControl>
                    <div
                      className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-gray-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_permissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.form.permissions")}</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={
                        AllPermission?.map((perm) => ({
                          label: perm.name,
                          value: perm.id,
                        })) || []
                      }
                      value={(field.value || []).map((id: any) => {
                        const matched = AllPermission?.find(
                          (perm) => perm.id === id
                        );
                        return {
                          label: matched?.name || id,
                          value: id,
                        };
                      })}
                      onChange={(selected: any) =>
                        field.onChange(selected.map((s: any) => s.value))
                      }
                      labelledBy={t("admin.form.select_permissions")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="groups"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.form.role")}</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={
                        AllGroup?.map((group) => ({
                          label: group.name,
                          value: group.id,
                        })) || []
                      }
                      value={(field.value || []).map((id: any) => {
                        const matched = AllGroup?.find(
                          (group) => group.id === id
                        );
                        return {
                          label: matched?.name || id,
                          value: id,
                        };
                      })}
                      onChange={(selected: any) =>
                        field.onChange(selected.map((s: any) => s.value))
                      }
                      labelledBy={t("admin.form.select_roles")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profile_picture_file"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("admin.form.profile_picture")}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("admin.form.gender")}</FormLabel>
                  <FormControl>
                    <div className="flex space-x-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={field.name}
                          checked={field.value === "M"}
                          onChange={() => field.onChange("M")}
                          className="h-5 w-5 cursor-pointer appearance-none border-2 border-gray-300 rounded-full 
                          checked:border-purple-600 checked:bg-purple-600 transition-all duration-300 shadow-sm 
                          hover:scale-105 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        />
                        <span className="ml-2">
                          {t("admin.form.gender_male")}
                        </span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={field.name}
                          checked={field.value === "F"}
                          onChange={() => field.onChange("F")}
                          className="h-5 w-5 cursor-pointer appearance-none border-2 border-gray-300 rounded-full 
                          checked:border-purple-600 checked:bg-purple-600 transition-all duration-300 shadow-sm 
                          hover:scale-105 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        />
                        <span className="ml-2">
                          {t("admin.form.gender_female")}
                        </span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-md bg-white">
                  <FormLabel>{t("admin.form.active")}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-300 transition-colors"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center pt-4">
            <Button
              disabled={loading}
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? t("admin.loading") : t("admin.update_user")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateUser;
