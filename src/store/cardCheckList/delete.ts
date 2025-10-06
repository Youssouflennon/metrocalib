// src/store/useStoredeleteCheck.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  deleteCheck: any; // L'état pour stocker les données de véhicules
  loadingdeleteCheck: boolean; // Nouveau state pour suivre l'état du chargement
  fetchdeleteCheck: (user_id: string) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoredeleteCheck = create<VehicleState>((set) => ({
  deleteCheck: null,
  loadingdeleteCheck: false,
  fetchdeleteCheck: async (user_id: string) => {
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
    set({ loadingdeleteCheck: true }); // Démarre le chargement
    try {
        
  const response = await axios.request({
        method: "delete",
        url: `${config.mintClient}card-checklist/${user_id}/`,
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ deleteCheck: response.data, loadingdeleteCheck: false }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching deleteCheck:", error);
      set({ loadingdeleteCheck: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoredeleteCheck;
