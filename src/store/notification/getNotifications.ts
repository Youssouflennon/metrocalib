import config from "../../config/config.dev";
import axios from "axios";

export interface CardActivity {
  id: string;
  card: string;
  activity: string;
  created_at: string;
  updated_at: string;
  member: {
    id: string;
    is_active: boolean;
    email: string;
    first_name: string | null;
    last_name: string | null;
    gender: string;
    phone_number: string | null;
    profile_picture_file: string | null;
    register_number: string | null;
  };
}

export interface CardActivityResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CardActivity[];
}

const getAuthToken = () => {
  const savedState = JSON.parse(
    localStorage.getItem("Task-Manager-auth-data") || "{}"
  );
  return savedState.accessToken;
};

export const getCardActivities = async (
  page: number = 1,
  pageSize: number = 10
): Promise<CardActivityResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(`${config.mintClient}card-activity/`, {
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
      "Erreur lors de la récupération des activités des cartes:",
      error
    );
    throw error;
  }
};

export const getCardActivitiesByCardId = async (
  cardId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<CardActivityResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(`${config.mintClient}card-activity/`, {
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
      `Erreur lors de la récupération des activités de la carte ${cardId}:`,
      error
    );
    throw error;
  }
};

export const getCardActivitiesByUserId = async (
  userId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<CardActivityResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(`${config.mintClient}card-activity/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        user: userId,
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des activités de l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
};

export const createCardActivity = async (
  cardId: string,
  action: string,
  description: string
): Promise<CardActivity> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.post(
      `${config.mintClient}card-activity/`,
      {
        card: cardId,
        action,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création d'une activité:", error);
    throw error;
  }
};
