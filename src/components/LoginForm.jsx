import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import BackButton from "./BackButton"; // Importamos el botón

const socket = io("https://servidorfingerprinter.onrender.com", {
  transports: ["websocket"],
  reconnection: true,
});

export default function LoginForm({ onLoginSuccess }) {
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Cliente conectado con éxito a WebSockets");
    });

    socket.on("fingerprint-verified", (data) => {
      setMessage(data.message);
      if (data.message === "Acceso permitido") {
        const userData = { id: data.id, name: data.name };
        onLoginSuccess(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/dashboard");
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    socket.on("connect_error", (err) => {
      setLoading(false);
      setMessage("Error en la conexión al servidor.");
    });

    return () => {
      socket.off("fingerprint-verified");
      socket.off("connect_error");
    };
  }, [onLoginSuccess, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-md text-center">
        <BackButton />
        {!userData ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Verificación de Huella Digital</h2>
            {loading ? (
              <p className="text-gray-500 animate-pulse">Esperando datos del servidor...</p>
            ) : (
              <p className={`mt-4 font-medium ${message === "Acceso permitido" ? "text-green-500" : "text-red-500"}`}>
                {message}
              </p>
            )}
          </>
        ) : (
          <p>Redirigiendo...</p>
        )}
      </div>
    </div>
  );
}
