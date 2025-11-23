import React, { useEffect, useState } from 'react';

function EditarUsuario({ cedula, onNavigate }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const datosSimulados = {
      '12345678': {
        tipo: 'estudiante',
        primerNombre: 'Miguel',
        segundoNombre: 'Alejandro',
        apellido: 'Guerra',
        segundoApellido: 'Lopiz',
        cedula: '00.000.000',
        fechaNacimiento: '00/00/00',
        correo: 'miguel@gmail.com',
        telefono: '0412-000-0000',
        emergencia: '0412-000-0000',
        direccion: 'San Antonio',
        sexo: 'Masculino',
        representante: {
          primerNombre: 'Valentina',
          segundoNombre: 'Alejandra',
          apellido: 'Guerra',
          segundoApellido: 'Vegas',
          cedula: '00.000.000',
          telefono: '0412-000-0000',
          trabajo: '0412-000-0000',
          correo: 'vale@gmail.com',
          direccionTrabajo: 'Av. San Francisco',
        },
        nivel: 'Nivel Básico',
        profesor: 'Williams De Freitas',
        sede: 'Los Teques',
      },
    };

    setUsuario(datosSimulados[cedula]);
  }, [cedula]);

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento || fechaNacimiento === '00/00/00') return '12 años';
    return '12 años';
  };

  const edad = usuario?.fechaNacimiento ? calcularEdad(usuario.fechaNacimiento) : '12 años';

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

  if (!usuario) return <p className="p-6 text-gray-500">No se encontró el usuario.</p>;

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

      {/* 📋 Datos del Estudiante */}
       <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Datos del Empleado</h3>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Apellido</label>
            <input 
              type="text" 
              name="apellido" 
              value={usuario.apellido} 
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
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Nacimiento</label>
            <input 
              type="text" 
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
              value={usuario.representante.cedula} 
              onChange={handleRepChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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

      
      {/* 👨‍👩‍👧 Datos del Representante */}
      <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Datos del Representante</h3>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            
        {/* Fila 1: Nombres del representante */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Apellido</label>
            <input 
              type="text" 
              name="apellido" 
              value={usuario.representante.apellido} 
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

      {/* 🎓 Nivel de Formación */}
      <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Datos de Formacion</h3>
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
              <option value="Nivel Básico">Nivel Básico</option>
              <option value="Nivel Intermedio">Nivel Intermedio</option>
              <option value="Nivel Avanzado">Nivel Avanzado</option>
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
              <option value="Williams De Freitas">Williams De Freitas</option>
              <option value="Luis Torres">Luis Torres</option>
              <option value="María González">María González</option>
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
              <option value="Los Teques">Los Teques</option>
              <option value="Caracas">Caracas</option>
              <option value="San Antonio">San Antonio</option>
            </select>
          </div>
        </div>
      </div>

      {/* 📤 Botones de acción - Centrados */}
      <div className="flex justify-center gap-4 mt-8">
        <button 
          onClick={() => onNavigate('detalle-usuario')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-medium transition-colors"
        >
          Atrás
        </button>
        <button 
          onClick={() => console.log('Datos actualizados:', usuario)}
          className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-3 rounded-full font-medium transition-colors"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}

export default EditarUsuario;