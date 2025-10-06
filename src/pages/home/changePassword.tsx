import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/components/ui/select";
import { Button } from "../../components/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/components/ui/form";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Input } from "../../components/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAddessaddUserStore from "src/store/Administration/addUser";
import { useNavigate } from "react-router-dom";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../components/components/ui/radio-group";
import { Switch } from "../../components/components/ui/switch";
import useStoreAllPermission from "src/store/permission/getAll";
import useStoreAllGroup from "src/store/group/getAll";
import { toast, ToastContainer } from "react-toastify";
import { MultiSelect } from "react-multi-select-component";
import { useTranslation } from "../../hooks/useTranslation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAddesschangePassStore from "src/store/changePass/update";

const FormSchema = z.object({
  is_active: z.boolean(),
  email: z.string().email({ message: "Email invalide." }),
  phone_number: z.string().min(8, {
    message: "Le numéro de téléphone doit contenir au moins 8 caractères.",
  }),
  first_name: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  last_name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),

  gender: z.enum(["M", "F"], {
    message: "Le genre doit être 'male', 'female' ",
  }),
  profile_picture_file: z.any(),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
});

const ChangePass = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      is_active: true,
      email: "",
      phone_number: "",
      first_name: "",
      last_name: "",
      gender: "M",
      profile_picture_file: null,
      password: "",
    },
  });

  const { changePass, changePassResponse } = useAddesschangePassStore(
    (state) => state
  );

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    // Create FormData object
    const formData = new FormData();

    // Append form data
    formData.append("is_active", String(data.is_active));
    formData.append("email", data.email);
    formData.append("phone_number", data.phone_number);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("gender", data.gender);
    formData.append("password", data.password);
    if (data.profile_picture_file) {
      formData.append("profile_picture_file", data.profile_picture_file);
    }
    // Append groups and permissions as JSON strings (or however your API expects them)

    try {
      // Send the FormData with an HTTP client (axios or fetch)
      await changePass(formData); // Assuming `addUser` can handle FormData

     navigate(0);
      setLoading(false);
      toast.success(t("password.success_add"));
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(t("password.error_add"));

      setLoading(false);
    }
  };

  return (
    <div className="w-[950px]  mx-auto p-2 bg-white shadow-lg rounded-md m-8 overflow-y-auto">
      <ToastContainer />

      <h2 className="text-2xl font-bold mb-4">{t("password.change")}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-10 p-6">
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("admin.form.last_name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("admin.form.last_name")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("admin.form.first_name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("admin.form.first_name")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("admin.form.phone")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("admin.form.phone")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("admin.form.email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("admin.form.email")} {...field} />
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
                          name={field.name} // Utilisation correcte du nom
                          checked={field.value === "M"}
                          onChange={() => field.onChange("M")} // Mise à jour de la valeur
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
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("admin.form.active")}
                    </FormLabel>
                  </div>
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

          <div className="w-full flex justify-center pt-4">
            <Button
              disabled={loading}
              type="submit"
              variant="default"
              className="w-full p-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 mt-3"
            >
              {loading ? t("admin.loading") : t("button.add")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChangePass;
