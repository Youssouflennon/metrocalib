// src/store/useStoreGetSection.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface StatistiqueState {
  GetSection: any; // L'état pour stocker les données de véhicules
  loadingGetSection: boolean; // Nouveau state pour suivre l'état du chargement
  fetchGetSection: () => Promise<void>; // Fonction pour récupérer les véhicules
  updateCardSection: (cardId: string, sectionId: string) => Promise<void>; // Fonction pour mettre à jour la section d'une carte
}

const useStoreGetSection = create<StatistiqueState>((set) => ({
  GetSection: null,
  loadingGetSection: false,
  fetchGetSection: async () => {
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
    set({ loadingGetSection: true }); // Démarre le chargement
    try {
      const response = await axios.get(`${config.mintClient + "sections/"}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in headers
        },
      });
      set({
        GetSection: response.data.results,
        loadingGetSection: false,
      }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching GetSection:", error);
      set({ loadingGetSection: false }); // Arrête le chargement en cas d'erreur
    }
  },

  updateCardSection: async (cardId, sectionId) => {
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
    try {
      await axios.patch(
        `${config.mintClient}cards/${cardId}/switch_card/`,
        { section_id: sectionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`Carte ${cardId} déplacée vers la section ${sectionId}`);
    } catch (error) {
      console.error("Erreur lors du déplacement de la carte :", error);
    }
  },
}));

export default useStoreGetSection;
