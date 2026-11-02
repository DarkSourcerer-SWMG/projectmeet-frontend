// Backend base URL. Override locally with VITE_BACKEND_URL in .env.development.local.
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ?? "https://projectmeet-backend.onrender.com";
