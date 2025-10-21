import React, { useEffect, useState } from 'react';

function RestablecerContrasena({ cedula, onVolver }) {
  const [usuario, setUsuario] = useState(null);
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    // ⚠️ Reemplaza esta simulación por fetch real cuando tengas el backend:
    /*
    fetch(`https://tu-backend.com/api/usuarios/${cedula}`)
      .then((res) => res.json())
      .then((data) => setUsuario(data))
      .catch((err) => console.error('Error al cargar usuario:', err));
    */

    // 🧪 Simulación temporal de datos del usuario
    const usuarioSimulado = {
      cedula: cedula,
      nombre: 'Miguel Guerra',
      rol: 'Estudiante',
      contrasenaActual: 'Hello.123'
    };
    setUsuario(usuarioSimulado);
  }, [cedula]);

  // 🔄 Guardar cambios de contraseña
  const guardarCambios = () => {
    if (!nuevaContrasena.trim()) {
      alert('Por favor ingresa una nueva contraseña.');
      return;
    }

    // ⚠️ Reemplaza esta simulación por fetch real cuando tengas el backend:
    /*
    fetch(`https://tu-backend.com/api/usuarios/${cedula}/contrasena`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        contrasena: nuevaContrasena, 
        comentario 
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert('Contraseña actualizada correctamente.');
          onVolver();
        } else {
          throw new Error('Error en la respuesta del servidor');
        }
      })
      .catch((err) => {
        console.error('Error al actualizar contraseña:', err);
        alert('No se pudo actualizar la contraseña.');
      });
    */

    // 🧪 Simulación temporal
    alert(`Contraseña de ${usuario.nombre} actualizada correctamente`);
    onVolver();
  };

  // 🖼️ Manejar cambio de foto (placeholder para futura implementación)
  const handleCambiarFoto = () => {
    // 📸 Lógica para cambiar foto del usuario
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
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <div className="bg-white text-gray-500 py-4 px-6 rounded-t-lg">
          <h2 className="text-2xl font-bold">Restablecer Contraseña</h2>
        </div>

        <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Usuario y Contraseña</h3>
        </div>

        {/* Contenedor principal con borde y sombra */}
        <div className="bg-white rounded-b-lg shadow-lg p-6 border border-gray-200">
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
                      value={usuario.nombre}
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña Actual
                    </label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950 bg-gray-100"
                      value="••••••••"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                      type="password"
                      value={nuevaContrasena}
                      onChange={(e) => setNuevaContrasena(e.target.value)}
                      placeholder="Ingresa la nueva contraseña"
                    />
                  </div>
                </div>

                {/* Columna 2 - Rol y Comentario */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950 bg-gray-100"
                      value={usuario.rol}
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comentario
                    </label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      placeholder="Agregar comentario sobre el cambio de contraseña..."
                      rows="5"
                    />
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
            className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Atrás
          </button>
          <button 
            type="button" 
            onClick={guardarCambios}
            disabled={!nuevaContrasena.trim()}
            className="px-8 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Cargar
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestablecerContrasena;