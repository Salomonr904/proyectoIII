import React, { useState, useEffect } from 'react';

function ConsultaUsuarios({ onVerUsuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [tipo, setTipo] = useState('todos');
  const [estado, setEstado] = useState('todos');
  const [fecha, setFecha] = useState('todos');
  const [nivel, setNivel] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  // 🔄 Cargar usuarios desde el backend (GET)
  useEffect(() => {
    // ⚠️ Reemplaza esta simulación por fetch real cuando tengas el backend:
    /*
    fetch('https://tu-backend.com/api/usuarios')
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error('Error al cargar usuarios:', err));
    */

    // 🧪 Simulación temporal
    const datosSimulados = [
      {
        cedula: '12345678',
        nombre: 'Miguel Alejandro Guerra López',
        telefono: '0412-0000000',
        estado: 'Activo',
        tipo: 'estudiante',
        fecha: '2025-10-01',
        nivel: 'Básico',
      },
      {
        cedula: '87654321',
        nombre: 'Valentina Valido',
        telefono: '0412-0000000',
        estado: 'Inactivo',
        tipo: 'profesor',
        fecha: '2025-09-15',
        nivel: 'Avanzado',
      },
      {
        cedula: '11223344',
        nombre: 'Oscar Ampudia',
        telefono: '0412-0000000',
        estado: 'Activo',
        tipo: 'empleado',
        fecha: '2025-10-10',
        nivel: 'Intermedio',
      },
    ];

    setUsuarios(datosSimulados);
  }, []);

  // 🔍 Aplicar filtros
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideTipo = tipo === 'todos' || usuario.tipo === tipo;
    const coincideEstado = estado === 'todos' || usuario.estado.toLowerCase() === estado.toLowerCase();
    const coincideFecha = fecha === 'todos' || usuario.fecha === fecha;
    const coincideNivel = nivel === 'todos' || usuario.nivel === nivel;
    const coincideBusqueda = busqueda === '' || 
      usuario.cedula.includes(busqueda) || 
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase());
    
    return coincideTipo && coincideEstado && coincideFecha && coincideNivel && coincideBusqueda;
  });

  // ❌ LÓGICA DE DESACTIVACIÓN DE USUARIO (SIMULADA)
  const desactivarUsuario = (cedula) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.cedula === cedula ? { ...u, estado: 'Inactivo' } : u))
    );
    setUsuarioAEliminar(null); // 🧼 cerrar modal
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      {/* 🏷️ Header de la página - Consultar izquierda, Filtros y Búsqueda derecha */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
        {/* 📝 Título a la izquierda */}
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-2">
            Consultar
          </h1>
        </div>

        {/* 🔍 Filtros y Búsqueda a la derecha */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          {/* Selector de Tipo */}
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 bg-white min-w-[140px]"
          >
            <option value="todos">Todos los tipos</option>
            <option value="estudiante">Estudiante</option>
            <option value="profesor">Profesor</option>
            <option value="empleado">Empleado</option>
          </select>

          {/* Selector de Estado */}
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 bg-white min-w-[140px]"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          {/* Selector de Fecha */}
          <select
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 bg-white min-w-[140px]"
          >
            <option value="todos">Todas las fechas</option>
            <option value="2025-10-01">01/10/2025</option>
            <option value="2025-09-15">15/09/2025</option>
            <option value="2025-10-10">10/10/2025</option>
          </select>

          {/* Selector de Nivel */}
          <select
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 bg-white min-w-[140px]"
          >
            <option value="todos">Todos los niveles</option>
            <option value="Básico">Básico</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>

          {/* Barra de Búsqueda */}
          <div className="relative">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar"
              className="w-full md:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {usuariosFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg font-medium">No hay datos</p>
            <p className="text-gray-400 text-sm mt-2">
              {busqueda || tipo !== 'todos' || estado !== 'todos' || fecha !== 'todos' || nivel !== 'todos'
                ? 'No hay usuarios que coincidan con los filtros.' 
                : 'No hay usuarios registrados en el sistema.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-950">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    C.I
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Nombre y Apellido
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden sm:table-cell">
                    Teléfono
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Eliminar
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Ver
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.cedula} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{usuario.cedula}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{usuario.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                      {usuario.telefono}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        usuario.estado === 'Activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {usuario.estado === 'Activo' ? (
                        <button 
                          onClick={() => setUsuarioAEliminar(usuario)}
                          className="inline-flex items-center p-2 border border-red-300 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                          title="Desactivar Usuario"
                        >
                          <span className="text-lg">🗑️</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center p-2 border border-gray-300 rounded-lg text-gray-400 bg-gray-100 cursor-not-allowed">
                          <span className="text-lg">🗑️</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => onVerUsuario(usuario.cedula)}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
                        title="Ver Detalles"
                      >
                        <span className="text-lg">👁️</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🧨 Modal de confirmación */}
      {usuarioAEliminar && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirmar eliminación
            </h3>
            
            <p className="text-gray-600 mb-2">
              ¿Estás seguro de que deseas eliminar al siguiente usuario?
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-medium text-gray-800 capitalize">{usuarioAEliminar.tipo}</p>
              <p className="text-gray-600">{usuarioAEliminar.nombre}</p>
              <p className="text-gray-600 text-sm">C.I: {usuarioAEliminar.cedula}</p>
              <p className="text-gray-600 text-sm">Tel: {usuarioAEliminar.telefono}</p>
              <p className="text-gray-600 text-sm">Nivel: {usuarioAEliminar.nivel}</p>
              <p className="text-gray-600 text-sm">Fecha: {usuarioAEliminar.fecha}</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setUsuarioAEliminar(null)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => desactivarUsuario(usuarioAEliminar.cedula)}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultaUsuarios;