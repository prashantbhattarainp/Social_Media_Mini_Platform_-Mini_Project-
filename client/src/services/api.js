import axios from "axios";

const normalizeBaseUrl = (value) => {
  const rawValue = (value || "").trim();

  if (!rawValue) {
    return "http://localhost:5000/api";
  }

  const trimmed = rawValue.replace(/\/+$/, "");

  if (/\/api$/i.test(trimmed)) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return `${trimmed}/api`;
  }

  return "http://localhost:5000/api";
};

const extractApiErrorMessage = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.message || fallback;

const apiBaseUrl = normalizeBaseUrl(
  import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_URL
);

const API = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  timeout: 15000,
});

export { extractApiErrorMessage };
export default API;