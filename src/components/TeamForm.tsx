import React, { useEffect } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { useTranslation } from "../hooks/useTranslation";

interface TeamFormData {
  name: string;
  description: string;
  workspace_id: string;
  members: string[];
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
}

interface Workspace {
  id: string;
  name: string;
}

interface TeamFormProps {
  formData: TeamFormData;
  setFormData: (data: TeamFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  workspaces: Workspace[];
  users: User[];
  mode: "create" | "edit";
}

const TeamForm: React.FC<TeamFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isSubmitting,
  workspaces,
  users,
  mode,
}) => {
  const { t } = useTranslation();

  const selectedWorkspace = workspaces.find(
    (ws) => ws.id === formData.workspace_id
  );

  const selectedUsers = formData.members
    .map((memberId) => {
      const user = users.find((u) => u.id === memberId);
      return user;
    })
    .filter((user): user is User => user !== undefined);

  useEffect(() => {
    if (
      mode === "create" &&
      (!formData.workspace_id ||
        !workspaces.some((ws) => ws.id === formData.workspace_id))
    ) {
      console.log(
        "Current workspace_id is invalid or empty, selecting first available"
      );
      if (workspaces.length > 0) {
        setFormData({
          ...formData,
          workspace_id: workspaces[0].id,
        });
      }
    }
  }, [workspaces, formData.workspace_id, mode, setFormData, formData]);

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("teams.form.name")}
        </label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={t("teams.form.name_placeholder")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("teams.form.description")}
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder={t("teams.form.description_placeholder")}
        />
      </div>

      {mode === "create" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("teams.form.workspace")}
            </label>
            <Select
              key={`workspace-select-${formData.workspace_id || "empty"}`}
              value={formData.workspace_id || ""}
              onValueChange={(value) => {
                console.log("Selected workspace with ID:", value);
                setFormData({
                  ...formData,
                  workspace_id: value,
                });
              }}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {selectedWorkspace
                    ? selectedWorkspace.name
                    : t("teams.form.workspace_placeholder")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {workspaces?.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("teams.form.members")}
            </label>
            <Select
              onValueChange={(value) => {
                console.log("Selected new member with ID:", value);
                setFormData({
                  ...formData,
                  members: [...formData.members, value],
                });
              }}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("teams.form.members_placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {users
                  ?.filter((user) => {
                    const isAlreadySelected = formData.members.includes(
                      user.id
                    );
                    return !isAlreadySelected;
                  })
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {`${user.first_name} ${user.last_name}`}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {selectedUsers.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-md">
                    <span className="text-sm">
                      {`${user.first_name} ${user.last_name}`}
                    </span>
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          members: formData.members.filter(
                            (id) => id !== user.id
                          ),
                        })
                      }
                      className="text-purple-700 hover:text-purple-900">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="pt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          {t("button.cancel")}
        </Button>
        <Button
          onClick={() => {
            console.log("Submitting form with data:", formData);
            onSubmit();
          }}
          disabled={isSubmitting}
          className="bg-purple-600 hover:bg-purple-700 text-white">
          {isSubmitting
            ? t("button.saving")
            : mode === "create"
            ? t("button.create")
            : t("button.save")}
        </Button>
      </div>
    </div>
  );
};

export default TeamForm;
