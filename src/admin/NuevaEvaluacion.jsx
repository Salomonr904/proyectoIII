import React, { useState, useEffect } from 'react';

function NuevaEvaluacion() {
  const [nombreEvaluacion, setNombreEvaluacion] = useState('');
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [evaluacionAEliminar, setEvaluacionAEliminar] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // 🔄 Cargar evaluaciones desde el backend (GET)
  useEffect(() => {
    // ⚠️ Reemplaza esta simulación por fetch real cuando tengas el backend:
    /*
    fetch('https://tu-backend.com/api/evaluaciones')
      .then((res) => res.json())
      .then((data) => setEvaluaciones(data))
      .catch((err) => console.error('Error al cargar evaluaciones:', err));
    */

    // 🧪 Simulación temporal con los datos de la imagen
    const simuladas = [
      { id: 1, nombre: 'Examen escrito (gramática y vocabulario).' },
      { id: 2, nombre: 'Prueba de comprensión lectora (reading).' },
      { id: 3, nombre: 'Prueba de comprensión auditiva (listening).' },
      { id: 4, nombre: 'Evaluación oral (speaking test, entrevistas, presentaciones).' },
      { id: 5, nombre: 'Redacción / Ensayo corto (writing).' },
      { id: 6, nombre: 'Participación en clase (seguimiento del desempeño).' },
    ];
    setEvaluaciones(simuladas);
  }, []);

  const agregarEvaluacion = () => {
    if (!nombreEvaluacion.trim()) {
      alert('Por favor ingresa el nombre de la evaluación.');
      return;
    }

    const nueva = { 
      id: Date.now(), 
      nombre: nombreEvaluacion 
    };

    // 🔼 Enviar nueva evaluación al backend (POST)
    /*
    fetch('https://tu-backend.com/api/evaluaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nueva),
    })
      .then((res) => res.json())
      .then((data) => {
        setEvaluaciones((prev) => [...prev, data]);
        setNombreEvaluacion('');
      })
      .catch((err) => {
        console.error('Error al crear evaluación:', err);
        alert('No se pudo crear la evaluación.');
      });
    */

    // 🧪 Simulación temporal
    setEvaluaciones((prev) => [...prev, nueva]);
    setNombreEvaluacion('');
  };

  const confirmarEliminacion = () => {
    if (!evaluacionAEliminar) return;

    // 🔽 Eliminar evaluación del backend (DELETE)
    /*
    fetch(`https://tu-backend.com/api/evaluaciones/${evaluacionAEliminar.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setEvaluaciones((prev) =>
          prev.filter((e) => e.id !== evaluacionAEliminar.id)
        );
        setEvaluacionAEliminar(null);
      })
      .catch((err) => {
        console.error('Error al eliminar evaluación:', err);
        alert('No se pudo eliminar la evaluación.');
      });
    */

    // 🧪 Simulación temporal
    setEvaluaciones((prev) =>
      prev.filter((e) => e.id !== evaluacionAEliminar.id)
    );
    setEvaluacionAEliminar(null);
  };

  // 🔍 Filtrado de evaluaciones por nombre
  const evaluacionesFiltradas = evaluaciones.filter(evaluacion =>
    evaluacion.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      {/* 🏷️ Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-2">
          Nueva Evaluación
        </h1>
      </div>

      {/* 📝 Formulario Superior */}
      <div className="bg-white rounded-lg p-6 mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-4">
          {/* Campo Nombre de Evaluación */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de Evaluación
            </label>
            <input
              type="text"
              value={nombreEvaluacion}
              onChange={(e) => setNombreEvaluacion(e.target.value)}
              placeholder="Nombre de evaluación"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Botón Agregar */}
          <div className="lg:w-auto">
            <button
              onClick={agregarEvaluacion}
              className="w-full lg:w-auto px-6 py-2 bg-indigo-950 text-white text-sm font-medium rounded-full hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* 📋 Tabla de Evaluaciones Inferior */}
      <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
        {/* Header de la tabla con título y búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-500 mb-4 md:mb-0">
            Tipos de Evaluaciones
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
                      <button className="inline-flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-800 transition-colors duration-200">
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