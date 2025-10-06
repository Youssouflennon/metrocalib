// src/store/useStoredeleteCard.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  deleteCard: any; // L'état pour stocker les données de véhicules
  loadingdeleteCard: boolean; // Nouveau state pour suivre l'état du chargement
  fetchdeleteCard: (user_id: string) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoredeleteCard = create<VehicleState>((set) => ({
  deleteCard: null,
  loadingdeleteCard: false,
  fetchdeleteCard: async (user_id: string) => {
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
    set({ loadingdeleteCard: true }); // Démarre le chargement
    try {
        
  const response = await axios.request({
        method: "delete",
        url: `${config.mintClient}cards/${user_id}/`,
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ deleteCard: response.data, loadingdeleteCard: false }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching deleteCard:", error);
      set({ loadingdeleteCard: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoredeleteCard;
