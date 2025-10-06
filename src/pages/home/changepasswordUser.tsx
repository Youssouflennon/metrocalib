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
import { useNavigate } from "react-router-dom";
import { Switch } from "../../components/components/ui/switch";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "../../hooks/useTranslation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAddesschangePassStore from "src/store/changePass/update";
import useAddesschangePassUserStore from "src/store/changePass/updateUser";

const FormSchema = z.object({
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
});

interface AddSectionProps {
  IdMember: any; // Ou 'number' selon le type attendu
}

const ChangepasswordUser: React.FC<AddSectionProps> = ({ IdMember }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
    },
  });

  const { changePassUser, changePassUserResponse } =
    useAddesschangePassUserStore((state) => state);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    // Create FormData object

    // Append groups and permissions as JSON strings (or however your API expects them)

    try {
      // Send the FormData with an HTTP client (axios or fetch)
      await changePassUser(IdMember, data.password); // 👈 passe directement le mot de passe

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
    <div className="  mx-auto p-2 bg-white shadow-lg rounded-md m-8 overflow-y-auto">
      <ToastContainer />

      <h2 className="text-2xl font-bold mb-4">{t("password.change")}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex gap-10 p-6">
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

export default ChangepasswordUser;
