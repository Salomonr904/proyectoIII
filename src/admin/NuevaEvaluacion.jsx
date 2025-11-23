import React, { useState, useEffect } from 'react';

function NuevaEvaluacion() {
  const [nombreEvaluacion, setNombreEvaluacion] = useState('');
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [evaluacionAEliminar, setEvaluacionAEliminar] = useState(null);
  const [evaluacionAEditar, setEvaluacionAEditar] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [errores, setErrores] = useState({});

  // URL de la API
  const API_BASE_URL = 'http://localhost:6500/api';
  const TYPES_EVALUATIONS_ENDPOINT = `${API_BASE_URL}/typesEvaluations`;

  // 🔄 Cargar evaluaciones desde el backend (GET)
  useEffect(() => {
    cargarEvaluaciones();
  }, []);

  const cargarEvaluaciones = async () => {
    try {
      setCargando(true);
      console.log('🔄 Cargando evaluaciones desde:', TYPES_EVALUATIONS_ENDPOINT);
      
      const res = await fetch(TYPES_EVALUATIONS_ENDPOINT);
      
      console.log('📡 Status respuesta:', res.status);
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const result = await res.json();
      console.log('📊 Respuesta GET typesEvaluations:', result);
      
      if (result.success && result.data) {
        // FILTRAR: Solo mostrar registros con delete: false
        const datosFiltrados = result.data.filter(item => item.delete === false);
        
        const datosMapeados = datosFiltrados.map(item => ({
          id: item.id_type_evaluation,
          nombre: item.type_evaluation,
        }));
        
        setEvaluaciones(datosMapeados);
        console.log('✅ Evaluaciones activas cargadas:', datosMapeados);
        console.log('📝 Registros filtrados (delete: false):', datosFiltrados.length);
        console.log('🗑️ Registros eliminados (delete: true):', result.data.length - datosFiltrados.length);
      } else {
        setEvaluaciones([]);
        console.log('⚠️ No hay datos en la respuesta');
      }
      
    } catch (err) {
      console.error('❌ Error al cargar evaluaciones:', err.message);
      // Datos de ejemplo simplificados
      const simuladas = [
        { id: 1, nombre: 'Examen escrito' },
        { id: 2, nombre: 'Evaluación oral' },
      ];
      setEvaluaciones(simuladas);
    } finally {
      setCargando(false);
    }
  };

  // Validación del formulario simplificada
  const validarFormulario = () => {
    if (!nombreEvaluacion.trim()) {
      setErrores({ nombre: 'El nombre de la evaluación es requerido' });
      return false;
    }
    setErrores({});
    return true;
  };

  // Función para mostrar mensajes
  const displayMessage = (message, type = 'error') => {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
      messageDiv.textContent = message;
      messageDiv.className = type === 'success' 
        ? 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-4 transition-all duration-300'
        : 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4 transition-all duration-300';
      messageDiv.style.visibility = 'visible';
      messageDiv.style.height = 'auto';
      
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.style.visibility = 'hidden';
        messageDiv.style.height = '0';
        messageDiv.style.padding = '0';
      }, 5000);
    }
  };

  // CREAR Evaluación (POST)
  const agregarEvaluacion = async () => {
    if (!validarFormulario()) {
      return;
    }

    // Payload simplificado - solo el nombre
    const payload = {
      type_evaluation: nombreEvaluacion,
    };

    console.log('📤 Enviando POST:', payload);

    try {
      const res = await fetch(TYPES_EVALUATIONS_ENDPOINT, {
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
        throw new Error(result.message || 'Error en la creación');
      }

      // Recargar las evaluaciones
      await cargarEvaluaciones();
      
      // Limpiar formulario
      setNombreEvaluacion('');
      setErrores({});
      
      displayMessage('✅ Evaluación creada correctamente', 'success');
      
    } catch (err) {
      console.error('Error al crear evaluación:', err.message);
      displayMessage(`No se pudo crear la evaluación: ${err.message}`);
    }
  };

  // ELIMINAR Evaluación (DELETE) - ACTUALIZADO para soft delete
  const confirmarEliminacion = async () => {
    if (!evaluacionAEliminar) return;

    try {
      const deleteUrl = `${TYPES_EVALUATIONS_ENDPOINT}/${evaluacionAEliminar.id}`;
      console.log('🗑️ Enviando DELETE a:', deleteUrl);
      
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
      });

      const result = await res.json();
      console.log('📥 Respuesta DELETE:', result);

      if (!res.ok) {
        throw new Error(result.message || `Error HTTP: ${res.status}`);
      }

      if (!result.success) {
        throw new Error(result.message || 'Error en la eliminación');
      }

      // ACTUALIZACIÓN: En lugar de filtrar localmente, recargamos desde el servidor
      // para asegurarnos de tener los datos actualizados con el soft delete
      await cargarEvaluaciones();
      setEvaluacionAEliminar(null);
      
      displayMessage('✅ Evaluación eliminada correctamente', 'success');
      
    } catch (err) {
      console.error('Error al eliminar evaluación:', err.message);
      displayMessage(`No se pudo eliminar la evaluación: ${err.message}`);
      setEvaluacionAEliminar(null);
    }
  };

  // ACTUALIZAR Evaluación (PUT)
  const guardarEdicion = async () => {
    if (!evaluacionAEditar) return;

    if (!validarFormulario()) {
      return;
    }

    // Payload simplificado - solo el nombre
    const payload = {
      type_evaluation: nombreEvaluacion,
    };

    try {
      const updateUrl = `${TYPES_EVALUATIONS_ENDPOINT}/${evaluacionAEditar.id}`;
      const res = await fetch(updateUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || `Error HTTP: ${res.status}`);
      }

      if (!result.success) {
        throw new Error(result.message || 'Error en la actualización');
      }

      // Recargar las evaluaciones
      await cargarEvaluaciones();
      setEvaluacionAEditar(null);
      
      displayMessage('✅ Evaluación actualizada correctamente', 'success');
      
    } catch (err) {
      console.error('Error al actualizar evaluación:', err.message);
      displayMessage(`No se pudo actualizar la evaluación: ${err.message}`);
    }
  };

  // Iniciar edición
  const iniciarEdicion = (evaluacion) => {
    setEvaluacionAEditar(evaluacion);
    setNombreEvaluacion(evaluacion.nombre);
    setErrores({});
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEvaluacionAEditar(null);
    setNombreEvaluacion('');
    setErrores({});
  };

  // 🔍 Filtrado de evaluaciones por nombre
  const evaluacionesFiltradas = evaluaciones.filter(evaluacion =>
    evaluacion.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Cargando evaluaciones...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      {/* 🏷️ Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-2">
          {evaluacionAEditar ? 'Editar Evaluación' : 'Nueva Evaluación'}
        </h1>
      </div>

      {/* Contenedor para mensajes */}
      <div id="message" className="bg-red-100 border border-red-400 text-red-700 px-4 py-0 rounded-xl relative mb-4 transition-all duration-300" style={{ visibility: 'hidden', height: '0', padding: 0 }}></div>

      {/* 📝 Formulario Superior - SIMPLIFICADO */}
      <div className="bg-white rounded-lg p-6 mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-4">
          {/* Solo campo Nombre de Evaluación */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de Evaluación *
            </label>
            <input
              type="text"
              value={nombreEvaluacion}
              onChange={(e) => {
                setNombreEvaluacion(e.target.value);
                if (errores.nombre) setErrores({});
              }}
              placeholder="Nombre de evaluación"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400 ${
                errores.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errores.nombre && (
              <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>
            )}
          </div>

          {/* Botón Agregar/Guardar */}
          <div className="lg:w-auto">
            {evaluacionAEditar ? (
              <div className="flex gap-4">
                <button
                  onClick={guardarEdicion}
                  className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={cancelarEdicion}
                  className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={agregarEvaluacion}
                className="w-full lg:w-auto px-6 py-2 bg-indigo-950 text-white text-sm font-medium rounded-full hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
              >
                Agregar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 📋 Tabla de Evaluaciones Inferior - SIMPLIFICADA */}
      <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
        {/* Header de la tabla con título y búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-500 mb-4 md:mb-0">
            Tipos de Evaluaciones ({evaluaciones.length})
          </h3>
          
          {/* 🔍 Barra de búsqueda */}
          <div className="w-full md:w-64">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar evaluación..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
        
        {evaluacionesFiltradas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {busqueda ? 'No hay evaluaciones que coincidan con la búsqueda.' : 'No hay evaluaciones registradas.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-950">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Evaluaciones
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Editar
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Eliminar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {evaluacionesFiltradas.map((evaluacion) => (
                  <tr key={evaluacion.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{evaluacion.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => iniciarEdicion(evaluacion)}
                        className="inline-flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-800 transition-colors duration-200"
                      >
                        <span className="text-lg">✏️</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => setEvaluacionAEliminar(evaluacion)}
                        className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <span className="text-lg">🗑️</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🧨 Modal de confirmación de eliminación */}
      {evaluacionAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirmar eliminación
            </h3>
            
            <p className="text-gray-600 mb-2">
              ¿Estás seguro de eliminar esta evaluación?
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-medium text-gray-800">{evaluacionAEliminar.nombre}</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEvaluacionAEliminar(null)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
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

export default NuevaEvaluacion;