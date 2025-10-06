// src/store/useStoreAllPermission.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  AllPermission: any[]; // L'état pour stocker les données de véhicules
  loadingAllPermission: boolean; // Nouveau state pour suivre l'état du chargement
  fetchAllPermission: (filters?: {
    page_size?: number;
    page?: number;
    search?: string;
  }) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreAllPermission = create<VehicleState>((set) => ({
  AllPermission: [],
  loadingAllPermission: false,
  fetchAllPermission: async (filters?: {
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
    set({ loadingAllPermission: true }); // Démarre le chargement

    const params = new URLSearchParams();

    if (filters) {
      if (filters.page_size)
        params.append("page_size", filters.page_size.toString());
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.search) params.append("search", filters.search.toString());
    }
    try {
      const response = await axios.get(
        `${config.mintClient}permissions/?${params.toString()}`, // cardId est bien une string

        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({
        AllPermission: response.data.results,
        loadingAllPermission: false,
      }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching AllPermission:", error);
      set({ loadingAllPermission: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreAllPermission;
