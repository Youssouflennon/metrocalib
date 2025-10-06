import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  updateSection: (UserId: any, input: any) => Promise<void>;
}

const useStoreUpdatedSection = create<VehicleState>(() => ({
  updateSection: async (UserId, input) => {
    const savedState = JSON.parse(
      localStorage.getItem("Task-Manager-auth-data") || "{}"
    );

    const token = savedState.accessToken;

    if (!token) {
      console.error("No token available. User might not be authenticated.");
      throw new Error("User is not authenticated");
    }

    try {
      await axios.patch(
        `${config.mintClient}sections/${UserId}/`, // URL correcte
        {
          name: input.name || "",
          description: input.description || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`Carte ${UserId} mise à jour avec succès`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la carte :", error);
    }
  },
}));

export default useStoreUpdatedSection;
