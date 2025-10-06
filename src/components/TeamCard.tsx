import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Badge } from "./components/ui/badge";

interface Dashboard {
  id: string;
  name: string;
}

interface TeamCardProps {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  completedCards: number;
  totalCards: number;
  performance: string;
  dashboards: Dashboard[];
  performanceLabel: string;
  statusColor: string;
  getInitials: (firstName: string, lastName: string) => string;
  dashboardsLabel: string;
  completedTasksLabel: string;
  performanceTextLabel: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  firstName,
  lastName,
  email,
  profilePicture,
  completedCards,
  totalCards,
  performance,
  dashboards,
  performanceLabel,
  statusColor,
  getInitials,
  dashboardsLabel,
  completedTasksLabel,
  performanceTextLabel,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12">
          {profilePicture ? (
            <AvatarImage src={profilePicture} />
          ) : (
            <AvatarFallback className="bg-purple-100 text-purple-600">
              {getInitials(firstName, lastName)}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 className="font-medium">
            {firstName} {lastName}
          </h3>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{completedTasksLabel}:</span>
          <span className="font-medium">
            {completedCards}/{totalCards}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{performanceTextLabel}:</span>
          <Badge className={statusColor}>{performanceLabel}</Badge>
        </div>
      </div>

      {dashboards.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">{dashboardsLabel}</h4>
          <div className="flex flex-wrap gap-2">
            {dashboards.map((dashboard) => (
              <Badge key={dashboard.id} className="bg-purple-50">
                {dashboard.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
