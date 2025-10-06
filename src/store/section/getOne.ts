// src/store/useStoreOneSection.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  OneSection: any; // L'état pour stocker les données de véhicules
  loadingOneSection: boolean; // Nouveau state pour suivre l'état du chargement
  fetchOneSection: (user_id: string) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreOneSection = create<VehicleState>((set) => ({
  OneSection: null,
  loadingOneSection: false,
  fetchOneSection: async (user_id: string) => {
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
    set({ loadingOneSection: true }); // Démarre le chargement
    try {
      const response = await axios.get(
        `${config.mintClient}sections/${user_id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({ OneSection: response.data, loadingOneSection: false }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching OneSection:", error);
      set({ loadingOneSection: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreOneSection;
