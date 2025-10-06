import React, { useState, useEffect, useRef } from "react";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import TMModal from "./components/ui/TM_Modal";
import { useTranslation } from "../hooks/useTranslation";
import { useToast } from "./hooks/use-toast";
import config from "../config/config.dev";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_file?: string;
}

interface RemoveTeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberIds: string[]) => Promise<void>;
  teamId: string;
  teamName: string;
  teamMembers: any[]; // Membres actuels de l'équipe
}

const RemoveTeamMembersModal: React.FC<RemoveTeamMembersModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teamId,
  teamName,
  teamMembers,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentMembers, setCurrentMembers] = useState<User[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Utiliser une référence pour suivre si nous avons déjà chargé les membres
  const hasLoadedRef = useRef(false);

  // Fonction pour charger les membres actuels de l'équipe
  const loadTeamMembers = async () => {
    if (!teamId || !isOpen) return;

    // Éviter de charger les membres plusieurs fois
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    setLoadingMembers(true);
    try {
      // Si teamMembers est déjà fourni, l'utiliser
      if (teamMembers && teamMembers.length > 0) {
        const formattedMembers = teamMembers.map((member) => ({
          id: typeof member === "string" ? member : member.id,
          first_name: typeof member === "string" ? "" : member.first_name,
          last_name: typeof member === "string" ? "" : member.last_name,
          email: typeof member === "string" ? "" : member.email,
          profile_picture_file:
            typeof member === "string" ? "" : member.profile_picture_file || "",
        }));
        setCurrentMembers(formattedMembers);
        console.log("Using provided team members:", formattedMembers);
        setLoadingMembers(false);
        return;
      }

      // Sinon, faire l'appel API directement
      const token = JSON.parse(
        localStorage.getItem("Task-Manager-auth-data") || "{}"
      ).accessToken;

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Charger les membres actuels de l'équipe
      const response = await fetch(
        `${config.mintClient}teams/${teamId}/get_global_state_team`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (data.members && Array.isArray(data.members)) {
        setCurrentMembers(data.members);
        console.log(`Loaded ${data.members.length} members for team ${teamId}`);
      } else {
        setCurrentMembers([]);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast({
        variant: "destructive",
        title: t("teams.error_loading_members"),
        description: t("teams.error_loading_members_description"),
      });
      setCurrentMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Charger les membres actuels lorsque le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      // Réinitialiser les états
      setSelectedMembers([]);
      hasLoadedRef.current = false;
      loadTeamMembers();
    }
  }, [isOpen, teamId, teamMembers]);

  const handleSubmit = async () => {
    if (selectedMembers.length === 0) {
      toast({
        variant: "destructive",
        title: t("teams.error_remove_members"),
        description: t("teams.select_at_least_one_member_to_remove"),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(selectedMembers);
      toast({
        title: t("teams.success_remove_members"),
        description: t("teams.success_remove_members_description"),
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("teams.error_remove_members"),
        description: t("teams.error_remove_members_description"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TMModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t("teams.remove_members")} - ${teamName}`}
      position="center"
      size="md">
      <div className="space-y-4 p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("teams.select_members_to_remove")}
          </label>

          {loadingMembers ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          ) : currentMembers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {t("teams.no_members_to_remove")}
            </div>
          ) : (
            <Select
              onValueChange={(value) =>
                setSelectedMembers([...selectedMembers, value])
              }>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("teams.select_members_to_remove_placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {currentMembers
                  .filter((user) => !selectedMembers.includes(user.id))
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {`${user.first_name} ${user.last_name}`}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {selectedMembers.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("teams.members_to_remove")}:
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedMembers.map((memberId) => {
                const user = currentMembers.find((u) => u.id === memberId);
                if (!user) return null;
                return (
                  <div
                    key={memberId}
                    className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-md">
                    <span className="text-sm">
                      {`${user.first_name} ${user.last_name}`}
                    </span>
                    <button
                      onClick={() =>
                        setSelectedMembers(
                          selectedMembers.filter((id) => id !== memberId)
                        )
                      }
                      className="text-red-700 hover:text-red-900">
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            {t("button.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              loadingMembers ||
              currentMembers.length === 0 ||
              selectedMembers.length === 0
            }
            variant="destructive">
            {isSubmitting ? t("button.removing") : t("button.remove")}
          </Button>
        </div>
      </div>
    </TMModal>
  );
};

export default RemoveTeamMembersModal;
