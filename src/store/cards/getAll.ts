// src/store/useStoreAllCards.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  count: number;
  AllCards: any[]; // L'état pour stocker les données de véhicules
  loadingAllCards: boolean; // Nouveau state pour suivre l'état du chargement
  fetchAllCards: (filters?: {
    priority?: any;
    section__dashboard_id?: string;
    search?: string;
    members__member_id?: string;
    tags__id?: string;
    page_size?: number;
    page?: number;
  }) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreAllCards = create<VehicleState>((set) => ({
  AllCards: [],
  count: 0,
  loadingAllCards: false,
  fetchAllCards: async (filters?: {
    priority?: any;
    section__dashboard_id?: string;
    search?: string;
    members__member_id?: string;
    tags__id?: string;
    page_size?: number;
    page?: number;
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
    set({ loadingAllCards: true }); // Démarre le chargement

    const params = new URLSearchParams();

    if (filters) {
      if (filters.page_size)
        params.append("page_size", filters.page_size.toString());
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.priority)
        params.append("priority", filters.priority.toString());
      if (filters.section__dashboard_id)
        params.append(
          "section__dashboard_id",
          filters.section__dashboard_id.toString()
        );
      if (filters.search) params.append("search", filters.search.toString());
      if (filters.members__member_id)
        params.append(
          "members__member_id",
          filters.members__member_id.toString()
        );
      if (filters.tags__id)
        params.append("tags__id", filters.tags__id.toString());
    }
    try {
      const response = await axios.get(
        `${config.mintClient}cards/?${params.toString()}`, // cardId est bien une string

        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({
        AllCards: response.data.results,
        loadingAllCards: false,
      }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching AllCards:", error);
      set({ loadingAllCards: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreAllCards;
