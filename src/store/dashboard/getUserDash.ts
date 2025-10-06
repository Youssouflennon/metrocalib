// src/store/useStoreGetUserDash.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface StatistiqueState {
  count: number;
  userState: any;

  GetUserDash: any[]; // L'état pour stocker les données de véhicules
  loadingGetUserDash: boolean; // Nouveau state pour suivre l'état du chargement
  fetchGetUserDash: (filters?: {
    member_id?: any;
    page_size?: number;
    page?: number;
  }) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreGetUserDash = create<StatistiqueState>((set) => ({
  GetUserDash: [],
  loadingGetUserDash: false,
  count: 0,
  userState: null,

  fetchGetUserDash: async (filters?: {
    member_id?: any;
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
    set({ loadingGetUserDash: true }); // Démarre le chargement

    const params = new URLSearchParams();

    if (filters) {
      if (filters.page_size)
        params.append("page_size", filters.page_size.toString());
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.member_id)
        params.append("member_id", filters.member_id.toString());
    }

    try {
      const response = await axios.get(
        `${
          config.mintClient
        }dashboard/get_user_dashboards/?${params.toString()}`, // cardId est bien une string
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({
        GetUserDash: response.data.results,
        loadingGetUserDash: false,
        count: response.data.count,
        userState: response.data.user,
      }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching GetUserDash:", error);
      set({ loadingGetUserDash: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreGetUserDash;
