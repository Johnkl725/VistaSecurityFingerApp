import axios from "axios";

export const createApiClient = (esp32Ip) => axios.create({
  baseURL: `http://${esp32Ip}`,
  headers: { "Content-Type": "application/json" },
});
