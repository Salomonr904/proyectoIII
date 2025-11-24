import React, { useState, useMemo, useEffect } from "react";

// Componente Text seguro
const Text = ({ children, className = "" }) => {
  return <span className={className}>{children}</span>;
};

export default function HistorialAcademico({ estudiante = {}, onVolver }) {
  const [nivelSeleccionado, setNivelSeleccionado] = useState("");
  const [evaluacionesPorNivel, setEvaluacionesPorNivel] = useState({});
  const [loading, setLoading] = useState(true);
  const [profesor, setProfesor] = useState(null);
  const [loadingProfesor, setLoadingProfesor] = useState(false);
  const [niveles, setNiveles] = useState([]);
  const [cargandoNiveles, setCargandoNiveles] = useState(false);

  // Cargar lista de niveles desde la API - CORREGIDO
  useEffect(() => {
    const cargarNiveles = async () => {
      try {
        setCargandoNiveles(true);
        console.log('🔄 Cargando lista de niveles...');
        
        // ✅ CORRECCIÓN: URL correcta
        const response = await fetch('http://localhost:6500/api/levels', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const resultado = await response.json();
          console.log('✅ Niveles cargados:', resultado);
          
          if (resultado.success && resultado.data) {
            setNiveles(resultado.data);
          } else {
            console.log('❌ No se pudieron cargar los niveles');
            setNiveles([]);
          }
        } else {
          console.log(`❌ Error al cargar niveles: ${response.status}`);
          setNiveles([]);
        }
      } catch (error) {
        console.error('❌ Error cargando niveles:', error);
        setNiveles([]);
      } finally {
        setCargandoNiveles(false);
      }
    };

    cargarNiveles();
  }, []);

  // Cargar información del profesor - MEJORADO
  useEffect(() => {
    const cargarProfesor = async () => {
      const cedulaProfesor = estudiante?.datosCompletos?.student_cedula_teacher_id || 
                            estudiante?.profesorCedula;

      console.log('🔍 Buscando profesor con cédula:', cedulaProfesor);
      
      if (!cedulaProfesor) {
        console.log('❌ No se encontró cédula del profesor');
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

    if (estudiante && (estudiante.datosCompletos?.student_cedula_teacher_id || estudiante.profesorCedula)) {
      cargarProfesor();
    } else {
      console.log('⚠️ No hay datos suficientes del estudiante para cargar profesor');
      setProfesor(null);
    }
  }, [estudiante]);

  // Cargar evaluaciones del estudiante - MEJORADO
  useEffect(() => {
    const cargarEvaluaciones = async () => {
      const cedulaEstudiante = estudiante?.cedula;
      
      if (!cedulaEstudiante) {
        console.log('❌ No se encontró cédula del estudiante');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`🔄 Cargando historial académico para: ${cedulaEstudiante}`);
        
        const response = await fetch(`http://localhost:6500/api/evaluations/${cedulaEstudiante}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const resultado = await response.json();
          console.log('✅ Historial académico cargado:', resultado);
          
          if (resultado.success && resultado.data) {
            // Agrupar evaluaciones por nivel usando los datos reales de la API
            const evaluacionesAgrupadas = resultado.data.reduce((acc, evalItem) => {
              const nivel = obtenerNombreNivelDesdeAPI(evalItem.level_id);
              const nota = parseFloat(evalItem.score) || 0;
              const ponderacionCalculada = Math.round((nota / 20) * 100);
              
              // ✅ KEY ÚNICA Y ESTABLE
              const evaluacion = {
                id: `eval-${evalItem.id_evaluation}-${evalItem.level_id}`,
                id_evaluation: evalItem.id_evaluation,
                nombre: evalItem.type_evaluation || 'Evaluación',
                descripcion: evalItem.evaluation_description || 'Sin descripción',
                ponderacion: ponderacionCalculada,
                nota: nota,
                fecha: evalItem.evaluation_date || new Date().toISOString(),
                datosOriginales: evalItem
              };

              if (!acc[nivel]) {
                acc[nivel] = [];
              }
              acc[nivel].push(evaluacion);
              return acc;
            }, {});

            console.log('📊 Evaluaciones agrupadas por nivel:', evaluacionesAgrupadas);
            setEvaluacionesPorNivel(evaluacionesAgrupadas);

            // Si hay evaluaciones, seleccionar automáticamente el nivel actual del estudiante
            if (Object.keys(evaluacionesAgrupadas).length > 0) {
              const nivelActual = obtenerNivelEstudianteDesdeAPI();
              if (evaluacionesAgrupadas[nivelActual]) {
                setNivelSeleccionado(nivelActual);
              } else {
                // Si no hay evaluaciones del nivel actual, seleccionar el primero disponible
                setNivelSeleccionado(Object.keys(evaluacionesAgrupadas)[0]);
              }
            }
          } else {
            console.log('❌ No hay evaluaciones para este estudiante');
            setEvaluacionesPorNivel({});
          }
        } else {
          console.log(`❌ Error al cargar historial: ${response.status}`);
          setEvaluacionesPorNivel({});
        }
      } catch (error) {
        console.error('❌ Error cargando historial académico:', error);
        setEvaluacionesPorNivel({});
      } finally {
        setLoading(false);
      }
    };

    cargarEvaluaciones();
  }, [estudiante, niveles]);

  // Función para obtener nombre del nivel desde la API
  const obtenerNombreNivelDesdeAPI = (levelId) => {
    if (!levelId) return 'Nivel no definido';
    
    const nivelEncontrado = niveles.find(nivel => nivel.id_level == levelId);
    
    if (nivelEncontrado) {
      return nivelEncontrado.level_name || `Nivel ${levelId}`;
    }
    
    return `Nivel ${levelId}`;
  };

  // Función para obtener el nivel actual del estudiante desde la API
  const obtenerNivelEstudianteDesdeAPI = () => {
    const levelId = estudiante?.datosCompletos?.student_level_id || estudiante?.nivelId;
    
    if (levelId) {
      return obtenerNombreNivelDesdeAPI(levelId);
    }
    
    return 'Nivel no disponible';
  };

  // Función para obtener nombre del profesor
  const obtenerNombreProfesor = () => {
    if (profesor) {
      const { 
        teacher_first_name, 
        teacher_second_name, 
        teacher_first_lastname, 
        teacher_second_lastname 
      } = profesor;
      
      let nombreCompleto = '';
      
      if (teacher_first_name) {
        nombreCompleto += teacher_first_name;
      }
      
      if (teacher_second_name) {
        nombreCompleto += ` ${teacher_second_name}`;
      }
      
      if (teacher_first_lastname) {
        nombreCompleto += ` ${teacher_first_lastname}`;
      }
      
      if (teacher_second_lastname) {
        nombreCompleto += ` ${teacher_second_lastname}`;
      }
      
      return nombreCompleto.trim() || 'Profesor no disponible';
    }
    
    // Usar el profesor del estudiante si está disponible
    if (estudiante?.profesor) {
      return <Text>{estudiante.profesor}</Text>;
    }
    
    const cedulaProfesor = estudiante?.datosCompletos?.student_cedula_teacher_id || 
                          estudiante?.profesorCedula;
    
    if (cedulaProfesor) {
      return `Profesor Cédula: ${cedulaProfesor}`;
    }
    
    return 'No asignado';
  };

  // Función para obtener información del nivel actual desde la API
  const obtenerInfoNivelActual = () => {
    const levelId = estudiante?.datosCompletos?.student_level_id || estudiante?.nivelId;
    
    if (levelId) {
      const nivelEncontrado = niveles.find(nivel => nivel.id_level == levelId);
      
      if (nivelEncontrado) {
        return {
          nombre: nivelEncontrado.level_name || 'Nivel no disponible',
          diaClase: nivelEncontrado.class_day || 'No especificado',
          id: nivelEncontrado.id_level
        };
      }
    }
    
    return {
      nombre: 'Nivel no disponible',
      diaClase: 'No especificado',
      id: 'N/A'
    };
  };

  const evaluaciones = nivelSeleccionado
    ? evaluacionesPorNivel[nivelSeleccionado] || []
    : [];

  const porcentaje = useMemo(() => {
    const totalPonderacion = evaluaciones.reduce(
      (acc, ev) => acc + ev.ponderacion,
      0
    );
    const totalAportado = evaluaciones.reduce(
      (acc, ev) => acc + (ev.nota * ev.ponderacion) / 20,
      0
    );
    return totalPonderacion > 0
      ? Math.round((totalAportado / totalPonderacion) * 100)
      : 0;
  }, [evaluaciones]);

  // Obtener niveles disponibles
  const nivelesDisponibles = Object.keys(evaluacionesPorNivel);

  // Función para exportar PDF (placeholder)
  const handleExportPDF = () => {
    alert('Funcionalidad de exportar PDF en desarrollo');
  };

  return (
    <div className="w-full p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onVolver}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Text>← Volver al Detalle</Text>
        </button>

        <button 
          onClick={handleExportPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition"
        >
          <Text>Exportar PDF</Text>
        </button>
      </div>

      {/* Título */}
      <h2 className="text-2xl font-semibold text-gray-500 mb-6">
        <Text>Historial Académico</Text>
      </h2>

      {/* Perfil + Nivel + Porcentaje */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Perfil */}
        <div className="flex items-center gap-4">
          <img
            src="/img/student.png"
            className="w-20 h-20 rounded-full object-cover shadow"
            alt="Estudiante"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFOEU4RTgiLz4KPHBhdGggZD0iTTQwIDQ0QzQ0LjQxODMgNDQgNDggNDAuNDE4MyA0OCAzNkM0OCAzMS41ODE3IDQ0LjQxODMgMjggNDAgMjhDMzUuNTgxNyAyOCAzMiAzMS41ODE3IDMyIDM2QzMyIDQwLjQxODMgMzUuNTgxNyA0NCA0MCA0NFoiIGZpbGw9IiNCQkJCQkIiLz4KPHBhdGggZD0iTTQ4IDQ4SDBWNTJDMCA1Ny41MjIgNC40NzcgNjIgMTAgNjJINzBDNzUuNTIzIDYyIDgwIDU3LjUyMiA4MCA1MlY0OEg0OFoiIGZpbGw9IiNCQkJCQkIiLz4KPC9zdmc+';
            }}
          />
          <div>
            <p className="text-lg font-semibold text-gray-800">
              <Text>{estudiante?.nombre || "Nombre no disponible"}</Text>
            </p>
            <p className="text-gray-600">
              <Text>{estudiante?.cedula || "Cédula no disponible"}</Text>
            </p>
          </div>
        </div>

        {/* Nivel info - CON DATOS REALES DE API */}
        <div className="space-y-2">
          <div className="flex items-center">
            <p className="text-lg font-medium text-gray-700 mr-2">
              <Text>Nivel Seleccionado:</Text>
            </p>
            <span className="font-semibold text-indigo-600">
              <Text>{nivelSeleccionado || "—"}</Text>
            </span>
          </div>
          
          <div className="flex items-center">
            <p className="text-gray-600 mr-2">
              <Text>Profesor:</Text>
            </p>
            <div className="flex items-center">
              <span className="font-medium">
                <Text>{obtenerNombreProfesor()}</Text>
              </span>
              {loadingProfesor && (
                <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600"></div>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <p className="text-gray-600 mr-2">
              <Text>Nivel Actual:</Text>
            </p>
            <div className="flex items-center">
              <span className="font-medium">
                <Text>{obtenerInfoNivelActual().nombre}</Text>
              </span>
              {cargandoNiveles && (
                <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600"></div>
              )}
            </div>
          </div>

          {obtenerInfoNivelActual().diaClase && obtenerInfoNivelActual().diaClase !== 'No especificado' && (
            <div className="flex items-center">
              <p className="text-gray-600 mr-2">
                <Text>Día de clase:</Text>
              </p>
              <span className="font-medium">
                <Text>{obtenerInfoNivelActual().diaClase}</Text>
              </span>
            </div>
          )}
        </div>

        {/* Porcentaje circular */}
        <div className="flex justify-center">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="50"
                stroke="#e5e7eb"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="50"
                stroke="#2563eb"
                strokeWidth="10"
                strokeDasharray={314}
                strokeDashoffset={314 - (314 * porcentaje) / 100}
                fill="transparent"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-gray-700">
              <Text>{porcentaje}%</Text>
            </span>
          </div>
        </div>
      </div>

      {/* Selector de nivel */}
      <div className="mt-6 w-64">
        <select
          className="w-full p-2 border rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={nivelSeleccionado}
          onChange={(e) => setNivelSeleccionado(e.target.value)}
          disabled={loading || nivelesDisponibles.length === 0}
        >
          <option value="">
            <Text>Seleccione Nivel</Text>
          </option>
          {nivelesDisponibles.map((nivel) => (
            <option key={`nivel-${nivel}`} value={nivel}>
              <Text>{nivel}</Text>
            </option>
          ))}
        </select>
        {loading && (
          <p className="text-sm text-gray-500 mt-2">
            <Text>Cargando niveles...</Text>
          </p>
        )}
        {!loading && nivelesDisponibles.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">
            <Text>No hay niveles disponibles</Text>
          </p>
        )}
      </div>

      {/* Tabla - MEJORADA CON KEYS ÚNICAS */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-indigo-950 text-white">
            <tr>
              <th className="p-3 text-left">
                <Text>Evaluación</Text>
              </th>
              <th className="p-3 text-left">
                <Text>Descripción</Text>
              </th>
              <th className="p-3 text-left">
                <Text>Ponderación</Text>
              </th>
              <th className="p-3 text-left">
                <Text>Nota Obtenida</Text>
              </th>
            </tr>
          </thead>

          {loading ? (
            <tbody>
              <tr>
                <td colSpan="4" className="p-6 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-950"></div>
                    <span className="ml-3 text-gray-600">
                      <Text>Cargando historial académico...</Text>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : evaluaciones.length > 0 ? (
            <tbody>
              {evaluaciones.map((ev, index) => (
                <tr 
                  key={`${ev.id}-${index}-${ev.id_evaluation}`} 
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3 font-medium text-gray-800">
                    <Text>{ev.nombre}</Text>
                  </td>
                  <td className="p-3 text-gray-700">
                    <Text>{ev.descripcion}</Text>
                  </td>
                  <td className="p-3">
                    <Text>{ev.ponderacion}%</Text>
                  </td>
                  <td className="p-3 font-medium text-gray-800">
                    <Text>{ev.nota}/20</Text>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  <Text>
                    {nivelSeleccionado 
                      ? `No hay evaluaciones registradas para el nivel ${nivelSeleccionado}`
                      : 'Seleccione un nivel para ver las evaluaciones'
                    }
                  </Text>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {/* Información adicional */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">
            <Text>Total de Niveles Cursados</Text>
          </h4>
          <p>
            <Text>{nivelesDisponibles.length} nivel(es)</Text>
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">
            <Text>Total de Evaluaciones</Text>
          </h4>
          <p>
            <Text>{Object.values(evaluacionesPorNivel).flat().length} evaluación(es)</Text>
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">
            <Text>Promedio General</Text>
          </h4>
          <p>
            <Text>{porcentaje}%</Text>
          </p>
        </div>
      </div>
    </div>
  );
}

 