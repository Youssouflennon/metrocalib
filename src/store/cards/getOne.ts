// src/store/useStoreOneCard.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  OneCard: any; // L'état pour stocker les données de véhicules
  loadingOneCard: boolean; // Nouveau state pour suivre l'état du chargement
  fetchOneCard: (user_id: string) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreOneCard = create<VehicleState>((set) => ({
  OneCard: null,
  loadingOneCard: false,
  fetchOneCard: async (user_id: string) => {
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
    set({ loadingOneCard: true }); // Démarre le chargement
    try {
      const response = await axios.get(
        `${config.mintClient}cards/${user_id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({ OneCard: response.data, loadingOneCard: false }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching OneCard:", error);
      set({ loadingOneCard: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreOneCard;
