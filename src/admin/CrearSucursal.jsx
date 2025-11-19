import React, { useState, useEffect } from 'react';

function CrearSucursal() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [sucursales, setSucursales] = useState([]);
  const [sucursalAEliminar, setSucursalAEliminar] = useState(null);
  const [sucursalAEditar, setSucursalAEditar] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [errores, setErrores] = useState({});

  // URL de la API
  const API_BASE_URL = 'http://localhost:6500/api';
  const BRANCHES_ENDPOINT = `${API_BASE_URL}/branches`;

  // 🔄 Cargar sucursales desde el backend (GET)
  useEffect(() => {
    cargarSucursales();
  }, []);

  const cargarSucursales = async () => {
    try {
      setCargando(true);
      const res = await fetch(BRANCHES_ENDPOINT);
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const result = await res.json();
      console.log('📊 Respuesta GET sucursales:', result);
      
      if (result.success && result.data) {
        setSucursales(mapBackendToFrontend(result.data));
      } else {
        setSucursales([]);
      }
      
    } catch (err) {
      console.error('❌ Error al cargar sucursales:', err.message);
      // 🧪 Datos de ejemplo en caso de error
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
    } finally {
      setCargando(false);
    }
  };

  // Función de Mapeo (Backend -> Frontend) - CORREGIDO
  const mapBackendToFrontend = (data) => data.map(item => ({
    id: item.id_branch,
    nombre: item.branch || '', // Cambiado de branch_name a branch
    telefono: item.branch_telephone || '', // Cambiado de branch_phone a branch_telephone
    direccion: item.address || '', // Cambiado de branch_address a address
  }));

  // Función para mostrar mensajes de error
  const displayErrorMessage = (message) => {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.visibility = 'visible';
      errorDiv.style.height = 'auto';
      errorDiv.style.paddingTop = '0.75rem';
      errorDiv.style.paddingBottom = '0.75rem';
      setTimeout(() => {
        errorDiv.textContent = '';
        errorDiv.style.visibility = 'hidden';
        errorDiv.style.height = '0';
        errorDiv.style.paddingTop = '0';
        errorDiv.style.paddingBottom = '0';
      }, 5000);
    }
  };

  // Función para mostrar mensajes de éxito
  const displaySuccessMessage = (message) => {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-0 rounded-xl relative mb-4 transition-all duration-300';
      errorDiv.style.visibility = 'visible';
      errorDiv.style.height = 'auto';
      errorDiv.style.paddingTop = '0.75rem';
      errorDiv.style.paddingBottom = '0.75rem';
      setTimeout(() => {
        errorDiv.textContent = '';
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-0 rounded-xl relative mb-4 transition-all duration-300';
        errorDiv.style.visibility = 'hidden';
        errorDiv.style.height = '0';
        errorDiv.style.paddingTop = '0';
        errorDiv.style.paddingBottom = '0';
      }, 5000);
    }
  };

  // Validación del formulario
  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre de la sucursal es requerido';
    }
    
    if (!telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es requerido';
    }
    
    if (!direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es requerida';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // 1. CREAR Sucursal (POST)
  const agregarSucursal = async () => {
    if (!validarFormulario()) {
      return;
    }

    // CORREGIDO: Usar la estructura correcta del backend para POST
    const payload = {
      branch: nombre,
      branch_telephone: telefono,
      address: direccion,
    };

    console.log('📤 Enviando POST sucursal:', payload);

    try {
      const res = await fetch(BRANCHES_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log('📥 Respuesta POST sucursal:', result);

      if (!res.ok) {
        throw new Error(result.message || `Error HTTP: ${res.status}`);
      }

      if (!result.success) {
        throw new Error(result.message || 'Error en la inserción');
      }

      // Recargar las sucursales
      await cargarSucursales();
      
      setNombre('');
      setTelefono('');
      setDireccion('');
      setErrores({});
      displaySuccessMessage('✅ Sucursal creada correctamente');
      
    } catch (err) {
      console.error('Error al crear sucursal:', err.message);
      displayErrorMessage(`No se pudo crear la sucursal: ${err.message}`);
    }
  };

  // 2. ACTUALIZAR Sucursal (PATCH) - CORREGIDO
  const guardarEdicion = async () => {
    if (!sucursalAEditar || !validarFormulario()) {
      return;
    }

    // CORREGIDO: Usar la estructura correcta del backend para PATCH
    const payload = {
      branch: nombre,
      telephone: telefono, // CAMBIADO: branch_telephone → telephone
      address: direccion,
    };

    console.log('📤 Enviando PATCH sucursal:', payload);

    try {
      const updateUrl = `${BRANCHES_ENDPOINT}/${sucursalAEditar.id}`;
      console.log('🔗 URL de actualización:', updateUrl);

      const res = await fetch(updateUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('📥 Status respuesta PATCH:', res.status);

      // Verificar si la respuesta es JSON
      const contentType = res.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Respuesta no JSON: ${text.substring(0, 100)}`);
      }

      console.log('📥 Respuesta PATCH sucursal:', result);

      if (!res.ok) {
        throw new Error(result.message || `Error HTTP: ${res.status}`);
      }

      if (!result.success) {
        throw new Error(result.message || 'Error en la actualización');
      }

      // Recargar las sucursales
      await cargarSucursales();
      setSucursalAEditar(null);
      setErrores({});
      displaySuccessMessage('✅ Sucursal actualizada correctamente');
      
    } catch (err) {
      console.error('Error al actualizar sucursal:', err.message);
      displayErrorMessage(`No se pudo actualizar la sucursal: ${err.message}`);
    }
  };

  // 3. ELIMINAR Sucursal (DELETE)
  const confirmarEliminacion = async () => {
    if (!sucursalAEliminar) return;

    try {
      const deleteUrl = `${BRANCHES_ENDPOINT}/${sucursalAEliminar.id}`;
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.message || `Error HTTP: ${res.status}`);
      }

      if (!result.success) {
        throw new Error(result.message || 'Error en la eliminación');
      }

      // Recargar las sucursales
      await cargarSucursales();
      setSucursalAEliminar(null);
      displaySuccessMessage('✅ Sucursal eliminada correctamente');
      
    } catch (err) {
      console.error('Error al eliminar sucursal:', err.message);
      displayErrorMessage(`No se pudo eliminar la sucursal: ${err.message}`);
      setSucursalAEliminar(null);
    }
  };

  // Iniciar edición
  const iniciarEdicion = (sucursal) => {
    setSucursalAEditar(sucursal);
    setNombre(sucursal.nombre);
    setTelefono(sucursal.telefono);
    setDireccion(sucursal.direccion);
    setErrores({});
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setSucursalAEditar(null);
    setNombre('');
    setTelefono('');
    setDireccion('');
    setErrores({});
  };

  // 🔍 Filtrado de sucursales por nombre - CORREGIDO
  const sucursalesFiltradas = sucursales.filter(sucursal => {
    if (!sucursal) return false;
    
    const nombreSucursal = sucursal.nombre || '';
    const direccionSucursal = sucursal.direccion || '';
    const busquedaLower = busqueda.toLowerCase();
    
    return (
      nombreSucursal.toLowerCase().includes(busquedaLower) ||
      direccionSucursal.toLowerCase().includes(busquedaLower)
    );
  });

  if (cargando) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Cargando sucursales...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      {/* 🏷️ Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-2">
          {sucursalAEditar ? 'Editar Sucursal' : 'Nueva Sucursal'}
        </h1>
      </div>

      {/* Contenedor para mensajes */}
      <div id="error-message" className="bg-red-100 border border-red-400 text-red-700 px-4 py-0 rounded-xl relative mb-4 transition-all duration-300" role="alert" style={{ visibility: 'hidden', height: '0', padding: 0 }}></div>

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
              onChange={(e) => {
                setNombre(e.target.value);
                if (errores.nombre) setErrores(prev => ({ ...prev, nombre: '' }));
              }}
              placeholder="Nombre de sucursal"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400 ${
                errores.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errores.nombre && (
              <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>
            )}
          </div>

          {/* Campo Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => {
                setTelefono(e.target.value);
                if (errores.telefono) setErrores(prev => ({ ...prev, telefono: '' }));
              }}
              placeholder="Número de teléfono"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400 ${
                errores.telefono ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errores.telefono && (
              <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>
            )}
          </div>

          {/* Campo Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => {
                setDireccion(e.target.value);
                if (errores.direccion) setErrores(prev => ({ ...prev, direccion: '' }));
              }}
              placeholder="Dirección"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400 ${
                errores.direccion ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errores.direccion && (
              <p className="text-red-500 text-xs mt-1">{errores.direccion}</p>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-start gap-4">
          {sucursalAEditar ? (
            <>
              <button
                onClick={guardarEdicion}
                className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Guardar Cambios
              </button>
              <button
                onClick={cancelarEdicion}
                className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={agregarSucursal}
              className="px-6 py-2 bg-indigo-950 text-white text-sm font-medium rounded-full hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
            >
              Agregar
            </button>
          )}
        </div>
      </div>

      {/* 📋 Lista de Sucursales Inferior */}
      <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
        {/* Header con título y búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-500 mb-4 md:mb-0">
            Sucursales ({sucursales.length})
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
                        <button 
                          onClick={() => iniciarEdicion(sucursal)}
                          className="inline-flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-800 transition-colors duration-200"
                        >
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
                      <button 
                        onClick={() => iniciarEdicion(sucursal)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-800 transition-colors duration-200"
                      >
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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