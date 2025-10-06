import React from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { Loader2 } from "lucide-react";
import TeamCard from "../../components/TeamCard";
import Pagination from "../../components/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/components/ui/select";
import { useTeamsStore } from "../../store/teams/teamsStore";
import { Badge } from "../../components/components/ui/badge";
import { joinUrlWithParamsId } from "src/helpers/helpers";
import { useNavigate } from "react-router-dom";

interface Dashboard {
  id: string;
  name: string;
}

interface TeamMember {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture_file: string;
  total_cards: number;
  completed_cards: number;
  performance: string;
  dashboards: Dashboard[];
}

interface TeamDetailsProps {
  teamId: string;
  teamDetails: {
    name?: string;
    members: TeamMember[];
  } | null;
  loading: boolean;
  onClose: () => void;
}

const getStatusColor = (performance: string) => {
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

const getPerformanceClass = (performance: string) => {
  switch (performance) {
    case "EXCELLENT":
      return "bg-green-50 text-green-800 border-green-200";
    case "GOOD":
      return "bg-orange-50 text-orange-800 border-orange-200";
    case "MEDIUM":
      return "bg-yellow-50 text-yellow-800 border-yellow-200";
    case "POOR":
      return "bg-red-50 text-red-800 border-red-200";
    case "INACTIVE":
      return "bg-gray-50 text-gray-800 border-gray-200";
    default:
      return "bg-gray-50 text-gray-800 border-gray-200";
  }
};

const getInitials = (firstName: string, lastName: string, email: string) => {
  if (!firstName || !lastName) {
    return email.charAt(0).toUpperCase();
  }
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const getTableauColor = (name: string) => {
  const colors = {
    Rental: "bg-red-500",
    CSU: "bg-purple-500",
    Pharma: "bg-yellow-500",
    "RF-eTrust": "bg-green-500",
    "Task-Manager": "bg-blue-500",
    R: "bg-red-500",
    P: "bg-yellow-500", // Plus proche de la couleur "P" sur la capture
    C: "bg-yellow-300",
    T: "bg-teal-500",
  };

  return (
    colors[name as keyof typeof colors] ||
    `bg-purple-${(name.length * 100) % 900 || 500}`
  );
};

const getTableauInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};

const TeamDetails: React.FC<TeamDetailsProps> = ({
  teamId,
  teamDetails,
  loading,
  onClose,
}) => {
  const { t } = useTranslation();
  const {
    memberCurrentPage,
    memberPageSize,
    paginatedMembers,
    setMemberPage,
    setMemberPageSize,
    updatePaginatedMembers,
    teams,
  } = useTeamsStore();

  //   const getTeamName = () => {
  //     if (teams && teamId) {
  //       const team = teams.find((t) => t.id === teamId);
  //       if (team) {
  //         return team.name;
  //       }
  //     }
  //     return t("teams.team_details");
  //   };

  const calculateTotalPages = () => {
    if (!teamDetails || !teamDetails.members) return 1;
    return Math.max(1, Math.ceil(teamDetails.members.length / memberPageSize));
  };

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!teamDetails) {
    return (
      <div className="text-center py-8">
        <p>{t("teams.no_data")}</p>
      </div>
    );
  }

  const getPerformanceLabel = (performance: string) => {
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

  const membersToDisplay =
    paginatedMembers ||
    (() => {
      const startIndex = (memberCurrentPage - 1) * memberPageSize;
      const endIndex = startIndex + memberPageSize;
      return teamDetails.members.slice(startIndex, endIndex);
    })();

  console.log("membersToDisplay", membersToDisplay);

  const handleRowClick = (id: any) => {
    navigate(joinUrlWithParamsId("/detail/userboard/:id", id));
  };

  return (
    <div className="space-y-6 ">
      <div className="mb-4">
        {/* <h2 className="text-xl font-semibold mb-2">{getTeamName()}</h2> */}
        <div className="flex items-center gap-2">
          <span className="text-purple-600 font-medium">
            {teamDetails.members.length} {t("teams.members")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {membersToDisplay.map((member) => (
          <div
            key={member.id}
            className=" bg-white rounded-lg shadow-sm border p-4 sm:p-6 space-y-3 sm:space-y-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-purple-200 cursor-pointer *:
            
            "
            onClick={() => handleRowClick(member.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-700 font-medium ">
                  {member.total_cards}{" "}
                  {member.total_cards > 1
                    ? t("teams.tasks_plural")
                    : t("teams.tasks")}
                </span>
              </div>
              <div
                className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor:
                    member.performance === "EXCELLENT"
                      ? "#ecfdf5"
                      : member.performance === "GOOD"
                      ? "#fff7ed"
                      : member.performance === "MEDIUM"
                      ? "#fefce8"
                      : member.performance === "POOR"
                      ? "#fef2f2"
                      : "#f9fafb",
                  color:
                    member.performance === "EXCELLENT"
                      ? "#047857"
                      : member.performance === "GOOD"
                      ? "#c2410c"
                      : member.performance === "MEDIUM"
                      ? "#a16207"
                      : member.performance === "POOR"
                      ? "#b91c1c"
                      : "#374151",
                }}
              >
                {getPerformanceLabel(member.performance)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {member.profile_picture_file ? (
                  <img
                    src={member.profile_picture_file}
                    alt={`${member.first_name} ${member.last_name}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-medium">
                    {getInitials(
                      member.first_name,
                      member.last_name,
                      member.email
                    )}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {member.first_name} {member.last_name}
                </h3>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1.5">
                {t("teams.dashboards")}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex -space-x-2">
                  {member.dashboards.slice(0, 3).map((dashboard, index) => {
                    const initial = dashboard.name.charAt(0).toUpperCase();
                    let bgColor = "";

                    if (initial === "R") bgColor = "bg-red-500";
                    else if (initial === "P") bgColor = "bg-yellow-500";
                    else if (initial === "C") bgColor = "bg-yellow-300";
                    else if (initial === "T") bgColor = "bg-teal-500";
                    else
                      bgColor = `bg-purple-${((index + 1) * 100) % 900 || 500}`;

                    return (
                      <div
                        key={dashboard.id}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${bgColor}`}
                        title={dashboard.name}
                      >
                        {initial}
                      </div>
                    );
                  })}
                  {member.dashboards.length > 3 && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-800">
                      +{member.dashboards.length - 3}
                    </div>
                  )}
                  {member.dashboards.length === 0 && (
                    <span className="text-sm text-gray-500 italic">
                      {t("teams.no_dashboards")}
                    </span>
                  )}
                </div>
                <div className="text-right text-sm text-gray-600">
                  {member.completed_cards} / {member.total_cards}{" "}
                  {t("teams.completed_tasks")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Pagination
          pages={calculateTotalPages()}
          currentPage={memberCurrentPage}
          onPageChange={setMemberPage}
          rangeLimit={5}
        />
      </div>
    </div>
  );
};

export default TeamDetails;
