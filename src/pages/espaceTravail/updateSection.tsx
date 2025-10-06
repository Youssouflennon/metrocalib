import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useStoreOneDashboard from "src/store/dashboard/getOne";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
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
import { useTranslation } from "../../hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import useStoreUpdatedDashboard from "src/store/dashboard/updateDashboard";
import useStoreOneSection from "src/store/section/getOne";
import useStoreUpdatedSection from "src/store/section/update";

interface AddSectionProps {
  idEdit: any;
}

// Exemple de workspace

// Tu peux ajuster ça selon ton store

const userSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
});

type UserFormValues = z.infer<typeof userSchema>;

const UpdateDashboard: React.FC<AddSectionProps> = ({ idEdit }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { OneSection, fetchOneSection } = useStoreOneSection();

  const { updateSection } = useStoreUpdatedSection();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (idEdit) {
      fetchOneSection(idEdit);
    }
  }, [idEdit, fetchOneSection]);

  useEffect(() => {
    if (OneSection) {
      form.reset({
        name: OneSection.name || "",
        description: OneSection.description || "",
      });
    }
  }, [OneSection, form]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      if (idEdit) {
        await updateSection(idEdit, data);
        toast.success(t("section.update_success"));
        navigate(0);
      }
    } catch (error) {
      toast.error(t("section.error_add"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="">
        <ToastContainer />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col items-start justify-start p-6 gap-10">
              {/* Nom */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("section.form.name")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("section.form.description")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Workspace Select */}
            </div>

            <div className="flex justify-center pt-4">
              <Button
                disabled={loading}
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? t("section.loading") : t("section.update")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateDashboard;
