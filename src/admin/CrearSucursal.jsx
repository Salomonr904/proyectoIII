import React, { useState, useEffect } from 'react';

function CrearSucursal() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [sucursales, setSucursales] = useState([]);
  const [sucursalAEliminar, setSucursalAEliminar] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // 🔄 Cargar sucursales desde el backend (GET)
  useEffect(() => {
    // ⚠️ Reemplaza esta simulación por fetch real cuando tengas el backend:
    /*
    fetch('https://tu-backend.com/api/sucursales')
      .then((res) => res.json())
      .then((data) => setSucursales(data))
      .catch((err) => console.error('Error al cargar sucursales:', err));
    */

    // 🧪 Simulación temporal con los datos de la imagen
    const simuladas = [
      { 
        id: 1, 
        nombre: 'Los Teques', 
        telefono: '0212-000-0000', 
        direccion: 'Dirección Los Teques...' 
      },
      { 
        id: 2, 
        nombre: 'San Antonio', 
        telefono: '0212-000-0000', 
        direccion: 'Dirección San Antonio...' 
      },
    ];
    setSucursales(simuladas);
  }, []);

  const agregarSucursal = () => {
    if (!nombre.trim() || !telefono.trim() || !direccion.trim()) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const nueva = { 
      id: Date.now(), 
      nombre, 
      telefono, 
      direccion 
    };

    // 🔼 Enviar nueva sucursal al backend (POST)
    /*
    fetch('https://tu-backend.com/api/sucursales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nueva),
    })
      .then((res) => res.json())
      .then((data) => {
        setSucursales((prev) => [...prev, data]);
        setNombre('');
        setTelefono('');
        setDireccion('');
      })
      .catch((err) => {
        console.error('Error al crear sucursal:', err);
        alert('No se pudo crear la sucursal.');
      });
    */

    // 🧪 Simulación temporal
    setSucursales((prev) => [...prev, nueva]);
    setNombre('');
    setTelefono('');
    setDireccion('');
  };

  const confirmarEliminacion = () => {
    if (!sucursalAEliminar) return;

    // 🔽 Eliminar sucursal del backend (DELETE)
    /*
    fetch(`https://tu-backend.com/api/sucursales/${sucursalAEliminar.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setSucursales((prev) =>
          prev.filter((s) => s.id !== sucursalAEliminar.id)
        );
        setSucursalAEliminar(null);
      })
      .catch((err) => {
        console.error('Error al eliminar sucursal:', err);
        alert('No se pudo eliminar la sucursal.');
      });
    */

    // 🧪 Simulación temporal
    setSucursales((prev) =>
      prev.filter((s) => s.id !== sucursalAEliminar.id)
    );
    setSucursalAEliminar(null);
  };

  // 🔍 Filtrado de sucursales por nombre
  const sucursalesFiltradas = sucursales.filter(sucursal =>
    sucursal.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    sucursal.direccion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      {/* 🏷️ Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-2">
          Nueva Sucursal
        </h1>
      </div>

      {/* 📝 Formulario Superior */}
      <div className="bg-white rounded-lg p-6 mb-6 md:mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Campo Nombre de Sucursal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de Sucursal
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de sucursal"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Campo Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Número de teléfono"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Campo Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Dirección"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Botón Agregar */}
        <div className="flex justify-start">
          <button
            onClick={agregarSucursal}
            className="px-6 py-2 bg-indigo-950 text-white text-sm font-medium rounded-full hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* 📋 Lista de Sucursales Inferior */}
      <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
        {/* Header con título y búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-500 mb-4 md:mb-0">
            Sucursales
          </h3>
          
          {/* 🔍 Barra de búsqueda */}
          <div className="w-full md:w-64">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar sucursal..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
        
        {sucursalesFiltradas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {busqueda ? 'No hay sucursales que coincidan con la búsqueda.' : 'No hay sucursales registradas.'}
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
                      Nombre de Sucursal
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Dirección
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
                  {sucursalesFiltradas.map((sucursal) => (
                    <tr key={sucursal.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{sucursal.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{sucursal.telefono}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">{sucursal.direccion}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="inline-flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-800 transition-colors duration-200">
                          <span className="text-lg">✏️</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => setSucursalAEliminar(sucursal)}
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
                {sucursalesFiltradas.map((sucursal) => (
                  <div key={sucursal.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg mb-2">{sucursal.nombre}</h3>
                        <p className="text-gray-600 text-sm mb-1">
                          <span className="font-medium">Teléfono:</span> {sucursal.telefono}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Dirección:</span> {sucursal.direccion}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-800 transition-colors duration-200">
                        <span className="text-lg mr-2">✏️</span>
                        Editar
                      </button>
                      
                      <button 
                        onClick={() => setSucursalAEliminar(sucursal)}
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
      {sucursalAEliminar && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirmar eliminación
            </h3>
            
            <p className="text-gray-600 mb-2">
              ¿Estás seguro de eliminar esta sucursal?
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-medium text-gray-800">{sucursalAEliminar.nombre}</p>
              <p className="text-gray-600 text-sm">Teléfono: {sucursalAEliminar.telefono}</p>
              <p className="text-gray-600 text-sm">Dirección: {sucursalAEliminar.direccion}</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSucursalAEliminar(null)}
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

export default CrearSucursal;