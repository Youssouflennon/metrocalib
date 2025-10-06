import config from "src/config/config.dev";
import { create } from "zustand";
// import { user } from "../parrtial";

interface removeCardMembeState {
  removeCardMembe: (input: any) => Promise<void>;
  removeCardMembeResponse: any | null;
  loading: boolean;
}

const useAddessremoveCardMembeStore = create<removeCardMembeState>((set) => ({
  removeCardMembeResponse: null,
  loading: false,

  removeCardMembe: async (input: any) => {
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

    set({ loading: true });

    try {
      const response = await fetch(
        `${config.mintClient + "card-members/remove_users_on_card/"}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to add removeCardMembe address: ${response.statusText}`
        );
      }

      const data = await response.json();
      set({ removeCardMembeResponse: data, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding removeCardMembe address:", error.message);
      } else {
        console.error("Unknown error occurred");
      }
      set({ loading: false });
    }
  },
}));

export default useAddessremoveCardMembeStore;
