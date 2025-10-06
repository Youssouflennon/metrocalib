// src/store/useStoreaddDelais.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface addDelaisState {
  addDelais: (cardId: string, due_date: string) => Promise<void>; // due_date est un string ISO
  addDelaisResponse: any | null;
  loading: boolean;
}

const useStoreaddDelais = create<addDelaisState>((set) => ({
  addDelaisResponse: null,
  loading: false,

  addDelais: async (cardId, due_date) => {
    set({ loading: true });

    const savedState = JSON.parse(
      localStorage.getItem("Task-Manager-auth-data") || "{}"
    );

    console.log(savedState.accessToken);

    const token = savedState.accessToken;

    if (!token) {
      throw new Error("User is not authenticated");
    }

    if (!token) {
      console.error("No token available. User might not be authenticated.");
      return;
    }

    try {
      console.log(`Envoi: cardId=${cardId}, due_date=${due_date}`);

      await axios.patch(
        `${config.mintClient}cards/${cardId}/`, // cardId est bien une string
        { due_date }, // due_date est une string ISO déjà formatée
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`Carte ${cardId} mise à jour avec la date ${due_date}`);
      set({ loading: false });
    } catch (error) {
      console.error("Erreur lors de l'ajout du délai:", error);
      set({ loading: false });
    }
  },
}));

export default useStoreaddDelais;
