import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/components/ui/popover";
import { cn } from "../../components/lib/utils";
import { Calendar } from "../../components/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Button } from "../../components/components/ui/button";
import { format } from "date-fns";
import { useTranslation } from "src/hooks/useTranslation";
import { Input } from "../../components/components/ui/input";
import useaddTagStore from "src/store/tag/add";
import { useThemeStore } from "src/store/themeStore";

interface AddSectionProps {
  idcartes: any; // Ou 'number' selon le type attendu
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormSchema = z.object({
  tag: z.string().min(2, {
    message: "tag must be at least 2 characters.",
  }),
});

const AdddEtiquette: React.FC<AddSectionProps> = ({
  idcartes,
  isOpen,
  setIsOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  // console.log("idcartes", typeof idcartes);

  const { addTag, addTagResponse } = useaddTagStore((state: any) => state);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tag: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      // Appel pour ajouter l'adresse de livraison
      await addTag({
        tag: data.tag,
        card: idcartes,
      });
      toast.success(t("etiquette.project_success"));
      setTimeout(() => setIsOpen(false), 1000);

      setLoading(false);

      //   navigate(0);
    } catch (error) {
      console.error(t("etiquette.project_error"), error);
      setLoading(false);
    }
  };

  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Assure que la classe "dark" est appliquée au chargement
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return isOpen ? (
    <div>
      <div>
        <ToastContainer />

        <div className=" p-6 w-99">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col items-start justify-start p-6 gap-10">
                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem className="w-full dark:text-gray-950">
                      <FormLabel className="flex items-start justify-start">
                        {" "}
                        {t("tag.name.")}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={t("tag.placeholder")} {...field} />
                      </FormControl>
                      {/*    <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full p-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 mt-3"
                  disabled={loading}
                >
                  {loading ? t("etiquette.loading") : t("etiquette.add_delais")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  ) : null;
};

export default AdddEtiquette;
