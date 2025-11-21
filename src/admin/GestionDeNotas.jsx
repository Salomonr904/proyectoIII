import React, { useState, useEffect } from 'react';
import DetalleNotas from './DetalleNotas';

function GestionNotas() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [nivel, setNivel] = useState('todos');
  const [loading, setLoading] = useState(false);
  const [vista, setVista] = useState('lista');
  const [estudianteActual, setEstudianteActual] = useState(null);

  useEffect(() => {
    setLoading(true);

    // 🧪 Datos de simulación temporal basados en las imágenes
    const simulados = [
      {
        cedula: '00.000.000',
        nombre: 'Miguel Guerra',
        nivel: 'Beginner',
        curso: 'José Alfredo Freita',
        promedio: 82,
        evaluaciones: [
          { ponderacion: 15, nota: 12 },
          { ponderacion: 15, nota: 15 },
          { ponderacion: 10, nota: 7 },
          { ponderacion: 20, nota: 16 },
          { ponderacion: 15, nota: 12 },
          { ponderacion: 20, nota: 16 },
          { ponderacion: 5, nota: 4 },
        ],
      },
      {
        cedula: '00.000.001',
        nombre: 'Valentina Villalba',
        nivel: 'Beginner',
        curso: 'José Alfredo Freita',
        promedio: 100,
        evaluaciones: [
          { ponderacion: 15, nota: 15 },
          { ponderacion: 15, nota: 15 },
          { ponderacion: 10, nota: 10 },
          { ponderacion: 20, nota: 20 },
          { ponderacion: 15, nota: 15 },
          { ponderacion: 20, nota: 20 },
          { ponderacion: 5, nota: 5 },
        ],
      },
      {
        cedula: '00.000.002',
        nombre: 'Moises Gil',
        nivel: 'Beginner',
        curso: 'José Alfredo Freita',
        promedio: 67,
        evaluaciones: [
          { ponderacion: 15, nota: 10 },
          { ponderacion: 15, nota: 10 },
          { ponderacion: 10, nota: 6 },
          { ponderacion: 20, nota: 14 },
          { ponderacion: 15, nota: 10 },
          { ponderacion: 20, nota: 14 },
          { ponderacion: 5, nota: 3 },
        ],
      },
      {
        cedula: '00.000.003',
        nombre: 'Gabriela Sanchez',
        nivel: 'Elementary',
        curso: 'José Alfredo Freita',
        promedio: 95,
        evaluaciones: [
          { ponderacion: 15, nota: 14 },
          { ponderacion: 15, nota: 15 },
          { ponderacion: 10, nota: 9 },
          { ponderacion: 20, nota: 19 },
          { ponderacion: 15, nota: 14 },
          { ponderacion: 20, nota: 19 },
          { ponderacion: 5, nota: 5 },
        ],
      },
      {
        cedula: '00.000.004',
        nombre: 'Jose Montesino',
        nivel: 'Elementary',
        curso: 'José Alfredo Freita',
        promedio: 50,
        evaluaciones: [
          { ponderacion: 15, nota: 8 },
          { ponderacion: 15, nota: 7 },
          { ponderacion: 10, nota: 5 },
          { ponderacion: 20, nota: 10 },
          { ponderacion: 15, nota: 8 },
          { ponderacion: 20, nota: 10 },
          { ponderacion: 5, nota: 2 },
        ],
      },
      {
        cedula: '00.000.005',
        nombre: 'Oscar Ampudia',
        nivel: 'Elementary',
        curso: 'José Alfredo Freita',
        promedio: 95,
        evaluaciones: [
          { ponderacion: 15, nota: 14 },
          { ponderacion: 15, nota: 15 },
          { ponderacion: 10, nota: 9 },
          { ponderacion: 20, nota: 19 },
          { ponderacion: 15, nota: 14 },
          { ponderacion: 20, nota: 19 },
          { ponderacion: 5, nota: 5 },
        ],
      },
      {
        cedula: '00.000.006',
        nombre: 'Fabiola Rodriguez',
        nivel: 'Elementary',
        curso: 'José Alfredo Freita',
        promedio: 98,
        evaluaciones: [
          { ponderacion: 15, nota: 15 },
          { ponderacion: 15, nota: 15 },
          { ponderacion: 10, nota: 10 },
          { ponderacion: 20, nota: 20 },
          { ponderacion: 15, nota: 14 },
          { ponderacion: 20, nota: 19 },
          { ponderacion: 5, nota: 5 },
        ],
      },
    ];

    const filtrados = nivel === 'todos'
      ? simulados
      : simulados.filter((est) => est.nivel === nivel);

    setTimeout(() => {
      setEstudiantes(filtrados);
      setLoading(false);
    }, 400);
  }, [nivel]);

  //  Calcular promedio de evaluaciones
  const calcularPromedio = (evaluaciones) => {
    const totalPonderacion = evaluaciones.reduce((acc, e) => acc + e.ponderacion, 0);
    const totalAportado = evaluaciones.reduce((acc, e) => acc + ((e.nota * e.ponderacion) / 20), 0);
    return totalPonderacion > 0 ? Math.round((totalAportado / totalPonderacion) * 100) : 0;
  };

  //  Ver detalles del estudiante
  const verDetalles = (estudiante) => {
    setEstudianteActual(estudiante);
    setVista('detalle');
  };

  //  Exportar PDF (función placeholder)
  const exportarPDF = () => {
    alert('Función de exportar PDF aún no conectada.');
  };

  //  Volver a la lista
  const volverALista = () => {
    setVista('lista');
    setEstudianteActual(null);
  };

  //  Sincronizar cambios desde DetalleNotas
  const actualizarEstudianteActual = (evaluacionesActualizadas) => {
    const actualizado = { ...estudianteActual, evaluaciones: evaluacionesActualizadas };
    setEstudianteActual(actualizado);

    setEstudiantes((prev) =>
      prev.map((est) =>
        est.cedula === actualizado.cedula ? actualizado : est
      )
    );
  };

  // Función para determinar el color del promedio
  const getColorPromedio = (promedio) => {
    if (promedio >= 90) return 'text-green-600 bg-green-100';
    if (promedio >= 70) return 'text-blue-600 bg-blue-100';
    if (promedio >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Gestión de Notas
        </h1>
      </div>

      {/* Controles de filtro y acciones */}
      <div className="bg-white rounded-lg p-4 md:p-6 mb-6 justify-end">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                <option value="Beginner">Beginner</option>
                <option value="Elementary">Elementary</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

          {/* Botón Exportar PDF */}
          <div className="w-full md:w-auto flex justify-end">
            <button
              onClick={exportarPDF}
              className="w-full md:w-auto px-6 py-2 border border-indigo-800 text-sm font-medium rounded-full text-white bg-blue-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
            >
              <span className="flex items-center">
                Exportar PDF
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de estudiantes */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          //  Estado de carga
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-950 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando estudiantes...</p>
          </div>
        ) : estudiantes.length === 0 ? (
          //  Estado vacío
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg font-medium">No hay datos</p>
            <p className="text-gray-400 text-sm mt-2">
              {nivel !== 'todos' 
                ? `No hay estudiantes en el nivel ${nivel}` 
                : 'No hay estudiantes registrados en el sistema.'}
            </p>
          </div>
        ) : (
          // Tabla con datos
          <>
            {/*  Versión móvil - Cards */}
            <div className="block md:hidden">
              <div className="divide-y divide-gray-200">
                {estudiantes.map((estudiante) => (
                  <div key={estudiante.cedula} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg">{estudiante.nombre}</h3>
                        <p className="text-gray-600 text-sm">C.I: {estudiante.cedula}</p>
                        <p className="text-gray-600 text-sm">Curso: {estudiante.curso}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                        {estudiante.nivel}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getColorPromedio(estudiante.promedio)}`}>
                          {estudiante.promedio}%
                        </span>
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white  uppercase tracking-wider">
                      Nombre y Apellido
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Cédula de Identidad
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Nivel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Promedio
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
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getColorPromedio(estudiante.promedio)}`}>
                          {estudiante.promedio}%
                        </span>
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

      {/* ℹ️ Información adicional */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start">
          <span className="text-blue-600 mr-2">💡</span>
          <div>
            <p className="text-blue-700 text-sm font-medium">Información sobre promedios:</p>
            <p className="text-blue-600 text-xs mt-1">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
              90-100%: Excelente • 
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1 ml-2"></span>
              70-89%: Bueno • 
              <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1 ml-2"></span>
              50-69%: Regular • 
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1 ml-2"></span>
              0-49%: Necesita mejora
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionNotas;