import React, { useState, useEffect } from "react";
import TMModal from "./components/ui/TM_Modal";
import { useTranslation } from "../hooks/useTranslation";
import { useToast } from "./hooks/use-toast";
import TeamForm from "./TeamForm";
import useStoreAllWorkSpace from "../store/workPace/getAll";
import useStoreAllUsers from "../store/Administration/getAll";
import { Team } from "../store/teams/teamsStore";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    workspace_id: string;
    members: string[];
  }) => Promise<void>;
  team?: Team | null;
}

const TeamModal: React.FC<TeamModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  team,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { AllWorkSpace: workspaces, fetchAllWorkSpace } =
    useStoreAllWorkSpace();
  const { AllUsers: users, fetchAllUsers } = useStoreAllUsers();

  const normalizeMembers = (members: any[]): string[] => {
    return members.map((member) =>
      typeof member === "string" ? member : member.id
    );
  };

  const [formData, setFormData] = useState({
    name: team?.name || "",
    description: team?.description || "",
    workspace_id: team?.workspace_id || "",
    members: team ? normalizeMembers(team.members) : [],
  });

  const isEditMode = !!team?.id;

  useEffect(() => {
    if (isOpen) {
      fetchAllWorkSpace();
      fetchAllUsers();

      if (team) {
        const normalizedMembers = normalizeMembers(team.members);

        setFormData({
          name: team.name,
          description: team.description,
          workspace_id: team.workspace_id,
          members: normalizedMembers,
        });
      } else {
        setFormData({
          name: "",
          description: "",
          workspace_id: "",
          members: [],
        });
      }
    }
  }, [isOpen, team, fetchAllWorkSpace, fetchAllUsers]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: isEditMode ? t("teams.error_update") : t("teams.error_create"),
        description: t("teams.name_required"),
      });
      return;
    }

    if (!isEditMode && !formData.workspace_id) {
      toast({
        variant: "destructive",
        title: t("teams.error_create"),
        description: t("teams.workspace_required"),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // En mode édition, on ne passe que name et description
      if (isEditMode) {
        await onSubmit({
          name: formData.name,
          description: formData.description,
          workspace_id: team?.workspace_id || "",
          members: formData.members,
        });
      } else {
        await onSubmit(formData);
      }

      toast({
        title: isEditMode
          ? t("teams.success_update")
          : t("teams.success_create"),
        description: isEditMode
          ? t("teams.success_update_description")
          : t("teams.success_create_description"),
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: isEditMode ? t("teams.error_update") : t("teams.error_create"),
        description: isEditMode
          ? t("teams.error_update_description")
          : t("teams.error_create_description"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TMModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? t("teams.edit") : t("teams.create")}
      position="center"
      size="md">
      <TeamForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
        workspaces={workspaces || []}
        users={users || []}
        mode={isEditMode ? "edit" : "create"}
      />
    </TMModal>
  );
};

export default TeamModal;
