import config from "src/config/config.dev";
import { create } from "zustand";
// import { user } from "../parrtial";

interface addWorkSpaceState {
  addTag: (input: any) => Promise<void>;
  addTagResponse: any | null;
  loading: boolean;
}

const useaddTagStore = create<addWorkSpaceState>((set) => ({
  addTagResponse: null,
  loading: false,

  addTag: async (input: any) => {
    //  const token = localStorage.getItem("token");
    /*    if (!token) {
      console.error("User is not authenticated");
      return;
    } */

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
      const response = await fetch(`${config.mintClient + "card-tags/"}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Failed to add addTag address: ${response.statusText}`);
      }

      const data = await response.json();
      set({ addTagResponse: data, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding addTag address:", error.message);
      } else {
        console.error("Unknown error occurred");
      }
      set({ loading: false });
    }
  },
}));

export default useaddTagStore;
