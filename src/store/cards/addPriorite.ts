// src/store/useStoreaddPriorite.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface addPrioriteState {
  addPriorite: (cardId: string, priority: number) => Promise<void>; // priority est un string ISO
  addPrioriteResponse: any | null;
  loading: boolean;
}

const useStoreaddPriorite = create<addPrioriteState>((set) => ({
  addPrioriteResponse: null,
  loading: false,

  addPriorite: async (cardId, priority) => {
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
      console.log(`Envoi: cardId=${cardId}, priority=${priority}`);

      await axios.patch(
        `${config.mintClient}cards/${cardId}/`, // cardId est bien une string
        { priority }, // priority est une string ISO déjà formatée
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`Carte ${cardId} mise à jour avec la date ${priority}`);
      set({ loading: false });
    } catch (error) {
      console.error("Erreur lors de l'ajout du délai:", error);
      set({ loading: false });
    }
  },
}));

export default useStoreaddPriorite;
