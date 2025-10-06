// src/store/useStoredeleteWorkSpace.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  deleteWorkSpace: any; // L'état pour stocker les données de véhicules
  loadingdeleteWorkSpace: boolean; // Nouveau state pour suivre l'état du chargement
  fetchdeleteWorkSpace: (user_id: string) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoredeleteWorkSpace = create<VehicleState>((set) => ({
  deleteWorkSpace: null,
  loadingdeleteWorkSpace: false,
  fetchdeleteWorkSpace: async (user_id: string) => {
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
    set({ loadingdeleteWorkSpace: true }); // Démarre le chargement
    try {
      const response = await axios.request({
        method: "patch",
        url: `${config.mintClient}workspaces/${user_id}/remove_workspace_cascade/`,
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ deleteWorkSpace: response.data, loadingdeleteWorkSpace: false }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching deleteWorkSpace:", error);
      set({ loadingdeleteWorkSpace: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoredeleteWorkSpace;
