// src/store/useStorelistCurrentProject.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  count: number;

  listCurrentProject: any[]; // L'état pour stocker les données de véhicules
  loadinglistCurrentProject: boolean; // Nouveau state pour suivre l'état du chargement
  fetchlistCurrentProject: (filters?: {
    page_size?: number;
    page?: number;
    workspace_id?: any;

    search?: string;
  }) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStorelistCurrentProject = create<VehicleState>((set) => ({
  listCurrentProject: [],
  loadinglistCurrentProject: false,
  count: 0,

  fetchlistCurrentProject: async (filters?: {
    page_size?: number;
    page?: number;
    search?: string;
    workspace_id?: string;
  }) => {
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
    set({ loadinglistCurrentProject: true }); // Démarre le chargement
    const params = new URLSearchParams();

    if (filters) {
      if (filters.page_size)
        params.append("page_size", filters.page_size.toString());
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.search) params.append("search", filters.search.toString());
      if (filters.workspace_id)
        params.append("workspace_id", filters.workspace_id.toString());
    }
    try {
      const response = await axios.get(
        `${config.mintClient}dashboard/?${params.toString()}`, // cardId est bien une string

        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
            //  "Content-Type": "application/json",
            //  "ngrok-skip-browser-warning": true,
          },
        }
      );
      set({
        listCurrentProject: response.data.results,
        loadinglistCurrentProject: false,
        count: response.data.count,
      }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching listCurrentProject:", error);
      set({ loadinglistCurrentProject: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStorelistCurrentProject;
