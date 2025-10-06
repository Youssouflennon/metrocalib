// src/store/useStoreAllWorkSpace.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  AllWorkSpace: any[]; // L'état pour stocker les données de véhicules
  loadingAllWorkSpace: boolean; // Nouveau state pour suivre l'état du chargement
  fetchAllWorkSpace: () => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreAllWorkSpace = create<VehicleState>((set) => ({
  AllWorkSpace: [],
  loadingAllWorkSpace: false,
  fetchAllWorkSpace: async () => {
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
    set({ loadingAllWorkSpace: true }); // Démarre le chargement
    try {
      const response = await axios.get(`${config.mintClient + "workspaces/"}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in headers
        },
      });
      set({
        AllWorkSpace: response.data.results,
        loadingAllWorkSpace: false,
      }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching AllWorkSpace:", error);
      set({ loadingAllWorkSpace: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreAllWorkSpace;
