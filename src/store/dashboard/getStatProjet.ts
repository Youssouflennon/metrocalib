// src/store/useStoreGetStat.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";
import { useAuthStore } from "../authStore";

interface StatistiqueState {
  GetStat: any; // L'état pour stocker les données de véhicules
  loadingGetStat: boolean; // Nouveau state pour suivre l'état du chargement
  fetchGetStat: () => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreGetStat = create<StatistiqueState>((set) => ({
  GetStat: null,
  loadingGetStat: false,
  fetchGetStat: async () => {
    // const token = useAuthStore((state) => state.refreshToken);

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
    set({ loadingGetStat: true }); // Démarre le chargement
    try {
      const response = await axios.get(
        `${config.mintClient + "dashboard/get_project_stats/"}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({
        GetStat: response.data,
        loadingGetStat: false,
      }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching GetStat:", error);
      set({ loadingGetStat: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreGetStat;
