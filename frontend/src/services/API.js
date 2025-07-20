import axios from "axios";

const API = axios.create({
  baseURL: "https://smartnotes-r3ac.onrender.com/api", // backend base URL
});

// For attaching token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
