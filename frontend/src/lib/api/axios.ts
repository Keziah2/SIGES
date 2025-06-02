import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // à adapter selon ton environnement
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajout du token automatiquement si présent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
