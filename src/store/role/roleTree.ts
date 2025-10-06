// src/store/useStoreOneRoleTree.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  OneRoleTree: any; // L'état pour stocker les données de véhicules
  loadingOneRoleTree: boolean; // Nouveau state pour suivre l'état du chargement
  fetchOneRoleTree: (user_id: string) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreOneRoleTree = create<VehicleState>((set) => ({
  OneRoleTree: null,
  loadingOneRoleTree: false,
  fetchOneRoleTree: async (user_id: string) => {
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
    set({ loadingOneRoleTree: true }); // Démarre le chargement
    try {
      const response = await axios.get(
        `${config.mintClient}groups/${user_id}/role_permissions_tree/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({ OneRoleTree: response.data, loadingOneRoleTree: false }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching OneRoleTree:", error);
      set({ loadingOneRoleTree: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreOneRoleTree;
