import React, { useState } from 'react';

function PanelDeControl({ onNavigate }) {
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

  return (
    <>
      {/* Botón móvil */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-700 text-white p-3 rounded-md shadow-md"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        ☰
      </button>

      {/* Overlay móvil */}
      {menuAbierto && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* Panel de Control */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40
        w-72 bg-gray-200 text-gray-800 border-r border-gray-300
        transform transition-transform duration-300 ease-in-out
        ${menuAbierto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-screen
      `}>
        {/* Logo y Título */}
        <div className="p-5 border-b border-gray-500">
          <div className="flex items-center justify-center mb-3">
            <img
              src="/img/institutolearning.png"
              alt="Logo Wenglish"
              className="h-14 w-auto object-contain"
            />
          </div>
          <h1 className="text-lg font-semibold text-center tracking-wide">Wenglish</h1>
        </div>

        {/* Menú Principal */}
        <nav className="flex-1 px-5 py-6 space-y-3 overflow-y-auto text-sm font-medium">
  {/* Inicio */}
  <button
    onClick={() => seleccionarOpcion('inicio')}
    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
  >
    Inicio
  </button>

  {/* Prácticas */}
  <button
    onClick={() => seleccionarOpcion('practicas')}
    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
  >
    Prácticas
  </button>

  {/* Calificaciones */}
  <button
    onClick={() => seleccionarOpcion('calificaciones')}
    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
  >
    Calificaciones
  </button>

</nav>

        {/* Footer */}
        <div className="p-5 border-t border-gray-500">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors font-semibold mb-3">
            ← Cerrar Sesión
          </button>
          <p className="text-center text-gray-500 text-xs">
            2025 Nnes Learning Center C.A
          </p>
        </div>
      </aside>
    </>
  );
}

export default PanelDeControl;