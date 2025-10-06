import { create } from "zustand";
import axios from "axios";
import config from "../../config/config.dev";

export interface Team {
  id: string;
  name: string;
  description: string;
  workspace_id: string;
  members: (string | TeamMember)[];
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  id: string;
  is_active: boolean;
  is_superuser: boolean;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  register_number: string | null;
  gender: string;
  profile_picture_file: string | null;
}

interface CreateTeamData {
  name: string;
  description: string;
  workspace_id: string;
  members: (string | TeamMember)[];
}

interface TeamDetails {
  name: string;
  members: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_picture_file: string;
    total_cards: number;
    completed_cards: number;
    performance: string;
    dashboards: {
      id: string;
      name: string;
    }[];
  }[];
}

interface TeamsState {
  teams: Team[];
  selectedTeam: Team | null;
  loading: boolean;
  error: string | null;
  count: number;
  currentPage: number;
  pageSize: number;
  selectedTeamDetails: TeamDetails | null;
  loadingDetails: boolean;
  excludeMembers: any[];
  loadingExcludeMembers: boolean;
  // Member pagination state
  memberCurrentPage: number;
  memberPageSize: number;
  paginatedMembers: TeamDetails["members"] | null;
  fetchTeams: (page?: number, pageSize?: number) => Promise<void>;
  createTeam: (data: CreateTeamData) => Promise<Team>;
  setSelectedTeam: (team: Team | null) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  getTeamDetails: (teamId: string) => Promise<void>;
  addTeamMembers: (teamId: string, memberIds: string[]) => Promise<void>;
  removeTeamMembers: (teamId: string, memberIds: string[]) => Promise<void>;
  updateTeam: (teamId: string, data: Partial<CreateTeamData>) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  getExcludeMembers: (teamId: string) => Promise<any[]>;
  // Member pagination functions
  setMemberPage: (page: number) => void;
  setMemberPageSize: (size: number) => void;
  updatePaginatedMembers: () => void;
}

const getAuthToken = () => {
  const savedState = JSON.parse(
    localStorage.getItem("Task-Manager-auth-data") || "{}"
  );
  return savedState.accessToken;
};

