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

import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "src/hooks/useTranslation";
import useAddessaddWorkSpaceStore from "src/store/workPace/add";
import { useThemeStore } from "src/store/themeStore";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),

  description: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const AddEspace = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { addWorkSpace, addWorkSpaceResponse } = useAddessaddWorkSpaceStore(
    (state) => state
  );

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      // Appel pour ajouter l'adresse de livraison
      await addWorkSpace({
        name: data.name,
        description: data.description,
      });
      toast.success(t("workspace.project_success"));

      setLoading(false);

      navigate(0);
    } catch (error) {
      console.error(t("workspace.project_error"), error);
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
        {/*    <img
          src="/path-to-image.jpg"
          alt="Aperçu du projet"
          className="w-full rounded mb-4"
        /> */}
        {/*         <label className="block text-sm font-medium mb-2">Fond D’écran</label>
         */}{" "}
        {/*   <div className="flex gap-2 mb-4">
          <div className="w-10 h-6 bg-blue-600 rounded cursor-pointer"></div>
          <div className="w-10 h-6 bg-indigo-600 rounded cursor-pointer"></div>
          <div className="w-10 h-6 bg-green-400 rounded cursor-pointer"></div>
          <div className="w-10 h-6 bg-pink-400 rounded cursor-pointer"></div>
          <div className="w-10 h-6 bg-gray-600 rounded cursor-pointer"></div>
          <div className="w-10 h-6 bg-orange-600 rounded cursor-pointer"></div>
        </div> */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col items-start justify-start p-6 gap-10">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full dark:text-gray-950">
                    <FormLabel className="flex items-start justify-start">
                      {" "}
                      {t("workspace.name.")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("workspace.placeholder")}
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full dark:text-gray-950">
                    <FormLabel className="flex items-start justify-start">
                      {" "}
                      {t("workspace.description")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("workspace.placeholder_description")}
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
                {loading ? t("workspace.loading") : t("workspace.create.")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddEspace;
