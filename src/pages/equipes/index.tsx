import React, { useEffect, useState } from "react";
import {
  Loader2,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  ArrowLeft,
  UserPlus,
  UserMinus,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/components/ui/select";
import { Button } from "../../components/components/ui/button";
import { Input } from "../../components/components/ui/input";
import { Textarea } from "../../components/components/ui/textarea";
import { useToast } from "../../components/hooks/use-toast";
import TMModal from "../../components/components/ui/TM_Modal";
import { useDashboardStore } from "../../store/dashboard/dashboardStore";
import { useTeamsStore } from "../../store/teams/teamsStore";
import type { Team } from "../../store/teams/teamsStore";
import Pagination from "../../components/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import useStoreAllWorkSpace from "../../store/workPace/getAll";
import useStoreAllUsers from "../../store/Administration/getAll";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/components/ui/dropdown-menu";
import TeamDetails from "./teamDetails";
import TeamModal from "../../components/TeamModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/components/ui/dialog";
import AddTeamMembersModal from "../../components/AddTeamMembersModal";
import RemoveTeamMembersModal from "../../components/RemoveTeamMembersModal";

const getStatusColor = (performance?: string) => {
  switch (performance) {
    case "EXCELLENT":
      return "bg-green-100 text-green-700";
    case "GOOD":
      return "bg-orange-100 text-orange-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    case "POOR":
      return "bg-red-100 text-red-700";
    case "INACTIVE":
      return "bg-gray-100 text-gray-500";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const ProjectIcon = ({ name, index }: { name: string; index: number }) => (
  <div
    className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
    style={{
      backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
      marginLeft: index > 0 ? "-0.5rem" : "0",
    }}
    title={name}>
    {name.charAt(0).toUpperCase()}
  </div>
);

const Equipes = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedTeamForDashboards, setSelectedTeamForDashboards] = useState<
    string | null
  >(null);
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    teams,
    loading: teamsLoading,
    error: teamsError,
    fetchTeams,
    createTeam,
    selectedTeamDetails,
    loadingDetails,
    getTeamDetails,
    updateTeam,
    deleteTeam,
    addTeamMembers,
    removeTeamMembers,
    count: totalTeams,
    currentPage,
    pageSize,
    setPage,
    setPageSize,
  } = useTeamsStore();

  const {
    dashboards,
    teamMembers,
    loading: dashboardsLoading,
    fetchDashboards,
    fetchTeamMembers,
  } = useDashboardStore();

  const {
    AllWorkSpace: workspaces,
    loadingAllWorkSpace: workspacesLoading,
    fetchAllWorkSpace: fetchWorkspaces,
  } = useStoreAllWorkSpace();

  const {
    AllUsers: users,
    loadingAllUsers: usersLoading,
    fetchAllUsers: fetchUsers,
  } = useStoreAllUsers();

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeamForEdit, setSelectedTeamForEdit] = useState<Team | null>(
    null
  );
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);
  const [isRemoveMembersModalOpen, setIsRemoveMembersModalOpen] =
    useState(false);

  useEffect(() => {
    fetchTeams(currentPage, pageSize);
    fetchWorkspaces();
    fetchUsers();
  }, [fetchTeams, fetchWorkspaces, fetchUsers, currentPage, pageSize]);

  useEffect(() => {
    if (selectedTeamForDashboards) {
      fetchDashboards();
    }
  }, [selectedTeamForDashboards, fetchDashboards]);

  useEffect(() => {
    if (selectedTeamForDashboards && selectedDashboard) {
      fetchTeamMembers(selectedDashboard);
    }
  }, [selectedTeamForDashboards, selectedDashboard, fetchTeamMembers]);

  useEffect(() => {
    if (selectedTeamId && selectedTeamDetails) {
      console.log("Team details updated:", selectedTeamDetails);
      console.log("Type of selectedTeamDetails:", typeof selectedTeamDetails);
      console.log(
        "Keys in selectedTeamDetails:",
        Object.keys(selectedTeamDetails)
      );
    }
  }, [selectedTeamId, selectedTeamDetails]);

  const handleCreateTeam = async (data: {
    name: string;
    description: string;
    workspace_id: string;
    members: string[];
  }): Promise<void> => {
    try {
      await createTeam(data);
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  };

  const handleEditTeam = (team: Team) => {
    const currentTeam = teams.find((t) => t.id === team.id) || team;
    console.log("Editing team:", currentTeam);
    setSelectedTeamForEdit(currentTeam);
    setIsTeamModalOpen(true);
  };

  const handleUpdateTeam = async (data: {
    name: string;
    description: string;
    workspace_id: string;
    members: string[];
  }): Promise<void> => {
    if (!selectedTeamForEdit) return;
    try {
      const { name, description } = data;
      await updateTeam(selectedTeamForEdit.id, {
        name,
        description,
      });

      toast({
        title: t("teams.success_update"),
        description: t("teams.success_update_description"),
      });
    } catch (error) {
      console.error("Error updating team:", error);
      toast({
        variant: "destructive",
        title: t("teams.error_update"),
        description: t("teams.error_update_description"),
      });
      throw error;
    }
  };

  const handleTeamSubmit = async (data: {
    name: string;
    description: string;
    workspace_id: string;
    members: string[];
  }): Promise<void> => {
    if (selectedTeamForEdit) {
      await handleUpdateTeam(data);
    } else {
      await handleCreateTeam(data);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeam(teamId);
      toast({
        title: t("teams.success_delete"),
        description: t("teams.success_delete_description"),
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("teams.error_delete"),
        description: t("teams.error_delete_description"),
      });
    }
  };

  const getPerformanceLabel = (performance?: string) => {
    switch (performance) {
      case "EXCELLENT":
        return t("teams.performance.excellent");
      case "GOOD":
        return t("teams.performance.good");
      case "MEDIUM":
        return t("teams.performance.medium");
      case "POOR":
        return t("teams.performance.poor");
      case "INACTIVE":
        return t("teams.performance.inactive");
      default:
        return t("teams.performance.undefined");
    }
  };

  // Fonction sécurisée pour obtenir les initiales
  const getInitials = (firstName: string, lastName: string, email: string) => {
    if (!firstName || !lastName) {
      return email.charAt(0).toUpperCase();
    }
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleDashboardSelect = (dashboardId: string) => {
    setSelectedDashboard(dashboardId);
  };

  const handleBackToTeams = () => {
    setSelectedDashboard(null);
    setSelectedTeamForDashboards(null);
  };

  const handleTeamClick = async (teamId: string) => {
    console.log("Clicking on team with ID:", teamId);
    setSelectedTeamId(teamId);
    await getTeamDetails(teamId);
    console.log("Team details loaded:", selectedTeamDetails);
  };

  const handleAddMembers = (team: Team) => {
    setSelectedTeamForEdit(team);
    setIsAddMembersModalOpen(true);
  };

  const handleRemoveMembers = (team: Team) => {
    setSelectedTeamForEdit(team);
    setIsRemoveMembersModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const calculateTotalPages = () => {
    return Math.max(1, Math.ceil(totalTeams / pageSize));
  };

  const getSelectedTeamName = () => {
    if (selectedTeamId && teams) {
      const team = teams.find((t) => t.id === selectedTeamId);
      if (team) {
        console.log("Using team name from teams list:", team.name);
        return team.name;
      }
    }
    return t("teams.title");
  };

  if (teamsLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (teamsError) {
    return <div className="text-red-500 text-center p-4">{teamsError}</div>;
  }

  const colors = [
    "bg-yellow-300",
    "bg-yellow-400",
    "bg-yellow-500",
    "bg-green-300",
    "bg-green-400",
    "bg-green-500",
    "bg-blue-300",
    "bg-blue-400",
    "bg-blue-500",
    "bg-purple-300",
    "bg-purple-400",
    "bg-purple-500",
  ];

  const getRandomColorClass = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 ">
          {selectedTeamId && (
            <Button
              variant="ghost"
              className="p-2 bg-gray-100"
              onClick={() => setSelectedTeamId(null)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-2xl font-bold">{getSelectedTeamName()}</h1>
        </div>
        <Button
          onClick={() => {
            setSelectedTeamForEdit(null);
            setIsTeamModalOpen(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t("teams.create")}
        </Button>
      </div>

      {selectedTeamId ? (
        <TeamDetails
          teamId={selectedTeamId}
          teamDetails={selectedTeamDetails}
          loading={loadingDetails}
          onClose={() => setSelectedTeamId(null)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-lg shadow-sm border p-6 relative space-y-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleTeamClick(team.id)}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{team.name}</h3>
                    <p className="text-gray-600 text-sm">{team.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-gray-100"
                        onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddMembers(team);
                        }}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        {t("teams.add_members")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-yellow-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTeam(team);
                        }}>
                        <Edit className="h-4 w-4 mr-2" />
                        {t("teams.edit")}
                      </DropdownMenuItem>
                      {/* fonction non stable pour le moment */}
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveMembers(team);
                        }}>
                        <UserMinus className="h-4 w-4 mr-2" />
                        {t("teams.remove_members")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeamForEdit(team);
                          setIsDeleteDialogOpen(true);
                        }}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("button.delete.team")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex -space-x-2 overflow-visible">
                  {Array.isArray(team.members) &&
                    team.members.slice(0, 4).map((member) => {
                      const memberId =
                        typeof member === "string" ? member : member.id;
                      const user =
                        typeof member === "string"
                          ? users?.find((u) => u.id === memberId)
                          : member;

                      if (!user) return null;

                      return (
                        <Avatar key={memberId} className="h-8 w-8">
                          {
                            <AvatarFallback
                              className={`h-8 w-8 text-white ${getRandomColorClass()}`}>
                              {getInitials(
                                user.first_name,
                                user.last_name,
                                user.email
                              )}
                            </AvatarFallback>
                          }
                        </Avatar>
                      );
                    })}
                  {Array.isArray(team.members) && team.members.length > 4 && (
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
                      +{team.members.length - 4}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Pagination
              pages={calculateTotalPages()}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              rangeLimit={5}
            />
          </div>
        </>
      )}

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => {
          setIsTeamModalOpen(false);
          setSelectedTeamForEdit(null);
        }}
        onSubmit={handleTeamSubmit}
        team={selectedTeamForEdit}
      />

      {selectedTeamForEdit && (
        <AddTeamMembersModal
          isOpen={isAddMembersModalOpen}
          onClose={() => {
            setIsAddMembersModalOpen(false);
            setSelectedTeamForEdit(null);
          }}
          onSubmit={(memberIds) =>
            addTeamMembers(selectedTeamForEdit.id, memberIds)
          }
          teamId={selectedTeamForEdit.id}
          teamName={selectedTeamForEdit.name}
        />
      )}

      {selectedTeamForEdit && (
        <RemoveTeamMembersModal
          isOpen={isRemoveMembersModalOpen}
          onClose={() => {
            setIsRemoveMembersModalOpen(false);
            setSelectedTeamForEdit(null);
          }}
          onSubmit={(memberIds) =>
            removeTeamMembers(selectedTeamForEdit.id, memberIds)
          }
          teamId={selectedTeamForEdit.id}
          teamName={selectedTeamForEdit.name}
          teamMembers={selectedTeamForEdit.members || []}
        />
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("teams.delete_confirmation")}</DialogTitle>
            <DialogDescription>
              {t("teams.delete_description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}>
              {t("button.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedTeamForEdit && handleDeleteTeam(selectedTeamForEdit.id)
              }>
              {t("button.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Equipes;
