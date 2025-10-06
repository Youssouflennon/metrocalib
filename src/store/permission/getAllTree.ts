// src/store/useStoreAllPermissionTree.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  AllPermissionTree: any; // L'état pour stocker les données de véhicules
  loadingAllPermissionTree: boolean; // Nouveau state pour suivre l'état du chargement
  fetchAllPermissionTree: () => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreAllPermissionTree = create<VehicleState>((set) => ({
  AllPermissionTree: null,
  loadingAllPermissionTree: false,
  fetchAllPermissionTree: async () => {
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
    set({ loadingAllPermissionTree: true }); // Démarre le chargement

    try {
      const response = await axios.get(
        `${config.mintClient}permissions/get_permissions_tree/`, // cardId est bien une string

        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({
        AllPermissionTree: response.data,
        loadingAllPermissionTree: false,
      }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching AllPermissionTree:", error);
      set({ loadingAllPermissionTree: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreAllPermissionTree;
