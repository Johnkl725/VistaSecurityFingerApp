import { useState, useEffect } from "react";
import io from "socket.io-client";
import BackButton from "./BackButton"; // Importamos el botón

const socket = io("https://servidorfingerprinter.onrender.com", {
  transports: ["websocket"],
  reconnection: true,
});

export default function DeleteFingerprint() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on("fingerprint-deleted", (data) => {
      setMessage(data.message);
      setLoading(false);
    });

    return () => {
      socket.off("fingerprint-deleted");
    };
  }, []);

  const handleDelete = (id) => {
    setLoading(true);
    socket.emit("delete-fingerprint", { id });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-md text-center">
        <BackButton />
        <h2 className="text-2xl font-semibold mb-4">Borrar Huella Digital</h2>
        <input
          type="number"
          placeholder="ID de huella"
          onChange={(e) => setMessage(`¿Seguro que deseas borrar la huella ID ${e.target.value}?`)}
          className="border p-2 rounded-md w-full mb-4"
        />
        <button onClick={() => handleDelete()} className="bg-red-500 text-white p-2 rounded-md w-full">
          Borrar Huella
        </button>
        <p className="mt-4">{loading ? "Esperando huella..." : message}</p>
      </div>
    </div>
  );
}
