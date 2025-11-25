import React, { useState, useEffect } from 'react';
import DetalleNotas from './DetalleNotas';

// Configuración de logging
const DEBUG = process.env.NODE_ENV === 'development';

const debugLog = (...args) => {
  if (DEBUG) {
    console.log(...args);
  }
};

const errorLog = (...args) => {
  console.error(...args);
};

function GestionNotas() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [nivel, setNivel] = useState('todos');
  const [profesorFiltro, setProfesorFiltro] = useState('todos');
  const [loading, setLoading] = useState(false);
  const [vista, setVista] = useState('lista');
  const [estudianteActual, setEstudianteActual] = useState(null);
  const [niveles, setNiveles] = useState([]);
  const [profesores, setProfesores] = useState([]);

  // Calcular promedio de evaluaciones
  const calcularPromedio = (evaluaciones) => {
    if (!evaluaciones || evaluaciones.length === 0) return 0;
    
    const totalPonderacion = evaluaciones.reduce((acc, e) => acc + (e.ponderacion || 0), 0);
    const totalAportado = evaluaciones.reduce((acc, e) => {
      return acc + (((e.nota || 0) * (e.ponderacion || 0)) / 20);
    }, 0);
    
    return totalPonderacion > 0 ? Math.round((totalAportado / totalPonderacion) * 100) : 0;
  };

  // Cargar datos del estudiante individual
  const cargarDatosEstudiante = async (estudiante, nivelesData, profesoresData) => {
    try {
      // Obtener evaluaciones del estudiante
      let evaluaciones = [];
      let promedio = 0;

      try {
        const responseEvaluaciones = await fetch(`http://localhost:6500/api/evaluations/${estudiante.student_cedula}`);
        
        if (responseEvaluaciones.ok) {
          const resultadoEvaluaciones = await responseEvaluaciones.json();
          
          if (resultadoEvaluaciones.success && resultadoEvaluaciones.data) {
            evaluaciones = resultadoEvaluaciones.data.map(evalItem => ({
              id: evalItem.id_evaluation,
              nombre: evalItem.evaluation_name,
              ponderacion: evalItem.evaluation_ponderation,
              nota: evalItem.score || 0,
              fecha: evalItem.evaluation_date
            }));

            promedio = calcularPromedio(evaluaciones);
          }
        } else if (responseEvaluaciones.status === 404) {
          debugLog(`📝 No hay evaluaciones para ${estudiante.student_cedula}`);
        }
      } catch (error) {
        debugLog(`❌ Error cargando evaluaciones para ${estudiante.student_cedula}`);
      }

      // Obtener nombre del nivel
      const nivelEstudiante = nivelesData.find(n => n.id_level === estudiante.student_level_id);
      const nombreNivel = nivelEstudiante ? nivelEstudiante.level_name : `Nivel ${estudiante.student_level_id}`;

      // Buscar profesor por cédula
      let profesorAsignado = 'Sin asignar';
      let profesorCedula = null;
      
      if (estudiante.student_cedula_teacher_id) {
        const profesorDelEstudiante = profesoresData.find(p => 
          p.teacher_cedula === estudiante.student_cedula_teacher_id
        );

        if (profesorDelEstudiante) {
          profesorAsignado = `${profesorDelEstudiante.teacher_first_name || ''} ${profesorDelEstudiante.teacher_first_lastname || ''}`.trim();
          profesorCedula = profesorDelEstudiante.teacher_cedula;
          debugLog(`✅ Profesor encontrado para ${estudiante.student_cedula}:`, profesorAsignado);
        } else {
          debugLog(`❌ No se encontró profesor para ${estudiante.student_cedula}`);
        }
      } else {
        debugLog(`⚠️ Estudiante ${estudiante.student_cedula} sin profesor asignado`);
      }

      debugLog(`🎯 Estudiante ${estudiante.student_cedula}: Nivel=${nombreNivel}, Profesor=${profesorAsignado}`);

      return {
        cedula: estudiante.student_cedula?.toString(),
        nombre: `${estudiante.student_first_name || ''} ${estudiante.student_second_name || ''} ${estudiante.student_first_lastname || ''} ${estudiante.student_second_lastname || ''}`.trim(),
        nivel: nombreNivel,
        nivelId: estudiante.student_level_id,
        profesor: profesorAsignado,
        profesorCedula: profesorCedula,
        promedio: promedio,
        evaluaciones: evaluaciones,
        datosCompletos: estudiante
      };
    } catch (error) {
      errorLog(`Error procesando estudiante ${estudiante.student_cedula}:`, error);
      
      const nivelEstudiante = nivelesData.find(n => n.id_level === estudiante.student_level_id);
      const nombreNivel = nivelEstudiante ? nivelEstudiante.level_name : `Nivel ${estudiante.student_level_id}`;
      
      // También intentar asignar profesor en caso de error
      let profesorAsignado = 'Sin asignar';
      let profesorCedula = null;
      if (estudiante.student_cedula_teacher_id) {
        const profesorDelEstudiante = profesoresData.find(p => 
          p.teacher_cedula === estudiante.student_cedula_teacher_id
        );
        if (profesorDelEstudiante) {
          profesorAsignado = `${profesorDelEstudiante.teacher_first_name || ''} ${profesorDelEstudiante.teacher_first_lastname || ''}`.trim();
          profesorCedula = profesorDelEstudiante.teacher_cedula;
        }
      }

      return {
        cedula: estudiante.student_cedula?.toString(),
        nombre: `${estudiante.student_first_name || ''} ${estudiante.student_second_name || ''} ${estudiante.student_first_lastname || ''} ${estudiante.student_second_lastname || ''}`.trim(),
        nivel: nombreNivel,
        nivelId: estudiante.student_level_id,
        profesor: profesorAsignado,
        profesorCedula: profesorCedula,
        promedio: 0,
        evaluaciones: [],
        datosCompletos: estudiante
      };
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      
      try {
        // 1. Cargar niveles desde la API
        debugLog('🔄 Cargando niveles...');
        const responseNiveles = await fetch('http://localhost:6500/api/level');
        const resultadoNiveles = await responseNiveles.json();
        
        let nivelesData = [];
        if (resultadoNiveles.success && resultadoNiveles.data) {
          nivelesData = resultadoNiveles.data;
          debugLog('✅ Niveles cargados:', nivelesData.length);
        } else {
          debugLog('❌ No se pudieron cargar los niveles');
        }
        setNiveles(nivelesData);

        // 2. Cargar profesores desde la API
        debugLog('🔄 Cargando profesores...');
        const responseProfesores = await fetch('http://localhost:6500/api/teachers');
        const resultadoProfesores = await responseProfesores.json();
        
        let profesoresData = [];
        if (resultadoProfesores.success && resultadoProfesores.data) {
          profesoresData = resultadoProfesores.data;
          debugLog('✅ Profesores cargados:', profesoresData.length);
        } else {
          debugLog('❌ No se pudieron cargar los profesores');
        }
        setProfesores(profesoresData);

        // 3. Cargar todos los estudiantes
        debugLog('🔄 Cargando estudiantes...');
        const responseEstudiantes = await fetch('http://localhost:6500/api/students');
        const resultadoEstudiantes = await responseEstudiantes.json();

        if (!resultadoEstudiantes.success || !resultadoEstudiantes.data) {
          debugLog('❌ No hay datos de estudiantes');
          setEstudiantes([]);
          setLoading(false);
          return;
        }

        debugLog(`✅ ${resultadoEstudiantes.data.length} estudiantes encontrados`);

        // 4. Para cada estudiante, obtener sus evaluaciones y asignar profesor
        const estudiantesConNotas = await Promise.all(
          resultadoEstudiantes.data.map(estudiante => 
            cargarDatosEstudiante(estudiante, nivelesData, profesoresData)
          )
        );

        debugLog('🎓 Estudiantes procesados:', estudiantesConNotas.length);

        // Aplicar filtros combinados
        const filtrados = estudiantesConNotas.filter((est) => {
          const coincideNivel = nivel === 'todos' || est.nivel === nivel;
          const coincideProfesor = profesorFiltro === 'todos' || est.profesorCedula === parseInt(profesorFiltro);
          return coincideNivel && coincideProfesor;
        });

        setEstudiantes(filtrados);

      } catch (error) {
        errorLog('Error cargando datos:', error);
        setEstudiantes([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [nivel, profesorFiltro]);

  // Ver detalles del estudiante
  const verDetalles = (estudiante) => {
    setEstudianteActual(estudiante);
    setVista('detalle');
  };

  // Exportar PDF (función placeholder)
  const exportarPDF = () => {
    alert('Función de exportar PDF aún no conectada.');
  };

  // Volver a la lista
  const volverALista = () => {
    setVista('lista');
    setEstudianteActual(null);
  };

  // Sincronizar cambios desde DetalleNotas
  const actualizarEstudianteActual = (evaluacionesActualizadas) => {
    const actualizado = { 
      ...estudianteActual, 
      evaluaciones: evaluacionesActualizadas,
      promedio: calcularPromedio(evaluacionesActualizadas)
    };
    setEstudianteActual(actualizado);

    setEstudiantes((prev) =>
      prev.map((est) =>
        est.cedula === actualizado.cedula ? actualizado : est
      )
    );
  };

  // Obtener opciones únicas de niveles para el filtro
  const opcionesNivel = [
    'todos', 
    ...new Set(niveles.map(nivel => nivel.level_name).filter(Boolean))
  ];

  // Obtener opciones únicas de profesores para el filtro
  const opcionesProfesores = [
    'todos',
    ...new Set(
      estudiantes
        .map(est => ({
          cedula: est.profesorCedula,
          nombre: est.profesor
        }))
        .filter(p => p.cedula && p.nombre !== 'Sin asignar')
        .map(p => p.cedula.toString())
    )
  ];

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setNivel('todos');
    setProfesorFiltro('todos');
  };

  // Si estamos en vista de detalle, mostrar el componente DetalleNotas
  if (vista === 'detalle') {
    return (
      <DetalleNotas
        estudiante={estudianteActual}
        onVolver={volverALista}
        onActualizarEvaluaciones={actualizarEstudianteActual}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header de la página */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-2">
          Gestión de Notas
        </h1>
      </div>

      {/* Controles de filtro y acciones */}
      <div className="bg-white rounded-lg p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Filtro por nivel */}
            <div className="w-full md:w-auto">
              <label htmlFor="nivel" className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por nivel
              </label>
              <select
                id="nivel"
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 bg-white"
              >
                <option value="todos">Todos los niveles</option>
                {opcionesNivel.filter(n => n !== 'todos').map((nivelOption) => (
                  <option key={nivelOption} value={nivelOption}>
                    {nivelOption}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por profesor */}
            <div className="w-full md:w-auto">
              <label htmlFor="profesor" className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por profesor
              </label>
              <select
                id="profesor"
                value={profesorFiltro}
                onChange={(e) => setProfesorFiltro(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 bg-white"
              >
                <option value="todos">Todos los profesores</option>
                {opcionesProfesores.filter(p => p !== 'todos').map((profesorCedula) => {
                  const profesor = estudiantes.find(est => est.profesorCedula === parseInt(profesorCedula));
                  return (
                    <option key={profesorCedula} value={profesorCedula}>
                      {profesor?.profesor || `Profesor ${profesorCedula}`}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col md:flex-row gap-2">
            {/* Botón Limpiar Filtros */}
            <button
              onClick={limpiarFiltros}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
            >
              Limpiar Filtros
            </button>

            {/* Botón Exportar PDF */}
            <button
              onClick={exportarPDF}
              className="w-full md:w-auto px-6 py-2 border border-indigo-800 text-sm font-medium rounded-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
            >
              <span className="flex items-center">
                Exportar PDF
              </span>
            </button>
          </div>
        </div>

        {/* Indicadores de filtros activos */}
        {(nivel !== 'todos' || profesorFiltro !== 'todos') && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-sm text-indigo-700">
              <strong>Filtros aplicados:</strong>
              {nivel !== 'todos' && <span className="ml-2 inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">Nivel: {nivel}</span>}
              {profesorFiltro !== 'todos' && (
                <span className="ml-2 inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                  Profesor: {estudiantes.find(est => est.profesorCedula === parseInt(profesorFiltro))?.profesor || `Profesor ${profesorFiltro}`}
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Tabla de estudiantes */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-950 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando estudiantes y notas...</p>
          </div>
        ) : estudiantes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg font-medium">No hay datos</p>
            <p className="text-gray-400 text-sm mt-2">
              {nivel !== 'todos' || profesorFiltro !== 'todos' 
                ? 'No hay estudiantes que coincidan con los filtros aplicados.' 
                : 'No hay estudiantes registrados en el sistema.'}
            </p>
            {(nivel !== 'todos' || profesorFiltro !== 'todos') && (
              <button
                onClick={limpiarFiltros}
                className="mt-4 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Versión móvil - Cards */}
            <div className="block md:hidden">
              <div className="divide-y divide-gray-200">
                {estudiantes.map((estudiante) => (
                  <div key={estudiante.cedula} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg">{estudiante.nombre}</h3>
                        <p className="text-gray-600 text-sm">C.I: {estudiante.cedula}</p>
                        <p className="text-gray-600 text-sm">Nivel: {estudiante.nivel}</p>
                        <p className="text-gray-600 text-sm">Profesor: {estudiante.profesor}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {estudiante.nivel}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <p className="text-gray-500 text-xs">
                          {estudiante.evaluaciones.length} evaluaciones
                        </p>
                      </div>
                      
                      <button
                        onClick={() => verDetalles(estudiante)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
                        title="Ver detalles de notas"
                      >
                        <span className="mr-2">👁️</span>
                        Ver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Versión desktop - Tabla */}
            <div className="hidden md:block overflow-x-auto">
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
                      Nivel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Profesor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Evaluaciones
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      Ver
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {estudiantes.map((estudiante) => (
                    <tr key={estudiante.cedula} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{estudiante.nombre}</div>
                        <div className="text-sm text-gray-500 md:hidden">C.I: {estudiante.cedula}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{estudiante.cedula}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {estudiante.nivel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {estudiante.profesor}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {estudiante.evaluaciones.length} eval.
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => verDetalles(estudiante)}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
                          title="Ver detalles de notas"
                        >
                          <span className="text-lg">👁️</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start">
          <span className="text-blue-600 mr-2">💡</span>
          <div>
            <p className="text-blue-700 text-sm font-medium">Información del sistema:</p>
            <p className="text-blue-600 text-xs mt-1">
              • Use los filtros de nivel y profesor para encontrar estudiantes específicos
            </p>
            <p className="text-blue-600 text-xs mt-1">
              • Los profesores se asignan según la cédula del profesor en los datos del estudiante
            </p>
            <p className="text-blue-600 text-xs mt-1">
              • Haga clic en "Ver" para gestionar las evaluaciones de cada estudiante
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionNotas;