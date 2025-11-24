import React, { useState, useEffect } from 'react';

// Componente Text seguro
const Text = ({ children, className = "" }) => {
  return <span className={className}>{children}</span>;
};

function CargarEvaluacion({ estudiante, onVolver, onEvaluacionCargada }) {
  const [form, setForm] = useState({
    type_evaluation_id: '',
    descripcion: '',
    nota: '',
  });
  
  const [tiposDeEvaluacion, setTiposDeEvaluacion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cargandoTipos, setCargandoTipos] = useState(true);
  const [profesor, setProfesor] = useState(null);
  const [cargandoProfesor, setCargandoProfesor] = useState(false);
  const [nivel, setNivel] = useState(null);
  const [cargandoNivel, setCargandoNivel] = useState(false);

  // Función para calcular ponderación automáticamente
  const calcularPonderacion = (nota) => {
    const notaNum = parseFloat(nota) || 0;
    return Math.round((notaNum / 20) * 100);
  };

  // Cargar tipos de evaluación desde la API
  useEffect(() => {
    const cargarTiposEvaluacion = async () => {
      try {
        setCargandoTipos(true);
        console.log('🔄 Cargando tipos de evaluación...');
        
        const response = await fetch('http://localhost:6500/api/typesEvaluations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const resultado = await response.json();
          console.log('✅ Tipos de evaluación cargados:', resultado);
          
          if (resultado.success && resultado.data) {
            setTiposDeEvaluacion(resultado.data);
          } else {
            console.log('❌ No se pudieron cargar los tipos de evaluación');
          }
        } else {
          console.log(`❌ Error al cargar tipos: ${response.status}`);
        }
      } catch (error) {
        console.error('❌ Error cargando tipos de evaluación:', error);
      } finally {
        setCargandoTipos(false);
      }
    };

    cargarTiposEvaluacion();
  }, []);

  // Cargar información del profesor
  useEffect(() => {
    const cargarProfesor = async () => {
      const cedulaProfesor = estudiante?.datosCompletos?.student_cedula_teacher_id;
      
      if (!cedulaProfesor) {
        console.log('❌ No se encontró cédula del profesor en los datos del estudiante');
        setProfesor(null);
        return;
      }

      try {
        setCargandoProfesor(true);
        console.log(`🔄 Cargando profesor con cédula: ${cedulaProfesor}`);
        
        const response = await fetch('http://localhost:6500/api/teachers', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const resultado = await response.json();
        console.log('✅ Profesores cargados:', resultado);
        
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
      } catch (error) {
        console.error('❌ Error cargando profesor:', error);
        setProfesor(null);
      } finally {
        setCargandoProfesor(false);
      }
    };

    if (estudiante?.datosCompletos?.student_cedula_teacher_id) {
      cargarProfesor();
    } else {
      setProfesor(null);
    }
  }, [estudiante?.datosCompletos?.student_cedula_teacher_id]);

  // Cargar información del nivel
  useEffect(() => {
    const cargarNivel = async () => {
      const levelId = estudiante?.datosCompletos?.student_level_id;
      
      if (!levelId) {
        console.log('❌ No se encontró ID del nivel en los datos del estudiante');
        setNivel(null);
        return;
      }

      try {
        setCargandoNivel(true);
        console.log(`🔄 Cargando nivel con ID: ${levelId}`);
        
        const response = await fetch('http://localhost:6500/api/level', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const resultado = await response.json();
        console.log('✅ Niveles cargados:', resultado);
        
        if (resultado.success && resultado.data) {
          const nivelEncontrado = resultado.data.find(
            nivel => nivel.id_level == levelId
          );
          
          if (nivelEncontrado) {
            console.log('✅ Nivel encontrado:', nivelEncontrado);
            setNivel(nivelEncontrado);
          } else {
            console.log('❌ No se encontró el nivel con ID:', levelId);
            setNivel(null);
          }
        } else {
          console.log('❌ No hay datos de niveles');
          setNivel(null);
        }
      } catch (error) {
        console.error('❌ Error cargando nivel:', error);
        setNivel(null);
      } finally {
        setCargandoNivel(false);
      }
    };

    if (estudiante?.datosCompletos?.student_level_id) {
      cargarNivel();
    } else {
      setNivel(null);
    }
  }, [estudiante?.datosCompletos?.student_level_id]);

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
      return `Profesor Cédula: ${estudiante.datosCompletos.student_cedula_teacher_id}`;
    }
    
    return 'No asignado';
  };

  // Función para obtener el nombre del nivel
  const obtenerNombreNivel = () => {
    if (nivel) {
      return nivel.level_name || 'Nivel no disponible';
    }
    
    if (cargandoNivel) {
      return 'Cargando nivel...';
    }
    
    return estudiante?.nivel || 'No asignado';
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones básicas antes de enviar
    if (!form.type_evaluation_id || !form.nota) {
      alert('Por favor, selecciona el Tipo de Evaluación y ingresa la Nota.');
      setLoading(false);
      return;
    }

    // Validar que la nota esté entre 0 y 20
    const notaNum = parseFloat(form.nota);
    if (notaNum < 0 || notaNum > 20) {
      alert('La nota debe estar entre 0 y 20.');
      setLoading(false);
      return;
    }

    try {
      // Calcular ponderación automáticamente
      const ponderacionCalculada = calcularPonderacion(form.nota);

      // Obtener los IDs correctos
      const cedulaProfesor = estudiante?.datosCompletos?.student_cedula_teacher_id;
      const levelId = estudiante?.datosCompletos?.student_level_id;

      // Preparar datos para enviar a la API
      const datosEvaluacion = {
        cedula_student_id: parseInt(estudiante.cedula),
        cedula_teacher_id: cedulaProfesor || 20345678,
        level_id: levelId || 1,
        type_evaluation_id: parseInt(form.type_evaluation_id),
        score: parseFloat(form.nota),
        evaluation_ponderation: ponderacionCalculada,
        evaluation_description: form.descripcion || ''
      };

      console.log('📤 Enviando evaluación:', datosEvaluacion);
      console.log('👨‍🏫 Profesor asignado:', {
        cedula: cedulaProfesor,
        nombre: obtenerNombreProfesor()
      });
      console.log('📚 Nivel asignado:', {
        id: levelId,
        nombre: obtenerNombreNivel()
      });

      // Enviar a la API
      const response = await fetch('http://localhost:6500/api/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosEvaluacion)
      });

      if (response.ok) {
        const resultado = await response.json();
        console.log('✅ Evaluación creada:', resultado);

        // Crear objeto con la MISMA ESTRUCTURA que DetalleNotas espera
        const tipoSeleccionado = tiposDeEvaluacion.find(tipo => 
          tipo.id_type_evaluation === parseInt(form.type_evaluation_id)
        );
        
        const nuevaEvaluacion = {
          id: resultado.data?.id_evaluation || `eval-${Date.now()}`,
          id_evaluation: resultado.data?.id_evaluation,
          nombre: tipoSeleccionado?.type_evaluation || 'Evaluación',
          descripcion: form.descripcion || 'Sin descripción',
          ponderacion: ponderacionCalculada,
          nota: parseFloat(form.nota),
          fecha: new Date().toISOString(),
          estado: 'Completado',
          datosOriginales: {
            id_evaluation: resultado.data?.id_evaluation,
            type_evaluation: tipoSeleccionado?.type_evaluation,
            score: parseFloat(form.nota),
            evaluation_description: form.descripcion,
            evaluation_date: new Date().toISOString(),
            cedula_teacher_id: cedulaProfesor,
            level_id: levelId
          }
        };

        console.log('📝 Nueva evaluación creada:', nuevaEvaluacion);

        // Llamar a la función del padre para actualizar el estado
        onEvaluacionCargada(nuevaEvaluacion);
        
        // Mostrar mensaje de éxito
        alert('✅ Evaluación cargada exitosamente');
        
        // Volver a la vista anterior
        onVolver();
      } else {
        const errorData = await response.json();
        console.error('❌ Error al crear evaluación:', errorData);
        alert(`Error al cargar evaluación: ${errorData.message || 'Error del servidor'}`);
      }
    } catch (error) {
      console.error('❌ Error en la petición:', error);
      alert('Error de conexión al cargar la evaluación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto">
        
        {/* === Botón Atrás === */}
        <div className="mb-4">
          <button
            onClick={onVolver}
            disabled={loading}
            className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out disabled:opacity-50"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            <Text>Atrás</Text>
          </button>
        </div>
        
        {/* === Información del estudiante === */}
        {estudiante && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              <Text>Estudiante</Text>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Text>Nombre</Text>
                </label>
                <p className="text-gray-900 font-medium">
                  <Text>{estudiante.nombre}</Text>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Text>Cédula</Text>
                </label>
                <p className="text-gray-900 font-medium">
                  <Text>{estudiante.cedula}</Text>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Text>Nivel</Text>
                </label>
                <div className="flex items-center">
                  <p className="text-gray-900 font-medium">
                    <Text>{obtenerNombreNivel()}</Text>
                  </p>
                  {cargandoNivel && (
                    <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-950"></div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Información del profesor */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Text>Profesor Asignado</Text>
              </label>
              <div className="flex items-center">
                {cargandoProfesor ? (
                  <div className="flex items-center text-gray-900 font-medium">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-950 mr-2"></div>
                    <Text>Cargando profesor...</Text>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-medium">
                      <Text>{obtenerNombreProfesor()}</Text>
                    </span>
                    {profesor && (
                      <span className="text-xs text-gray-500 mt-1">
                        <Text>Cédula: {profesor.teacher_cedula} | ID: {profesor.id_teacher}</Text>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* === Contenedor Principal del Formulario === */}
        <div className="shadow-xl rounded-lg overflow-hidden">
          
          {/* Encabezado Azul Fuerte */}
          <div className="bg-indigo-950 p-4">
            <h2 className="text-xl font-semibold text-white">
              <Text>Evaluación</Text>
            </h2>
          </div>
          
          {/* Formulario y Contenido */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Primera Fila: Tipo y Nota */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Tipo de Evaluación (SELECT desde API) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Text>Tipo de Evaluación *</Text>
                </label>
                {cargandoTipos ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                    <div className="animate-pulse">
                      <Text>Cargando tipos...</Text>
                    </div>
                  </div>
                ) : (
                  <select
                    name="type_evaluation_id"
                    value={form.type_evaluation_id}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-950 appearance-none disabled:opacity-50"
                  >
                    <option value="" disabled>
                      <Text>Seleccionar tipo</Text>
                    </option>
                    {tiposDeEvaluacion.map((tipo) => (
                      <option 
                        key={`tipo-eval-${tipo.id_type_evaluation}`}
                        value={tipo.id_type_evaluation}
                      >
                        <Text>{tipo.type_evaluation}</Text>
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              {/* Nota (Input numérico) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Text>Nota (0-20) *</Text>
                </label>
                <input
                  name="nota"
                  type="number"
                  placeholder="0-20"
                  value={form.nota}
                  onChange={handleChange}
                  required
                  min="0"
                  max="20"
                  step="0.1"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-950 disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  <Text>La ponderación se calculará automáticamente: (nota/20) × 100</Text>
                </p>
              </div>
              
            </div>

            {/* Segunda Fila: Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Text>Descripción (Opcional)</Text>
              </label>
              <input
                name="descripcion"
                placeholder="Descripción de la evaluación..."
                value={form.descripcion}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-950 disabled:opacity-50"
              />
            </div>

            {/* Información de cálculo automático */}
            {form.nota && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 text-sm font-medium">
                    <Text>Ponderación calculada automáticamente:</Text>
                  </span>
                  <span className="text-blue-800 font-bold">
                    <Text>{calcularPonderacion(form.nota)}%</Text>
                  </span>
                </div>
                <p className="text-blue-600 text-xs mt-1">
                  <Text>({form.nota}/20 = {calcularPonderacion(form.nota)}%)</Text>
                </p>
              </div>
            )}

            {/* Información de envío */}
            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-blue-700 text-sm">
                    <Text>Enviando evaluación al servidor...</Text>
                  </span>
                </div>
              </div>
            )}

            {/* Botón de Cargar Centrado */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-full text-base font-medium text-white bg-blue-400 hover:bg-blue-500 transition duration-150 ease-in-out shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Text>{loading ? 'Cargando...' : 'Cargar Evaluación'}</Text>
              </button>
            </div>
          </form>
          
        </div>

        {/* Información de depuración (solo en desarrollo) */}
        <div className="mt-6 bg-gray-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            <Text>📋 Datos que se enviarán:</Text>
          </h4>
          <pre className="text-xs text-gray-600 bg-white p-2 rounded border">
            <Text>
              {JSON.stringify({
                cedula_student_id: parseInt(estudiante?.cedula),
                cedula_teacher_id: estudiante?.datosCompletos?.student_cedula_teacher_id || 'No asignado',
                level_id: estudiante?.datosCompletos?.student_level_id || 'No asignado',
                type_evaluation_id: form.type_evaluation_id ? parseInt(form.type_evaluation_id) : null,
                score: form.nota ? parseFloat(form.nota) : null,
                evaluation_ponderation: form.nota ? calcularPonderacion(form.nota) : null,
                evaluation_description: form.descripcion,
                profesor_info: {
                  id: profesor?.id_teacher,
                  cedula: profesor?.teacher_cedula,
                  nombre: obtenerNombreProfesor()
                },
                nivel_info: {
                  id: nivel?.id_level,
                  nombre: obtenerNombreNivel()
                }
              }, null, 2)}
            </Text>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default CargarEvaluacion;