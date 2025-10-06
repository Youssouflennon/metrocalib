import config from "src/config/config.dev";
import { create } from "zustand";
// import { user } from "../parrtial";

interface changePassUserState {
  changePassUser: (userId: string, password: any) => Promise<void>;
  changePassUserResponse: any | null;
  loading: boolean;
}

const useAddesschangePassUserStore = create<changePassUserState>((set) => ({
  changePassUserResponse: null,
  loading: false,

  changePassUser: async (userId: any, password: any) => {
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
      const response = await fetch(
        `${config.mintClient}users/${userId}/set-password/`,

        {
          method: "Put",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }), // 👈 structure correcte
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to add changePassUser address: ${response.statusText}`
        );
      }

      const data = await response.json();
      set({ changePassUserResponse: data, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding changePassUser address:", error.message);
      } else {
        console.error("Unknown error occurred");
      }
      set({ loading: false });
    }
  },
}));

export default useAddesschangePassUserStore;
