import React, { useState, useEffect } from 'react';

function FormularioNuevoEstudiante({ onContinuar }) {
  const [datos, setDatos] = useState({
    cedula: '',
    primerNombre: '',
    segundoNombre: '',
    apellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    edad: '',
    sexo: '',
    correo: '',
    telefono: '',
    telefonoEmergencia: '',
    direccion: '',
    cedulaRepresentante: '',
    nivel: '',
    profesor: '',
    sucursal: ''
  });

  // Nuevo estado para datos del representante
  const [datosRepresentante, setDatosRepresentante] = useState({
    guardian_cedula: '',
    guardian_first_name: '',
    guardian_second_name: '',
    guardian_first_lastname: '',
    guardian_second_lastname: '',
    guardian_email: '',
    guardian_telephone: '',
    guardian_work_telephone: '',
    guardian_work_address: ''
  });

  const [cargando, setCargando] = useState(false);
  const [cargandoListas, setCargandoListas] = useState(true);
  const [errores, setErrores] = useState({});
  const [erroresRepresentante, setErroresRepresentante] = useState({});
  const [mostrarRepresentante, setMostrarRepresentante] = useState(false);
  
  // Estados para las listas desplegables
  const [profesores, setProfesores] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [niveles, setNiveles] = useState([]);

  // URLs de la API
  const API_BASE_URL = 'http://localhost:6500/api';
  const STUDENTS_ENDPOINT = `${API_BASE_URL}/students`;
  const GUARDIANS_ENDPOINT = `${API_BASE_URL}/guardians`;
  const TEACHERS_ENDPOINT = `${API_BASE_URL}/teachers`;
  const BRANCHES_ENDPOINT = `${API_BASE_URL}/branches`;
  const LEVELS_ENDPOINT = `${API_BASE_URL}/level`;

  // Calcular edad automáticamente cuando cambia la fecha de nacimiento
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad.toString();
  };

  // Verificar si necesita representante (menor de 9 años)
  const necesitaRepresentante = parseInt(datos.edad) < 9;

  // Cargar listas desplegables
  useEffect(() => {
    const cargarListas = async () => {
      try {
        setCargandoListas(true);
        
        console.log('🔄 Cargando listas desplegables...');
        
        // Cargar profesores
        const resProfesores = await fetch(TEACHERS_ENDPOINT);
        const resultProfesores = await resProfesores.json();
        
        if (resultProfesores.success && resultProfesores.data) {
          setProfesores(resultProfesores.data.map(prof => ({
            id: prof.id_teacher,
            cedula: prof.teacher_cedula,
            nombre: `${prof.teacher_first_name} ${prof.teacher_first_lastname}`
          })));
        }

        // Cargar sucursales
        const resSucursales = await fetch(BRANCHES_ENDPOINT);
        const resultSucursales = await resSucursales.json();
        
        if (resultSucursales.success && resultSucursales.data) {
          setSucursales(resultSucursales.data.map(suc => ({
            id: suc.id_branch,
            nombre: suc.branch
          })));
        }

        // Cargar niveles
        const resNiveles = await fetch(LEVELS_ENDPOINT);
        const resultNiveles = await resNiveles.json();
        
        if (resultNiveles.success && resultNiveles.data) {
          setNiveles(resultNiveles.data.map(nivel => ({
            id: nivel.id_level,
            nombre: nivel.level_name
          })));
        }

      } catch (err) {
        console.error('❌ Error al cargar listas:', err.message);
      } finally {
        setCargandoListas(false);
      }
    };

    cargarListas();
  }, []);

  // Efecto para mostrar/ocultar formulario de representante
  useEffect(() => {
    if (necesitaRepresentante) {
      setMostrarRepresentante(true);
      // Prellenar la cédula del representante con la del estudiante si está vacía
      if (datos.cedula && !datosRepresentante.guardian_cedula) {
        setDatosRepresentante(prev => ({
          ...prev,
          guardian_cedula: datos.cedula
        }));
      }
    } else {
      setMostrarRepresentante(false);
    }
  }, [necesitaRepresentante, datos.cedula]);

  const esMenor = parseInt(datos.edad) <= 18;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'fechaNacimiento') {
      const edadCalculada = calcularEdad(value);
      setDatos(prev => ({ 
        ...prev, 
        [name]: value,
        edad: edadCalculada
      }));
    } else {
      setDatos(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleChangeRepresentante = (e) => {
    const { name, value } = e.target;
    setDatosRepresentante(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (erroresRepresentante[name]) {
      setErroresRepresentante(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Función para normalizar texto (minúsculas)
  const normalizarTexto = (texto) => {
    return texto.toLowerCase().trim();
  };

  // Validación del formulario del estudiante
  const validarFormularioEstudiante = () => {
    const nuevosErrores = {};
    const soloLetrasRegex = /^[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ\s]+$/;
    
    // Validar cédula
    if (!datos.cedula.trim()) {
      nuevosErrores.cedula = 'La cédula es requerida';
    } else if (!/^\d+$/.test(datos.cedula)) {
      nuevosErrores.cedula = 'La cédula debe contener solo números';
    }
    
    // Validar primer nombre (solo letras)
    if (!datos.primerNombre.trim()) {
      nuevosErrores.primerNombre = 'El primer nombre es requerido';
    } else if (!soloLetrasRegex.test(datos.primerNombre)) {
      nuevosErrores.primerNombre = 'El primer nombre solo puede contener letras';
    }
    
    // Validar segundo nombre (solo letras, opcional)
    if (datos.segundoNombre.trim() && !soloLetrasRegex.test(datos.segundoNombre)) {
      nuevosErrores.segundoNombre = 'El segundo nombre solo puede contener letras';
    }
    
    // Validar apellido (solo letras)
    if (!datos.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es requerido';
    } else if (!soloLetrasRegex.test(datos.apellido)) {
      nuevosErrores.apellido = 'El apellido solo puede contener letras';
    }
    
    // Validar segundo apellido (solo letras, opcional)
    if (datos.segundoApellido.trim() && !soloLetrasRegex.test(datos.segundoApellido)) {
      nuevosErrores.segundoApellido = 'El segundo apellido solo puede contener letras';
    }
    
    if (!datos.correo.trim()) {
      nuevosErrores.correo = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(datos.correo)) {
      nuevosErrores.correo = 'El correo electrónico no es válido';
    }
    
    if (!datos.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es requerido';
    }
    
    if (!datos.fechaNacimiento.trim()) {
      nuevosErrores.fechaNacimiento = 'La fecha de nacimiento es requerida';
    }
    
    if (!datos.sexo.trim()) {
      nuevosErrores.sexo = 'El sexo es requerido';
    }
    
    if (!datos.nivel.trim()) {
      nuevosErrores.nivel = 'El nivel es requerido';
    }
    
    if (!datos.profesor.trim()) {
      nuevosErrores.profesor = 'El profesor es requerido';
    }
    
    if (!datos.sucursal.trim()) {
      nuevosErrores.sucursal = 'La sucursal es requerida';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Validación del formulario del representante
  const validarFormularioRepresentante = () => {
    const nuevosErrores = {};
    const soloLetrasRegex = /^[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ\s]+$/;
    
    if (!datosRepresentante.guardian_cedula.trim()) {
      nuevosErrores.guardian_cedula = 'La cédula del representante es requerida';
    } else if (!/^\d+$/.test(datosRepresentante.guardian_cedula)) {
      nuevosErrores.guardian_cedula = 'La cédula debe contener solo números';
    }
    
    if (!datosRepresentante.guardian_first_name.trim()) {
      nuevosErrores.guardian_first_name = 'El primer nombre es requerido';
    } else if (!soloLetrasRegex.test(datosRepresentante.guardian_first_name)) {
      nuevosErrores.guardian_first_name = 'El primer nombre solo puede contener letras';
    }
    
    if (!datosRepresentante.guardian_first_lastname.trim()) {
      nuevosErrores.guardian_first_lastname = 'El apellido es requerido';
    } else if (!soloLetrasRegex.test(datosRepresentante.guardian_first_lastname)) {
      nuevosErrores.guardian_first_lastname = 'El apellido solo puede contener letras';
    }
    
    if (!datosRepresentante.guardian_email.trim()) {
      nuevosErrores.guardian_email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(datosRepresentante.guardian_email)) {
      nuevosErrores.guardian_email = 'El correo electrónico no es válido';
    }
    
    if (!datosRepresentante.guardian_telephone.trim()) {
      nuevosErrores.guardian_telephone = 'El teléfono es requerido';
    }
    
    setErroresRepresentante(nuevosErrores);
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
      fechaNacimiento: '',
      edad: '',
      sexo: '',
      correo: '',
      telefono: '',
      telefonoEmergencia: '',
      direccion: '',
      cedulaRepresentante: '',
      nivel: '',
      profesor: '',
      sucursal: ''
    });
    setDatosRepresentante({
      guardian_cedula: '',
      guardian_first_name: '',
      guardian_second_name: '',
      guardian_first_lastname: '',
      guardian_second_lastname: '',
      guardian_email: '',
      guardian_telephone: '',
      guardian_work_telephone: '',
      guardian_work_address: ''
    });
    setErrores({});
    setErroresRepresentante({});
    setMostrarRepresentante(false);
  };

  // Función para crear el representante
  const crearRepresentante = async () => {
    const payloadRepresentante = {
      guardian_cedula: parseInt(datosRepresentante.guardian_cedula),
      guardian_first_name: normalizarTexto(datosRepresentante.guardian_first_name),
      guardian_second_name: datosRepresentante.guardian_second_name ? normalizarTexto(datosRepresentante.guardian_second_name) : null,
      guardian_first_lastname: normalizarTexto(datosRepresentante.guardian_first_lastname),
      guardian_second_lastname: datosRepresentante.guardian_second_lastname ? normalizarTexto(datosRepresentante.guardian_second_lastname) : null,
      guardian_email: datosRepresentante.guardian_email.trim(),
      guardian_telephone: datosRepresentante.guardian_telephone.trim(),
      guardian_work_telephone: datosRepresentante.guardian_work_telephone.trim() || null,
      guardian_work_address: datosRepresentante.guardian_work_address.trim() || null
    };

    console.log('📤 Enviando POST guardians:', JSON.stringify(payloadRepresentante, null, 2));

    const res = await fetch(GUARDIANS_ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadRepresentante),
    });

    const result = await res.json();
    console.log('📥 Respuesta POST guardians:', result);

    if (!res.ok) {
      throw new Error(result.message || 'Error al crear el representante');
    }

    if (!result.success) {
      throw new Error(result.message || 'Error en la creación del representante');
    }

    return parseInt(datosRepresentante.guardian_cedula);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormularioEstudiante()) {
      displayMessage('Por favor, complete todos los campos requeridos del estudiante correctamente.');
      return;
    }

    if (necesitaRepresentante && !validarFormularioRepresentante()) {
      displayMessage('Por favor, complete todos los campos requeridos del representante correctamente.');
      return;
    }

    setCargando(true);

    try {
      let cedulaRepresentanteId = null;

      // Si necesita representante, crearlo primero
      if (necesitaRepresentante) {
        cedulaRepresentanteId = await crearRepresentante();
      }

      // Obtener los objetos completos para verificar
      const profesorSeleccionado = profesores.find(p => p.cedula === datos.profesor);
      const sucursalSeleccionada = sucursales.find(s => s.id.toString() === datos.sucursal);
      const nivelSeleccionado = niveles.find(n => n.id.toString() === datos.nivel);

      console.log('🔍 Datos seleccionados:', {
        profesor: profesorSeleccionado,
        sucursal: sucursalSeleccionada,
        nivel: nivelSeleccionado,
        cedulaRepresentanteId
      });

      // Preparar el payload del estudiante
      const payload = {
        student_cedula: parseInt(datos.cedula),
        student_first_name: normalizarTexto(datos.primerNombre),
        student_second_name: datos.segundoNombre ? normalizarTexto(datos.segundoNombre) : null,
        student_first_lastname: normalizarTexto(datos.apellido),
        student_second_lastname: datos.segundoApellido ? normalizarTexto(datos.segundoApellido) : null,
        student_email: datos.correo.trim(),
        student_telephone: datos.telefono.trim(),
        student_emergency_telephone: datos.telefonoEmergencia.trim() || null,
        student_sex: datos.sexo,
        student_birthdate: datos.fechaNacimiento,
        student_registration_date: new Date().toISOString(),
        student_home_address: datos.direccion.trim() || null,
        student_cedula_guardians_id: cedulaRepresentanteId, // Usar la cédula del representante creado
        student_level_id: parseInt(datos.nivel),
        student_branch_id: parseInt(datos.sucursal),
        student_cedula_teacher_id: parseInt(datos.profesor)
      };

      console.log('📤 Enviando POST students:', JSON.stringify(payload, null, 2));

      const res = await fetch(STUDENTS_ENDPOINT, {
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
        throw new Error(result.message || 'Error en la creación del estudiante');
      }

      displayMessage('✅ Estudiante creado correctamente' + (necesitaRepresentante ? ' con representante' : ''), 'success');
      
      // Limpiar formulario después de éxito
      handleCancelar();
      
    } catch (err) {
      console.error('❌ Error al crear estudiante:', err.message);
      console.error('❌ Detalles del error:', err);
      
      displayMessage(`Error: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  if (cargandoListas) {
    return (
      <div className="min-h-screen bg-white py-8 px-4 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Cargando datos...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <form className="max-w-5xl mx-auto" onSubmit={handleSubmit}>
        {/* Encabezado Principal del Formulario */}
        <div className="bg-white text-gray-500 py-4 px-6 rounded-t-lg mb-6">
          <h2 className="text-2xl font-bold">Nuevo Estudiante</h2>
          {necesitaRepresentante && (
            <p className="text-orange-600 text-sm mt-1">
              ⚠️ El estudiante es menor de 9 años, se requiere información del representante
            </p>
          )}
        </div>

        {/* Contenedor para mensajes */}
        <div id="message" className="bg-red-100 border border-red-400 text-red-700 px-4 py-0 rounded-xl relative mb-4 transition-all duration-300" style={{ visibility: 'hidden', height: '0', padding: 0 }}></div>

        {/* Contenedor General de Secciones */}
        <div className="bg-white rounded-lg p-0">

          {/* Sección: Datos del Estudiante */}
          <div className="border border-gray-300 rounded-lg shadow-sm">
            <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Datos del Estudiante</h3>
            </div>
            
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primer Nombre *
                </label>
                <input 
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                    errores.primerNombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="primerNombre" 
                  placeholder="Primer Nombre" 
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
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                    errores.segundoNombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="segundoNombre" 
                  placeholder="Segundo Nombre (opcional)" 
                  value={datos.segundoNombre}
                  onChange={handleChange}
                  disabled={cargando}
                />
                {errores.segundoNombre && (
                  <p className="text-red-500 text-xs mt-1">{errores.segundoNombre}</p>
                )}
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
                  placeholder="Apellido" 
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
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                    errores.segundoApellido ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="segundoApellido" 
                  placeholder="Segundo Apellido (opcional)" 
                  value={datos.segundoApellido}
                  onChange={handleChange}
                  disabled={cargando}
                />
                {errores.segundoApellido && (
                  <p className="text-red-500 text-xs mt-1">{errores.segundoApellido}</p>
                )}
              </div>
              
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
                  Fecha de Nacimiento *
                </label>
                <input 
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                    errores.fechaNacimiento ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="fechaNacimiento" 
                  type="date" 
                  value={datos.fechaNacimiento}
                  onChange={handleChange}
                  disabled={cargando}
                />
                {errores.fechaNacimiento && (
                  <p className="text-red-500 text-xs mt-1">{errores.fechaNacimiento}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad
                </label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                  name="edad"
                  placeholder="Edad"
                  value={datos.edad}
                  readOnly
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Calculada automáticamente</p>
                {necesitaRepresentante && (
                  <p className="text-orange-600 text-xs mt-1">Se requiere representante</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sexo *
                </label>
                <select 
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                    errores.sexo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="sexo"
                  value={datos.sexo}
                  onChange={handleChange}
                  disabled={cargando}
                >
                  <option value="">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
                {errores.sexo && (
                  <p className="text-red-500 text-xs mt-1">{errores.sexo}</p>
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
                  Teléfono Celular *
                </label>
                <input 
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                    errores.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="telefono" 
                  placeholder="Teléfono Celular" 
                  value={datos.telefono}
                  onChange={handleChange}
                  disabled={cargando}
                />
                {errores.telefono && (
                  <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono de Emergencia
                </label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="telefonoEmergencia" 
                  placeholder="Teléfono de Emergencia (opcional)" 
                  value={datos.telefonoEmergencia}
                  onChange={handleChange}
                  disabled={cargando}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cédula del Representante
                </label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="cedulaRepresentante" 
                  placeholder="Cédula del Representante (opcional)" 
                  value={datos.cedulaRepresentante}
                  onChange={handleChange}
                  disabled={cargando}
                />
              </div>
              
              <div className="col-span-1 md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="direccion" 
                  placeholder="Dirección (opcional)" 
                  value={datos.direccion}
                  onChange={handleChange}
                  disabled={cargando}
                />
              </div>
            </div>
          </div>

          {/* Sección: Datos del Representante (solo si es menor de 9 años) */}
          {mostrarRepresentante && (
            <div className="mt-8 border border-gray-300 rounded-lg shadow-sm">
              <div className="bg-orange-600 px-5 py-2 rounded-t-lg flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Datos del Representante</h3>
                <span className="text-white text-sm bg-orange-700 px-2 py-1 rounded">Requerido</span>
              </div>
              
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cédula del Representante *
                  </label>
                  <input 
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 ${
                      erroresRepresentante.guardian_cedula ? 'border-red-500' : 'border-gray-300'
                    }`}
                    name="guardian_cedula"
                    placeholder="Cédula del Representante"
                    value={datosRepresentante.guardian_cedula}
                    onChange={handleChangeRepresentante}
                    disabled={cargando}
                  />
                  {erroresRepresentante.guardian_cedula && (
                    <p className="text-red-500 text-xs mt-1">{erroresRepresentante.guardian_cedula}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primer Nombre *
                  </label>
                  <input 
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 ${
                      erroresRepresentante.guardian_first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    name="guardian_first_name"
                    placeholder="Primer Nombre"
                    value={datosRepresentante.guardian_first_name}
                    onChange={handleChangeRepresentante}
                    disabled={cargando}
                  />
                  {erroresRepresentante.guardian_first_name && (
                    <p className="text-red-500 text-xs mt-1">{erroresRepresentante.guardian_first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Segundo Nombre
                  </label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    name="guardian_second_name"
                    placeholder="Segundo Nombre (opcional)"
                    value={datosRepresentante.guardian_second_name}
                    onChange={handleChangeRepresentante}
                    disabled={cargando}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primer Apellido *
                  </label>
                  <input 
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 ${
                      erroresRepresentante.guardian_first_lastname ? 'border-red-500' : 'border-gray-300'
                    }`}
                    name="guardian_first_lastname"
                    placeholder="Primer Apellido"
                    value={datosRepresentante.guardian_first_lastname}
                    onChange={handleChangeRepresentante}
                    disabled={cargando}
                  />
                  {erroresRepresentante.guardian_first_lastname && (
                    <p className="text-red-500 text-xs mt-1">{erroresRepresentante.guardian_first_lastname}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Segundo Apellido
                  </label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    name="guardian_second_lastname"
                    placeholder="Segundo Apellido (opcional)"
                    value={datosRepresentante.guardian_second_lastname}
                    onChange={handleChangeRepresentante}
                    disabled={cargando}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input 
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 ${
                      erroresRepresentante.guardian_email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    name="guardian_email"
                    placeholder="Correo Electrónico"
                    value={datosRepresentante.guardian_email}
                    onChange={handleChangeRepresentante}
                    disabled={cargando}
                  />
                  {erroresRepresentante.guardian_email && (
                    <p className="text-red-500 text-xs mt-1">{erroresRepresentante.guardian_email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input 
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 ${
                      erroresRepresentante.guardian_telephone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    name="guardian_telephone"
                    placeholder="Teléfono"
                    value={datosRepresentante.guardian_telephone}
                    onChange={handleChangeRepresentante}
                    disabled={cargando}
                  />
                  {erroresRepresentante.guardian_telephone && (
                    <p className="text-red-500 text-xs mt-1">{erroresRepresentante.guardian_telephone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono de Trabajo
                  </label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    name="guardian_work_telephone"
                    placeholder="Teléfono de Trabajo (opcional)"
                    value={datosRepresentante.guardian_work_telephone}
                    onChange={handleChangeRepresentante}
                    disabled={cargando}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección de Trabajo
                  </label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    name="guardian_work_address"
                    placeholder="Dirección de Trabajo (opcional)"
                    value={datosRepresentante.guardian_work_address}
                    onChange={handleChangeRepresentante}
                    disabled={cargando}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sección: Programar */}
          <div className="mt-8 border border-gray-300 rounded-lg shadow-sm">
            <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Programar</h3>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel a cursar *
                </label>
                <select 
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                    errores.nivel ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="nivel"
                  value={datos.nivel}
                  onChange={handleChange}
                  disabled={cargando}
                >
                  <option value="">Seleccionar nivel</option>
                  {niveles.map(nivel => (
                    <option key={nivel.id} value={nivel.id}>
                      {nivel.nombre}
                    </option>
                  ))}
                </select>
                {errores.nivel && (
                  <p className="text-red-500 text-xs mt-1">{errores.nivel}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asignación de Profesor *
                </label>
                <select 
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                    errores.profesor ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="profesor"
                  value={datos.profesor}
                  onChange={handleChange}
                  disabled={cargando}
                >
                  <option value="">Seleccionar profesor</option>
                  {profesores.map(prof => (
                    <option key={prof.cedula} value={prof.cedula}>
                      {prof.nombre} ({prof.cedula})
                    </option>
                  ))}
                </select>
                {errores.profesor && (
                  <p className="text-red-500 text-xs mt-1">{errores.profesor}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sucursal *
                </label>
                <select 
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950 ${
                    errores.sucursal ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="sucursal"
                  value={datos.sucursal}
                  onChange={handleChange}
                  disabled={cargando}
                >
                  <option value="">Seleccionar sucursal</option>
                  {sucursales.map(suc => (
                    <option key={suc.id} value={suc.id}>
                      {suc.nombre}
                    </option>
                  ))}
                </select>
                {errores.sucursal && (
                  <p className="text-red-500 text-xs mt-1">{errores.sucursal}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información de campos requeridos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Los campos marcados con * son obligatorios. 
              {necesitaRepresentante && " Se requiere información del representante para estudiantes menores de 9 años."}
              {esMenor && !necesitaRepresentante && " El estudiante es menor de edad."}
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
                `Cargar ${necesitaRepresentante ? 'con Representante' : ''}`
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormularioNuevoEstudiante;