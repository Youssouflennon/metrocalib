import { create } from "zustand";
import axios from "axios";
import config from "../config/config.dev";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface GenericState<T> {
  data: T[];
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
}

interface GenericActions<T> {
  fetchData: (
    endpoint: string,
    page?: number,
    pageSize?: number,
    params?: Record<string, any>
  ) => Promise<PaginatedResponse<T>>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  createItem: (endpoint: string, data: Partial<T>) => Promise<T>;
  updateItem: (endpoint: string, id: string, data: Partial<T>) => Promise<T>;
  deleteItem: (endpoint: string, id: string) => Promise<void>;
  setData: (data: T[]) => void;
}

const getAuthToken = () => {
  const savedState = JSON.parse(
    localStorage.getItem("Task-Manager-auth-data") || "{}"
  );
  return savedState.accessToken;
};

export const createGenericStore = <T extends { id: string }>(
  initialState?: Partial<GenericState<T>>
) => {
  return create<GenericState<T> & GenericActions<T>>((set, get) => ({
    data: [],
    count: 0,
    loading: false,
    error: null,
    currentPage: 1,
    pageSize: 10,
    ...initialState,

    fetchData: async (
      endpoint: string,
      page = 1,
      pageSize = 10,
      params = {}
    ) => {
      try {
        set({ loading: true, error: null });
        const token = getAuthToken();
        if (!token) {
          throw new Error("User is not authenticated");
        }

        console.log("Fetching data from endpoint:", endpoint, {
          page,
          pageSize,
          params,
        });

        const response = await axios.get<PaginatedResponse<T>>(
          `${config.mintClient}${endpoint}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page,
              page_size: pageSize,
              ...params,
            },
          }
        );

        console.log("Response received:", response.data);

        set({
          data: response.data.results,
          count: response.data.count,
          currentPage: page,
          pageSize,
          loading: false,
          error: null,
        });

        return response.data;
      } catch (error) {
        console.error("Error in fetchData:", error);
        set({
          error:
            error instanceof Error ? error.message : "Une erreur est survenue",
          loading: false,
          data: [],
          count: 0,
        });
        throw error;
      }
    },

    createItem: async (endpoint: string, data: Partial<T>) => {
      try {
        set({ loading: true, error: null });
        const token = getAuthToken();
        if (!token) {
          throw new Error("User is not authenticated");
        }

        const response = await axios.post<T>(
          `${config.mintClient}${endpoint}/`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { currentPage, pageSize } = get();
        await get().fetchData(endpoint, currentPage, pageSize);
        return response.data;
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Une erreur est survenue",
          loading: false,
        });
        throw error;
      }
    },

    updateItem: async (endpoint: string, id: string, data: Partial<T>) => {
      try {
        set({ loading: true, error: null });
        const token = getAuthToken();
        if (!token) {
          throw new Error("User is not authenticated");
        }

        const response = await axios.put<T>(
          `${config.mintClient}${endpoint}/${id}/`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { currentPage, pageSize } = get();
        await get().fetchData(endpoint, currentPage, pageSize);
        return response.data;
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Une erreur est survenue",
          loading: false,
        });
        throw error;
      }
    },

    deleteItem: async (endpoint: string, id: string) => {
      try {
        set({ loading: true, error: null });
        const token = getAuthToken();
        if (!token) {
          throw new Error("User is not authenticated");
        }

        await axios.delete(`${config.mintClient}${endpoint}/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { currentPage, pageSize } = get();
        await get().fetchData(endpoint, currentPage, pageSize);
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Une erreur est survenue",
          loading: false,
        });
        throw error;
      }
    },

    setPage: (page: number) => set({ currentPage: page }),
    setPageSize: (pageSize: number) => set({ pageSize }),
    setData: (newData: T[]) => {
      const { count, currentPage, pageSize } = get();
      set({
        data: newData,
        count,
        loading: false,
        error: null,
      });
    },
  }));
};
