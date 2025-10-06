// src/store/useStoreOneWork.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  OneWork: any; // L'état pour stocker les données de véhicules
  loadingOneWork: boolean; // Nouveau state pour suivre l'état du chargement
  fetchOneWork: (user_id: string) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreOneWork = create<VehicleState>((set) => ({
  OneWork: null,
  loadingOneWork: false,
  fetchOneWork: async (user_id: string) => {
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
    set({ loadingOneWork: true }); // Démarre le chargement
    try {
      const response = await axios.get(
        `${config.mintClient}workspaces/${user_id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({ OneWork: response.data, loadingOneWork: false }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching OneWork:", error);
      set({ loadingOneWork: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreOneWork;
