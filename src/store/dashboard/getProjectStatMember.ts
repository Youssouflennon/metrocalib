// src/store/useStoreGetStateMember.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";
import { useAuthStore } from "../authStore";

interface StatistiqueState {
  GetStateMember: any; // L'état pour stocker les données de véhicules
  loadingGetStateMember: boolean; // Nouveau state pour suivre l'état du chargement
  fetchGetStateMember: (
    user_id: string,
    filters?: {
      member_id?: any;
    }
  ) => Promise<void>; // Fonction pour récupérer les véhicules
  userState: any;
}

const useStoreGetStateMember = create<StatistiqueState>((set) => ({
  GetStateMember: null,
  userState: null,
  loadingGetStateMember: false,
  fetchGetStateMember: async (
    user_id: string,
    filters?: {
      member_id?: any;
    }
  ) => {
    // const token = useAuthStore((state) => state.refreshToken);

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
    set({ loadingGetStateMember: true }); // Démarre le chargement

    const params = new URLSearchParams();

    if (filters) {
      if (filters.member_id)
        params.append("member_id", filters.member_id.toString());
    }

    try {
      const response = await axios.get(
        `${
          config.mintClient
        }dashboard/${user_id}/get_project_state/?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({
        GetStateMember: response.data,
        loadingGetStateMember: false,
      }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching GetStateMember:", error);
      set({ loadingGetStateMember: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreGetStateMember;
