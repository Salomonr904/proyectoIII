import React, { useState, useEffect } from 'react';

function ConsultaUsuarios({ onVerUsuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [tipo, setTipo] = useState('todos');
  const [estado, setEstado] = useState('todos');
  const [fecha, setFecha] = useState('todos');
  const [nivel, setNivel] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [cargando, setCargando] = useState(false);

  // 🔄 Cargar usuarios cuando cambie el tipo seleccionado
  useEffect(() => {
    const cargarUsuariosPorTipo = async () => {
      if (tipo === 'todos') {
        setUsuarios([]);
        return;
      }

      setCargando(true);
      try {
        let endpoint = '';
        let transformador = null;

        // Determinar endpoint y transformador según el tipo
        switch (tipo) {
          case 'estudiante':
            endpoint = 'http://localhost:6500/api/students';
            transformador = transformarEstudiante;
            break;
          case 'profesor':
            endpoint = 'http://localhost:6500/api/teachers';
            transformador = transformarProfesor;
            break;
          case 'empleado':
            endpoint = 'http://localhost:6500/api/employees';
            transformador = transformarEmpleado;
            break;
          default:
            return;
        }

        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error('Error al cargar usuarios');
        }

        const data = await response.json();

        if (data.success && data.data) {
          const usuariosTransformados = data.data.map(transformador);
          setUsuarios(usuariosTransformados);
        } else {
          setUsuarios([]);
        }

      } catch (err) {
        console.error('Error al cargar usuarios:', err);
        setUsuarios([]);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuariosPorTipo();
  }, [tipo]);

  // Transformadores para cada tipo de usuario
  const transformarEstudiante = (estudiante) => {
    const cedula = estudiante.student_cedula?.toString() || 'N/A';
    
    const nombre = `${estudiante.student_first_name || ''} ${
                  estudiante.student_second_name || ''
                } ${estudiante.student_first_lastname || ''} ${
                  estudiante.student_second_lastname || ''
                }`.trim().replace(/\s+/g, ' ') || 'Nombre no disponible';
    
    const telefono = estudiante.student_telephone || 
                   estudiante.student_emergency_telephone || 
                   'No disponible';
    
    let estado = 'Activo';
    if (estudiante.student_delete === true) {
      estado = 'Inactivo';
    }

    return {
      id: `estudiante-${estudiante.id_student}`,
      cedula: cedula,
      nombre: nombre,
      telefono: telefono,
      estado: estado,
      tipo: 'estudiante',
      fecha: estudiante.student_registration_date || 'N/A',
      nivel: `Nivel ${estudiante.student_level_id}` || 'Básico',
      datosCompletos: estudiante
    };
  };

  const transformarEmpleado = (empleado) => {
    const cedula = empleado.employee_cedula?.toString() || 'N/A';
    
    const nombre = `${empleado.employee_first_name || ''} ${
                  empleado.employee_second_name || ''
                } ${empleado.employee_first_lastname || ''} ${
                  empleado.employee_second_lastname || ''
                }`.trim().replace(/\s+/g, ' ') || 'Nombre no disponible';
    
    const telefono = empleado.employee_telephone || 'No disponible';
    
    let estado = 'Activo';
    if (empleado.employee_delete === true) {
      estado = 'Inactivo';
    }

    return {
      id: `empleado-${empleado.id_employee}-${cedula}`,
      cedula: cedula,
      nombre: nombre,
      telefono: telefono,
      estado: estado,
      tipo: 'empleado',
      fecha: empleado.employee_registration_date || 'N/A',
      nivel: 'Empleado',
      datosCompletos: empleado
    };
  };

  const transformarProfesor = (profesor) => {
    const cedula = profesor.teacher_cedula?.toString() || 'N/A';
    
    const nombre = `${profesor.teacher_first_name || ''} ${
                  profesor.teacher_second_name || ''
                } ${profesor.teacher_first_lastname || ''} ${
                  profesor.teacher_second_lastname || ''
                }`.trim().replace(/\s+/g, ' ') || 'Nombre no disponible';
    
    const telefono = profesor.teacher_telephone || 'No disponible';
    
    let estado = 'Activo';
    if (profesor.teacher_delete === true) {
      estado = 'Inactivo';
    }

    return {
      id: `profesor-${profesor.id_teacher}-${cedula}`,
      cedula: cedula,
      nombre: nombre,
      telefono: telefono,
      estado: estado,
      tipo: 'profesor',
      fecha: profesor.teacher_registration_date || 'N/A',
      nivel: 'Profesor',
      datosCompletos: profesor
    };
  };

  // 🔍 Aplicar filtros
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideEstado = estado === 'todos' || usuario.estado.toLowerCase() === estado.toLowerCase();
    const coincideFecha = fecha === 'todos' || usuario.fecha === fecha;
    const coincideNivel = nivel === 'todos' || usuario.nivel === nivel;
    const coincideBusqueda = busqueda === '' || 
      usuario.cedula.includes(busqueda) || 
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase());
    
    return coincideEstado && coincideFecha && coincideNivel && coincideBusqueda;
  });

  // ❌ LÓGICA DE ELIMINACIÓN DE USUARIO
  const desactivarUsuario = async (usuario) => {
    try {
      let endpoint = '';

      switch (usuario.tipo) {
        case 'estudiante':
          endpoint = `http://localhost:6500/api/students/${usuario.cedula}`;
          break;
        case 'profesor':
          endpoint = `http://localhost:6500/api/teachers/${usuario.cedula}`;
          break;
        case 'empleado':
          endpoint = `http://localhost:6500/api/employees/${usuario.cedula}`;
          break;
        default:
          throw new Error('Tipo de usuario no válido');
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resultado = await response.json();

      if (!response.ok || !resultado.success) {
        throw new Error(resultado.message || 'Error al eliminar usuario');
      }

      setUsuarios((prev) =>
        prev.map((u) => 
          u.id === usuario.id ? { ...u, estado: 'Inactivo' } : u
        )
      );
      
      alert(`✅ ${usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1)} eliminado correctamente`);
      
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      alert(`❌ Error al eliminar usuario: ${err.message}`);
    } finally {
      setUsuarioAEliminar(null);
    }
  };

  // 👁️ LÓGICA PARA VER/EDITAR USUARIO - MEJORADA
  const handleVerUsuario = (usuario) => {
    console.log('=== DEBUG: Botón VER clickeado ===');
    console.log('Usuario completo:', usuario);
    console.log('Cédula:', usuario.cedula);
    console.log('Tipo:', usuario.tipo);
    console.log('Datos completos disponibles:', usuario.datosCompletos);
    
    // Verificar si la función onVerUsuario existe
    if (typeof onVerUsuario !== 'function') {
      console.error('❌ ERROR: onVerUsuario no es una función');
      alert('Error: La función para ver usuario no está disponible');
      return;
    }

    try {
      console.log('📤 Enviando datos a onVerUsuario...');
      // Enviar el objeto completo del usuario para mayor flexibilidad
      onVerUsuario(usuario);
      console.log('✅ Datos enviados correctamente');
    } catch (error) {
      console.error('❌ Error al ejecutar onVerUsuario:', error);
      alert('Error al abrir la vista de usuario');
    }
  };

  // Obtener fechas únicas para el filtro
  const fechasUnicas = [...new Set(usuarios.map(u => u.fecha))].filter(fecha => fecha !== 'N/A');
  const nivelesUnicos = [...new Set(usuarios.map(u => u.nivel))].filter(nivel => nivel);

  // Manejar cambio de tipo
  const handleTipoChange = (nuevoTipo) => {
    setTipo(nuevoTipo);
    setEstado('todos');
    setFecha('todos');
    setNivel('todos');
    setBusqueda('');
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      {/* 🏷️ Header de la página */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-2">
            Consultar
          </h1>
          <p className="text-sm text-gray-600">
            {tipo === 'todos' 
              ? 'Selecciona un tipo de usuario para comenzar'
              : `Mostrando ${usuariosFiltrados.length} ${tipo}(s) de ${usuarios.length} registrados`
            }
          </p>
        </div>

        {/* 🔍 Filtros y Búsqueda */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <select
            value={tipo}
            onChange={(e) => handleTipoChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 bg-white min-w-[140px]"
          >
            <option value="todos">Selecciona tipo</option>
            <option value="estudiante">Estudiante</option>
            <option value="profesor">Profesor</option>
            <option value="empleado">Empleado</option>
          </select>

          {tipo !== 'todos' && (
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 bg-white min-w-[140px]"
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          )}

          {tipo !== 'todos' && fechasUnicas.length > 0 && (
            <select
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 bg-white min-w-[140px]"
            >
              <option value="todos">Todas las fechas</option>
              {fechasUnicas.map(fecha => (
                <option key={fecha} value={fecha}>
                  {new Date(fecha).toLocaleDateString('es-ES')}
                </option>
              ))}
            </select>
          )}

          {tipo !== 'todos' && nivelesUnicos.length > 0 && (
            <select
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 bg-white min-w-[140px]"
            >
              <option value="todos">Todos los niveles</option>
              {nivelesUnicos.map(nivel => (
                <option key={nivel} value={nivel}>
                  {nivel}
                </option>
              ))}
            </select>
          )}

          {tipo !== 'todos' && (
            <div className="relative">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por cédula o nombre"
                className="w-full md:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 📊 Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {tipo === 'todos' ? (
          <div className="text-center py-16">
            <div className="text-gray-300 text-8xl mb-6">👥</div>
            <p className="text-gray-500 text-xl font-medium mb-2">Selecciona un tipo de usuario</p>
            <p className="text-gray-400 text-sm">
              Elige entre estudiantes, profesores o empleados para ver la lista correspondiente
            </p>
          </div>
        ) : cargando ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-950 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando {tipo}s...</p>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg font-medium">No hay {tipo}s</p>
            <p className="text-gray-400 text-sm mt-2">
              {busqueda || estado !== 'todos' || fecha !== 'todos' || nivel !== 'todos'
                ? 'No hay usuarios que coincidan con los filtros.' 
                : `No hay ${tipo}s registrados en el sistema.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-950">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">C.I</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nombre y Apellido</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden sm:table-cell">Teléfono</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tipo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Eliminar</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Ver/Editar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition-colors duration-150">
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
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
                        onClick={() => handleVerUsuario(usuario)}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
                        title="Ver y Editar Usuario"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirmar desactivación
            </h3>
            
            <p className="text-gray-600 mb-2">
              ¿Estás seguro de que deseas desactivar al siguiente usuario?
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
                onClick={() => desactivarUsuario(usuarioAEliminar)}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultaUsuarios;