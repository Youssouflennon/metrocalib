// src/store/useStoredeleteRoles.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  deleteRoles: any; // L'état pour stocker les données de véhicules
  loadingdeleteRoles: boolean; // Nouveau state pour suivre l'état du chargement
  fetchdeleteRoles: (user_id: string) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoredeleteRoles = create<VehicleState>((set) => ({
  deleteRoles: null,
  loadingdeleteRoles: false,
  fetchdeleteRoles: async (user_id: string) => {
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
    set({ loadingdeleteRoles: true }); // Démarre le chargement
    try {
        
  const response = await axios.request({
        method: "delete",
        url: `${config.mintClient}groups/${user_id}/`,
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ deleteRoles: response.data, loadingdeleteRoles: false }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching deleteRoles:", error);
      set({ loadingdeleteRoles: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoredeleteRoles;
