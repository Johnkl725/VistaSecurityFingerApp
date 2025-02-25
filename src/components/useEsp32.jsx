import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const SERVER_URL = "https://servidorfingerprinter.onrender.com"; // 🖥 Reemplázalo con tu servidor

const socket = io(SERVER_URL, { transports: ["websocket"], reconnection: true });

export const useEsp32 = () => {
  const [esp32Ip, setEsp32Ip] = useState("");

  useEffect(() => {
    const fetchEsp32Ip = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/esp32-ip`);
        if (response.data.esp32_ip) {
          setEsp32Ip(response.data.esp32_ip);
          console.log("✅ IP del ESP32 obtenida:", response.data.esp32_ip);
        }
      } catch (error) {
        console.error("❌ Error obteniendo la IP del ESP32", error);
      }
    };

    // Obtener la IP al cargar
    fetchEsp32Ip();

    // Mantener actualizada la IP en tiempo real con WebSockets
    socket.on("esp32-ip", (data) => {
      console.log("📡 IP del ESP32 actualizada:", data.esp32_ip);
      setEsp32Ip(data.esp32_ip);
    });

    return () => {
      socket.off("esp32-ip");
    };
  }, []);

  return { esp32Ip };
};
