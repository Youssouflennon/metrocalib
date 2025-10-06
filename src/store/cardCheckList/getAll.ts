// src/store/useStoreAllCheckCard.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  AllCheckCard: any[]; // L'état pour stocker les données de véhicules
  loadingAllCheckCard: boolean; // Nouveau state pour suivre l'état du chargement
  fetchAllCheckCard: (filters?: { card_id?: string }) => Promise<void>; // Fonction pour récupérer les véhicules
  updateCardCheck: (cardId: string, is_done: boolean) => Promise<void>; // Fonction pour mettre à jour la section d'une carte
}

const useStoreAllCheckCard = create<VehicleState>((set) => ({
  AllCheckCard: [],
  loadingAllCheckCard: false,
  fetchAllCheckCard: async (filters?: { card_id?: string }) => {
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
    set({ loadingAllCheckCard: true }); // Démarre le chargement

    const params = new URLSearchParams();

    if (filters) {
      if (filters.card_id) params.append("card_id", filters.card_id);
    }

    try {
      const response = await axios.get(
        `${config.mintClient}card-checklist/?${params.toString()}`, // cardId est bien une string

        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({
        AllCheckCard: response.data.results,
        loadingAllCheckCard: false,
      }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching AllCheckCard:", error);
      set({ loadingAllCheckCard: false }); // Arrête le chargement en cas d'erreur
    }
  },

  updateCardCheck: async (cardId, is_done) => {
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
      await axios.patch(
        `${config.mintClient}card-checklist/${cardId}/`,
        { is_done: is_done },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`Carte ${cardId} déplacée vers la section ${is_done}`);
    } catch (error) {
      console.error("Erreur lors du déplacement de la carte :", error);
    }
  },


}));

export default useStoreAllCheckCard;
