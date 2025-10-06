import { CardActivity } from "./getNotifications";
import { createGenericStore } from "../genericStore";

export const useNotificationStore = createGenericStore<CardActivity>();

// Export des fonctions utilitaires spécifiques aux notifications
export const useNotifications = () => {
  const store = useNotificationStore();

  return {
    ...store,
    notifications: store.data,
    fetchNotifications: (page?: number, pageSize?: number) =>
      store.fetchData("card-activity", page, pageSize),
    fetchNotificationsByCardId: (
      cardId: string,
      page?: number,
      pageSize?: number
    ) => store.fetchData("card-activity", page, pageSize, { card: cardId }),
    fetchNotificationsByUserId: (
      userId: string,
      page?: number,
      pageSize?: number
    ) => store.fetchData("card-activity", page, pageSize, { user: userId }),
    createNotification: (data: Partial<CardActivity>) =>
      store.createItem("card-activity", data),
  };
};
