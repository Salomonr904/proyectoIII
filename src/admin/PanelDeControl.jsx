import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

function PanelDeControl({ onNavigate }) {
  const navigate = useNavigate();
  const [submenuActivo, setSubmenuActivo] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleSubmenu = (nombre) => {
    setSubmenuActivo(submenuActivo === nombre ? null : nombre);
  };

  const seleccionarOpcion = (vista) => {
    onNavigate(vista);
    setSubmenuActivo(null);
    setMenuAbierto(false);
  };

  async function logout() {

    const res = await fetch('http://localhost:6500/api/logout', {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include'
    });

    const response = await res.json();

    if (!response.ok) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      navigate('/login-admin');
      return;
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login-admin');
  }

  return (
    <>
      {/* Botón móvil */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-400 text-white p-3 rounded-lg shadow-lg"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        ☰
      </button>

      {/* Overlay móvil */}
      {menuAbierto && (
        <div 
          className="lg:hidden fixed inset-0 bg-opacity-50 z-40"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* Panel de Control */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40
        w-80 bg-gradient-to-b from-gray-300 to-gray-300 text-gray-900
        transform transition-transform duration-300 ease-in-out
        ${menuAbierto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-screen
      `}>
        
        {/* Logo y Título */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/img/institutolearning.png" 
              alt="Logo Wenglish" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-500">PANEL DE CONTROL</h1>
        </div>

        {/* Menú Principal */}
        <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
          
          {/* Nuevo Usuario */}
          <div className="mb-4">
            <button 
              onClick={() => toggleSubmenu('usuario')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <span className="font-semibold">Nuevo Usuario</span>
              <span className={`transform transition-transform ${submenuActivo === 'usuario' ? 'rotate-180' : ''}`}>
              </span>
            </button>
            {submenuActivo === 'usuario' && (
              <div className="mt-2 ml-4 space-y-1">
                <button 
                  onClick={() => seleccionarOpcion('estudiante')}
                  className="w-full text-left p-2 rounded transition-colors hover:border-b-2 hover:border-gray-400"
                >
                  Estudiante
                </button>
                <button 
                  onClick={() => seleccionarOpcion('profesor')}
                  className="w-full text-left p-2 rounded transition-colors hover:border-b-2 hover:border-gray-400"
                >
                  Profesor
                </button>
                <button 
                  onClick={() => seleccionarOpcion('empleado')}
                  className="w-full text-left p-2 rounded transition-colors hover:border-b-2 hover:border-gray-400"
                >
                  Empleado
                </button>
              </div>
            )}
          </div>

          {/* Consultar */}
          <button 
            onClick={() => seleccionarOpcion('consultar')}
            className="w-full text-left p-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
          >
            Consultar
          </button>

          {/* Cargar */}
          <div className="mb-4">
            <button 
              onClick={() => toggleSubmenu('cargar')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <span className="font-semibold">Cargar</span>
              <span className={`transform transition-transform ${submenuActivo === 'cargar' ? 'rotate-180' : ''}`}>
              </span>
            </button>
            {submenuActivo === 'cargar' && (
              <div className="mt-2 ml-4 space-y-1">
                <button 
                  onClick={() => seleccionarOpcion('cargar-nota')}
                  className="w-full text-left p-2 rounded transition-colors hover:border-b-2 hover:border-gray-400"
                >
                  Notas
                </button>
                <button 
                  onClick={() => seleccionarOpcion('cargar-material')}
                  className="w-full text-left p-2 rounded transition-colors hover:border-b-2 hover:border-gray-400"
                >
                  Material
                </button>
              </div>
            )}
          </div>

          {/* Crear */}
          <div className="mb-4">
            <button 
              onClick={() => toggleSubmenu('crear')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <span className="font-semibold">Crear</span>
              <span className={`transform transition-transform ${submenuActivo === 'crear' ? 'rotate-180' : ''}`}>
             </span>
            </button>
            {submenuActivo === 'crear' && (
              <div className="mt-2 ml-4 space-y-1">
                <button 
                  onClick={() => seleccionarOpcion('nuevo-nivel')}
                  className="w-full text-left p-2 rounded transition-colors hover:border-b-2 hover:border-gray-400"
                >
                  Nuevo Nivel
                </button>
             
                <button 
                  onClick={() => seleccionarOpcion('nueva-sucursal')}
                  className="w-full text-left p-2 rounded transition-colors hover:border-b-2 hover:border-gray-400"
                >
                  Nueva Sucursal
                </button>
                <button 
                  onClick={() => seleccionarOpcion('nueva-evaluacion')}
                  className="w-full text-left p-2 rounded transition-colors hover:border-b-2 hover:border-gray-400"
                >
                  Nueva Evaluación
                </button>
                <button 
                  onClick={() => seleccionarOpcion('nuevo-pago')}
                  className="w-full text-left p-2 rounded transition-colors hover:border-b-2 hover:border-gray-400"
                >
                  Nuevo Pago
                </button>
              </div>
            )}
          </div>

          {/* Gestionar */}
          <div className="mb-4">
            <button 
              onClick={() => toggleSubmenu('gestion')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <span className="font-semibold">Gestionar</span>
              <span className={`transform transition-transform ${submenuActivo === 'gestion' ? 'rotate-180' : ''}`}>
              </span>
            </button>
            {submenuActivo === 'gestion' && (
              <div className="mt-2 ml-4 space-y-1">
                <button 
                  onClick={() => seleccionarOpcion('gestionar-usuarios')}
                  className="w-full text-left p-2 rounded transition-colors hover:border-b-2 hover:border-gray-400"
                >
                  Usuarios
                </button>
                <button 
                  onClick={() => seleccionarOpcion('gestionar-cuotas')}
                  className="w-full text-left p-2 rounded transition-colors hover:border-b-2 hover:border-gray-400"
                >
                  Cuotas
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 p-3 rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors font-semibold mb-4">
            <span>←</span>
            Cerrar Sesión
          </button>
          <p className="text-center text-gray-800 text-sm">
            2025 Nnes Learning Center C.A
          </p>
        </div>
      </aside>
    </>
  );
}

export default PanelDeControl;