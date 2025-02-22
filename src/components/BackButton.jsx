import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="bg-blue-500 text-white p-2 rounded-md mb-4"
    >
      Regresar al Home
    </button>
  );
}
