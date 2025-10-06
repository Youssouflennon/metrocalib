import { useForm } from "react-hook-form";
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
import { Input } from "../../components/components/ui/input";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/components/ui/select";
import { useNavigate } from "react-router-dom";
import useStoreGetSection from "src/store/section/getSection";
import useAddessaddCardStore from "src/store/cards/addCard";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/components/ui/popover";
import { cn } from "../../components/lib/utils";
import { Calendar } from "../../components/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import useStoreOneSection from "src/store/section/getOne";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "src/hooks/useTranslation";
import { useThemeStore } from "src/store/themeStore";

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),

  description: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

interface AddSectionProps {
  sectionsIds: any; // Ou 'number' selon le type attendu
}

const AddCard: React.FC<AddSectionProps> = ({ sectionsIds }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const [selectId, setSelectId] = useState<any>();

  const { GetSection, loadingGetSection, fetchGetSection } =
    useStoreGetSection();

  const { OneSection, loadingOneSection, fetchOneSection } =
    useStoreOneSection();

  useEffect(() => {
    if (sectionsIds) {
      fetchOneSection(sectionsIds);
    }
  }, [sectionsIds, fetchOneSection]);

  useEffect(() => {
    fetchGetSection();
  }, [fetchGetSection]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      //  due_date: new Date(),
    },
  });

  const { addCard, addCardResponse } = useAddessaddCardStore(
    (state: any) => state
  );

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      // Appel pour ajouter l'adresse de livraison
      await addCard({
        title: data.title,
        section: OneSection?.id,
        description: data.description,
      });
      toast.success(t("workspace.card_success"));

      navigate(0);
      setLoading(false);
      fetchGetSection();
    } catch (error) {
      console.error(t("workspace.card_error"), error);
      setLoading(false);
    }
  };

  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Assure que la classe "dark" est appliquée au chargement
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div>
      <ToastContainer />

      <div className=" p-6 w-99">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col items-start justify-start p-6 gap-10">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full dark:text-gray-950">
                    <FormLabel className="flex items-start justify-start">
                      {" "}
                      {t("workspace.card_title")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("workspace.card_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    {/*    <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*         <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify">
                    <FormLabel className="flex items-start justify-start">
                      {t("workspace.card_date")}
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[260px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t("workspace.card_date")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full dark:text-gray-950">
                    <FormLabel className="flex items-start justify-start">
                      {" "}
                      {t("workspace.card_description")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("workspace.card_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    {/*  <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full  p-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 mt-3"
                disabled={loading}
              >
                {loading ? t("workspace.loading") : t("workspace.add_card")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddCard;
