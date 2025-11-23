import React, { useEffect, useState } from "react";

function DetalleUsuario({ cedula, onNavigate }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

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

  // 🧠 Obtener datos reales de la API
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
        
        console.log('Buscando usuario con cédula:', cedula);
        
        // Hacer la llamada a la API para obtener los datos del estudiante
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
        console.log('Respuesta de la API:', resultado);

        if (!response.ok || !resultado.success) {
          throw new Error(resultado.message || 'Error al obtener usuario');
        }

        if (resultado.data && resultado.data.length > 0) {
          const datosEstudiante = resultado.data[0];
          console.log('Datos completos del estudiante:', datosEstudiante);
          
          // Verificar si tiene representante
          const tieneRepresentante = datosEstudiante.guardian_first_name && 
                                   datosEstudiante.guardian_first_lastname;
          
          // Transformar los datos de la API al formato que espera tu componente
          const usuarioTransformado = {
            nombre: `${datosEstudiante.student_first_name || ''} ${datosEstudiante.student_second_name || ''} ${datosEstudiante.student_first_lastname || ''} ${datosEstudiante.student_second_lastname || ''}`.trim(),
            tipo: "Estudiante",
            cedula: datosEstudiante.student_cedula?.toString() || cedula,
            telefono: datosEstudiante.student_telephone || 'No disponible',
            correo: datosEstudiante.student_email || 'No disponible',
            direccion: datosEstudiante.student_home_address || 'No disponible',
            sexo: datosEstudiante.student_sex === 'M' ? 'Masculino' : datosEstudiante.student_sex === 'F' ? 'Femenino' : 'No especificado',
            estado: 'Activo', // Asumiendo que si está en la base de datos está activo
            fechaNacimiento: datosEstudiante.student_birthdate ? new Date(datosEstudiante.student_birthdate).toLocaleDateString('es-ES') : 'No disponible',
            nivel: obtenerNombreNivel(datosEstudiante.level_name),
            nivelOriginal: datosEstudiante.level_name,
            profesor: datosEstudiante.teacher_first_name && datosEstudiante.teacher_first_lastname 
              ? `${datosEstudiante.teacher_first_name} ${datosEstudiante.teacher_first_lastname}`
              : 'No asignado',
            sede: datosEstudiante.branch || 'No asignada',
            tieneRepresentante: tieneRepresentante,
            representante: tieneRepresentante ? {
              nombre: `${datosEstudiante.guardian_first_name} ${datosEstudiante.guardian_first_lastname}`,
              telefono: datosEstudiante.guardian_telephone || 'No disponible',
              emergencia: datosEstudiante.student_emergency_telephone || 'No disponible',
              correo: datosEstudiante.guardian_email || 'No disponible',
              direccion: datosEstudiante.guardian_work_address || 'No disponible',
              cedula: datosEstudiante.guardian_cedula?.toString() || 'No disponible'
            } : null
          };
          
          console.log('Usuario transformado:', usuarioTransformado);
          setUsuario(usuarioTransformado);
        } else {
          setError("No se encontró el usuario en la base de datos");
        }
      } catch (err) {
        console.error('Error al obtener usuario:', err);
        setError(err.message || 'Error al cargar los datos del usuario');
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuario();
  }, [cedula]);

  if (cargando) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <button
          onClick={() => onNavigate("consultar")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <span className="text-xl mr-1">←</span> Volver a Consulta
        </button>
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
        <button
          onClick={() => onNavigate("consultar")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <span className="text-xl mr-1">←</span> Volver a Consulta
        </button>
        <div className="text-center py-16">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <p className="text-gray-500 text-lg font-medium mb-2">Error</p>
          <p className="text-gray-400 text-sm">{error}</p>
          <p className="text-gray-400 text-sm mt-2">Cédula: {cedula}</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <button
          onClick={() => onNavigate("consultar")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <span className="text-xl mr-1">←</span> Volver a Consulta
        </button>
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <p className="text-gray-500 text-lg font-medium mb-2">No se encontró el usuario</p>
          <p className="text-gray-400 text-sm">No existe un usuario con la cédula: {cedula}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* 🔙 Botón de regreso */}
      <button
        onClick={() => onNavigate("consultar")}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
      >
        <span className="text-xl mr-1">←</span> Volver a Consulta
      </button>

      {/* 🧩 GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 🧑 Foto y perfil */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
            <span className="text-gray-500 text-sm text-center">Foto del<br />Estudiante</span>
          </div>
          <h2 className="text-gray-800 font-bold text-lg text-center">
            {usuario.nombre}
          </h2>
          <p className="text-blue-700 font-medium mt-1">{usuario.tipo}</p>

          <button
            onClick={() => onNavigate("editar-usuario")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full flex items-center gap-2 transition-colors font-medium"
          >
            Editar
          </button>
        </div>

        {/* 🎓 Nivel de Formación */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-indigo-950 font-bold text-lg mb-4">Nivel de Formación</h3>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-700 text-sm mb-1">Nivel</p>
              <div className="flex items-center gap-2">
                <p className="p-2 rounded text-gray-800 font-medium">{usuario.nivel}</p>
                {usuario.nivelOriginal && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {usuario.nivelOriginal}
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-sm mb-1">Profesor</p>
              <p className="p-2 rounded text-gray-800">{usuario.profesor}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-sm mb-1">Sucursal</p>
              <p className="p-2 rounded text-gray-800">{usuario.sede}</p>
            </div>
          </div>
        </div>

        {/* 📋 Datos del Estudiante — ocupa toda la columna derecha */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-200 lg:row-span-2">
          <h3 className="text-indigo-950 font-bold text-lg mb-4">Datos del Estudiante</h3>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-700 text-sm mb-1">Cédula de Identidad</p>
              <p className="p-2 rounded text-gray-800">{usuario.cedula}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-sm mb-1">Sexo</p>
              <p className="p-2 rounded text-gray-800">{usuario.sexo}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-sm mb-1">Fecha de Nacimiento</p>
              <p className="p-2 rounded text-gray-800">{usuario.fechaNacimiento}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-sm mb-1">Número de Teléfono</p>
              <p className="p-2 rounded text-gray-800">{usuario.telefono}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-sm mb-1">Número de Emergencia</p>
              <p className="p-2 rounded text-gray-800">
                {usuario.tieneRepresentante ? usuario.representante.emergencia : 'No disponible'}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-sm mb-1">Correo Electrónico</p>
              <p className="p-2 rounded text-gray-800">{usuario.correo}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-sm mb-1">Dirección</p>
              <p className="p-2 rounded text-gray-800">{usuario.direccion}</p>
            </div>
          </div>
        </div>

        {/* 👩‍👦 Datos del Representante — debajo de los dos primeros cuadros */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="text-indigo-950 font-bold text-lg mb-4">
            Datos del Representante
            {!usuario.tieneRepresentante && (
              <span className="text-sm text-gray-500 font-normal ml-2">
                (No requiere representante)
              </span>
            )}
          </h3>
          
          {usuario.tieneRepresentante ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Columna 1 */}
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-700 text-sm mb-1">Nombre y Apellido</p>
                  <p className="p-2 rounded text-gray-800">{usuario.representante.nombre}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 text-sm mb-1">Cédula de Identidad</p>
                  <p className="p-2 rounded text-gray-800">{usuario.representante.cedula}</p>
                </div>
              </div>
              
              {/* Columna 2 */}
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-700 text-sm mb-1">Teléfono</p>
                  <p className="p-2 rounded text-gray-800">{usuario.representante.telefono}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 text-sm mb-1">Tlf. de Emergencia</p>
                  <p className="p-2 rounded text-gray-800">{usuario.representante.emergencia}</p>
                </div>
              </div>
              
              {/* Columna 3 */}
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-700 text-sm mb-1">Correo Electrónico</p>
                  <p className="p-2 rounded text-gray-800">{usuario.representante.correo}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 text-sm mb-1">Dirección de Trabajo</p>
                  <p className="p-2 rounded text-gray-800">{usuario.representante.direccion}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-gray-400 text-4xl mb-3">👤</div>
              <p className="text-gray-500 font-medium">Este estudiante no tiene representante asignado</p>
              <p className="text-gray-400 text-sm mt-1">No se requiere representante para este caso</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalleUsuario;