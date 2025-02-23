import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import BackButton from "./BackButton";

const socket = io("https://servidorfingerprinter.onrender.com", {
  reconnection: true, // Permitimos reconexión automática
  // transports: ["websocket"] // Comentado para que Socket.IO elija el transporte
});

export default function RegisterFingerprint() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Cliente conectado a WebSockets");
    });

    socket.on("fingerprint-registered", (data) => {
      console.log("📥 Respuesta del servidor:", data);
      setMessage(data.message);
      setLoading(false);

      if (data.message === "Huella registrada con éxito") {
        const userData = { id: data.id, name: data.name };
        setUserData(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Error de conexión detallado:", error);
      setLoading(false);
      setMessage("❌ Error en la conexión con el servidor.");
    });

    return () => {
      socket.off("fingerprint-registered");
      socket.off("connect_error");
    };
  }, [navigate]);

  const handleRegister = async () => {
    setLoading(true);
    setMessage("Esperando huella...");
    console.log("📤 Enviando solicitud de enrolamiento al servidor...");

    try {
      const response = await fetch("https://servidorfingerprinter.onrender.com/start-enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("📥 Respuesta del servidor:", data);
      setMessage(data.message);
    } catch (error) {
      console.error("❌ Error al comunicarse con el servidor:", error);
      setMessage("❌ Error al comunicarse con el servidor.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-md text-center">
        <BackButton />
        {!userData ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Registrar Huella Digital</h2>
            <button
              onClick={handleRegister}
              className={`px-4 py-2 rounded-md text-white ${
                loading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
              } transition`}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Enrolar Huella"}
            </button>
            <p className="mt-4 text-lg font-medium animate-pulse">{message}</p>
          </>
        ) : (
          <p className="text-green-500 font-medium">✅ Registro exitoso. Redirigiendo...</p>
        )}
      </div>
    </div>
  );
}