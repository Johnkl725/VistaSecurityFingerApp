import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export const useEsp32 = () => {
  const [esp32Ip, setEsp32Ip] = useState(localStorage.getItem("esp32Ip") || "");

  useEffect(() => {
    const socket = io(import.meta.env.VITE_WS_URL, { transports: ["websocket"] });

    socket.on("connect", () => console.log("✅ Conectado a WebSockets"));

    // Recibir la IP del ESP32 y almacenarla en localStorage para evitar problemas al recargar la página
    socket.on("esp32_ip", (data) => {
      console.log("🔍 IP detectada:", data.esp32_ip);
      setEsp32Ip(data.esp32_ip);
      localStorage.setItem("esp32Ip", data.esp32_ip);
    });

    socket.on("connect_error", () => console.error("❌ Error en WebSocket"));

    return () => socket.disconnect();
  }, []);

  return { esp32Ip };
};
