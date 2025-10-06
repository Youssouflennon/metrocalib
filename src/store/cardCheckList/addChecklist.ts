import config from "src/config/config.dev";
import { create } from "zustand";
// import { user } from "../parrtial";

interface addCheckListState {
  addCheckList: (input: any) => Promise<void>;
  addCheckListResponse: any | null;
  loading: boolean;
}

const useAddessaddCheckListStore = create<addCheckListState>((set) => ({
  addCheckListResponse: null,
  loading: false,

  addCheckList: async (input: any) => {
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
      const response = await fetch(`${config.mintClient + "card-checklist/"}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to add addCheckList address: ${response.statusText}`
        );
      }

      const data = await response.json();
      set({ addCheckListResponse: data, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding addCheckList address:", error.message);
      } else {
        console.error("Unknown error occurred");
      }
      set({ loading: false });
    }
  },
}));

export default useAddessaddCheckListStore;
