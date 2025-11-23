import React, { useEffect, useState, useMemo } from 'react';
import CargarEvaluacion from './CargarEvaluacion';
import HistorialAcademico from './HistorialAcademico';

function DetalleNotas({ estudiante, onVolver, onActualizarEvaluaciones }) {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [formTemp, setFormTemp] = useState({});
  const [vista, setVista] = useState('detalle');
  const [evaluacionAEliminar, setEvaluacionAEliminar] = useState(null);

  // Cargar evaluaciones del estudiante
  useEffect(() => {
    if (estudiante?.evaluaciones) {
      setEvaluaciones(estudiante.evaluaciones);
    }
  }, [estudiante]);

  // Calcular promedio
  const promedio = useMemo(() => {
    const totalPonderacion = evaluaciones.reduce((acc, item) => acc + item.ponderacion, 0);
    const totalAportado = evaluaciones.reduce((acc, item) => acc + ((item.nota * item.ponderacion) / 20), 0);
    return totalPonderacion > 0 ? Math.round((totalAportado / totalPonderacion) * 100) : 0;
  }, [evaluaciones]);

  // Color del promedio basado en el rendimiento
  const getColorPromedio = (promedio) => {
    if (promedio >= 90) return 'text-green-600 bg-green-100';
    if (promedio >= 80) return 'text-blue-600 bg-blue-100';
    if (promedio >= 70) return 'text-yellow-600 bg-yellow-100';
    if (promedio >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  // Texto descriptivo del promedio
  const textoPromedio = useMemo(() => {
    if (promedio >= 90) return 'Excelente';
    if (promedio >= 80) return 'Muy bien';
    if (promedio >= 70) return 'Bien';
    if (promedio >= 60) return 'Regular';
    return 'Deficiente';
  }, [promedio]);

  // Eliminar evaluación con confirmación
  const eliminarEvaluacion = (index) => {
    if (evaluacionAEliminar === null) return;
    
    const nuevas = [...evaluaciones];
    nuevas.splice(index, 1);
    setEvaluaciones(nuevas);
    onActualizarEvaluaciones(nuevas);
    setEvaluacionAEliminar(null);
  };

  // Iniciar edición de evaluación
  const iniciarEdicion = (index) => {
    setEditandoIndex(index);
    setFormTemp({ ...evaluaciones[index] });
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditandoIndex(null);
    setFormTemp({});
  };

  // Guardar edición
  const guardarEdicion = (index) => {
    const actualizadas = [...evaluaciones];
    actualizadas[index] = {
      ...formTemp,
      ponderacion: parseInt(formTemp.ponderacion),
      nota: parseInt(formTemp.nota),
    };
    setEvaluaciones(actualizadas);
    onActualizarEvaluaciones(actualizadas);
    cancelarEdicion();
  };

  // Manejar cambios en el formulario temporal
  const handleChange = (e) => {
    setFormTemp({ ...formTemp, [e.target.name]: e.target.value });
  };

  // Agregar nueva evaluación
  const agregarEvaluacion = (nueva) => {
    const actualizadas = [...evaluaciones, nueva];
    setEvaluaciones(actualizadas);
    onActualizarEvaluaciones(actualizadas);
    setVista('detalle');
  };

  // Datos de evaluación simulados basados en la imagen
  const evaluacionesSimuladas = useMemo(() => [
    {
      nombre: 'Interrogative',
      descripcion: 'Preguntas escritas/orales sobre gramática y vocabulario.',
      ponderacion: 10,
      nota: 8,
      estado: 'Completado'
    },
    {
      nombre: 'Presentation',
      descripcion: 'Exposición individual o grupal sobre un tema en inglés.',
      ponderacion: 15,
      nota: 12,
      estado: 'Completado'
    },
    {
      nombre: 'Speaking Quiz',
      descripcion: 'Evaluación oral de fluidez, pronunciación y vocabulario.',
      ponderacion: 20,
      nota: 16,
      estado: 'Completado'
    },
    {
      nombre: 'Test',
      descripcion: 'Examen escrito de comprensión lectora y gramática.',
      ponderacion: 20,
      nota: 17,
      estado: 'Completado'
    },
    {
      nombre: 'Listening Test',
      descripcion: 'Prueba de comprensión auditiva a través de audios en inglés.',
      ponderacion: 10,
      nota: 8,
      estado: 'Completado'
    },
    {
      nombre: 'Speaking Test',
      descripcion: 'Evaluación oral formal (entrevista, diálogo o role-play).',
      ponderacion: 20,
      nota: 16,
      estado: 'Completado'
    },
    {
      nombre: 'Assistance',
      descripcion: 'Asistencia regular, participación en clase y puntualidad.',
      ponderacion: 5,
      nota: 5,
      estado: 'Completado'
    }
  ], []);

  // Cargar datos simulados si no hay evaluaciones
  useEffect(() => {
    if (evaluaciones.length === 0 && estudiante) {
      setEvaluaciones(evaluacionesSimuladas);
    }
  }, [evaluaciones.length, estudiante, evaluacionesSimuladas]);

  //  Navegación a otras vistas
  if (vista === 'evaluar') {
    return (
      <CargarEvaluacion
        estudiante={estudiante}
        onVolver={() => setVista('detalle')}
        onEvaluacionCargada={agregarEvaluacion}
      />
    );
  }

  if (vista === 'historial') {
    return (
      <HistorialAcademico
        estudiante={estudiante}
        onVolver={() => setVista('detalle')}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/*  Header de la página */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Cargar Notas
          </h1>
          <p className="text-gray-600">
            Detalle de evaluaciones y notas del estudiante
          </p>
        </div>
        
        <button
          onClick={onVolver}
          className="flex items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-full text-white bg-blue-500 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
        >
          <span className="mr-2">←</span>
          Atrás
        </button>
      </div>

      {/*  Información del estudiante */}
      {estudiante && (
        <div className="bg-gray-50 rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Estudiante</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <p className="text-gray-900 font-medium">{estudiante.nombre}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
              <p className="text-gray-900 font-medium">{estudiante.cedula}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
              <p className="text-gray-900 font-medium">{estudiante.nivel}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
              <p className="text-gray-900 font-medium">{estudiante.curso}</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => setVista('historial')}
              className="inline-flex items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-full text-white bg-blue-500 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
            >
              Histórico
            </button>
            <button
              onClick={() => setVista('evaluar')}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-blue-500 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
            >
            Evaluar
            </button>
          </div>
        </div>
      )}

      {/*  Tabla de evaluaciones */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-950">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Evaluación
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Descripción
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Ponderación
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Nota Obtenida
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Editar
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Eliminar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {evaluaciones.map((evaluacion, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                  {editandoIndex === index ? (
                    // Modo edición
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          name="nombre"
                          value={formTemp.nombre || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 text-gray-700"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          name="descripcion"
                          value={formTemp.descripcion || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 text-gray-700"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          name="ponderacion"
                          type="number"
                          value={formTemp.ponderacion || ''}
                          onChange={handleChange}
                          className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 text-gray-700"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          name="nota"
                          type="number"
                          value={formTemp.nota || ''}
                          onChange={handleChange}
                          className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 text-gray-700"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => guardarEdicion(index)}
                          className="inline-flex items-center p-2 border border-green-300 rounded-lg text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                          title="Guardar cambios"
                        >
                          <span className="text-lg">💾</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={cancelarEdicion}
                          className="inline-flex items-center p-2 border border-red-300 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                          title="Cancelar edición"
                        >
                          <span className="text-lg">❌</span>
                        </button>
                      </td>
                    </>
                  ) : (
                    // Modo visualización
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{evaluacion.nombre}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs">{evaluacion.descripcion}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{evaluacion.ponderacion}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{evaluacion.nota}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => iniciarEdicion(index)}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
                          title="Editar evaluación"
                        >
                          <span className="text-lg">✏️</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => setEvaluacionAEliminar(index)}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
                          title="Eliminar evaluación"
                        >
                          <span className="text-lg">🗑️</span>
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Información del promedio y tabla de conversión */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Promedio actual */}
        <div className="bg-gray-50 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Promedio Actual</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-800">{promedio}%</p>
              <p className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getColorPromedio(promedio)}`}>
                {textoPromedio}
              </p>
            </div>
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
              <span className="text-2xl font-bold text-gray-700">{promedio}%</span>
            </div>
          </div>
        </div>

        {/* Tabla de conversión */}
        <div className="bg-gray-50 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tabla de Conversión de Nota Final</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">(18 puntos):</span>
              <span className="font-medium text-gray-900">79 - 85%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">(19 puntos):</span>
              <span className="font-medium text-gray-900">86 - 92%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">(17 puntos):</span>
              <span className="font-medium text-gray-900">72 - 78%</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">(20 puntos):</span>
              <span className="font-medium text-gray-900">93 - 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {evaluacionAEliminar !== null && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirmar eliminación
            </h3>
            
            <p className="text-gray-600 mb-2">
              ¿Estás seguro de que deseas eliminar la siguiente evaluación?
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-medium text-gray-800">{evaluaciones[evaluacionAEliminar]?.nombre}</p>
              <p className="text-gray-600 text-sm">Nota: {evaluaciones[evaluacionAEliminar]?.nota}</p>
              <p className="text-gray-600 text-sm">Ponderación: {evaluaciones[evaluacionAEliminar]?.ponderacion}%</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEvaluacionAEliminar(null)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminarEvaluacion(evaluacionAEliminar)}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
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

export default DetalleNotas;