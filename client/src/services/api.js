import axios from "axios";

const normalizeBaseUrl = (value) => {
  const rawValue = (value || "").trim();

  if (!rawValue) {
    return "/api";
  }

  const trimmed = rawValue.endsWith("/") ? rawValue.slice(0, -1) : rawValue;

  if (trimmed === "/api" || trimmed.endsWith("/api")) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const pathname = url.pathname.replace(/\/+$/, "");

      if (!pathname || pathname === "/") {
        url.pathname = "/api";
        return url.toString().replace(/\/$/, "");
      }
    } catch {
      // Fall through to the trimmed value when URL parsing fails.
    }
  }

  return trimmed;
};

const extractApiErrorMessage = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.message || fallback;

const API = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_URL || "/api"),
  withCredentials: true,
  timeout: 15000,
});

export { extractApiErrorMessage };
export default API;