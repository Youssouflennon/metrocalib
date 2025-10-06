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

import useStoreUpdatedWorkSpace from "src/store/workPace/update";
import useStoreOneWork from "src/store/workPace/getOne";

interface AddSectionProps {
  selectedWorkTeam: any;
}

// Exemple de workspace

// Tu peux ajuster ça selon ton store

const userSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
});

type UserFormValues = z.infer<typeof userSchema>;

const UpdateWork: React.FC<AddSectionProps> = ({ selectedWorkTeam }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { OneWork, fetchOneWork } = useStoreOneWork();
  const { updateWorkSpace } = useStoreUpdatedWorkSpace();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (selectedWorkTeam) {
      fetchOneWork(selectedWorkTeam);
    }
  }, [selectedWorkTeam, fetchOneWork]);

  useEffect(() => {
    if (OneWork) {
      form.reset({
        name: OneWork.name || "",
        description: OneWork.description || "",
      });
    }
  }, [OneWork, form]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      if (selectedWorkTeam) {
        await updateWorkSpace(selectedWorkTeam, data);
        toast.success(t("admin.update_success"));
        navigate(0);
      }
    } catch (error) {
      toast.error(t("admin.error_add"));
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
                    <FormLabel>{t("admin.form.name")}</FormLabel>
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
                    <FormLabel>{t("admin.form.description")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
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
    </div>
  );
};

export default UpdateWork;