export const useTeamsStore = create<TeamsState>((set, get) => ({
  teams: [],
  selectedTeam: null,
  loading: false,
  error: null,
  count: 0,
  currentPage: 1,
  pageSize: 10,
  selectedTeamDetails: null,
  loadingDetails: false,
  excludeMembers: [],
  loadingExcludeMembers: false,
  // Initialize member pagination state
  memberCurrentPage: 1,
  memberPageSize: 9,
  paginatedMembers: null,

  fetchTeams: async (page = 1, pageSize = 10) => {
    try {
      set({ loading: true, error: null });
      const token = getAuthToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${config.mintClient}teams/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          page_size: pageSize,
        },
      });

      console.log("Teams API response:", response.data);
      console.log("Total teams count:", response.data.count);
      console.log("Number of teams in results:", response.data.results.length);

      // Vérifier la structure des membres pour chaque équipe
      response.data.results.forEach((team: any) => {
        console.log(`Team ${team.name} (${team.id}) members:`, team.members);
      });

      set({
        teams: response.data.results,
        count: response.data.count || response.data.results.length, // Fallback to length if count is missing
        loading: false,
        currentPage: page,
        pageSize: pageSize,
      });

      console.log("Store state after update:", {
        count: get().count,
        currentPage: get().currentPage,
        pageSize: get().pageSize,
        totalPages: Math.ceil(get().count / get().pageSize),
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch teams",
        loading: false,
      });
    }
  },

  createTeam: async (data: CreateTeamData) => {
    try {
      set({ loading: true, error: null });
      const token = getAuthToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${config.mintClient}teams/`,
        {
          ...data,
          member_ids: data.members, // Conversion du format pour l'API
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh teams list after creation
      const { currentPage, pageSize } = get();
      await get().fetchTeams(currentPage, pageSize);

      return response.data;
    } catch (error: any) {
      set({
        error: error.message || "Failed to create team",
        loading: false,
      });
      throw error;
    }
  },

  setSelectedTeam: (team) => set({ selectedTeam: team }),
  setPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),

  getTeamDetails: async (teamId: string) => {
    set({ loadingDetails: true });
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${config.mintClient}teams/${teamId}/get_global_state_team`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({
        selectedTeamDetails: response.data,
        loadingDetails: false,
        // Reset member pagination when loading new team details
        memberCurrentPage: 1,
      });

      // Update paginated members immediately after setting team details
      get().updatePaginatedMembers();
    } catch (error) {
      console.error("Error fetching team details:", error);
      set({ error: "Failed to fetch team details", loadingDetails: false });
    }
  },

  addTeamMembers: async (teamId: string, memberIds: string[]) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.patch(
        `${config.mintClient}teams/${teamId}/add-members-to-team/`,
        { member_ids: memberIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh team details after adding members
      await get().getTeamDetails(teamId);

      // Refresh teams list to ensure all data is up to date
      const { currentPage, pageSize } = get();
      await get().fetchTeams(currentPage, pageSize);
    } catch (error) {
      console.error("Error adding team members:", error);
      throw new Error("Failed to add team members");
    }
  },

  removeTeamMembers: async (teamId: string, memberIds: string[]) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.patch(
        `${config.mintClient}teams/${teamId}/remove-members-from-team/`,
        { member_ids: memberIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh team details after removing members
      await get().getTeamDetails(teamId);

      // Refresh teams list to ensure all data is up to date
      const { currentPage, pageSize } = get();
      await get().fetchTeams(currentPage, pageSize);
    } catch (error) {
      console.error("Error removing team members:", error);
      throw new Error("Failed to remove team members");
    }
  },

  updateTeam: async (teamId: string, data: Partial<CreateTeamData>) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Ne prendre en compte que name et description pour la mise à jour
      const updateData = {
        name: data.name,
        description: data.description,
      };

      console.log("Updating team with data:", updateData);

      await axios.patch(`${config.mintClient}teams/${teamId}/`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh teams list and team details
      const { currentPage, pageSize } = get();
      await get().fetchTeams(currentPage, pageSize);
      if (get().selectedTeamDetails) {
        await get().getTeamDetails(teamId);
      }
    } catch (error) {
      console.error("Error updating team:", error);
      throw new Error("Failed to update team");
    }
  },

  deleteTeam: async (teamId: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.delete(`${config.mintClient}teams/${teamId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh teams list
      const { currentPage, pageSize } = get();
      await get().fetchTeams(currentPage, pageSize);
    } catch (error) {
      console.error("Error deleting team:", error);
      throw new Error("Failed to delete team");
    }
  },

  getExcludeMembers: async (teamId: string) => {
    try {
      set({ loadingExcludeMembers: true });
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${config.mintClient}teams/${teamId}/get_exclude_members/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Exclude members received:", response.data);

      // S'assurer que les données sont bien un tableau
      const membersData =
        response.data && Array.isArray(response.data)
          ? response.data
          : response.data?.results && Array.isArray(response.data.results)
          ? response.data.results
          : [];

      set({ excludeMembers: membersData, loadingExcludeMembers: false });
      return membersData;
    } catch (error) {
      console.error("Error fetching exclude members:", error);
      set({ excludeMembers: [], loadingExcludeMembers: false });
      throw new Error("Failed to fetch exclude members");
    }
  },

  // Member pagination functions
  setMemberPage: (page: number) => {
    set({ memberCurrentPage: page });
    get().updatePaginatedMembers();
  },

  setMemberPageSize: (size: number) => {
    set({ memberPageSize: size, memberCurrentPage: 1 });
    get().updatePaginatedMembers();
  },

  updatePaginatedMembers: () => {
    const { selectedTeamDetails, memberCurrentPage, memberPageSize } = get();

    if (!selectedTeamDetails || !selectedTeamDetails.members) {
      set({ paginatedMembers: null });
      return;
    }

    const startIndex = (memberCurrentPage - 1) * memberPageSize;
    const endIndex = startIndex + memberPageSize;
    const paginatedMembers = selectedTeamDetails.members.slice(
      startIndex,
      endIndex
    );

    set({ paginatedMembers });
  },
}));
