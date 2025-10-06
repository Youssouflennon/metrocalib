// src/store/useStoredeleteUsers.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  deleteUsers: any; // L'état pour stocker les données de véhicules
  loadingdeleteUsers: boolean; // Nouveau state pour suivre l'état du chargement
  fetchdeleteUsers: (user_id: string) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoredeleteUsers = create<VehicleState>((set) => ({
  deleteUsers: null,
  loadingdeleteUsers: false,
  fetchdeleteUsers: async (user_id: string) => {
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
    set({ loadingdeleteUsers: true }); // Démarre le chargement
    try {
        
  const response = await axios.request({
        method: "delete",
        url: `${config.mintClient}users/${user_id}/`,
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ deleteUsers: response.data, loadingdeleteUsers: false }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching deleteUsers:", error);
      set({ loadingdeleteUsers: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoredeleteUsers;
