import React, { useEffect, useState, useMemo } from 'react';
import CargarEvaluacion from './CargarEvaluacion';
import HistorialAcademico from './HistorialAcademico';

function DetalleNotas({ estudiante, onVolver, onActualizarEvaluaciones }) {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [formTemp, setFormTemp] = useState({});
  const [vista, setVista] = useState('detalle');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [profesor, setProfesor] = useState(null);
  const [loadingProfesor, setLoadingProfesor] = useState(false);

  // Función para calcular ponderación automáticamente (nota/20 * 100)
  const calcularPonderacion = (nota) => {
    const notaNum = parseFloat(nota) || 0;
    return Math.round((notaNum / 20) * 100);
  };

  // Cargar información del profesor desde la API
  useEffect(() => {
    const cargarProfesor = async () => {
      const cedulaProfesor = estudiante?.datosCompletos?.student_cedula_teacher_id;
      
      if (!cedulaProfesor) {
        console.log('❌ No se encontró cédula del profesor en los datos del estudiante');
        setProfesor(null);
        return;
      }

      try {
        setLoadingProfesor(true);
        console.log(`🔄 Cargando información del profesor con cédula: ${cedulaProfesor}`);
        
        const response = await fetch('http://localhost:6500/api/teachers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const resultado = await response.json();
          console.log('✅ Lista de profesores cargada:', resultado);
          
          if (resultado.success && resultado.data) {
            const profesorEncontrado = resultado.data.find(
              prof => prof.teacher_cedula == cedulaProfesor
            );
            
            if (profesorEncontrado) {
              console.log('✅ Profesor encontrado:', profesorEncontrado);
              setProfesor(profesorEncontrado);
            } else {
              console.log('❌ No se encontró el profesor con cédula:', cedulaProfesor);
              setProfesor(null);
            }
          } else {
            console.log('❌ No hay datos de profesores');
            setProfesor(null);
          }
        } else {
          console.log(`❌ Error al cargar profesores: ${response.status}`);
          setProfesor(null);
        }
      } catch (error) {
        console.error('❌ Error cargando profesor:', error);
        setProfesor(null);
      } finally {
        setLoadingProfesor(false);
      }
    };

    if (estudiante?.datosCompletos?.student_cedula_teacher_id) {
      cargarProfesor();
    } else {
      setProfesor(null);
    }
  }, [estudiante]);

  // Cargar evaluaciones del estudiante desde la API
  useEffect(() => {
    const cargarEvaluaciones = async () => {
      if (!estudiante?.cedula) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`🔄 Cargando evaluaciones para: ${estudiante.cedula}`);
        
        const response = await fetch(`http://localhost:6500/api/evaluations/${estudiante.cedula}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const resultado = await response.json();
          console.log('✅ Evaluaciones cargadas:', resultado);
          
          if (resultado.success && resultado.data) {
            const evaluacionesTransformadas = resultado.data.map((itemEvaluacion, index) => {
              const nota = parseFloat(itemEvaluacion.score) || 0;
              const ponderacionCalculada = calcularPonderacion(nota);
              
              return {
                id: itemEvaluacion.id_evaluation || `evaluacion-${Date.now()}-${index}`,
                id_evaluation: itemEvaluacion.id_evaluation,
                nombre: itemEvaluacion.type_evaluation || 'Evaluación',
                descripcion: itemEvaluacion.evaluation_description || 'Sin descripción',
                ponderacion: ponderacionCalculada,
                nota: nota,
                fecha: itemEvaluacion.evaluation_date || new Date().toISOString(),
                estado: 'Completado',
                datosOriginales: itemEvaluacion
              };
            });
            
            setEvaluaciones(evaluacionesTransformadas);
            if (onActualizarEvaluaciones) {
              onActualizarEvaluaciones(evaluacionesTransformadas);
            }
          } else {
            console.log('❌ No hay evaluaciones para este estudiante');
            setEvaluaciones([]);
          }
        } else {
          console.log(`❌ Error al cargar evaluaciones: ${response.status}`);
          setEvaluaciones([]);
        }
      } catch (error) {
        console.error('❌ Error cargando evaluaciones:', error);
        setEvaluaciones([]);
      } finally {
        setLoading(false);
      }
    };

    cargarEvaluaciones();
  }, [estudiante?.cedula]);

  // Función para actualizar evaluación en la API
  const actualizarEvaluacionAPI = async (evaluacionId, datosActualizados) => {
    try {
      setGuardando(true);
      console.log('📤 Actualizando evaluación:', { evaluacionId, datosActualizados });

      // Obtener los datos originales de la evaluación
      const evaluacionOriginal = evaluaciones.find(evaluacionItem => evaluacionItem.id_evaluation === evaluacionId);
      
      if (!evaluacionOriginal) {
        throw new Error('No se encontró la evaluación original');
      }

      // Obtener type_evaluation_id de los datos originales
      const typeEvaluationId = evaluacionOriginal.datosOriginales?.type_evaluation_id || 1;

      // Preparar los datos en el formato exacto que espera el backend
      const datosParaAPI = {
        cedula_student_id: parseInt(estudiante.cedula),
        cedula_teacher_id: parseInt(estudiante.datosCompletos?.student_cedula_teacher_id || 0),
        level_id: parseInt(estudiante.nivel) || 1,
        type_evaluation_id: typeEvaluationId,
        score: parseFloat(datosActualizados.nota) || 0
      };

      console.log('📤 Datos enviados a API:', datosParaAPI);

      const response = await fetch(`http://localhost:6500/api/evaluations/${evaluacionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosParaAPI)
      });

      const responseData = await response.json();
      console.log('📥 Respuesta del servidor:', responseData);

      if (response.ok) {
        console.log('✅ Evaluación actualizada exitosamente');
        return { success: true, data: responseData };
      } else {
        console.error('❌ Error del servidor:', responseData);
        return { 
          success: false, 
          error: responseData.message || 'Error del servidor',
          details: responseData
        };
      }
    } catch (error) {
      console.error('❌ Error en la petición de actualización:', error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión'
      };
    } finally {
      setGuardando(false);
    }
  };

  // Calcular promedio
  const promedio = useMemo(() => {
    if (evaluaciones.length === 0) return 0;
    
    const totalPonderacion = evaluaciones.reduce((acc, item) => acc + (item.ponderacion || 0), 0);
    const totalAportado = evaluaciones.reduce((acc, item) => {
      const nota = item.nota || 0;
      const ponderacion = item.ponderacion || 0;
      return acc + ((nota * ponderacion) / 20);
    }, 0);
    
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

  // Iniciar edición de evaluación
  const iniciarEdicion = (index) => {
    console.log('✏️ Iniciando edición de evaluación:', evaluaciones[index]);
    setEditandoIndex(index);
    setFormTemp({ 
      ...evaluaciones[index],
      descripcion: evaluaciones[index].descripcion || '',
      nota: evaluaciones[index].nota || 0
    });
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    console.log('❌ Cancelando edición');
    setEditandoIndex(null);
    setFormTemp({});
  };

  // Guardar edición
  const guardarEdicion = async (index) => {
    console.log('💾 Guardando edición para índice:', index);
    
    // Validaciones básicas
    if (!formTemp.nota && formTemp.nota !== 0) {
      alert('Por favor, ingresa una nota válida');
      return;
    }

    const nota = parseFloat(formTemp.nota) || 0;
    if (nota < 0 || nota > 20) {
      alert('La nota debe estar entre 0 y 20');
      return;
    }

    const ponderacionCalculada = calcularPonderacion(nota);
    
    // Preparar datos actualizados
    const datosActualizados = {
      ...evaluaciones[index],
      descripcion: formTemp.descripcion || '',
      nota: nota,
      ponderacion: ponderacionCalculada,
    };

    console.log('📝 Datos actualizados:', datosActualizados);

    const evaluacionOriginal = evaluaciones[index];
    
    // Si tiene ID real (de la base de datos), actualizar en la API
    if (evaluacionOriginal.id_evaluation) {
      console.log('🔄 Actualizando evaluación en API...');
      const resultado = await actualizarEvaluacionAPI(evaluacionOriginal.id_evaluation, datosActualizados);
      
      if (!resultado.success) {
        alert(`❌ Error al actualizar la evaluación: ${resultado.error}`);
        console.error('Detalles del error:', resultado.details);
        return;
      }
      
      // Recargar las evaluaciones desde el servidor
      console.log('🔄 Recargando evaluaciones desde servidor...');
      const response = await fetch(`http://localhost:6500/api/evaluations/${estudiante.cedula}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const resultado = await response.json();
        if (resultado.success && resultado.data) {
          const evaluacionesActualizadas = resultado.data.map((itemEvaluacion, idx) => {
            const nota = parseFloat(itemEvaluacion.score) || 0;
            const ponderacionCalculada = calcularPonderacion(nota);
            
            return {
              id: itemEvaluacion.id_evaluation || `evaluacion-${Date.now()}-${idx}`,
              id_evaluation: itemEvaluacion.id_evaluation,
              nombre: itemEvaluacion.type_evaluation || 'Evaluación',
              descripcion: itemEvaluacion.evaluation_description || 'Sin descripción',
              ponderacion: ponderacionCalculada,
              nota: nota,
              fecha: itemEvaluacion.evaluation_date || new Date().toISOString(),
              estado: 'Completado',
              datosOriginales: itemEvaluacion
            };
          });
          
          setEvaluaciones(evaluacionesActualizadas);
          if (onActualizarEvaluaciones) {
            onActualizarEvaluaciones(evaluacionesActualizadas);
          }
        }
      }
    } else {
      // Si es una evaluación temporal, solo actualizar el estado local
      const actualizadas = [...evaluaciones];
      actualizadas[index] = datosActualizados;
      setEvaluaciones(actualizadas);
      if (onActualizarEvaluaciones) {
        onActualizarEvaluaciones(actualizadas);
      }
    }
    
    cancelarEdicion();
    alert('✅ Evaluación actualizada exitosamente');
  };

  // Manejar cambios en el formulario temporal
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`📝 Cambio en campo ${name}:`, value);
    
    const nuevosDatos = { ...formTemp, [name]: value };
    
    // Si cambia la nota, recalcular automáticamente la ponderación
    if (name === 'nota') {
      const nota = parseFloat(value) || 0;
      nuevosDatos.ponderacion = calcularPonderacion(nota);
      console.log(`🔢 Ponderación recalculada: ${nota}/20 = ${nuevosDatos.ponderacion}%`);
    }
    
    setFormTemp(nuevosDatos);
  };

  // Agregar nueva evaluación
  const agregarEvaluacion = (nueva) => {
    const nota = nueva.nota || 0;
    const ponderacionCalculada = calcularPonderacion(nota);
    
    const evaluacionConPonderacion = {
      ...nueva,
      ponderacion: ponderacionCalculada
    };
    
    const actualizadas = [...evaluaciones, evaluacionConPonderacion];
    setEvaluaciones(actualizadas);
    if (onActualizarEvaluaciones) {
      onActualizarEvaluaciones(actualizadas);
    }
    setVista('detalle');
  };

  // Función para obtener el nombre del profesor
  const obtenerNombreProfesor = () => {
    if (profesor) {
      const { 
        teacher_first_name, 
        teacher_second_name, 
        teacher_first_lastname, 
        teacher_second_lastname 
      } = profesor;
      
      let nombreCompleto = '';
      
      if (teacher_first_name) nombreCompleto += teacher_first_name;
      if (teacher_second_name) nombreCompleto += ` ${teacher_second_name}`;
      if (teacher_first_lastname) nombreCompleto += ` ${teacher_first_lastname}`;
      if (teacher_second_lastname) nombreCompleto += ` ${teacher_second_lastname}`;
      
      return nombreCompleto.trim() || 'Profesor no disponible';
    }
    
    if (estudiante?.datosCompletos?.student_cedula_teacher_id) {
      return `Profesor ID: ${estudiante.datosCompletos.student_cedula_teacher_id}`;
    }
    
    return 'No asignado';
  };

  // Navegación a otras vistas
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
      {/* Header de la página */}
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
          disabled={guardando}
          className="flex items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-full text-white bg-blue-500 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="mr-2">←</span>
          Atrás
        </button>
      </div>

      {/* Información del estudiante */}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Profesor</label>
              <div className="text-gray-900 font-medium">
                {loadingProfesor ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-950 mr-2"></div>
                    Cargando...
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span>{obtenerNombreProfesor()}</span>
                    {profesor && (
                      <span className="text-xs text-gray-500 mt-1">
                        Cédula: {profesor.teacher_cedula}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => setVista('historial')}
              disabled={guardando}
              className="inline-flex items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-full text-white bg-blue-500 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Histórico
            </button>
            <button
              onClick={() => setVista('evaluar')}
              disabled={guardando}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-blue-500 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Evaluar
            </button>
          </div>
        </div>
      )}

      {/* Indicador de carga global */}
      {guardando && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Guardando cambios...
        </div>
      )}

      {/* Tabla de evaluaciones */}
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
                  Nota Obtenida
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Ponderación Calculada
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Editar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-950"></div>
                      <span className="ml-3 text-gray-600">Cargando evaluaciones...</span>
                    </div>
                  </td>
                </tr>
              ) : evaluaciones.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="text-gray-400 text-6xl mb-4">📭</div>
                    <p className="text-gray-500 text-lg font-medium">No hay evaluaciones</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Este estudiante no tiene evaluaciones registradas
                    </p>
                  </td>
                </tr>
              ) : (
                evaluaciones.map((evaluacion, index) => (
                  <tr 
                    key={`${evaluacion.id_evaluation || evaluacion.id}-${index}`}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    {editandoIndex === index ? (
                      // Modo edición
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-2 rounded border">
                            {evaluacion.nombre}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            (Tipo de evaluación no editable)
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            name="descripcion"
                            value={formTemp.descripcion || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 text-gray-700"
                            disabled={guardando}
                            placeholder="Descripción de la evaluación..."
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            name="nota"
                            type="number"
                            step="0.1"
                            min="0"
                            max="20"
                            value={formTemp.nota || ''}
                            onChange={handleChange}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 text-gray-700"
                            disabled={guardando}
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            Rango: 0 - 20
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700 font-medium">
                            {formTemp.ponderacion}%
                          </div>
                          <div className="text-xs text-gray-500">
                            (Calculado automáticamente)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => guardarEdicion(index)}
                              disabled={guardando}
                              className="inline-flex items-center px-3 py-2 border border-green-300 rounded-lg text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Guardar cambios"
                            >
                              {guardando ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              ) : (
                                <>
                                  <span className="text-lg mr-1">💾</span>
                                  <span>Guardar</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={cancelarEdicion}
                              disabled={guardando}
                              className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Cancelar edición"
                            >
                              <span className="text-lg mr-1">❌</span>
                              <span>Cancelar</span>
                            </button>
                          </div>
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
                          <div className="text-sm font-medium text-gray-900">{evaluacion.nota}/20</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700 font-medium">{evaluacion.ponderacion}%</div>
                          <div className="text-xs text-gray-500">
                            ({evaluacion.nota}/20 = {evaluacion.ponderacion}%)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => iniciarEdicion(index)}
                            disabled={guardando}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Editar evaluación"
                          >
                            <span className="text-lg mr-2">✏️</span>
                            <span>Editar</span>
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
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
              <p className="text-gray-600 text-sm mt-2">
                Basado en {evaluaciones.length} evaluación(es)
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
    </div>
  );
}

export default DetalleNotas;

