import { CardMember } from "./getCardMembers";
import axios from "axios";
import config from "../../config/config.dev";
import { createGenericStore } from "../genericStore";

interface User {
  user_code: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_file: string;
  is_active: boolean;
  permissions: string[];
}

interface Card {
  id: string;
  title: string;
}

interface ExtendedCardMember extends CardMember {
  userDetails?: User;
  cardDetails?: Card;
}

const getAuthToken = () => {
  const savedState = JSON.parse(
    localStorage.getItem("Task-Manager-auth-data") || "{}"
  );
  return savedState.accessToken;
};

const fetchUserDetails = async (userId: string): Promise<User | undefined> => {
  const token = getAuthToken();
  if (!token) throw new Error("User is not authenticated");

  try {
    const response = await axios.get(`${config.mintClient}users/${userId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching user details for ${userId}:`, error);
    return undefined;
  }
};

const fetchCardDetails = async (cardId: string): Promise<Card | undefined> => {
  const token = getAuthToken();
  if (!token) throw new Error("User is not authenticated");

  try {
    const response = await axios.get(`${config.mintClient}cards/${cardId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching card details for ${cardId}:`, error);
    return undefined;
  }
};

const baseStore = createGenericStore<ExtendedCardMember>();

export const useCardMembers = () => {
  const store = baseStore();

  const fetchMembersWithDetails = async (page?: number, pageSize?: number) => {
    try {
      const response = await store.fetchData("card-members", page, pageSize);
      const currentData = response.results;
      const currentCount = response.count;

      if (!currentData || currentData.length === 0) {
        return;
      }

      const membersWithDetails = await Promise.all(
        currentData.map(async (member: CardMember) => {
          if (!member.member || !member.card) {
            return { ...member };
          }

          try {
            const [userDetails, cardDetails] = await Promise.all([
              fetchUserDetails(member.member),
              fetchCardDetails(member.card),
            ]);

            return {
              ...member,
              userDetails,
              cardDetails,
            };
          } catch (error) {
            console.error(
              `Error fetching details for member ${member.id}:`,
              error
            );
            return { ...member };
          }
        })
      );

      store.setData(membersWithDetails);
      store.count = currentCount;
    } catch (error) {
      console.error("Error fetching members with details:", error);
      store.setData([]);
    }
  };

  return {
    ...store,
    data: store.data || [],
    count: store.count,
    currentPage: store.currentPage,
    pageSize: store.pageSize,
    fetchMembers: fetchMembersWithDetails,
    addMember: (data: Partial<CardMember>) =>
      store.createItem("card-members", data),
    updateMember: (id: string, data: Partial<CardMember>) =>
      store.updateItem("card-members", id, data),
    removeMember: (id: string) => store.deleteItem("card-members", id),
  };
};
