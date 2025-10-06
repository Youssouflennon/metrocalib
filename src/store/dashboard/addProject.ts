import config from "src/config/config.dev";
import { create } from "zustand";
// import { user } from "../parrtial";

interface addProjectState {
  addProject: (input: any) => Promise<void>;
  addProjectResponse: any | null;
  loading: boolean;
}

const useAddessaddProjectStore = create<addProjectState>((set) => ({
  addProjectResponse: null,
  loading: false,

  addProject: async (input: any) => {
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
      const response = await fetch(`${config.mintClient + "dashboard/"}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to add addProject address: ${response.statusText}`
        );
      }

      const data = await response.json();
      set({ addProjectResponse: data, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding addProject address:", error.message);
      } else {
        console.error("Unknown error occurred");
      }
      set({ loading: false });
    }
  },
}));

export default useAddessaddProjectStore;
