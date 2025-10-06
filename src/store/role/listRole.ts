// src/store/useStoreallRole.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  allRole: any[]; // L'état pour stocker les données de véhicules
  loadingallRole: boolean; // Nouveau state pour suivre l'état du chargement
  count: number;

  fetchallRole: (filters?: {
    page_size?: number;
    page?: number;
    search?: string;
  }) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreallRole = create<VehicleState>((set) => ({
  allRole: [],
  loadingallRole: false,
  count: 0,

  fetchallRole: async (filters?: {
    page_size?: number;
    page?: number;
    search?: string;
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
    set({ loadingallRole: true }); // Démarre le chargement

    const params = new URLSearchParams();

    if (filters) {
      if (filters.page_size)
        params.append("page_size", filters.page_size.toString());
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.search) params.append("search", filters.search.toString());
    }
    try {
      const response = await axios.get(
        `${config.mintClient}groups/?${params.toString()}`, // cardId est bien une string

        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({
        allRole: response.data.results,
        loadingallRole: false,
        count: response.data.count,
      }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching allRole:", error);
      set({ loadingallRole: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreallRole;
