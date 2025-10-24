import React, { useState, useEffect } from 'react';

function CrearNivel() {
  const [nombreNivel, setNombreNivel] = useState('');
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [nivelAEliminar, setNivelAEliminar] = useState(null);
  const [mostrarTabla, setMostrarTabla] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // 🔄 Cargar niveles desde el backend (GET)
  useEffect(() => {
    // ⚠️ Cuando tengas el backend, reemplaza esta simulación por fetch real:
    /*
    fetch('https://tu-backend.com/api/niveles')
      .then((res) => res.json())
      .then((data) => setNiveles(data))
      .catch((err) => console.error('Error al cargar niveles:', err));
    */

    // 🧪 Simulación temporal
    const nivelesSimulados = [
      { nombre: 'Básico', dias: ['Lunes', 'Jueves'] },
      { nombre: 'Intermedio', dias: ['Martes', 'Viernes'] },
      { nombre: 'Avanzado', dias: ['Miércoles', 'Sábado'] },
    ];
    setNiveles(nivelesSimulados);
  }, []);

  const diasDisponibles = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const toggleDia = (dia) => {
    setDiasSeleccionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const agregarNivel = () => {
    if (!nombreNivel || diasSeleccionados.length === 0) {
      alert('Por favor completa el nombre del nivel y selecciona al menos un día.');
      return;
    }

    const nuevoNivel = {
      nombre: nombreNivel,
      dias: diasSeleccionados,
    };

    // 🔼 Enviar nuevo nivel al backend (POST)
    // ⚠️ Cuando tengas el backend, reemplaza esta simulación por fetch real:
    /*
    fetch('https://tu-backend.com/api/niveles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoNivel),
    })
      .then((res) => res.json())
      .then((data) => {
        setNiveles((prev) => [...prev, data]);
        setNombreNivel('');
        setDiasSeleccionados([]);
      })
      .catch((err) => {
        console.error('Error al crear nivel:', err);
        alert('No se pudo crear el nivel.');
      });
    */

    // 🧪 Simulación temporal
    setNiveles((prev) => [...prev, nuevoNivel]);
    setNombreNivel('');
    setDiasSeleccionados([]);
  };

  const confirmarEliminacion = () => {
    if (!nivelAEliminar) return;

    // 🔽 Eliminar nivel del backend (DELETE)
    // ⚠️ Cuando tengas el backend, reemplaza esta simulación por fetch real:
    /*
    fetch(`https://tu-backend.com/api/niveles/${nivelAEliminar.nombre}`, {
      method: 'DELETE',
    })
      .then(() => {
        setNiveles((prev) => prev.filter((n) => n.nombre !== nivelAEliminar.nombre));
        setNivelAEliminar(null);
      })
      .catch((err) => {
        console.error('Error al eliminar nivel:', err);
        alert('No se pudo eliminar el nivel.');
      });
    */

    // 🧪 Simulación temporal
    setNiveles((prev) => prev.filter((n) => n.nombre !== nivelAEliminar.nombre));
    setNivelAEliminar(null);
  };

  // 🔍 Filtrado de niveles por nombre
  const nivelesFiltrados = niveles.filter(nivel =>
    nivel.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      {/* 🏷️ Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-2">
          Nuevo Nivel
        </h1>
      </div>

      {/* 📝 Formulario Superior - En una sola línea como la imagen */}
      <div className="bg-white rounded-lg p-6 mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          {/* Campo Nombre del Nivel */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Nivel
            </label>
            <input
              type="text"
              value={nombreNivel}
              onChange={(e) => setNombreNivel(e.target.value)}
              placeholder="Nombre del nivel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Días de clases */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Día de clases
            </label>
            <div className="flex flex-wrap gap-2">
              {diasDisponibles.map((dia) => (
                <label key={dia} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={diasSeleccionados.includes(dia)}
                    onChange={() => toggleDia(dia)}
                    className="w-4 h-4 text-indigo-950 border-gray-300 rounded focus:ring-indigo-950"
                  />
                  <span className="text-sm text-gray-700 whitespace-nowrap">{dia}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Botones - Uno a la izquierda y otro a la derecha */}
        <div className="flex justify-between items-center">
          <button
            onClick={agregarNivel}
            className="px-4 py-2 bg-indigo-950 text-white text-sm font-medium rounded-full hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
          >
            Agregar
          </button>
          <button
            onClick={() => setMostrarTabla(!mostrarTabla)}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
          >
            {mostrarTabla ? 'Ocultar Niveles' : 'Mostrar Niveles'}
          </button>
        </div>
      </div>

      {/* 📋 Tabla de niveles Inferior */}
      {mostrarTabla && (
        <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
          {/* Header de la tabla con título y búsqueda */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-500 mb-4 md:mb-0">
              Niveles de Formación
            </h3>
            
            {/* 🔍 Barra de búsqueda */}
            <div className="w-full md:w-64">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar nivel..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
          
          {nivelesFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                {busqueda ? 'No hay niveles que coincidan con la búsqueda.' : 'No hay niveles registrados.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-950">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Nivel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Día de clases
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
                  {nivelesFiltrados.map((nivel, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{nivel.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{nivel.dias.join(' / ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="inline-flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-800 transition-colors duration-200">
                          <span className="text-lg">✏️</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => setNivelAEliminar(nivel)}
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
      )}

      {/* 🧨 Modal de confirmación de eliminación */}
      {nivelAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirmar eliminación
            </h3>
            
            <p className="text-gray-600 mb-2">
              ¿Estás seguro de eliminar este nivel de formación?
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-medium text-gray-800">{nivelAEliminar.nombre}</p>
              <p className="text-gray-600 text-sm">Días: {nivelAEliminar.dias.join(', ')}</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setNivelAEliminar(null)}
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

export default CrearNivel;