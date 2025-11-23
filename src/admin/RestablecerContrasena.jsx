import React, { useEffect, useState } from 'react';

function RestablecerContrasena({ cedula, onVolver }) {
  const [usuario, setUsuario] = useState(null);
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [comentario, setComentario] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🔄 Obtener datos del usuario del backend
    const obtenerUsuario = async () => {
      try {
        const response = await fetch(`http://localhost:6500/api/users/${cedula}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const resultado = await response.json();
        console.log('Respuesta del backend:', resultado);
        
        if (!resultado.success) {
          throw new Error(resultado.message || 'Error al obtener datos del usuario');
        }

        const userData = resultado.data;
        
        if (!userData) {
          throw new Error('No se encontraron datos del usuario');
        }

        // Transformar datos del backend al formato que espera el componente
        // 🗑️ ELIMINADO: campo 'rol' y 'nombre' ya que no existen en la tabla user
        const usuarioData = {
          cedula: userData.cedula_person?.toString() || cedula,
          username: userData.username || 'user' + cedula,
          datosCompletos: userData
        };
        
        setUsuario(usuarioData);
      } catch (err) {
        console.error('Error al cargar usuario:', err);
        setError(`Error al cargar datos del usuario: ${err.message}`);
        
        // 🧪 Datos de simulación como fallback - ELIMINADO rol y nombre
        const usuarioSimulado = {
          cedula: cedula,
          username: 'user' + cedula
        };
        setUsuario(usuarioSimulado);
      }
    };

    obtenerUsuario();
  }, [cedula]);

  // 🔄 Guardar cambios de contraseña - CORREGIDO SEGÚN POSTMAN
  const guardarCambios = async () => {
    if (!nuevaContrasena.trim()) {
      alert('Por favor ingresa una nueva contraseña.');
      return;
    }

    if (nuevaContrasena.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true);
    setError(null);

    try {
      // Preparar los datos para el backend - SEGÚN POSTMAN
      const datosParaEnviar = {
        username: usuario.username, // ✅ Campo requerido
        password: nuevaContrasena   // ✅ Campo requerido (no new_password)
      };

      console.log('Datos enviados al backend:', datosParaEnviar);

      // Llamada al backend para restablecer contraseña
      const response = await fetch('http://localhost:6500/api/users', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosParaEnviar),
      });

      const resultado = await response.json();
      console.log('Respuesta restablecer contraseña:', resultado);

      if (!response.ok) {
        console.error('Error del servidor:', resultado);
        throw new Error(resultado.message || 'Error en la respuesta del servidor');
      }

      if (!resultado.success) {
        throw new Error(resultado.message || 'No se pudo restablecer la contraseña');
      }

      // Éxito
      alert(`✅ Contraseña de ${usuario.username} actualizada correctamente`);
      onVolver();
      
    } catch (err) {
      console.error('Error al actualizar contraseña:', err);
      setError(`❌ No se pudo actualizar la contraseña: ${err.message}`);
      alert(`Error: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  // 🖼️ Manejar cambio de foto (placeholder para futura implementación)
  const handleCambiarFoto = () => {
    alert('Funcionalidad de cambiar foto en desarrollo');
  };

  if (!usuario) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-950 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="w-full mx-auto">
        {/* Encabezado */}
        <div className="bg-white text-gray-500 py-4 px-6 rounded-t-lg">
          <h2 className="text-2xl font-bold">Restablecer Contraseña</h2>
        </div>

        <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Usuario y Contraseña</h3>
        </div>

        {/* Contenedor principal con borde y sombra */}
        <div className="bg-white rounded-b-lg shadow-lg p-6 border border-gray-200">
          {/* Estado de carga y error */}
          {cargando && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
              Actualizando contraseña...
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Contenedor flex para formulario y foto */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sección de Usuario y Contraseña */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Columna 1 - Cédula, Usuario y Contraseña */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cédula de Identidad
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950 bg-gray-100"
                      value={usuario.cedula}
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usuario
                    </label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950 bg-gray-100"
                      value={usuario.username}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña *
                    </label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                      type="password"
                      value={nuevaContrasena}
                      onChange={(e) => setNuevaContrasena(e.target.value)}
                      placeholder="Ingresa la nueva contraseña (mínimo 6 caracteres)"
                      disabled={cargando}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Mínimo 6 caracteres
                    </p>
                  </div>
                </div>

                {/* Columna 2 - Solo Comentario (se eliminó el campo Rol) */}
                <div className="space-y-4">
                  {/* 🗑️ ELIMINADO: Campo de Rol */}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comentario (Opcional)
                    </label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      placeholder="Agregar comentario sobre el cambio de contraseña..."
                      rows="5"
                      disabled={cargando}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Este comentario no se enviará al backend
                    </p>
                  </div>               
                </div>
              </div>
            </div>

            {/* Contenedor de la Foto - Separado pero al lado */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-gray-300 p-6 rounded-lg border border-gray-200 flex flex-col items-center justify-center h-full">
                <div className="relative mb-4">
                  {/* Círculo de la foto */}
                  <div className="w-48 h-48 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center bg-gray-100">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.86-1.35C9.47 4.192 10.74 3 12 3s2.53 1.192 3.546 2.76l.86 1.35a2 2 0 001.664.89H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                </div>

                {/* Botón "Cambiar Foto" */}
                <label className="w-full text-center cursor-pointer">
                  <span 
                    onClick={handleCambiarFoto}
                    className="font-semibold text-gray-700 hover:text-indigo-950 block"
                  >
                    Cambiar Foto
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                  />                      
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center space-x-4 pt-8 mt-6">
          <button 
            type="button" 
            onClick={onVolver}
            disabled={cargando}
            className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Atrás
          </button>
          <button 
            type="button" 
            onClick={guardarCambios}
            disabled={!nuevaContrasena.trim() || nuevaContrasena.length < 6 || cargando}
            className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cargando ? 'Actualizando...' : 'Restablecer Contraseña'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestablecerContrasena;