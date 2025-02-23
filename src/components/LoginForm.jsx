import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import BackButton from "./BackButton";

const socket = io("https://servidorfingerprinter.onrender.com", {
  transports: ["websocket"],
  reconnection: true,
});

export default function LoginForm({ onLoginSuccess }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Cliente conectado a WebSockets");
    });

    socket.on("fingerprint-verified", (data) => {
      console.log("📥 Respuesta del servidor:", data);
      setMessage(data.message);
      setLoading(false);

      if (data.message === "Acceso permitido") {
        const userData = { id: data.id, name: data.name };
        onLoginSuccess(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Error en la conexión WebSocket:", error);
      setLoading(false);
      setMessage("❌ Error en la conexión con el servidor.");
    });

    return () => {
      socket.off("fingerprint-verified");
      socket.off("connect_error");
    };
  }, [onLoginSuccess, navigate]);

  const handleVerify = () => {
    setLoading(true);
    setMessage("Esperando verificación...");
    console.log("📤 Enviando señal de verificación al ESP32...");

    socket.emit("start-verify"); // 🔹 Enviar evento WebSocket al ESP32
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-md text-center">
        <BackButton />
        <h2 className="text-2xl font-semibold mb-4">Verificación de Huella Digital</h2>
        <button 
          onClick={handleVerify} 
          className={`px-4 py-2 rounded-md text-white ${loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"} transition`}
          disabled={loading}
        >
          {loading ? "Verificando..." : "Verificar Huella"}
        </button>
        <p className="mt-4 text-lg font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
}
