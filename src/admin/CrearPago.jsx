import React, { useState, useEffect } from 'react';

function CrearPago() {
  const [nombreMetodo, setNombreMetodo] = useState('');
  const [metodos, setMetodos] = useState([]);
  const [metodoAEliminar, setMetodoAEliminar] = useState(null);
  const [metodoAEditar, setMetodoAEditar] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [errores, setErrores] = useState({});

  // URL de la API
  const API_BASE_URL = 'http://localhost:6500/api';
  const PAYMENTS_METHODS_ENDPOINT = `${API_BASE_URL}/payments_methods`;

  // 🔄 Cargar métodos desde el backend (GET)
  useEffect(() => {
    cargarMetodos();
  }, []);

  const cargarMetodos = async () => {
    try {
      setCargando(true);
      console.log('🔄 Cargando métodos de pago desde:', PAYMENTS_METHODS_ENDPOINT);
      
      const res = await fetch(PAYMENTS_METHODS_ENDPOINT);
      
      console.log('📡 Status respuesta:', res.status);
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const result = await res.json();
      console.log('📊 Respuesta GET payments_methods:', result);
      
      if (result.success && result.data) {
        // CORREGIDO: Usar method_delete en lugar de delete
        const datosFiltrados = result.data.filter(item => item.method_delete === false);
        
        const datosMapeados = datosFiltrados.map(item => ({
          id: item.id_payment_method,
          nombre: item.payment_method,
        }));
        
        setMetodos(datosMapeados);
        console.log('✅ Métodos de pago cargados:', datosMapeados);
        console.log('📝 Registros activos (method_delete: false):', datosFiltrados.length);
        console.log('📋 Total de registros en API:', result.data.length);
      } else {
        setMetodos([]);
        console.log('⚠️ No hay datos en la respuesta');
      }
      
    } catch (err) {
      console.error('❌ Error al cargar métodos de pago:', err.message);
      // Datos de ejemplo en caso de error
      const simulados = [
        { id: 1, nombre: 'Efectivo' },
        { id: 2, nombre: 'Tarjeta de crédito' },
        { id: 3, nombre: 'Transferencia bancaria' },
      ];
      setMetodos(simulados);
    } finally {
      setCargando(false);
    }
  };

  // Validación del formulario
  const validarFormulario = () => {
    if (!nombreMetodo.trim()) {
      setErrores({ nombre: 'El nombre del método de pago es requerido' });
      return false;
    }
    setErrores({});
    return true;
  };

  // Función para mostrar mensajes
  const displayMessage = (message, type = 'error') => {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
      messageDiv.textContent = message;
      messageDiv.className = type === 'success' 
        ? 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-4 transition-all duration-300'
        : 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4 transition-all duration-300';
      messageDiv.style.visibility = 'visible';
      messageDiv.style.height = 'auto';
      
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.style.visibility = 'hidden';
        messageDiv.style.height = '0';
        messageDiv.style.padding = '0';
      }, 5000);
    }
  };

  // CREAR Método de Pago (POST)
  const agregarMetodo = async () => {
    if (!validarFormulario()) {
      return;
    }

    const payload = {
      payment_method: nombreMetodo,
    };

    console.log('📤 Enviando POST payments_methods:', payload);

    try {
      const res = await fetch(PAYMENTS_METHODS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log('📥 Respuesta POST:', result);

      if (!res.ok) {
        throw new Error(result.message || `Error HTTP: ${res.status}`);
      }

      if (!result.success) {
        throw new Error(result.message || 'Error en la creación');
      }

      // Recargar los métodos
      await cargarMetodos();
      
      // Limpiar formulario
      setNombreMetodo('');
      setErrores({});
      
      displayMessage('✅ Método de pago creado correctamente', 'success');
      
    } catch (err) {
      console.error('Error al crear método de pago:', err.message);
      displayMessage(`No se pudo crear el método de pago: ${err.message}`);
    }
  };

  // ELIMINAR Método de Pago (DELETE)
  const confirmarEliminacion = async () => {
    if (!metodoAEliminar) return;

    try {
      const deleteUrl = `${PAYMENTS_METHODS_ENDPOINT}/${metodoAEliminar.id}`;
      console.log('🗑️ Enviando DELETE a:', deleteUrl);
      
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
      });

      const result = await res.json();
      console.log('📥 Respuesta DELETE:', result);

      if (!res.ok) {
        throw new Error(result.message || `Error HTTP: ${res.status}`);
      }

      if (!result.success) {
        throw new Error(result.message || 'Error en la eliminación');
      }

      // Recargar los métodos para obtener datos actualizados
      await cargarMetodos();
      setMetodoAEliminar(null);
      
      displayMessage('✅ Método de pago eliminado correctamente', 'success');
      
    } catch (err) {
      console.error('Error al eliminar método de pago:', err.message);
      displayMessage(`No se pudo eliminar el método de pago: ${err.message}`);
      setMetodoAEliminar(null);
    }
  };

  // ACTUALIZAR Método de Pago (PUT)
  const guardarEdicion = async () => {
    if (!metodoAEditar) return;

    if (!validarFormulario()) {
      return;
    }

    const payload = {
      payment_method: nombreMetodo,
    };

    try {
      const updateUrl = `${PAYMENTS_METHODS_ENDPOINT}/${metodoAEditar.id}`;
      const res = await fetch(updateUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || `Error HTTP: ${res.status}`);
      }

      if (!result.success) {
        throw new Error(result.message || 'Error en la actualización');
      }

      // Recargar los métodos
      await cargarMetodos();
      setMetodoAEditar(null);
      
      displayMessage('✅ Método de pago actualizado correctamente', 'success');
      
    } catch (err) {
      console.error('Error al actualizar método de pago:', err.message);
      displayMessage(`No se pudo actualizar el método de pago: ${err.message}`);
    }
  };

  // Iniciar edición
  const iniciarEdicion = (metodo) => {
    setMetodoAEditar(metodo);
    setNombreMetodo(metodo.nombre);
    setErrores({});
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setMetodoAEditar(null);
    setNombreMetodo('');
    setErrores({});
  };

  // 🔍 Filtrado de métodos por nombre
  const metodosFiltrados = metodos.filter(metodo =>
    metodo.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Cargando métodos de pago...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      {/* 🏷️ Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-2">
          {metodoAEditar ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
        </h1>
      </div>

      {/* Contenedor para mensajes */}
      <div id="message" className="bg-red-100 border border-red-400 text-red-700 px-4 py-0 rounded-xl relative mb-4 transition-all duration-300" style={{ visibility: 'hidden', height: '0', padding: 0 }}></div>

      {/* 📝 Formulario Superior */}
      <div className="bg-white rounded-lg p-6 mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-4">
          {/* Campo Nombre del método de pago */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del método de pago *
            </label>
            <input
              type="text"
              value={nombreMetodo}
              onChange={(e) => {
                setNombreMetodo(e.target.value);
                if (errores.nombre) setErrores({});
              }}
              placeholder="Nombre del método de pago"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400 ${
                errores.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errores.nombre && (
              <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>
            )}
          </div>

          {/* Botón Agregar/Guardar */}
          <div className="lg:w-auto">
            {metodoAEditar ? (
              <div className="flex gap-4">
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
              </div>
            ) : (
              <button
                onClick={agregarMetodo}
                className="w-full lg:w-auto px-6 py-2 bg-indigo-950 text-white text-sm font-medium rounded-full hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
              >
                Agregar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 📋 Lista de Métodos de Pago Inferior */}
      <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
        {/* Header con título y búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-500 mb-4 md:mb-0">
            Tipos de Pagos ({metodos.length})
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
                        <button 
                          onClick={() => iniciarEdicion(metodo)}
                          className="inline-flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-800 transition-colors duration-200"
                        >
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
                      <button 
                        onClick={() => iniciarEdicion(metodo)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-800 transition-colors duration-200"
                      >
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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