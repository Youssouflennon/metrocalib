import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useStoreaddPriorite from "src/store/cards/addPriorite";
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
import { Button } from "../../components/components/ui/button";
import { useTranslation } from "src/hooks/useTranslation";
import { useThemeStore } from "src/store/themeStore";

interface AddSectionProps {
  idcartes: any; // Ou 'number' selon le type attendu
}

const FormSchema = z.object({
  priority: z.number().max(100, {
    message: "La priorité doit être au moins 1.",
  }),
});

const AddPriorite: React.FC<AddSectionProps> = ({ idcartes }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  console.log("idcartes", typeof idcartes);

  const { addPriorite, addPrioriteResponse } = useStoreaddPriorite(
    (state: any) => state
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      priority: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      console.log("idcartes avant envoi:", idcartes);

      await addPriorite(String(idcartes), data.priority); // Convertir idcartes en string
      window.location.reload(); // Recharge la page après soumission

      toast.success(t("workspace.delais_success"));
      setLoading(false);
      navigate(0);
    } catch (error) {
      console.error(t("workspace.delais_error"), error);
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
      <div>
        <ToastContainer />

        <div className=" p-6 w-99">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col items-start justify-start p-6 gap-10">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="w-full dark:text-gray-950">
                      <FormLabel className="flex items-start justify-start">
                        {t("workspace.priority")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={4}
                          placeholder={t("workspace.placeholder_priority")}
                          {...field}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0 && value <= 4) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full p-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 mt-3"
                  disabled={loading}
                >
                  {loading
                    ? t("workspace.loading")
                    : t("workspace.add_priority")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddPriorite;
