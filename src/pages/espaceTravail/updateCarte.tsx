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
import useStoreUpdatedCart from "src/store/cards/update";
import useStoreOneCard from "src/store/cards/getOne";

interface AddcardProps {
  idEdit: any;
}

// Exemple de workspace

// Tu peux ajuster ça selon ton store

const userSchema = z.object({
  title: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
});

type UserFormValues = z.infer<typeof userSchema>;

const UpdateCarte: React.FC<AddcardProps> = ({ idEdit }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { OneCard, fetchOneCard } = useStoreOneCard();

  const { updateCart } = useStoreUpdatedCart();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (idEdit) {
      fetchOneCard(idEdit);
    }
  }, [idEdit, fetchOneCard]);

  useEffect(() => {
    if (OneCard) {
      form.reset({
        title: OneCard.title || "",
        description: OneCard.description || "",
      });
    }
  }, [OneCard, form]);

  console.log("OneCard", idEdit)

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      if (idEdit) {
        await updateCart(idEdit, data);
        toast.success(t("card.update_success"));
        navigate(0);
      }
    } catch (error) {
      toast.error(t("card.error_add"));
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("card.form.name")}</FormLabel>
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
                    <FormLabel>{t("card.form.description")}</FormLabel>
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
                {loading ? t("card.loading") : t("card.update")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateCarte;
