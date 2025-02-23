import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import BackButton from "./BackButton";

// Configuración del socket
const socket = io("https://servidorfingerprinter.onrender.com", {
  reconnection: true,           // Intentar reconectar automáticamente si falla
  reconnectionAttempts: 5,      // Número máximo de intentos de reconexión
  reconnectionDelay: 1000,      // Retraso entre intentos (en milisegundos)
});

export default function LoginForm({ onLoginSuccess }) {
  const [message, setMessage] = useState("");           // Mensaje para mostrar al usuario
  const [userData, setUserData] = useState(null);       // Datos del usuario autenticado
  const [loading, setLoading] = useState(true);         // Estado de carga
  const navigate = useNavigate();

  useEffect(() => {
    // Evento de conexión exitosa
    socket.on("connect", () => {
      console.log("Cliente conectado con éxito a WebSockets");
      setMessage("Conexión establecida, esperando verificación...");
      setLoading(false);
    });

    // Evento de verificación de huella digital
    socket.on("fingerprint-verified", (data) => {
      setMessage(data.message);
      if (data.message === "Acceso permitido") {
        const userData = { id: data.id, name: data.name };
        setUserData(userData);
        onLoginSuccess(userData);                     // Notificar al componente padre
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/dashboard");                        // Redirigir al dashboard
      }
      setLoading(false);
    });

    // Evento de error de conexión
    socket.on("connect_error", (error) => {
      console.error("Error de conexión detallado:", error.message);
      setMessage("Error al conectar con el servidor. Intenta de nuevo más tarde.");
      setLoading(false);
    });

    // Evento de desconexión
    socket.on("disconnect", (reason) => {
      console.log("Desconectado del servidor:", reason);
      setMessage("Conexión perdida con el servidor.");
      setLoading(false);
    });

    // Limpieza de eventos al desmontar el componente
    return () => {
      socket.off("connect");
      socket.off("fingerprint-verified");
      socket.off("connect_error");
      socket.off("disconnect");
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
              <p
                className={`mt-4 font-medium ${
                  message === "Acceso permitido" ? "text-green-500" : "text-red-500"
                }`}
              >
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