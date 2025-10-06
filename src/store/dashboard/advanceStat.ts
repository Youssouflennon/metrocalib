// src/store/useStoreAdvanceStat.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  AdvanceStat: any; // L'état pour stocker les données de véhicules
  loadingAdvanceStat: boolean; // Nouveau state pour suivre l'état du chargement
  fetchAdvanceStat: (filters?: { card_id?: string }) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreAdvanceStat = create<VehicleState>((set) => ({
  AdvanceStat: null,
  loadingAdvanceStat: false,
  fetchAdvanceStat: async (filters?: { card_id?: string }) => {
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
    set({ loadingAdvanceStat: true }); // Démarre le chargement

    const params = new URLSearchParams();

    if (filters) {
      if (filters.card_id) params.append("card_id", filters.card_id);
    }

    try {
      const response = await axios.get(
        `${config.mintClient}dashboard/advancement_stats/?${params.toString()}`, // cardId est bien une string

        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({
        AdvanceStat: response.data,
        loadingAdvanceStat: false,
      }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching AdvanceStat:", error);
      set({ loadingAdvanceStat: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreAdvanceStat;
