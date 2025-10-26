import React, { useState, useEffect } from 'react';

function CrearPago() {
  const [nombreMetodo, setNombreMetodo] = useState('');
  const [metodos, setMetodos] = useState([]);
  const [metodoAEliminar, setMetodoAEliminar] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // 🔄 Cargar métodos desde el backend (GET)
  useEffect(() => {
    // ⚠️ Reemplaza esta simulación por fetch real cuando tengas el backend:
    /*
    fetch('https://tu-backend.com/api/metodos-pago')
      .then((res) => res.json())
      .then((data) => setMetodos(data))
      .catch((err) => console.error('Error al cargar métodos de pago:', err));
    */

    // 🧪 Simulación temporal con los datos de la imagen
    const simulados = [
      { id: 1, nombre: 'Efectivo' },
      { id: 2, nombre: 'Tarjetas de débito o crédito' },
      { id: 3, nombre: 'Transferencias bancarias' },
      { id: 4, nombre: 'Pago móvil / billeteras digitales' },
      { id: 5, nombre: 'Cheques' },
      { id: 6, nombre: 'Criptomonedas' },
    ];
    setMetodos(simulados);
  }, []);

  const agregarMetodo = () => {
    if (!nombreMetodo.trim()) {
      alert('Por favor ingresa el nombre del método de pago.');
      return;
    }

    const nuevo = { 
      id: Date.now(), 
      nombre: nombreMetodo 
    };

    // 🔼 Enviar nuevo método al backend (POST)
    /*
    fetch('https://tu-backend.com/api/metodos-pago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo),
    })
      .then((res) => res.json())
      .then((data) => {
        setMetodos((prev) => [...prev, data]);
        setNombreMetodo('');
      })
      .catch((err) => {
        console.error('Error al crear método de pago:', err);
        alert('No se pudo crear el método.');
      });
    */

    // 🧪 Simulación temporal
    setMetodos((prev) => [...prev, nuevo]);
    setNombreMetodo('');
  };

  const confirmarEliminacion = () => {
    if (!metodoAEliminar) return;

    // 🔽 Eliminar método del backend (DELETE)
    /*
    fetch(`https://tu-backend.com/api/metodos-pago/${metodoAEliminar.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setMetodos((prev) =>
          prev.filter((m) => m.id !== metodoAEliminar.id)
        );
        setMetodoAEliminar(null);
      })
      .catch((err) => {
        console.error('Error al eliminar método de pago:', err);
        alert('No se pudo eliminar el método.');
      });
    */

    // 🧪 Simulación temporal
    setMetodos((prev) =>
      prev.filter((m) => m.id !== metodoAEliminar.id)
    );
    setMetodoAEliminar(null);
  };

  // 🔍 Filtrado de métodos por nombre
  const metodosFiltrados = metodos.filter(metodo =>
    metodo.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      {/* 🏷️ Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-2">
          Nuevo método de Pago
        </h1>
      </div>

      {/* 📝 Formulario Superior */}
      <div className="bg-white rounded-lg p-6 mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-4">
          {/* Campo Nombre del método de pago */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del método de pago
            </label>
            <input
              type="text"
              value={nombreMetodo}
              onChange={(e) => setNombreMetodo(e.target.value)}
              placeholder="Nombre del método de pago"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Botón Agregar */}
          <div className="lg:w-auto">
            <button
              onClick={agregarMetodo}
              className="w-full lg:w-auto px-6 py-2 bg-indigo-950 text-white text-sm font-medium rounded-full hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* 📋 Lista de Métodos de Pago Inferior */}
      <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
        {/* Header con título y búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-500 mb-4 md:mb-0">
            Tipos de Pagos
          </h3>
          
          {/* 🔍 Barra de búsqueda */}
          <div className="w-full md:w-64">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar método..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
        
        {metodosFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {busqueda ? 'No hay métodos que coincidan con la búsqueda.' : 'No hay métodos de pago registrados.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* 💻 Versión desktop - Tabla */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-950">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Métodos de Pagos
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
                  {metodosFiltrados.map((metodo) => (
                    <tr key={metodo.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{metodo.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="inline-flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-800 transition-colors duration-200">
                          <span className="text-lg">✏️</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => setMetodoAEliminar(metodo)}
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

            {/* 📱 Versión móvil - Cards */}
            <div className="block md:hidden">
              <div className="divide-y divide-gray-200">
                {metodosFiltrados.map((metodo) => (
                  <div key={metodo.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg mb-2">{metodo.nombre}</h3>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-800 transition-colors duration-200">
                        <span className="text-lg mr-2">✏️</span>
                        Editar
                      </button>
                      
                      <button 
                        onClick={() => setMetodoAEliminar(metodo)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <span className="text-lg mr-2">🗑️</span>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🧨 Modal de confirmación de eliminación */}
      {metodoAEliminar && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirmar eliminación
            </h3>
            
            <p className="text-gray-600 mb-2">
              ¿Estás seguro de eliminar este método de pago?
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-medium text-gray-800">{metodoAEliminar.nombre}</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setMetodoAEliminar(null)}
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

export default CrearPago;