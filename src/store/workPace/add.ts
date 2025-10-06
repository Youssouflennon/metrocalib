import config from "src/config/config.dev";
import { create } from "zustand";
// import { user } from "../parrtial";

interface addWorkSpaceState {
  addWorkSpace: (input: any) => Promise<void>;
  addWorkSpaceResponse: any | null;
  loading: boolean;
}

const useAddessaddWorkSpaceStore = create<addWorkSpaceState>((set) => ({
  addWorkSpaceResponse: null,
  loading: false,

  addWorkSpace: async (input: any) => {
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
      const response = await fetch(`${config.mintClient + "workspaces/"}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to add addWorkSpace address: ${response.statusText}`
        );
      }

      const data = await response.json();
      set({ addWorkSpaceResponse: data, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding addWorkSpace address:", error.message);
      } else {
        console.error("Unknown error occurred");
      }
      set({ loading: false });
    }
  },
}));

export default useAddessaddWorkSpaceStore;
