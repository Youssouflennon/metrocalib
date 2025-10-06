import config from "src/config/config.dev";
import { create } from "zustand";
// import { user } from "../parrtial";

interface addSectionState {
  addSection: (input: any) => Promise<void>;
  addSectionResponse: any | null;
  loading: boolean;
}

const useAddessaddSectionStore = create<addSectionState>((set) => ({
  addSectionResponse: null,
  loading: false,

  addSection: async (input: any) => {
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
      const response = await fetch(`${config.mintClient + "sections/"}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to add addSection address: ${response.statusText}`
        );
      }

      const data = await response.json();
      set({ addSectionResponse: data, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding addSection address:", error.message);
      } else {
        console.error("Unknown error occurred");
      }
      set({ loading: false });
    }
  },
}));

export default useAddessaddSectionStore;
