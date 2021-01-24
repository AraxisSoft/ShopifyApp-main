// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;
