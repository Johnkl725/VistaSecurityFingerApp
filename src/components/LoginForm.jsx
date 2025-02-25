import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("https://servidorfingerprinter.onrender.com", {
  transports: ["websocket"],
  reconnection: true,
});

export default function LoginForm({ onLoginSuccess, esp32Ip }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("fingerprint-verified", (data) => {
      setMessage(data.message);
      setLoading(false);
      if (data.message === "Acceso permitido") {
        const userData = { id: data.id, name: data.name };
        onLoginSuccess(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/dashboard");
      }
    });

    return () => socket.off("fingerprint-verified");
  }, [navigate]);

  const handleVerify = () => {
    setLoading(true);
    console.log("🔍 Verificando huella en ESP32 con IP:", esp32Ip);
    socket.emit("start-verify"); // 📤 Enviar al servidor intermedio
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Verificación de Huella</h2>
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
