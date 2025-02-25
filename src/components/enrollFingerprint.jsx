import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import BackButton from "./BackButton";

const socket = io("https://servidorfingerprinter.onrender.com", {
  transports: ["websocket"],
  reconnection: true,
});

export default function EnrollFingerprint({ esp32Ip }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fingerId, setFingerId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("fingerprint-registered", (data) => {
      console.log("📥 Respuesta del servidor:", data);
      setMessage(data.message);
      setLoading(false);

      if (data.message === "Huella registrada con éxito") {
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    });

    return () => socket.off("fingerprint-registered");
  }, [navigate]);

  const handleRegister = () => {
    if (!fingerId || isNaN(fingerId) || fingerId < 1 || fingerId > 127) {
      setMessage("❌ Ingresa un ID válido (1-127)");
      return;
    }

    setLoading(true);
    setMessage("📤 Enviando solicitud al ESP32...");
    console.log(`📤 Enrolando huella con ID: ${fingerId} en ESP32 con IP: ${esp32Ip}`);

    socket.emit("enroll_id_" + fingerId); // 🔹 Enviar evento WebSocket con el ID al ESP32
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-md text-center">
        <BackButton />
        <h2 className="text-2xl font-semibold mb-4">Registrar Huella Digital</h2>

        {/* 📌 Input para ID de la huella */}
        <input
          type="number"
          min="1"
          max="127"
          className="p-2 border rounded w-full mb-4 text-black"
          placeholder="Ingrese ID (1-127)"
          value={fingerId}
          onChange={(e) => setFingerId(e.target.value)}
          disabled={loading}
        />

        {/* 📌 Botón de Enrolamiento */}
        <button
          onClick={handleRegister}
          className={`px-4 py-2 rounded-md text-white ${loading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"} transition`}
          disabled={loading}
        >
          {loading ? "Registrando..." : "Enrolar Huella"}
        </button>

        <p className="mt-4 text-lg font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
}
