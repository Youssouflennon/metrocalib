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
import { ToastContainer, toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/components/ui/select";
import { useNavigate } from "react-router-dom";
import useAddessaddSectionStore from "src/store/section/addSection";
import useStorelistCurrentProject from "src/store/dashboard/curentProject";
import useStoreOneDashboard from "src/store/dashboard/getOne";
import { useTranslation } from "src/hooks/useTranslation";
import { useThemeStore } from "src/store/themeStore";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),

  description: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

interface AddSectionProps {
  id: any; // Ou 'number' selon le type attendu
}

const AddSection: React.FC<AddSectionProps> = ({ id }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const {
    OneDashboard,
    loadingOneDashboard,
    fetchOneDashboard,
    updateCardSection,
  } = useStoreOneDashboard();

  // Récupérer les données du dashboard uniquement lorsque idParam change
  useEffect(() => {
    if (id) {
      fetchOneDashboard(id);
    }
  }, [id, fetchOneDashboard]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { addSection, addSectionResponse } = useAddessaddSectionStore(
    (state: any) => state
  );

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      // Appel pour ajouter l'adresse de livraison
      await addSection({
        name: data.name,
        dashboard: id,
        description: data.description,
      });
      toast.success(t("workspace.section_success"));

      navigate(0);
      setLoading(false);
      fetchOneDashboard(id);
    } catch (error) {
      console.error(t("workspace.section_error"), error);
      toast.error(t("workspace.section_error"));

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
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full dark:text-gray-950">
                    <FormLabel className="flex items-start justify-start">
                      {t("workspace.name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("workspace.placeholder_name")}
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

              {/*  <FormField
                control={form.control}
                name="dashboard"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="flex items-start justify-start">
                      {" "}
                      Dashboard
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {listCurrentProject.map((member: any, idx: any) => (
                          <SelectItem
                            value="m@example.com"
                            onClick={() => {
                              setSelectId(member.id);
                            }}
                          >
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
               
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
                      {t("workspace.sub_title")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("workspace.placeholder_sub_title")}
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
                className="w-full p-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 mt-3"
                disabled={loading}
              >
                {loading ? t("workspace.loading") : t("workspace.add_section")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddSection;
