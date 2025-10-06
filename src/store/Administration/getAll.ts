// src/store/useStoreAllUsers.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  AllUsers: any[]; // L'état pour stocker les données de véhicules
  count: number;
  loadingAllUsers: boolean; // Nouveau state pour suivre l'état du chargement
  fetchAllUsers: (filters?: {
    page_size?: number;
    page?: number;
    search?: string;
  }) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreAllUsers = create<VehicleState>((set) => ({
  AllUsers: [],
  loadingAllUsers: false,
  count: 0,
  fetchAllUsers: async (filters?: {
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
    set({ loadingAllUsers: true }); // Démarre le chargement

    const params = new URLSearchParams();

    if (filters) {
      if (filters.page_size)
        params.append("page_size", filters.page_size.toString());
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.search) params.append("search", filters.search.toString());
    }

    try {
      const response = await axios.get(
        `${config.mintClient}users/?${params.toString()}`, // cardId est bien une string

        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({
        AllUsers: response.data.results,
        loadingAllUsers: false,
        count: response.data.count,
      }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching AllUsers:", error);
      set({ loadingAllUsers: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreAllUsers;
