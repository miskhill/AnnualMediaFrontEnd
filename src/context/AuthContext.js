import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const TOKEN_STORAGE_KEY = "am_token";
const USER_STORAGE_KEY = "am_user";
const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://annualmediaserver.onrender.com";

const AuthContext = createContext(null);

const readStoredToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

const readStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.warn("Unable to parse stored user", err);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => readStoredToken());
  const [user, setUser] = useState(() => readStoredUser());
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

  const persist = useCallback((nextToken, nextUser) => {
    if (typeof window !== "undefined") {
      if (nextToken) {
        localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }

      if (nextUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (email, password) => {
      setIsAuthenticating(true);
      try {
        const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email,
          password,
        });

        persist(data.token, data.user);
        return data.user;
      } catch (error) {
        console.error("Login request failed", error);
        let message = error.response?.data?.message || "Unable to login";

        if (error.code === "ERR_NETWORK") {
          message =
            "Unable to reach the server. It might be waking up—please try again in a few seconds.";
        }

        throw new Error(message);
      } finally {
        setIsAuthenticating(false);
      }
    },
    [persist]
  );

  const logout = useCallback(() => {
    persist(null, null);
  }, [persist]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isAuthenticating,
      hasHydrated,
      login,
      logout,
    }),
    [user, token, isAuthenticating, hasHydrated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
