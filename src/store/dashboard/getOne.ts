// src/store/useStoreOneDashboard.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

type SectionOrder = {
  section_id: string;
  order_number: number;
};
interface VehicleState {
  OneDashboard: any; // L'état pour stocker les données de véhicules
  loadingOneDashboard: boolean; // Nouveau state pour suivre l'état du chargement
  fetchOneDashboard: (user_id: string) => Promise<void>; // Fonction pour récupérer les véhicules
  updateCardSection: (cardId: string, sectionId: string) => Promise<void>; // Fonction pour mettre à jour la section d'une carte
  updateCard: (cardId: string, is_done: boolean) => Promise<void>; // Fonction pour mettre à jour la section d'une carte
  updateSection: (SectionOrder: SectionOrder[]) => Promise<void>; // Fonction pour mettre à jour la section d'une carte
}

const useStoreOneDashboard = create<VehicleState>((set) => ({
  OneDashboard: null,
  loadingOneDashboard: false,
  fetchOneDashboard: async (user_id: string) => {
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
    set({ loadingOneDashboard: true }); // Démarre le chargement
    try {
      const response = await axios.get(
        `${config.mintClient}dashboard/${user_id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({ OneDashboard: response.data, loadingOneDashboard: false }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching OneDashboard:", error);
      set({ loadingOneDashboard: false }); // Arrête le chargement en cas d'erreur
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

  updateSection: async (sectionsList: SectionOrder[]) => {
    const savedState = JSON.parse(
      localStorage.getItem("Task-Manager-auth-data") || "{}"
    );

    const token = savedState.accessToken;

    if (!token) {
      console.error("No token available. User might not be authenticated.");
      return;
    }

    try {
      await axios.post(
        `${config.mintClient}dashboard/reorder/`,
        { section_list: sectionsList },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Ordre des sections mis à jour avec succès");
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'ordre des sections :",
        error
      );
    }
  },

  updateCard: async (cardId, is_done) => {
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
        `${config.mintClient}cards/${cardId}/`,
        { is_done: is_done },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`Carte ${cardId} déplacée vers la section ${is_done}`);
    } catch (error) {
      console.error("Erreur lors du déplacement de la carte :", error);
    }
  },
}));

export default useStoreOneDashboard;
