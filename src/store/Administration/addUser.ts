import config from "src/config/config.dev";
import { create } from "zustand";
// import { user } from "../parrtial";

interface addUserState {
  addUser: (input: any) => Promise<void>;
  addUserResponse: any | null;
  loading: boolean;
}

const useAddessaddUserStore = create<addUserState>((set) => ({
  addUserResponse: null,
  loading: false,

  addUser: async (input: any) => {
    const savedState = JSON.parse(
      localStorage.getItem("Task-Manager-auth-data") || "{}"
    );

    console.log(savedState.accessToken);

    const token = savedState.accessToken;

    set({ loading: true });

    try {
      const response = await fetch(`${config.mintClient + "users/"}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in headers
         // "Content-Type": "multipart/form-data",
        },
        body: input,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to add addUser address: ${response.statusText}`
        );
      }

      const data = await response.json();
      set({ addUserResponse: data, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding addUser address:", error.message);
      } else {
        console.error("Unknown error occurred");
      }
      set({ loading: false });
    }
  },
}));

export default useAddessaddUserStore;
