import React, { useState, useEffect } from 'react';

function GestionUsuarios({ onVerRestablecer }) {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  // 🎛️ Estados para los filtros
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [mostrarFiltroEstado, setMostrarFiltroEstado] = useState(false);
  const [mostrarFiltroTipo, setMostrarFiltroTipo] = useState(false);

  // 🔄 Función para obtener usuarios del backend
  const obtenerUsuarios = async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await fetch('http://localhost:6500/api/users');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const resultado = await response.json();
      
      // Verificar que la respuesta tenga la estructura esperada
      if (!resultado.success || !Array.isArray(resultado.data)) {
        console.error('Estructura de respuesta inválida:', resultado);
        throw new Error('Formato de respuesta inválido del servidor');
      }
      
      // Transformar los datos del backend al formato que espera el componente
      const usuariosTransformados = resultado.data.map(usuario => ({
        id: usuario.id_user,
        nombre: usuario.full_name,
        cedula: usuario.cedula_person.toString(),
        estado: usuario.status ? 'Activo' : 'Deshabilitado',
        tipo: usuario.person_type === 'teacher' ? 'Profesor' : 
              usuario.person_type === 'student' ? 'Estudiante' : 'Empleado',
        // Mantener datos originales del backend por si los necesitas
        datosOriginales: usuario
      }));
      
      setUsuarios(usuariosTransformados);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      setError(`Error al cargar usuarios: ${err.message}`);
      // Mantener datos de simulación como fallback
      const usuariosSimulados = [
        { 
          id: 1, 
          nombre: 'Miguel Guerra', 
          cedula: '00.000.000', 
          estado: 'Activo',
          tipo: 'Profesor'
        },
        { 
          id: 2, 
          nombre: 'Valentina Villalba', 
          cedula: '00.000.001', 
          estado: 'Deshabilitado',
          tipo: 'Estudiante'
        }
      ];
      setUsuarios(usuariosSimulados);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // 🔍 Filtrado combinado de usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    const coincideBusqueda = usuario.cedula.includes(busqueda.trim()) || 
                            usuario.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'Todos' || usuario.estado === filtroEstado;
    const coincideTipo = filtroTipo === 'Todos' || usuario.tipo === filtroTipo;
    
    return coincideBusqueda && coincideEstado && coincideTipo;
  });

  // 🎯 Manejar selección para cambio de estado
  const handleSeleccionarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarConfirmacion(true);
  };

  // 🔄 Cambiar estado del usuario - SOLUCIÓN CORREGIDA
  const cambiarEstado = async () => {
    if (!usuarioSeleccionado) return;
    
    const nuevoEstado = usuarioSeleccionado.estado === 'Activo' ? 'Deshabilitado' : 'Activo';
    const nuevoStatus = usuarioSeleccionado.estado === 'Activo' ? false : true;

    try {
      // Usar siempre PUT para cambiar el estado, enviando el nuevo status en el body
      const response = await fetch(`http://localhost:6500/api/users/${usuarioSeleccionado.cedula}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: nuevoStatus
        })
      });

      const resultado = await response.json();

      if (!response.ok) {
        console.error('Error del servidor:', resultado);
        throw new Error(resultado.message || `Error al cambiar el estado del usuario`);
      }

      // Actualizar el estado local si la llamada al backend fue exitosa
      setUsuarios(prevUsuarios =>
        prevUsuarios.map(u =>
          u.id === usuarioSeleccionado.id
            ? { ...u, estado: nuevoEstado }
            : u
        )
      );
      
      // Mostrar mensaje de éxito
      alert(`Usuario ${nuevoEstado === 'Activo' ? 'activado' : 'desactivado'} exitosamente`);
      
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert(`Error al cambiar el estado del usuario: ${error.message}`);
    } finally {
      setMostrarConfirmacion(false);
      setUsuarioSeleccionado(null);
    }
  };

  // ❌ Cancelar cambio de estado
  const cancelarCambio = () => {
    setMostrarConfirmacion(false);
    setUsuarioSeleccionado(null);
  };

  // 🔄 Función para recargar usuarios
  const recargarUsuarios = () => {
    obtenerUsuarios();
  };

  // Cerrar menús desplegables al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setMostrarFiltroEstado(false);
      setMostrarFiltroTipo(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      {/* 🏷️ Header de la página - Título izquierda, Filtros y Búsqueda derecha */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
        {/* 📝 Título y descripción a la izquierda */}
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-2">
            Gestionar Usuarios
          </h1>
          {/* Botón de recargar */}
          <button
            onClick={recargarUsuarios}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
          >
            🔄 Actualizar
          </button>
        </div>

        {/* Estado de carga y error */}
        {cargando && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
            Cargando usuarios...
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* 🔍 Contenedor de Filtros y Búsqueda */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* 🎛️ Botones de Filtro */}
          <div className="flex flex-wrap gap-2">
            {/* Botón Filtro Estado */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMostrarFiltroEstado(!mostrarFiltroEstado);
                  setMostrarFiltroTipo(false);
                }}
                className={`flex items-center px-7 py-2.5 border rounded-lg text-sm font-medium transition-colors duration-200 ${
                  filtroEstado !== 'Todos' 
                    ? 'border-indigo-950 text-indigo-800 bg-indigo-50' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <span className="mr-1"></span>
                Estado: {filtroEstado}
              </button>
              
              {mostrarFiltroEstado && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <button
                      onClick={() => setFiltroEstado('Todos')}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md mb-1 ${
                        filtroEstado === 'Todos' 
                          ? 'bg-indigo-100 text-indigo-950' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setFiltroEstado('Activo')}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md mb-1 ${
                        filtroEstado === 'Activo' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Activo
                    </button>
                    <button
                      onClick={() => setFiltroEstado('Deshabilitado')}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                        filtroEstado === 'Deshabilitado' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Inactivo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Botón Filtro Tipo */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMostrarFiltroTipo(!mostrarFiltroTipo);
                  setMostrarFiltroEstado(false);
                }}
                className={`flex items-center px-7 py-2.5 border rounded-lg text-sm font-medium transition-colors duration-200 ${
                  filtroTipo !== 'Todos' 
                    ? 'border-indigo-950 text-indigo-800 bg-indigo-50' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <span className="mr-1"></span> 
                Tipo: {filtroTipo}
              </button>
              
              {mostrarFiltroTipo && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <button
                      onClick={() => setFiltroTipo('Todos')}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md mb-1 ${
                        filtroTipo === 'Todos' 
                          ? 'bg-indigo-100 text-indigo-950' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setFiltroTipo('Estudiante')}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md mb-1 ${
                        filtroTipo === 'Estudiante' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Estudiante
                    </button>
                    <button
                      onClick={() => setFiltroTipo('Profesor')}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md mb-1 ${
                        filtroTipo === 'Profesor' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Profesor
                    </button>
                    <button
                      onClick={() => setFiltroTipo('Empleado')}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                        filtroTipo === 'Empleado' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Empleado
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 🔍 Barra de búsqueda */}
          <div className="w-full md:w-64">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por cédula o nombre"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* 📊 Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Estado de carga */}
        {cargando && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Cargando usuarios...</p>
          </div>
        )}

        {/* 📱 Versión móvil - Cards */}
        <div className="block md:hidden">
          {!cargando && usuariosFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No hay usuarios que coincidan con la búsqueda.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {usuariosFiltrados.map((usuario) => (
                <div key={usuario.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{usuario.nombre}</h3>
                      <p className="text-gray-600 text-sm">C.I: {usuario.cedula}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {usuario.tipo}
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      usuario.estado === 'Activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.estado}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center gap-2">
                    <button
                      onClick={() => onVerRestablecer(usuario.cedula)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
                    >
                      <span className="mr-2">🔁</span>
                      Restablecer
                    </button>
                    
                    <button
                      onClick={() => handleSeleccionarUsuario(usuario)}
                      className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200 ${
                        usuario.estado === 'Activo'
                          ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                          : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                      }`}
                    >
                      {usuario.estado === 'Activo' ? 'Inactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 💻 Versión desktop - Tabla */}
        <div className="hidden md:block overflow-x-auto">
          {!cargando && usuariosFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No hay usuarios que coincidan con la búsqueda.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-950">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Nombre y Apellido
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Cédula de Identidad
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Restablecer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{usuario.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{usuario.cedula}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {usuario.tipo}
                      </span>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onVerRestablecer(usuario.cedula)}
                        className="inline-flex items-center text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
                        title="Restablecer contraseña"
                      >
                        <span className="text-lg">🔁</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleSeleccionarUsuario(usuario)}
                        className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200 ${
                          usuario.estado === 'Activo'
                            ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                            : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                        }`}
                      >
                        {usuario.estado === 'Activo' ? 'Inactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 🎯 Modal de confirmación para cambio de estado */}
      {mostrarConfirmacion && usuarioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirmar cambio de estado
            </h3>
            
            <p className="text-gray-600 mb-2">
              ¿Estás seguro de que deseas{' '}
              <span className="font-semibold">
                {usuarioSeleccionado.estado === 'Activo' ? 'inactivar' : 'activar'}
              </span>{' '}
              al siguiente usuario?
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-medium text-gray-800">{usuarioSeleccionado.nombre}</p>
              <p className="text-gray-600 text-sm">C.I: {usuarioSeleccionado.cedula}</p>
              <p className="text-gray-600 text-sm">
                Estado actual: <span className={`font-medium ${
                  usuarioSeleccionado.estado === 'Activo' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {usuarioSeleccionado.estado}
                </span>
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelarCambio}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={cambiarEstado}
                className={`px-4 py-2 border text-sm font-medium rounded-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200 ${
                  usuarioSeleccionado.estado === 'Activo'
                    ? 'border-red-700 bg-red-600 hover:bg-red-700'
                    : 'border-green-700 bg-green-600 hover:bg-green-700'
                }`}
              >
                {usuarioSeleccionado.estado === 'Activo' ? 'Inactivar' : 'Activar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionUsuarios;