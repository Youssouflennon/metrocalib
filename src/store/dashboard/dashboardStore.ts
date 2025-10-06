import { create } from "zustand";
import axios from "axios";
import config from "../../config/config.dev";
import { createGenericStore } from "../genericStore";

/**
 * Interface représentant un tableau de bord
 */
export interface Dashboard {
  id: string;
  name: string;
}

/**
 * Interface représentant un membre d'équipe
 */
export interface TeamMember {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string | null;
  profile_picture_file: string;
  performance: "INACTIVE" | "EXCELLENT" | "GOOD" | "MEDIUM" | "POOR";
  completed_cards: number;
  total_cards: number;
  dashboards: Dashboard[];
}

/**
 * État global du store des tableaux de bord
 */
interface DashboardState {
  dashboards: Dashboard[];
  selectedDashboard: string | null;
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

/**
 * Actions disponibles pour manipuler l'état des tableaux de bord
 *  fetchDashboards - Récupère la liste des tableaux
 *  fetchTeamMembers - Récupère les membres d'un tableau
 *- setSelectedDashboard - Définit le tableau sélectionné
 * - setPage - Change la page courante
 * - Modifie le nombre d'éléments par page
 */
interface DashboardActions {
  fetchDashboards: (page?: number, pageSize?: number) => Promise<void>;
  fetchTeamMembers: (
    dashboardId: string,
    page?: number,
    pageSize?: number
  ) => Promise<void>;
  setSelectedDashboard: (dashboardId: string | null) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

/**
 * Récupère le token d'authentification depuis le localStorage
 */
const getAuthToken = () => {
  const savedState = JSON.parse(
    localStorage.getItem("Task-Manager-auth-data") || "{}"
  );
  return savedState.accessToken;
};

const baseStore = createGenericStore<Dashboard>();

/**
 * Store Zustand pour la gestion des tableaux de bord et des équipes
 * Gère l'état et les actions liés aux tableaux et à leurs membres
 */
export const useDashboardStore = create<DashboardState & DashboardActions>(
  (set, get) => ({
    // État initial
    dashboards: [],
    selectedDashboard: null,
    teamMembers: [],
    loading: false,
    error: null,
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,

    /**
     * Récupère la liste des tableaux de bord avec pagination
     *  - Numéro de la page (défaut: 1)
     *  - Nombre d'éléments par page (défaut: 10)
     */
    fetchDashboards: async (page = 1, pageSize = 10) => {
      set((state) => ({ loading: true, error: null }));
      try {
        const token = getAuthToken();
        const response = await axios.get(`${config.mintClient}dashboard/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            page_size: pageSize,
          },
        });

        set({
          dashboards: response.data.results,
          totalCount: response.data.count,
          currentPage: page,
          pageSize,
          loading: false,
        });
      } catch (error) {
        // Conserver les données existantes en cas d'erreur
        set((state) => ({
          error:
            "Erreur lors du chargement des données veuillez réessayer plus tard",
          loading: false,
          // Ne pas écraser les données existantes
          dashboards: state.dashboards,
          totalCount: state.totalCount,
          currentPage: state.currentPage,
          pageSize: state.pageSize,
        }));
        console.error("Error fetching dashboards:", error);
      }
    },

    /**
     * Récupère les membres d'un tableau spécifique avec pagination
     *  - ID du tableau
     *  - Numéro de la page (défaut: 1)
     *  - Nombre d'éléments par page (défaut: 10)
     */
    fetchTeamMembers: async (dashboardId: string, page = 1, pageSize = 10) => {
      set((state) => ({ loading: true, error: null }));
      try {
        const token = getAuthToken();
        const response = await axios.get(
          `${config.mintClient}dashboard/${dashboardId}/get_member_teams/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page,
              page_size: pageSize,
            },
          }
        );

        set({
          teamMembers: response.data,
          currentPage: page,
          pageSize,
          loading: false,
        });
      } catch (error) {
        // Conserver les données existantes en cas d'erreur
        set((state) => ({
          error: "Erreur lors du chargement des membres",
          loading: false,
          // Ne pas écraser les données existantes
          teamMembers: state.teamMembers,
          currentPage: state.currentPage,
          pageSize: state.pageSize,
        }));
        console.error("Error fetching team members:", error);
      }
    },

    /**
     * Définit le tableau sélectionné et charge ses membres
     */
    setSelectedDashboard: (dashboardId: string | null) => {
      set({ selectedDashboard: dashboardId });
      if (dashboardId) {
        get().fetchTeamMembers(dashboardId, get().currentPage, get().pageSize);
      }
    },

    /**
     * Change la page courante et recharge les membres
     */
    setPage: (page: number) => {
      set({ currentPage: page });
      const { selectedDashboard, pageSize } = get();
      if (selectedDashboard) {
        get().fetchTeamMembers(selectedDashboard, page, pageSize);
      }
    },

    /**
     * Modifie le nombre d'éléments par page et recharge les membres
     */
    setPageSize: (size: number) => {
      set({ pageSize: size, currentPage: 1 });
      const { selectedDashboard } = get();
      if (selectedDashboard) {
        get().fetchTeamMembers(selectedDashboard, 1, size);
      }
    },
  })
);
