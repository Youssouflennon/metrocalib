import { CardMember } from "src/store/cardMember/getCardMembers";

export interface Notifications {
  id: string;
  icon: string;
  title: string;
  message: string;
  time: string;
  username: string;
  isRead: boolean;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
}

export interface Workspace {
  id: string;
  name: string;
  dashboards: Dashboard[];
}

export interface MemberWorkspaces {
  [memberId: string]: Workspace[];
}
