import React, { useEffect, useState } from "react";

function DetalleUsuario({ cedula, onNavigate }) {
  const [usuario, setUsuario] = useState(null);

  // 🧠 Datos simulados
  useEffect(() => {
    const datosSimulados = {
      "12345678": {
        nombre: "Miguel Alejandro Guerra López",
        tipo: "Estudiante",
        cedula: "00.000.000",
        telefono: "0412-000-0000",
        correo: "hola@gmail.com",
        direccion: "San Antonio",
        sexo: "Masculino",
        estado: "Activo",
        fechaNacimiento: "00/00/0000",
        nivel: "Básico",
        profesor: "Williams De Freita",
        sede: "Los Teques",
        representante: {
          nombre: "Valentina Guerra",
          telefono: "0412-000-0000",
          emergencia: "0412-000-0000",
          correo: "vale@gmail.com",
          direccion: "Av. San Francisco",
          cedula: "00.000.000"
        },
      },
    };
    setUsuario(datosSimulados[cedula]);
  }, [cedula]);

  if (!usuario) return <p className="p-6 text-gray-500">No se encontró el usuario.</p>;

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
              <p className="p-2 rounded text-gray-800">{usuario.nivel}</p>
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
              <p className="p-2 rounded text-gray-800">0412-000-0000</p>
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
          <h3 className="text-indigo-950 font-bold text-lg mb-4">Datos del Representante</h3>
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
        </div>
      </div>
    </div>
  );
}

export default DetalleUsuario;