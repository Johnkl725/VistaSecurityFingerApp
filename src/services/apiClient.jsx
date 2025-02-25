import axios from "axios";

export const createApiClient = (esp32Ip) => {
  if (!esp32Ip) {
    console.error("❌ ESP32 IP no encontrada, no se puede conectar al API.");
    return null;
  }

  return axios.create({
    baseURL: `http://${esp32Ip}`,
    headers: { "Content-Type": "application/json" },
  });
};
