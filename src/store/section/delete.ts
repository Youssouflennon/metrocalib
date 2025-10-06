// src/store/useStoredeleteSection.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  deleteSection: any; // L'état pour stocker les données de véhicules
  loadingdeleteSection: boolean; // Nouveau state pour suivre l'état du chargement
  fetchdeleteSection: (user_id: string) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoredeleteSection = create<VehicleState>((set) => ({
  deleteSection: null,
  loadingdeleteSection: false,
  fetchdeleteSection: async (user_id: string) => {
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
    set({ loadingdeleteSection: true }); // Démarre le chargement
    try {
      const response = await axios.request({
        method: "delete",
        url: `${config.mintClient}sections/${user_id}/`,
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ deleteSection: response.data, loadingdeleteSection: false }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching deleteSection:", error);
      set({ loadingdeleteSection: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoredeleteSection;
