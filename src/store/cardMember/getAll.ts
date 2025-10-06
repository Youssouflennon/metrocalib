// src/store/useStoreAllCardMember.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  AllCardMember: any[]; // L'état pour stocker les données de véhicules
  loadingAllCardMember: boolean; // Nouveau state pour suivre l'état du chargement
  fetchAllCardMember: (filters?: { member_id?: string }) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreAllCardMember = create<VehicleState>((set) => ({
  AllCardMember: [],
  loadingAllCardMember: false,
  fetchAllCardMember: async (filters?: { member_id?: string }) => {
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
    set({ loadingAllCardMember: true }); // Démarre le chargement

    const params = new URLSearchParams();

    if (filters) {
      if (filters.member_id) params.append("member_id", filters.member_id);
    }

    try {
      const response = await axios.get(
        `${config.mintClient}cards/get_card_of_member/?${params.toString()}`, // cardId est bien une string

        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({
        AllCardMember: response.data.results,
        loadingAllCardMember: false,
      }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching AllCardMember:", error);
      set({ loadingAllCardMember: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreAllCardMember;
