import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import useAddessaddCheckListStore from "src/store/cardCheckList/addChecklist";
import { Input } from "../../components/components/ui/input";
import { Button } from "../../components/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/components/ui/form";
import useStoreAllCheckCard from "src/store/cardCheckList/getAll";
import { useTranslation } from "src/hooks/useTranslation";

interface AddSectionProps {
  idcartes: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Schéma de validation avec Zod
const FormSchema = z.object({
  card: z.string().uuid(), // UUID valide
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  is_done: z.boolean(),
});

const AddCheckCard: React.FC<AddSectionProps> = ({
  idcartes,
  isOpen,
  setIsOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const { addCheckList } = useAddessaddCheckListStore((state: any) => state);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      card: idcartes,
      title: "",
      is_done: false,
    },
  });

  const {
    AllCheckCard,
    loadingAllCheckCard,
    fetchAllCheckCard,
    updateCardCheck,
  } = useStoreAllCheckCard();

  useEffect(() => {
    fetchAllCheckCard({
      card_id: idcartes,
    });
  }, [fetchAllCheckCard, idcartes]);

  const onSubmitcheck = async (data: z.infer<typeof FormSchema>) => {
    if (!idcartes) return;
    setLoading(true);
    try {
      await addCheckList(data);
      toast.success(t("workspace.checklist_success"));

      // Ferme le pop-up après succès
      setTimeout(() => setIsOpen(false), 1000);
      fetchAllCheckCard({
        card_id: idcartes,
      });
    } catch (error) {
      console.error(t("workspace.checklist_error"), error);
      toast.error(t("workspace.checklist_error"));
    } finally {
      setLoading(false);
    }
  };

  return isOpen ? ( // N'affiche que si `isOpen` est `true`
    <div className="p-6">
      <ToastContainer />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitcheck)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("workspace.checklist_title")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("workspace.placeholder_checklist_title")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_done"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                <FormLabel>{t("workspace.checklist_mark_as_done")}</FormLabel>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 mt-3">
            {loading ? t("workspace.loading") : t("workspace.add_checklist")}
          </Button>
        </form>
      </Form>
    </div>
  ) : null;
};

export default AddCheckCard;
