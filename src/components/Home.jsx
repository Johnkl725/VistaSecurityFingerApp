export default function Home() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Bienvenido</h2>
          <button
            onClick={() => window.location.href = '/login'} // Redirige a la página de login
            className="w-full bg-blue-500 text-white p-2 rounded-md mb-4"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => window.location.href = '/register'} // Redirige a la página de registro
            className="w-full bg-green-500 text-white p-2 rounded-md mb-4"
          >
            Registrar Huella
          </button>
          <button
            onClick={() => window.location.href = '/delete'} // Redirige a la página de borrar huella
            className="w-full bg-red-500 text-white p-2 rounded-md"
          >
            Borrar Huella
          </button>
        </div>
      </div>
    );
  }
  