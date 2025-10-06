import React, { useEffect, useState } from "react";
import useAddessAddJointeStore from "src/store/pieceJointe/add";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
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
import useStoreOneCard from "src/store/cards/getOne";
import { useThemeStore } from "src/store/themeStore";

interface AddSectionProps {
  idcartes: any; // Ou 'number' selon le type attendu
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormSchema = z.object({
  file: z.any(),
});
const AddPiece: React.FC<AddSectionProps> = ({
  idcartes,
  isOpen,
  setIsOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file: null,
    },
  });

  const { AddJointe, AddJointeResponse } = useAddessAddJointeStore(
    (state) => state
  );

  const { OneCard, loadingOneCard, fetchOneCard } = useStoreOneCard();

  useEffect(() => {
    if (idcartes) fetchOneCard(idcartes);
  }, [fetchOneCard, idcartes]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    // Create FormData object
    const formData = new FormData();

    // Append form data

    formData.append("card", idcartes);

    if (data.file) {
      formData.append("file", data.file);
    }

    try {
      // Send the FormData with an HTTP client (axios or fetch)
      await AddJointe(formData); // Assuming `addUser` can handle FormData
      toast.success("pièce jointe ajouté avec succes");
      setTimeout(() => setIsOpen(false), 1000);

      setLoading(false);
      if (idcartes) fetchOneCard(idcartes);

      //  navigate(0);
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("erreur d'ajout veuillez reessayer");

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="gap-10 p-6">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="w-full dark:text-gray-950">
                  <FormLabel>Pièce jointes</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full flex justify-center pt-4">
            <Button
              disabled={loading}
              type="submit"
              variant="default"
              className="w-full p-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 mt-3"
            >
              {loading ? "Chargement..." : "Ajouter"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  ) : null;
};

export default AddPiece;
