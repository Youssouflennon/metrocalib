import config from "src/config/config.dev";
import { create } from "zustand";
// import { user } from "../parrtial";

interface AddRoleState {
  AddRole: (input: any) => Promise<void>;
  AddRoleResponse: any | null;
  loading: boolean;
}

const useAddessAddRoleStore = create<AddRoleState>((set) => ({
  AddRoleResponse: null,
  loading: false,

  AddRole: async (input: any) => {
    const savedState = JSON.parse(
      localStorage.getItem("Task-Manager-auth-data") || "{}"
    );

    console.log(savedState.accessToken);

    const token = savedState.accessToken;

    set({ loading: true });

    try {
      const response = await fetch(`${config.mintClient + "groups/"}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in headers
        },
        body: input,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to add AddRole address: ${response.statusText}`
        );
      }

      const data = await response.json();
      set({ AddRoleResponse: data, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding AddRole address:", error.message);
      } else {
        console.error("Unknown error occurred");
      }
      set({ loading: false });
    }
  },
}));

export default useAddessAddRoleStore;
