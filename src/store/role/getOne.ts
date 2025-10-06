// src/store/useStoreOneRole.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  OneRole: any; // L'état pour stocker les données de véhicules
  loadingOneRole: boolean; // Nouveau state pour suivre l'état du chargement
  fetchOneRole: (user_id: string) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreOneRole = create<VehicleState>((set) => ({
  OneRole: null,
  loadingOneRole: false,
  fetchOneRole: async (user_id: string) => {
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
    set({ loadingOneRole: true }); // Démarre le chargement
    try {
      const response = await axios.get(
        `${config.mintClient}groups/${user_id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({ OneRole: response.data, loadingOneRole: false }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching OneRole:", error);
      set({ loadingOneRole: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreOneRole;
