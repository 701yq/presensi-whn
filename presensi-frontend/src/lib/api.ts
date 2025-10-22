// src/lib/api.ts
import axios, { AxiosHeaders } from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: new AxiosHeaders({
    Accept: "application/json",
    "Content-Type": "application/json",
  }),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt_token");
  if (token) {
    // Gunakan set() dari AxiosHeaders
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  }
  return config;
});

export { api };
