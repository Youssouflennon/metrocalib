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

interface AddTeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberIds: string[]) => Promise<void>;
  teamId: string;
  teamName: string;
}

const AddTeamMembersModal: React.FC<AddTeamMembersModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teamId,
  teamName,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [availableMembers, setAvailableMembers] = useState<User[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Utiliser une référence pour suivre si nous avons déjà chargé les membres
  const hasLoadedRef = useRef(false);

  // Fonction pour charger les membres exclus
  const loadExcludeMembers = async () => {
    if (!teamId || !isOpen) return;

    // Éviter de charger les membres plusieurs fois
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    setLoadingMembers(true);
    try {
      // Faire l'appel API directement
      const token = JSON.parse(
        localStorage.getItem("Task-Manager-auth-data") || "{}"
      ).accessToken;

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Fonction pour charger une page de membres
      const loadMembersPage = async (page = 1) => {
        const response = await fetch(
          `${config.mintClient}teams/${teamId}/get_exclude_members/?page=${page}&page_size=100`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        return await response.json();
      };

      // Charger la première page
      const firstPageData = await loadMembersPage(1);

      // Extraire les membres de la première page
      let allMembers: User[] = [];

      if (Array.isArray(firstPageData)) {
        // Si l'API renvoie directement un tableau
        allMembers = [...firstPageData];
      } else if (
        firstPageData.results &&
        Array.isArray(firstPageData.results)
      ) {
        // Si l'API renvoie un objet avec une propriété results
        allMembers = [...firstPageData.results];

        // S'il y a pagination, charger les pages suivantes
        if (firstPageData.count && firstPageData.count > allMembers.length) {
          const totalPages = Math.ceil(firstPageData.count / 100);

          // Charger les pages restantes
          for (let page = 2; page <= totalPages; page++) {
            const pageData = await loadMembersPage(page);
            if (pageData.results && Array.isArray(pageData.results)) {
              allMembers = [...allMembers, ...pageData.results];
            }
          }
        }
      }

      console.log(
        `Loaded ${allMembers.length} exclude members for team ${teamId}`
      );
      setAvailableMembers(allMembers);
    } catch (error) {
      console.error("Error fetching exclude members:", error);
      toast({
        variant: "destructive",
        title: t("teams.error_loading_members"),
        description: t("teams.error_loading_members_description"),
      });
      setAvailableMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Charger les membres exclus lorsque le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      // Réinitialiser les états
      setSelectedMembers([]);
      hasLoadedRef.current = false;
      loadExcludeMembers();
    }
  }, [isOpen, teamId]);

  const handleSubmit = async () => {
    if (selectedMembers.length === 0) {
      toast({
        variant: "destructive",
        title: t("teams.error_add_members"),
        description: t("teams.select_members"),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(selectedMembers);
      toast({
        title: t("teams.success_add_members"),
        description: t("teams.success_add_members_description"),
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("teams.error_add_members"),
        description: t("teams.error_add_members_description"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TMModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t("teams.add_members")} - ${teamName}`}
      position="center"
      size="md">
      <div className="space-y-4 p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("teams.select_members_to_add")}
          </label>

          {loadingMembers ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          ) : availableMembers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {t("teams.no_available_members")}
            </div>
          ) : (
            <Select
              onValueChange={(value) =>
                setSelectedMembers([...selectedMembers, value])
              }>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("teams.select_members_placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {availableMembers
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
              {t("teams.selected_members")}:
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedMembers.map((memberId) => {
                const user = availableMembers.find((u) => u.id === memberId);
                if (!user) return null;
                return (
                  <div
                    key={memberId}
                    className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-md">
                    <span className="text-sm">
                      {`${user.first_name} ${user.last_name}`}
                    </span>
                    <button
                      onClick={() =>
                        setSelectedMembers(
                          selectedMembers.filter((id) => id !== memberId)
                        )
                      }
                      className="text-purple-700 hover:text-purple-900">
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
              isSubmitting || loadingMembers || availableMembers.length === 0
            }
            className="bg-purple-600 hover:bg-purple-700 text-white">
            {isSubmitting ? t("button.saving") : t("button.add")}
          </Button>
        </div>
      </div>
    </TMModal>
  );
};

export default AddTeamMembersModal;
