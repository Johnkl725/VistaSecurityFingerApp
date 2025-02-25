import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useEsp32 } from "../hooks/useEsp32";
import BackButton from "./BackButton";

export default function LoginForm({ onLoginSuccess }) {
  const { esp32Ip } = useEsp32();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!esp32Ip) return;

    const newSocket = io(`http://${esp32Ip}:81`, { transports: ["websocket"], reconnection: true });
    setSocket(newSocket);

    newSocket.on("connect", () => console.log("✅ WebSocket conectado"));
    newSocket.on("fingerprint-verified", (data) => {
      setMessage(data.message);
      setLoading(false);
      if (data.message === "Acceso permitido") {
        onLoginSuccess({ id: data.id, name: data.name });
        localStorage.setItem("user", JSON.stringify({ id: data.id, name: data.name }));
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    });

    return () => newSocket.disconnect();
  }, [esp32Ip, onLoginSuccess, navigate]);

  const handleVerify = () => {
    if (!socket) return alert("Esperando conexión con ESP32...");
    setLoading(true);
    setMessage("Esperando verificación...");
    socket.emit("start-verify");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <BackButton />
        <h2 className="text-2xl font-semibold">Verificación de Huella Digital</h2>
        <button onClick={handleVerify} disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          {loading ? "Verificando..." : "Verificar Huella"}
        </button>
        <p className="mt-4">{message}</p>
      </div>
    </div>
  );
}
