import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStoreaddDelais from "src/store/cards/delaisTache";
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

interface AddSectionProps {
  idcartes: any; // Ou 'number' selon le type attendu
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormSchema = z.object({
  due_date: z.date({
    required_error: "A date of birth is required.",
  }),
});

const DelaisTache: React.FC<AddSectionProps> = ({
  idcartes,
  isOpen,
  setIsOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  console.log("idcartes", typeof idcartes);

  const { addDelais, addDelaisResponse } = useStoreaddDelais(
    (state: any) => state
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      due_date: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      console.log(t("workspace.delais_success"), idcartes);

      await addDelais(String(idcartes), data.due_date.toISOString()); // Convertir idcartes en string

      toast.success(t("workspace.delais_success"));
      setTimeout(() => setIsOpen(false), 1000);

      setLoading(false);
      //  navigate(0);
    } catch (error) {
      console.error(t("workspace.delais_error"), error);
      setLoading(false);
    }
  };

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
                  name="due_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify">
                      <FormLabel className="flex items-start justify-start">
                        {t("workspace.delais_date")}
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
                                <span>{t("workspace.pick_date")}</span>
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
                />

                <Button
                  type="submit"
                  className="w-full p-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 mt-3"
                  disabled={loading}
                >
                  {loading ? t("workspace.loading") : t("workspace.add_delais")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  ) : null;
};

export default DelaisTache;
