import React, { useEffect, useState } from 'react';

function EditarUsuario({ cedula, onNavigate }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [profesores, setProfesores] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [studentId, setStudentId] = useState(null); // Nuevo estado para el ID del estudiante

  // Función para obtener el nombre del nivel en español
  const obtenerNombreNivel = (levelName) => {
    const niveles = {
      'elementary': 'Elemental',
      'basic': 'Básico', 
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado',
      'proficiency': 'Perfeccionamiento'
    };
    return niveles[levelName] || levelName || 'No asignado';
  };

  // Obtener lista de profesores
  const obtenerProfesores = async () => {
    try {
      const response = await fetch('http://localhost:6500/api/teachers');
      const resultado = await response.json();
      console.log('Profesores cargados:', resultado);
      if (resultado.success && resultado.data) {
        setProfesores(resultado.data);
      }
    } catch (err) {
      console.error('Error al cargar profesores:', err);
    }
  };

  // Obtener lista de sucursales
  const obtenerSucursales = async () => {
    try {
      const response = await fetch('http://localhost:6500/api/branches');
      const resultado = await response.json();
      console.log('Sucursales cargadas:', resultado);
      if (resultado.success && resultado.data) {
        const sucursalesMapeadas = resultado.data.map(sucursal => ({
          id_branch: sucursal.id_branch,
          branch_name: sucursal.branch
        }));
        setSucursales(sucursalesMapeadas);
      }
    } catch (err) {
      console.error('Error al cargar sucursales:', err);
    }
  };

  // Obtener datos completos del representante
  const obtenerDatosRepresentante = async (cedulaRepresentante) => {
    if (!cedulaRepresentante) return null;
    
    try {
      const response = await fetch('http://localhost:6500/api/guardian', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guardianCedula: parseInt(cedulaRepresentante)
        })
      });

      const resultado = await response.json();
      console.log('Datos del representante:', resultado);
      
      if (resultado.success && resultado.data && resultado.data.length > 0) {
        return resultado.data[0];
      }
      return null;
    } catch (err) {
      console.error('Error al obtener datos del representante:', err);
      return null;
    }
  };

  // Obtener datos reales de la API
  useEffect(() => {
    const obtenerUsuario = async () => {
      if (!cedula) {
        setError("No se proporcionó cédula");
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setError(null);
        
        console.log('Buscando usuario para editar con cédula:', cedula);
        
        const response = await fetch(`http://localhost:6500/api/student`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentCedula: parseInt(cedula)
          })
        });

        const resultado = await response.json();
        console.log('Respuesta de la API para editar:', resultado);

        if (!response.ok || !resultado.success) {
          throw new Error(resultado.message || 'Error al obtener usuario');
        }

        if (resultado.data && resultado.data.length > 0) {
          const datosEstudiante = resultado.data[0];
          console.log('Datos completos del estudiante:', datosEstudiante);
          
          // GUARDAR EL ID DEL ESTUDIANTE - ESTO ES CLAVE
          if (datosEstudiante.id_student) {
            setStudentId(datosEstudiante.id_student);
          } else {
            console.warn('No se encontró id_student en los datos');
          }
          
          const tieneRepresentante = datosEstudiante.guardian_cedula && 
                                   datosEstudiante.guardian_first_name;
          
          let datosRepresentanteCompletos = null;
          
          if (tieneRepresentante && datosEstudiante.guardian_cedula) {
            datosRepresentanteCompletos = await obtenerDatosRepresentante(datosEstudiante.guardian_cedula);
          }

          const usuarioTransformado = {
            tipo: 'estudiante',
            primerNombre: datosEstudiante.student_first_name || '',
            segundoNombre: datosEstudiante.student_second_name || '',
            primerApellido: datosEstudiante.student_first_lastname || '',
            segundoApellido: datosEstudiante.student_second_lastname || '',
            cedula: datosEstudiante.student_cedula?.toString() || cedula,
            fechaNacimiento: datosEstudiante.student_birthdate ? 
              new Date(datosEstudiante.student_birthdate).toISOString().split('T')[0] : '',
            correo: datosEstudiante.student_email || '',
            telefono: datosEstudiante.student_telephone || '',
            emergencia: datosEstudiante.student_emergency_telephone || '',
            direccion: datosEstudiante.student_home_address || '',
            sexo: datosEstudiante.student_sex === 'M' ? 'Masculino' : 
                  datosEstudiante.student_sex === 'F' ? 'Femenino' : '',
            nivel: obtenerNombreNivel(datosEstudiante.level_name),
            nivelOriginal: datosEstudiante.level_name,
            profesor: datosEstudiante.teacher_first_name && datosEstudiante.teacher_first_lastname 
              ? `${datosEstudiante.teacher_first_name} ${datosEstudiante.teacher_first_lastname}`
              : '',
            profesorId: datosEstudiante.student_cedula_teacher_id || '',
            sede: datosEstudiante.branch || '',
            sedeId: datosEstudiante.student_branch_id || '',
            tieneRepresentante: !!tieneRepresentante,
            representante: tieneRepresentante ? {
              primerNombre: datosRepresentanteCompletos?.guardian_first_name || datosEstudiante.guardian_first_name || '',
              segundoNombre: datosRepresentanteCompletos?.guardian_second_name || datosEstudiante.guardian_second_name || '',
              primerApellido: datosRepresentanteCompletos?.guardian_first_lastname || datosEstudiante.guardian_first_lastname || '',
              segundoApellido: datosRepresentanteCompletos?.guardian_second_lastname || datosEstudiante.guardian_second_lastname || '',
              cedula: datosEstudiante.guardian_cedula?.toString() || '',
              telefono: datosRepresentanteCompletos?.guardian_telephone || datosEstudiante.guardian_telephone || '',
              trabajo: datosRepresentanteCompletos?.guardian_work_phone || datosEstudiante.guardian_work_phone || '',
              correo: datosRepresentanteCompletos?.guardian_email || datosEstudiante.guardian_email || '',
              direccionTrabajo: datosRepresentanteCompletos?.guardian_work_address || datosEstudiante.guardian_work_address || '',
            } : null
          };
          
          console.log('Usuario transformado para editar:', usuarioTransformado);
          setUsuario(usuarioTransformado);
        } else {
          setError("No se encontró el usuario en la base de datos");
        }
      } catch (err) {
        console.error('Error al obtener usuario para editar:', err);
        setError(err.message || 'Error al cargar los datos del usuario');
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuario();
    obtenerProfesores();
    obtenerSucursales();
  }, [cedula]);

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '';
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return `${edad} años`;
  };

  const edad = usuario?.fechaNacimiento ? calcularEdad(usuario.fechaNacimiento) : '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleRepChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({
      ...prev,
      representante: { ...prev.representante, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Datos a actualizar:', usuario);
    
    // VERIFICAR QUE TENEMOS EL ID DEL ESTUDIANTE
    if (!studentId) {
      alert('❌ Error: No se pudo identificar el ID del estudiante');
      return;
    }

    try {
      // USAR EL ID DEL ESTUDIANTE EN LUGAR DE LA CÉDULA
      const response = await fetch(`http://localhost:6500/api/student/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_first_name: usuario.primerNombre,
          student_second_name: usuario.segundoNombre,
          student_first_lastname: usuario.primerApellido,
          student_second_lastname: usuario.segundoApellido,
          student_email: usuario.correo,
          student_telephone: usuario.telefono,
          student_emergency_telephone: usuario.emergencia,
          student_home_address: usuario.direccion,
          student_sex: usuario.sexo === 'Masculino' ? 'M' : 'F',
          student_birthdate: usuario.fechaNacimiento,
          // Asegúrate de que estos campos sean los correctos para tu API
          student_level_id: usuario.nivel === 'Elemental' ? 1 : 
                           usuario.nivel === 'Básico' ? 2 :
                           usuario.nivel === 'Intermedio' ? 3 :
                           usuario.nivel === 'Avanzado' ? 4 : 5,
        })
      });

      console.log('Response status:', response.status);
      
      // Verificar si la respuesta es HTML en lugar de JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.log('Respuesta no JSON:', textResponse);
        throw new Error('El servidor devolvió una respuesta no JSON. Posible error 404.');
      }

      const resultado = await response.json();
      console.log('Resultado de la actualización:', resultado);
      
      if (response.ok && resultado.success) {
        alert('✅ Usuario actualizado correctamente');
        onNavigate('detalle-usuario');
      } else {
        throw new Error(resultado.message || 'Error al actualizar usuario');
      }
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      alert('❌ Error al actualizar usuario: ' + err.message);
    }
  };

  if (cargando) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-950 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del usuario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="text-center py-16">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <p className="text-gray-500 text-lg font-medium mb-2">Error</p>
          <p className="text-gray-400 text-sm">{error}</p>
          <button 
            onClick={() => onNavigate('detalle-usuario')}
            className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <p className="text-gray-500 text-lg font-medium mb-2">No se encontró el usuario</p>
          <button 
            onClick={() => onNavigate('detalle-usuario')}
            className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      
      <h1 className="text-2xl font-bold text-indigo-950 mb-2">Editar Usuario</h1>

      {/* 🖼️ Foto del usuario con botón de editar */}
      <div className="flex flex-col items-center mb-6">
        <div className="text-indigo-950 font-medium mb-4">Editar Foto</div>
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <span className="text-gray-500 text-sm text-center">Foto</span>
        </div>
        <button className="text-gray-500 hover:text-gray-700 text-sm font-medium">
          Editar Foto
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 📋 Datos del Estudiante */}
        <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Datos del Estudiante</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          
          {/* Fila 1: Nombres */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Primer Nombre</label>
              <input 
                type="text" 
                name="primerNombre" 
                value={usuario.primerNombre} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Segundo Nombre</label>
              <input 
                type="text" 
                name="segundoNombre" 
                value={usuario.segundoNombre} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Primer Apellido</label>
              <input 
                type="text" 
                name="primerApellido" 
                value={usuario.primerApellido} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Segundo Apellido</label>
              <input 
                type="text" 
                name="segundoApellido" 
                value={usuario.segundoApellido} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Fila 2: Datos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cédula de Identidad</label>
              <input 
                type="text" 
                name="cedula" 
                value={usuario.cedula} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Nacimiento</label>
              <input 
                type="date" 
                name="fechaNacimiento" 
                value={usuario.fechaNacimiento} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Edad</label>
              <input 
                type="text" 
                value={edad} 
                disabled 
                className="w-full p-2 border border-gray-300 rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sexo</label>
              <select 
                name="sexo" 
                value={usuario.sexo} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
          </div>

          {/* Fila 3: Contacto */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                name="correo" 
                value={usuario.correo} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono Celular</label>
              <input 
                type="text" 
                name="telefono" 
                value={usuario.telefono} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono de Emergencia</label>
              <input 
                type="text" 
                name="emergencia" 
                value={usuario.emergencia} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cédula del Representante</label>
              <input 
                type="text" 
                name="cedula" 
                value={usuario.representante?.cedula || ''} 
                onChange={handleRepChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!usuario.tieneRepresentante}
              />
            </div>
          </div>

          {/* Fila 4: Dirección */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección</label>
            <input 
              type="text" 
              name="direccion" 
              value={usuario.direccion} 
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        
        {/* 👨‍👩‍👧 Datos del Representante - Solo si tiene representante */}
        {usuario.tieneRepresentante && usuario.representante && (
          <>
            <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Datos del Representante</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              
              {/* Fila 1: Nombres del representante */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Primer Nombre</label>
                  <input 
                    type="text" 
                    name="primerNombre" 
                    value={usuario.representante.primerNombre} 
                    onChange={handleRepChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Segundo Nombre</label>
                  <input 
                    type="text" 
                    name="segundoNombre" 
                    value={usuario.representante.segundoNombre} 
                    onChange={handleRepChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Primer Apellido</label>
                  <input 
                    type="text" 
                    name="primerApellido" 
                    value={usuario.representante.primerApellido} 
                    onChange={handleRepChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Segundo Apellido</label>
                  <input 
                    type="text" 
                    name="segundoApellido" 
                    value={usuario.representante.segundoApellido} 
                    onChange={handleRepChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Fila 2: Datos del representante */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cédula de Identidad</label>
                  <input 
                    type="text" 
                    name="cedula" 
                    value={usuario.representante.cedula} 
                    onChange={handleRepChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input 
                    type="text" 
                    name="telefono" 
                    value={usuario.representante.telefono} 
                    onChange={handleRepChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono de Trabajo</label>
                  <input 
                    type="text" 
                    name="trabajo" 
                    value={usuario.representante.trabajo} 
                    onChange={handleRepChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Correo</label>
                  <input 
                    type="email" 
                    name="correo" 
                    value={usuario.representante.correo} 
                    onChange={handleRepChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Fila 3: Dirección del representante */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección de Trabajo</label>
                <input 
                  type="text" 
                  name="direccionTrabajo" 
                  value={usuario.representante.direccionTrabajo} 
                  onChange={handleRepChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </>
        )}

        {/* 🎓 Nivel de Formación */}
        <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Datos de Formación</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nivel a cursar</label>
              <select 
                name="nivel" 
                value={usuario.nivel} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccionar nivel</option>
                <option value="Elemental">Elemental</option>
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Perfeccionamiento">Perfeccionamiento</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Asignación de Profesor</label>
              <select 
                name="profesor" 
                value={usuario.profesor} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccionar profesor</option>
                {profesores.map((profesor) => (
                  <option 
                    key={profesor.teacher_cedula} 
                    value={`${profesor.teacher_first_name} ${profesor.teacher_first_lastname}`}
                  >
                    {profesor.teacher_first_name} {profesor.teacher_first_lastname}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sucursal</label>
              <select 
                name="sede" 
                value={usuario.sede} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccionar sucursal</option>
                {sucursales.map((sucursal) => (
                  <option key={sucursal.id_branch} value={sucursal.branch_name}>
                    {sucursal.branch_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 📤 Botones de acción - Centrados */}
        <div className="flex justify-center gap-4 mt-8">
          <button 
            type="button"
            onClick={() => onNavigate('detalle-usuario')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Atrás
          </button>
          <button 
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarUsuario;