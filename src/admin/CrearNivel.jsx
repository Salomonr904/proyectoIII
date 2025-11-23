import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:6500/api';
const LEVELS_ENDPOINT = `${API_BASE_URL}/level`;

// Componente principal
export default function CrearNivel() {
  // Estado para el formulario
  const [nombreNivel, setNombreNivel] = useState('');
  const [diaSeleccionado, setDiaSeleccionado] = useState('');
  const [errores, setErrores] = useState({});
  
  // Estado de datos
  const [niveles, setNiveles] = useState([]);
  const [nivelAEliminar, setNivelAEliminar] = useState(null);
  const [nivelAEditar, setNivelAEditar] = useState(null);
  const [cargando, setCargando] = useState(true);

  const diasDisponibles = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Validación del formulario
  const validarFormulario = (nombre, dia) => {
    const nuevosErrores = {};
    
    if (!nombre || nombre.length < 5) {
      nuevosErrores.nombre = 'El nombre del nivel debe tener al menos 5 caracteres';
    }
    
    if (!dia) {
      nuevosErrores.dia = 'Debes seleccionar un día';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Función para manejar la selección de UN solo día
  const seleccionarDia = (dia) => {
    if (nivelAEditar) {
      setNivelAEditar({ 
        ...nivelAEditar, 
        dias: dia 
      });
    } else {
      setDiaSeleccionado(diaSeleccionado === dia ? '' : dia);
    }
    // Limpiar error de día al seleccionar uno
    if (errores.dia) {
      setErrores(prev => ({ ...prev, dia: '' }));
    }
  };

  // Función para verificar si un día está seleccionado
  const isDiaSeleccionado = (dia) => {
    if (nivelAEditar) {
      return nivelAEditar.dias === dia;
    } else {
      return diaSeleccionado === dia;
    }
  };

  // Función de Mapeo (Backend -> Frontend)
  const mapBackendToFrontend = (data) => data.map(item => ({
    id: item.id_level,
    nombre: item.level_name,
    dias: item.class_day || '',
  }));

  // 🔄 Cargar niveles desde el backend
  useEffect(() => {
    const cargarNiveles = async () => {
      try {
        setCargando(true);
        const res = await fetch(LEVELS_ENDPOINT);
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        const result = await res.json();
        
        if (result.success && result.data) {
          setNiveles(mapBackendToFrontend(result.data));
        } else {
          setNiveles([]);
        }
        
      } catch (err) {
        console.error('❌ Error al cargar niveles:', err.message);
        const nivelesSimulados = [
          { id: 1, nombre: 'Básico', dias: 'Lunes' },
          { id: 2, nombre: 'Intermedio', dias: 'Martes' },
        ];
        setNiveles(nivelesSimulados);
      } finally {
        setCargando(false);
      }
    };

    cargarNiveles();
  }, []);

  // Función para mostrar mensajes de error
  const displayErrorMessage = (message) => {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.visibility = 'visible';
      errorDiv.style.height = 'auto';
      errorDiv.style.paddingTop = '0.75rem';
      errorDiv.style.paddingBottom = '0.75rem';
      setTimeout(() => {
        errorDiv.textContent = '';
        errorDiv.style.visibility = 'hidden';
        errorDiv.style.height = '0';
        errorDiv.style.paddingTop = '0';
        errorDiv.style.paddingBottom = '0';
      }, 5000);
    }
  };

  // Función para mostrar mensajes de éxito
  const displaySuccessMessage = (message) => {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-0 rounded-xl relative mb-4 transition-all duration-300';
      errorDiv.style.visibility = 'visible';
      errorDiv.style.height = 'auto';
      errorDiv.style.paddingTop = '0.75rem';
      errorDiv.style.paddingBottom = '0.75rem';
      setTimeout(() => {
        errorDiv.textContent = '';
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-0 rounded-xl relative mb-4 transition-all duration-300';
        errorDiv.style.visibility = 'hidden';
        errorDiv.style.height = '0';
        errorDiv.style.paddingTop = '0';
        errorDiv.style.paddingBottom = '0';
      }, 5000);
    }
  };

  // 1. CREAR Nivel (POST)
  const agregarNivel = async () => {
    if (!validarFormulario(nombreNivel, diaSeleccionado)) {
      return;
    }

    const payload = {
      level_name: nombreNivel,
      class_day: diaSeleccionado,
    };

    console.log('📤 Enviando POST con payload:', payload);

    try {
      const res = await fetch(LEVELS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log('📥 Respuesta POST:', result);

      if (!res.ok) {
        throw new Error(result.message || `Error HTTP: ${res.status}`);
      }

      if (!result.success) {
        throw new Error(result.message || 'Error en la inserción');
      }

      // Recargar los niveles
      const resNiveles = await fetch(LEVELS_ENDPOINT);
      const resultNiveles = await resNiveles.json();
      
      if (resultNiveles.success && resultNiveles.data) {
        setNiveles(mapBackendToFrontend(resultNiveles.data));
      }
      
      setNombreNivel('');
      setDiaSeleccionado('');
      setErrores({});
      displaySuccessMessage('✅ Nivel creado correctamente');
      
    } catch (err) {
      console.error('Error al crear nivel:', err.message);
      displayErrorMessage(`No se pudo crear el nivel: ${err.message}`);
    }
  };
  
  // 2. ELIMINAR Nivel (DELETE)
  const confirmarEliminacion = async () => {
    if (!nivelAEliminar || !nivelAEliminar.id) return;

    try {
      const deleteUrl = `${LEVELS_ENDPOINT}/${nivelAEliminar.id}`;
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const errorResult = await res.json(); 
        throw new Error(errorResult.message || `Error HTTP: ${res.status}`);
      }
      
      setNiveles((prev) => prev.filter((n) => n.id !== nivelAEliminar.id));
      setNivelAEliminar(null);
      displaySuccessMessage('✅ Nivel eliminado correctamente');
      
    } catch (err) {
      console.error('Error al eliminar nivel:', err.message);
      displayErrorMessage(`No se pudo eliminar el nivel: ${err.message}`);
      setNivelAEliminar(null);
    }
  };
  
  // 3. ACTUALIZAR Nivel (PUT)
  const guardarEdicion = async () => {
    if (!nivelAEditar || !nivelAEditar.id || !nivelAEditar.dias) {
      displayErrorMessage('Debes seleccionar un día para actualizar el nivel.'); 
      return;
    }

    // Validar que el nombre tenga al menos 5 caracteres
    if (nivelAEditar.nombre.length < 5) {
      displayErrorMessage('El nombre del nivel debe tener al menos 5 caracteres');
      return;
    }

    const payload = {
      level_name: nivelAEditar.nombre,
      class_day: nivelAEditar.dias,
    };

    console.log('📤 Enviando PUT con payload:', payload);
    console.log('🔗 URL:', `${LEVELS_ENDPOINT}/${nivelAEditar.id}`);
    
    try {
      const updateUrl = `${LEVELS_ENDPOINT}/${nivelAEditar.id}`;
      const res = await fetch(updateUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('📥 Status respuesta PUT:', res.status);
      
      const result = await res.json();
      console.log('📥 Respuesta PUT completa:', result);

      if (!res.ok) {
        throw new Error(result.message || `Error HTTP: ${res.status}`);
      }

      if (!result.success) {
        // Mostrar el mensaje específico de validación del backend
        if (result.error && result.error.length > 0) {
          const errorMsg = result.error[0].message || result.message;
          throw new Error(errorMsg);
        }
        throw new Error(result.message || 'Error en la actualización');
      }
      
      // Recargar los niveles
      const resNiveles = await fetch(LEVELS_ENDPOINT);
      const resultNiveles = await resNiveles.json();
      
      if (resultNiveles.success && resultNiveles.data) {
        setNiveles(mapBackendToFrontend(resultNiveles.data));
      }
      
      setNivelAEditar(null);
      displaySuccessMessage('✅ Nivel actualizado correctamente');
      
    } catch (err) {
      console.error('❌ Error al actualizar nivel:', err.message);
      console.error('❌ Detalles del error:', err);
      displayErrorMessage(`No se pudo actualizar el nivel: ${err.message}`);
    }
  };

  // Manejar cambio en el input de nombre
  const handleNombreChange = (e) => {
    const value = e.target.value;
    if (nivelAEditar) {
      setNivelAEditar({ ...nivelAEditar, nombre: value });
    } else {
      setNombreNivel(value);
    }
    
    // Limpiar error de nombre al escribir
    if (errores.nombre) {
      setErrores(prev => ({ ...prev, nombre: '' }));
    }
  };

  if (cargando) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Cargando niveles...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen font-[Inter]">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        Gestión de Niveles de Formación
      </h1>
      
      {/* Contenedor para mensajes de error */}
      <div id="error-message" className="bg-red-100 border border-red-400 text-red-700 px-4 py-0 rounded-xl relative mb-4 transition-all duration-300" role="alert" style={{ visibility: 'hidden', height: '0', padding: 0 }}></div>
      
      {/* 📝 Formulario de Creación/Edición */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-indigo-200">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
          {nivelAEditar ? `Editar Día del Nivel: ${nivelAEditar.nombre}` : 'Nuevo Nivel'}
        </h2>

        {/* Campo Nombre */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Nivel:
            <span className="text-xs text-gray-500 ml-1">(mínimo 5 caracteres)</span>
          </label>
          <input
            type="text"
            value={nivelAEditar ? nivelAEditar.nombre : nombreNivel}
            onChange={handleNombreChange}
            placeholder="Ej. Nivel Básico"
            className={`w-full p-3 border rounded-lg bg-gray-100 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ${
              errores.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={!!nivelAEditar}
          />
          {errores.nombre && (
            <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>
          )}
          {nivelAEditar && <p className="text-xs text-gray-500 mt-1">El nombre del nivel no puede modificarse.</p>}
        </div>

        {/* Selección de Días */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Día de clase:</label>
          <div className="flex flex-wrap gap-2">
            {diasDisponibles.map((dia) => (
              <button
                key={dia}
                type="button"
                onClick={() => seleccionarDia(dia)}
                className={`py-2 px-4 rounded-full text-sm font-medium transition duration-150 transform hover:scale-105 ${
                  isDiaSeleccionado(dia)
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300'
                    : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'
                }`}
              >
                {dia}
              </button>
            ))}
          </div>
          {errores.dia && (
            <p className="text-red-500 text-xs mt-1">{errores.dia}</p>
          )}
          <div className="mt-2 text-sm text-gray-600">
            {nivelAEditar ? (
              <span>Día seleccionado: <strong>{nivelAEditar.dias || 'Ninguno'}</strong></span>
            ) : (
              <span>Día seleccionado: <strong>{diaSeleccionado || 'Ninguno'}</strong></span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Solo puedes seleccionar un día por nivel</p>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-4">
          {nivelAEditar ? (
            <>
              <button 
                onClick={guardarEdicion}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 transform hover:scale-[1.02]"
              >
                Guardar Cambios
              </button>
              <button 
                onClick={() => {
                  setNivelAEditar(null);
                  setErrores({});
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 transform hover:scale-[1.02]"
              >
                Cancelar Edición
              </button>
            </>
          ) : (
            <button 
              onClick={agregarNivel}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-xl shadow-indigo-300 transition duration-200 transform hover:scale-[1.02]"
            >
              Agregar Nivel
            </button>
          )}
        </div>
      </div>

      {/* 📋 Tabla de niveles */}
      <h3 className="text-xl font-bold mb-4 text-gray-800">Niveles Registrados</h3>
      {niveles.length === 0 ? (
        <p className="text-gray-500 p-4 bg-white rounded-xl shadow-md">No hay niveles registrados. Intenta agregar uno.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nivel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día de clase</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {niveles.map((nivel) => (
                <tr key={nivel.id} className="hover:bg-indigo-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{nivel.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{nivel.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {nivel.dias || 'No asignado'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => setNivelAEditar(nivel)}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 p-2 rounded-full transition duration-150 transform hover:scale-110"
                      title="Editar"
                    >
                      ✏
                    </button>
                    <button 
                      onClick={() => setNivelAEliminar(nivel)}
                      className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-full transition duration-150 transform hover:scale-110"
                      title="Eliminar"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {nivelAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all scale-100">
            <h4 className="text-xl font-bold mb-4 text-gray-800">Confirmar Eliminación</h4>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de eliminar el nivel <strong>{nivelAEliminar.nombre}</strong> (ID: {nivelAEliminar.id})?
              Esta acción es permanente.
            </p>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setNivelAEliminar(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-150"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarEliminacion}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 transform hover:scale-105"
              >
                Eliminar Nivel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


