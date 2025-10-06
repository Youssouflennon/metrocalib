// src/store/useStoregetExcluMemb.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  getExcluMemb: any[]; // L'état pour stocker les données de véhicules
  loadinggetExcluMemb: boolean; // Nouveau state pour suivre l'état du chargement
  fetchgetExcluMemb: (user_id: string) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoregetExcluMemb = create<VehicleState>((set) => ({
  getExcluMemb: [],
  loadinggetExcluMemb: false,
  fetchgetExcluMemb: async (user_id: string) => {
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
    set({ loadinggetExcluMemb: true }); // Démarre le chargement
    try {
      const response = await axios.get(
        `${config.mintClient}cards/${user_id}/get_exclude_members/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({ getExcluMemb: response.data.results, loadinggetExcluMemb: false }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching getExcluMemb:", error);
      set({ loadinggetExcluMemb: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoregetExcluMemb;
