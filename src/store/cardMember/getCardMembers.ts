import config from "../../config/config.dev";
import axios from "axios";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_picture_file: string | null;
  is_active: boolean;
  user_code: string;
  register_number: string;
  gender: string;
  user_permissions: string[];
  groups: string[];
  permissions: string[];
}

export interface Card {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_to: string;
  board: string;
}

export interface CardMember {
  id: string;
  card: string; 
  member: string; 
  created_at: string;
  updated_at: string;
}

export interface CardMemberResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CardMember[];
}

const getAuthToken = () => {
  const savedState = JSON.parse(
    localStorage.getItem("Task-Manager-auth-data") || "{}"
  );
  return savedState.accessToken;
};

export const getUserDetails = async (userId: string): Promise<User> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(`${config.mintClient}users/${userId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des détails de l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
};

export const getCardDetails = async (cardId: string): Promise<Card> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(`${config.mintClient}cards/${cardId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des détails de la carte ${cardId}:`,
      error
    );
    throw error;
  }
};

export const getCardMembers = async (
  page: number = 1,
  pageSize: number = 10
): Promise<CardMemberResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(`${config.mintClient}card-members/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des membres des cartes:",
      error
    );
    throw error;
  }
};

export const getCardMembersByCardId = async (
  cardId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<CardMemberResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(`${config.mintClient}card-members/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        card: cardId,
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des membres de la carte ${cardId}:`,
      error
    );
    throw error;
  }
};

export const addCardMember = async (
  cardId: string,
  memberId: string
): Promise<CardMember> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.post(
      `${config.mintClient}card-members/`,
      {
        card: cardId,
        member: memberId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un membre à la carte:", error);
    throw error;
  }
};

export const removeCardMember = async (memberId: string): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    await axios.delete(`${config.mintClient}card-members/${memberId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(
      "Erreur lors de la suppression d'un membre de la carte:",
      error
    );
    throw error;
  }
};

export const updateCardMemberRole = async (
  memberId: string,
  role: string
): Promise<CardMember> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.patch(
      `${config.mintClient}card-members/${memberId}/`,
      {
        role: role,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rôle d'un membre:", error);
    throw error;
  }
};
