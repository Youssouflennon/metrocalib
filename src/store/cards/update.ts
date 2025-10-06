import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  updateCart: (UserId: any, input: any) => Promise<void>;
}

const useStoreUpdatedCart = create<VehicleState>(() => ({
  updateCart: async (UserId, input) => {
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
        `${config.mintClient}cards/${UserId}/`, // URL correcte
        {
          title: input.title || "",
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

export default useStoreUpdatedCart;
