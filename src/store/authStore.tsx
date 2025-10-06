import config from "src/config/config.dev";
import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

interface User {
  id: string;
  is_active: boolean;
  email: string;
  phone_number: string | null;
  first_name: string | null;
  last_name: string | null;
  register_number: string | null;
  gender: string;
  user_code: string;
  profile_picture_file: string | null;
  user_permissions: string[];
  groups: string[];
  permissions: string[];
}

interface AuthData {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  isAuthenticated: boolean;
}

interface AuthState extends AuthData {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

// Fonction pour sauvegarder les données d'authentification
const saveAuthData = (data: Partial<AuthData>) => {
  try {
    const authData = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
      isAuthenticated: data.isAuthenticated,
    };
    localStorage.setItem("Task-Manager-auth-data", JSON.stringify(authData));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde dans le localStorage:", error);
  }
};

// Fonction pour récupérer les données d'authentification
const getAuthData = (): AuthData => {
  try {
    const data = localStorage.getItem("Task-Manager-auth-data");
    if (data) {
      return JSON.parse(data);
    }
    return {
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération depuis le localStorage:",
      error
    );
    return {
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    };
  }
};

// Création d'un storage personnalisé
const customStorage: StateStorage = {
  getItem: (name): string | null => {
    try {
      const data = getAuthData();
      return JSON.stringify({
        state: data,
      });
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      const parsed = JSON.parse(value);
      saveAuthData(parsed.state);
    } catch (err) {
      console.error("Error saving to storage:", err);
    }
  },
  removeItem: (name) => {
    localStorage.removeItem("Task-Manager-auth-data");
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const storedData = getAuthData();
      return {
        ...storedData,
        refreshAccessToken: async () => {
          try {
            const refreshToken = get().refreshToken;
            if (!refreshToken) {
              throw new Error("Pas de token de rafraîchissement disponible");
            }

            const response = await fetch(
              `${config.mintClient}auth/token/refresh/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({ refresh: refreshToken }),
              }
            );

            if (!response.ok) {
              throw new Error("Échec du rafraîchissement du token");
            }

            const data = await response.json();
            if (data.access) {
              const currentState = get();
              const newState = {
                ...currentState,
                accessToken: data.access,
              };
              set(newState);
              saveAuthData(newState);
            }
          } catch (error) {
            console.error("Erreur lors du rafraîchissement du token:", error);
            get().logout();
          }
        },

        login: async (email: string, password: string) => {
          try {
            const response = await fetch(`${config.mintClient}auth/token/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(
                errorData.detail || "Échec de l'authentification"
              );
            }

            const data = await response.json();

            if (!data.access || !data.refresh) {
              throw new Error("Tokens non reçus dans la réponse");
            }

            // Récupérer les informations de l'utilisateur
            const userResponse = await fetch(`${config.mintClient}users/me`, {
              headers: {
                Authorization: `Bearer ${data.access}`,
                Accept: "application/json",
              },
            });

            if (userResponse.ok) {
              const userData = await userResponse.json();

              // Créer le nouveau state avec toutes les données
              const newState = {
                accessToken: data.access,
                refreshToken: data.refresh,
                user: userData,
                isAuthenticated: true,
              };

              console.log("Nouveau state avant sauvegarde:", newState);

              // Mettre à jour le state et sauvegarder
              set(newState);
              saveAuthData(newState);

              // Vérifier que les données ont été correctement sauvegardées
              const savedData = getAuthData();
              console.log("Données sauvegardées dans localStorage:", savedData);

              // Vérifier que le state a été mis à jour
              const currentState = get();
              console.log("State actuel après mise à jour:", currentState);
            } else {
              throw new Error(
                "Impossible de récupérer les informations de l'utilisateur"
              );
            }
          } catch (error) {
            console.error("Erreur d'authentification:", error);
            throw error;
          }
        },

        logout: () => {
          const emptyState = {
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
          };
          set(emptyState);
          saveAuthData(emptyState);
          localStorage.removeItem("Task-Manager-auth-data");
        },
      };
    },
    {
      name: "auth-storage",
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
