import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { useEsp32 } from "./hooks/useEsp32";  // ✅ Importamos el hook aquí
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";
import EnrollFingerprint from "./components/enrollFingerprint";
import DeleteFingerprint from "./components/DeleteFingerprint";
import Home from "./components/Home"; 

export default function App() {
  const [user, setUser] = useState(null);
  const { esp32Ip } = useEsp32(); // ✅ Se ejecuta en toda la app

  // Guardar el usuario autenticado en localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} esp32Ip={esp32Ip} />} />
        <Route path="/register" element={<EnrollFingerprint esp32Ip={esp32Ip} />} />
        <Route path="/delete" element={<DeleteFingerprint esp32Ip={esp32Ip} />} />
        <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} esp32Ip={esp32Ip} />} />
      </Routes>
    </Router>
  );
}
