import React, { useState } from 'react';

function FormularioNuevoProfesor({ onContinuar }) {
  const [datos, setDatos] = useState({
    cedula: '',
    primerNombre: '',
    segundoNombre: '',
    apellido: '',
    segundoApellido: '',
    telefono: '',
    correo: ''
  });
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});

  // URL de la API
  const API_BASE_URL = 'http://localhost:6500/api';
  const TEACHERS_ENDPOINT = `${API_BASE_URL}/teachers`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validación del formulario
  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!datos.cedula.trim()) {
      nuevosErrores.cedula = 'La cédula es requerida';
    } else if (!/^\d+$/.test(datos.cedula)) {
      nuevosErrores.cedula = 'La cédula debe contener solo números';
    }
    
    if (!datos.primerNombre.trim()) {
      nuevosErrores.primerNombre = 'El primer nombre es requerido';
    }
    
    if (!datos.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es requerido';
    }
    
    if (!datos.correo.trim()) {
      nuevosErrores.correo = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(datos.correo)) {
      nuevosErrores.correo = 'El correo electrónico no es válido';
    }
    
    if (!datos.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es requerido';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
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

  const handleCancelar = () => {
    setDatos({
      cedula: '',
      primerNombre: '',
      segundoNombre: '',
      apellido: '',
      segundoApellido: '',
      telefono: '',
      correo: ''
    });
    setErrores({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setCargando(true);

    // Preparar el payload según la estructura de tu API (sin dirección ni teléfono emergencia)
    const payload = {
      teacher_cedula: parseInt(datos.cedula),
      teacher_first_name: datos.primerNombre,
      teacher_second_name: datos.segundoNombre.trim() || null,
      teacher_first_lastname: datos.apellido,
      teacher_second_lastname: datos.segundoApellido.trim() || null,
      teacher_email: datos.correo,
      teacher_telephone: datos.telefono
    };

    console.log('📤 Enviando POST teachers:', payload);

    try {
      const res = await fetch(TEACHERS_ENDPOINT, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 Status respuesta:', res.status);

      // Verificar si la respuesta es JSON
      const contentType = res.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Respuesta no JSON: ${text.substring(0, 100)}`);
      }

      console.log('📥 Respuesta POST teachers:', result);

      if (!res.ok) {
        throw new Error(result.message || `Error HTTP: ${res.status}`);
      }

      if (!result.success) {
        throw new Error(result.message || 'Error en la creación del profesor');
      }

      displayMessage('✅ Profesor creado correctamente', 'success');
      
      // Limpiar formulario después de éxito
      handleCancelar();
      
      // Si necesitas continuar a otro paso, descomenta esta línea:
      // onContinuar('registro-usuario', datos.cedula);
      
    } catch (err) {
      console.error('Error al crear profesor:', err.message);
      displayMessage(`No se pudo crear el profesor: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <form className="max-w-5xl mx-auto" onSubmit={handleSubmit}>
        {/* Encabezado */}
        <div className="bg-white text-gray-500 py-4 px-6 rounded-t-lg ">
          <h2 className="text-2xl font-bold">Nuevo Profesor</h2>
        </div>

        {/* Contenedor para mensajes */}
        <div id="message" className="bg-red-100 border border-red-400 text-red-700 px-4 py-0 rounded-xl relative mb-4 transition-all duration-300" style={{ visibility: 'hidden', height: '0', padding: 0 }}></div>

        {/* Contenedor principal con borde y sombra */}
        <div className="bg-white rounded-b-lg p-6 border-gray-200">
          {/* Sección de Datos del Profesor */}

          <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Datos del Profesor</h3>
          </div>

          <div className="mb-8 border border-gray-300 rounded-b-lg p-5 shadow-sm">
            {/* Primera fila: 4 campos - Nombres y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input 
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                    errores.primerNombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="primerNombre"
                  placeholder="Primer nombre"
                  value={datos.primerNombre}
                  onChange={handleChange}
                  disabled={cargando}
                />
                {errores.primerNombre && (
                  <p className="text-red-500 text-xs mt-1">{errores.primerNombre}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Segundo Nombre
                </label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="segundoNombre"
                  placeholder="Segundo nombre (opcional)"
                  value={datos.segundoNombre}
                  onChange={handleChange}
                  disabled={cargando}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input 
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                    errores.apellido ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="apellido"
                  placeholder="Primer apellido"
                  value={datos.apellido}
                  onChange={handleChange}
                  disabled={cargando}
                />
                {errores.apellido && (
                  <p className="text-red-500 text-xs mt-1">{errores.apellido}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Segundo Apellido
                </label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="segundoApellido"
                  placeholder="Segundo apellido (opcional)"
                  value={datos.segundoApellido}
                  onChange={handleChange}
                  disabled={cargando}
                />
              </div>
            </div>
            
            {/* Segunda fila: 3 campos - Cédula, Correo, Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cédula de Identidad *
                </label>
                <input 
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                    errores.cedula ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="cedula"
                  placeholder="Cédula de Identidad"
                  value={datos.cedula}
                  onChange={handleChange}
                  disabled={cargando}
                />
                {errores.cedula && (
                  <p className="text-red-500 text-xs mt-1">{errores.cedula}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico *
                </label>
                <input 
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                    errores.correo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="correo"
                  placeholder="Correo Electrónico"
                  value={datos.correo}
                  onChange={handleChange}
                  disabled={cargando}
                />
                {errores.correo && (
                  <p className="text-red-500 text-xs mt-1">{errores.correo}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input 
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                    errores.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="telefono"
                  placeholder="Teléfono"
                  value={datos.telefono}
                  onChange={handleChange}
                  disabled={cargando}
                />
                {errores.telefono && (
                  <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información de campos requeridos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Los campos marcados con * son obligatorios. 
              Los campos opcionales se enviarán como null si están vacíos.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-center space-x-4 pt-4">
            <button 
              type="button" 
              onClick={handleCancelar}
              disabled={cargando}
              className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={cargando}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {cargando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Cargando...
                </>
              ) : (
                'Cargar'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormularioNuevoProfesor;