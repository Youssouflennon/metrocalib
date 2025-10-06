import React from "react";
import { Badge } from "./components/ui/badge";

interface TeamMemberCardProps {
  role: string;
  status: "Excellent" | "Moyen" | "Bien" | "Très actif" | "Médiocre";
  name: string;
  email: string;
  avatar: string;
  notifications: number;
  projects: string[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Excellent":
      return "bg-green-100 text-green-600";
    case "Moyen":
      return "bg-yellow-100 text-yellow-600";
    case "Bien":
      return "bg-orange-100 text-orange-600";
    case "Très actif":
      return "bg-blue-100 text-blue-600";
    case "Médiocre":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  role,
  status,
  name,
  email,
  avatar,
  notifications,
  projects,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900">{role}</h3>
        <Badge className={`${getStatusColor(status)}`}>{status}</Badge>
      </div>

      <div className="flex items-center space-x-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />

        <div>
          <h4 className="text-base font-medium text-gray-900">{name}</h4>

          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Projets</span>
          <span className="text-sm text-gray-500">
            {notifications} notifications
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {projects.map((project, index) => (
            <img
              key={index}
              src={project}
              alt="Project"
              className="w-6 h-6 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
