import React, { useState } from 'react';

function RegistroUsuario({ cedula, onCancelar, onUsuarioCreado }) {
  const [datos, setDatos] = useState({
    cedula_person: cedula || '',
    username: '',
    password: '',
    confirmarPassword: '',
    role: '',
    comentario: ''
  });

  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});
  
  // ✅ SOLUCIÓN: Usar estado para el mensaje
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '', visible: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ SOLUCIÓN: Usar estado en lugar de manipular el DOM
  const displayMessage = (message, messageType = 'error') => {
    setMensaje({ texto: message, tipo: messageType, visible: true });
    
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '', visible: false });
    }, 5000);
  };

  // Validación del formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar usuario
    if (!datos.username.trim()) {
      nuevosErrores.username = 'El usuario es requerido';
    } else if (datos.username.length < 3) {
      nuevosErrores.username = 'El usuario debe tener al menos 3 caracteres';
    }

    // Validar contraseña
    if (!datos.password.trim()) {
      nuevosErrores.password = 'La contraseña es requerida';
    } else if (datos.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(datos.password)) {
      nuevosErrores.password = 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial';
    }

    // Validar confirmación de contraseña
    if (!datos.confirmarPassword.trim()) {
      nuevosErrores.confirmarPassword = 'Confirme la contraseña';
    } else if (datos.password !== datos.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';
    }

    // Validar rol
    if (!datos.role.trim()) {
      nuevosErrores.role = 'El rol es requerido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      displayMessage('Por favor, complete todos los campos requeridos correctamente.');
      return;
    }

    setCargando(true);

    // Preparar el payload según la estructura de la API
    const payload = {
      cedula_person: parseInt(datos.cedula_person),
      username: datos.username.trim(),
      password: datos.password,
      role: datos.role
    };

    console.log('📤 Enviando POST users:', JSON.stringify(payload, null, 2));

    try {
      const res = await fetch('http://localhost:6500/api/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 Status respuesta:', res.status);

      const result = await res.json();
      console.log('📥 Respuesta completa del servidor:', result);

      if (!res.ok) {
        // Mostrar errores específicos del servidor si están disponibles
        if (result.errors) {
          const serverErrors = result.errors.map(err => err.message).join(', ');
          throw new Error(serverErrors);
        }
        if (result.error && Array.isArray(result.error)) {
          const serverErrors = result.error.map(err => err.message).join(', ');
          throw new Error(serverErrors);
        }
        throw new Error(result.message || `Error HTTP: ${res.status}`);
      }

      if (!result.success) {
        throw new Error(result.message || 'Error en la creación del usuario');
      }

      displayMessage('✅ Usuario creado correctamente', 'success');
      
      // Si se proporcionó la función de callback, ejecutarla
      if (onUsuarioCreado) {
        setTimeout(() => {
          onUsuarioCreado();
        }, 1500);
      }
      
    } catch (err) {
      console.error('❌ Error al crear usuario:', err.message);
      console.error('❌ Detalles del error:', err);
      
      displayMessage(`Error: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = () => {
    if (onCancelar) {
      onCancelar();
    }
  };

  // Generar sugerencia de usuario basada en la cédula
  const generarSugerenciaUsuario = () => {
    if (cedula) {
      const sugerencia = `user${cedula.slice(-4)}`;
      setDatos(prev => ({
        ...prev,
        username: sugerencia
      }));
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <form className="max-w-5xl mx-auto" onSubmit={handleSubmit}>
        {/* Encabezado */}
        <div className="bg-white text-gray-500 py-4 px-6 rounded-t-lg mb-6">
          <h2 className="text-2xl font-bold">Usuario y Contraseña</h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete los datos de acceso para el usuario
          </p>
        </div>

        {/* ✅ SOLUCIÓN: Mensaje condicional usando estado */}
        {mensaje.visible && (
          <div className={`${
            mensaje.tipo === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          } px-4 py-3 rounded-xl relative mb-4 transition-all duration-300`}>
            {mensaje.texto}
          </div>
        )}

        <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Credenciales de Acceso</h3>
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
                      Cédula de Identidad *
                    </label>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950 bg-gray-100"
                      name="cedula_person"
                      placeholder="Cédula de Identidad"
                      value={datos.cedula_person}
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">Cédula del estudiante/profesor</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usuario *
                    </label>
                    <div className="flex gap-2">
                      <input 
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                          errores.username ? 'border-red-500' : 'border-gray-300'
                        }`}
                        name="username" 
                        placeholder="Usuario" 
                        value={datos.username}
                        onChange={handleChange}
                        disabled={cargando}
                      />
                      <button
                        type="button"
                        onClick={generarSugerenciaUsuario}
                        disabled={!cedula || cargando}
                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
                      >
                        Sugerir
                      </button>
                    </div>
                    {errores.username && (
                      <p className="text-red-500 text-xs mt-1">{errores.username}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña *
                    </label>
                    <input 
                      className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                        errores.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      name="password" 
                      type="password" 
                      placeholder="Contraseña" 
                      value={datos.password}
                      onChange={handleChange}
                      disabled={cargando}
                    />
                    {errores.password && (
                      <p className="text-red-500 text-xs mt-1">{errores.password}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Mínimo 6 caracteres, con mayúscula, minúscula, número y carácter especial
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Contraseña *
                    </label>
                    <input 
                      className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                        errores.confirmarPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      name="confirmarPassword" 
                      type="password" 
                      placeholder="Confirmar Contraseña" 
                      value={datos.confirmarPassword}
                      onChange={handleChange}
                      disabled={cargando}
                    />
                    {errores.confirmarPassword && (
                      <p className="text-red-500 text-xs mt-1">{errores.confirmarPassword}</p>
                    )}
                  </div>
                </div>

                {/* Columna 2 - Rol y Comentario */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol *
                    </label>
                    <select 
                      className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                        errores.role ? 'border-red-500' : 'border-gray-300'
                      }`}
                      name="role"
                      value={datos.role}
                      onChange={handleChange}
                      disabled={cargando}
                    >
                      <option value="">Seleccionar Rol</option>
                      <option value="student">Estudiante</option>
                      <option value="teacher">Profesor</option>
                      <option value="admin">Administrador</option>
                    </select>
                    {errores.role && (
                      <p className="text-red-500 text-xs mt-1">{errores.role}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comentario (Opcional)
                    </label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                      name="comentario" 
                      placeholder="Comentario adicional..." 
                      rows="5"
                      value={datos.comentario}
                      onChange={handleChange}
                      disabled={cargando}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Información adicional sobre el usuario (no se envía a la API)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenedor de la Foto - Separado pero al lado */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col items-center justify-center h-full">
                <div className="relative mb-4">
                  {/* Círculo de la foto */}
                  <div className="w-48 h-48 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center bg-white overflow-hidden">
                    {previewFoto ? (
                      <img 
                        src={previewFoto} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.86-1.35C9.47 4.192 10.74 3 12 3s2.53 1.192 3.546 2.76l.86 1.35a2 2 0 001.664.89H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    )}
                  </div>
                </div>

                {/* Botón "Agregar foto" */}
                <label className="w-full text-center cursor-pointer">
                  <span className="font-semibold text-gray-700 hover:text-indigo-950 block px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    {previewFoto ? 'Cambiar foto' : 'Agregar foto'}
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleFotoChange}
                    disabled={cargando}
                  />                      
                </label>
                {foto && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {foto.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Información de campos requeridos */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <p className="text-sm text-blue-700">
            <strong>Nota:</strong> Los campos marcados con * son obligatorios. 
            La foto de perfil es opcional y no se envía a la API en este momento.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center space-x-4 pt-4">
          <button 
            type="button" 
            onClick={handleCancelar}
            disabled={cargando}
            className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={cargando}
            className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {cargando ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Cargando...
              </>
            ) : (
              'Crear Usuario'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistroUsuario;