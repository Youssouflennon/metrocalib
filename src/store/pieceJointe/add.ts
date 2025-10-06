import config from "src/config/config.dev";
import { create } from "zustand";
// import { user } from "../parrtial";

interface AddJointeState {
  AddJointe: (input: any) => Promise<void>;
  AddJointeResponse: any | null;
  loading: boolean;
}

const useAddessAddJointeStore = create<AddJointeState>((set) => ({
  AddJointeResponse: null,
  loading: false,

  AddJointe: async (input: any) => {
    const savedState = JSON.parse(
      localStorage.getItem("Task-Manager-auth-data") || "{}"
    );

    console.log(savedState.accessToken);

    const token = savedState.accessToken;

    set({ loading: true });

    try {
      const response = await fetch(
        `${config.mintClient + "card-join-files/"}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
          body: input,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to add AddJointe address: ${response.statusText}`
        );
      }

      const data = await response.json();
      set({ AddJointeResponse: data, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding AddJointe address:", error.message);
      } else {
        console.error("Unknown error occurred");
      }
      set({ loading: false });
    }
  },
}));

export default useAddessAddJointeStore;
