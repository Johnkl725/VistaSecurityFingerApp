import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem("user"); // Asegurar que el usuario se borre
    navigate("/login");
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <p className="text-lg font-semibold animate-pulse">Cargando...</p>
      </div>
    );

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-10 w-full max-w-lg text-center transform transition-all duration-300 hover:scale-105">
        {/* Encabezado */}
        <h1 className="text-4xl font-extrabold text-green-600 dark:text-green-400 mb-2">
          ¡Bienvenido!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Has iniciado sesión correctamente.
        </p>

        {/* Información del usuario */}
        <div className="mt-6 bg-gray-100 dark:bg-gray-700 p-5 rounded-xl shadow-md">
          <p className="text-lg font-medium text-gray-800 dark:text-white">
            <span className="font-semibold">ID:</span> {user.id}
          </p>
          <p className="text-lg font-medium text-gray-800 dark:text-white mt-2">
            <span className="font-semibold">Nombre:</span> {user.name}
          </p>
        </div>

        {/* Botón de logout */}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
