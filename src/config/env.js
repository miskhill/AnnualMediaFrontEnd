const LOCAL_API_BASE_URL = "http://localhost:4000";
const PROD_API_BASE_URL = "https://annualmediaserver.onrender.com";

const trimTrailingSlash = (value) => value?.replace(/\/+$/, "");

export const apiBaseUrl =
  trimTrailingSlash(import.meta.env.VITE_API_BASE_URL) ||
  (import.meta.env.DEV ? LOCAL_API_BASE_URL : PROD_API_BASE_URL);

export const apiUrl = `${apiBaseUrl}/api`;

export const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY ?? "";
