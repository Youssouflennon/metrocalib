// src/store/useStoreOneEtiquette.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  OneEtiquette: any; // L'état pour stocker les données de véhicules
  loadingOneEtiquette: boolean; // Nouveau state pour suivre l'état du chargement
  fetchOneEtiquette: (user_id: string) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreOneEtiquette = create<VehicleState>((set) => ({
  OneEtiquette: null,
  loadingOneEtiquette: false,
  fetchOneEtiquette: async (user_id: string) => {
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
    set({ loadingOneEtiquette: true }); // Démarre le chargement
    try {
      const response = await axios.get(
        `${config.mintClient}card-tags/${user_id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({ OneEtiquette: response.data, loadingOneEtiquette: false }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching OneEtiquette:", error);
      set({ loadingOneEtiquette: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreOneEtiquette;
