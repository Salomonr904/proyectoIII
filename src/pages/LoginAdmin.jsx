import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías validar usuario/contraseña si lo deseas
    navigate('/admin-panel');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: 'url(/img/fondolo.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay para mejorar la legibilidad */}
      <div className="absolute inset-0 bg-opacity-40"></div>
      
      <div className="max-w-md w-full bg-white rounded-tl-4xl rounded-br-4xl shadow-xl p-8 relative z-10">
        {/* Logo Section */}
        <div className="logo-section text-center mb-8">
          <img 
            src="/img/institutolearning.png" 
            alt="Logo Weglish" 
            className="mx-auto h-16 w-auto mb-4"
          />
          <p className="text-gray-600 text-sm"> Acceso exclusivo para administradores</p>
        </div>

        {/* Login Form */}
        <form className="login-form space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
            <input 
              type="text" 
              placeholder="Usuario" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-transparent outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-transparent outline-none transition-colors"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-950 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;