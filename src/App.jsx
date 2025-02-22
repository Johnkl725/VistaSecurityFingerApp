import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";
import RegisterFingerprint from "./components/RegisterFingerprint";
import DeleteFingerprint from "./components/DeleteFingerprint";
import Home from "./components/Home"; // Asegúrate de tener un componente Home

export default function App() {
  const [user, setUser] = useState(null);

  // Verificar si hay un usuario autenticado al cargar la página
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Si hay un usuario en localStorage, se establece el estado
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData); // Establecer el estado de usuario
    localStorage.setItem("user", JSON.stringify(userData)); // Almacenar en localStorage
  };

  const handleLogout = () => {
    setUser(null); // Limpiar el estado del usuario
    localStorage.removeItem("user"); // Eliminar el usuario de localStorage
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<RegisterFingerprint />} />
        <Route path="/delete" element={<DeleteFingerprint />} />
        <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}
