import React, { useState } from 'react';

function FormularioNuevoEstudiante({ onContinuar }) {
  const [edad, setEdad] = useState('');
  const [cedula, setCedula] = useState('');
  const esMenor = parseInt(edad) <= 18;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cedula.trim() === '') return alert('Por favor ingresa la cédula');
    onContinuar('registro-usuario', cedula);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <form className="max-w-5xl mx-auto" onSubmit={handleSubmit}>
        {/* Encabezado Principal del Formulario */}
        <div className="bg-white text-gray-500 py-4 px-6 rounded-t-lg mb-6"> {/* Añadido mb-6 para separar del siguiente bloque */}
          <h2 className="text-2xl font-bold">Nuevo Estudiante</h2>
        </div>

        {/* Contenedor General de Secciones */}
        <div className="bg-white rounded-lg p-0"> {/* Quitamos p-6 y redondeo de abajo, lo haremos por sección */}

          {/* Sección: Datos del Estudiante */}
          <div className="border border-gray-300 rounded-lg shadow-sm"> {/* Contenedor para esta sección */}
            {/* Encabezado de la Sección */}
            <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Datos del Estudiante</h3>
            </div>
            
            {/* Contenido de la Sección (Campos) */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"> {/* Padding aplicado aquí */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="primerNombre" 
                  placeholder="Primer Nombre" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="segundoNombre" 
                  placeholder="Segundo Nombre" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="apellido" 
                  placeholder="Apellido" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="segundoApellido" 
                  placeholder="Segundo Apellido" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula de Identidad</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="cedula"
                  placeholder="Cédula de Identidad"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="fechaNacimiento" 
                  type="date" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="edad"
                  placeholder="Edad"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="sexo"
                >
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="correo" 
                  placeholder="Correo Electrónico" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Celular</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="telefono" 
                  placeholder="Teléfono Celular" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de Emergencia</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="telefonoEmergencia" 
                  placeholder="Teléfono de Emergencia" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula del Representante</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="cedulaRepresentante" 
                  placeholder="Cédula del Representante" 
                />
              </div>
              
              <div className="col-span-1 md:col-span-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                name="direccion" 
                placeholder="Dirección" 
              />
              </div>
            </div>
          </div> {/* Fin de la Sección: Datos del Estudiante */}

          {/* Sección: Datos del Representante (solo si es menor) */}
          {esMenor && (
            <div className="mt-8 border border-gray-300 rounded-lg shadow-sm"> {/* Añadido mt-8 para separar */}
              {/* Encabezado de la Sección */}
              <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Datos del Representante</h3>
              </div>
              
              {/* Contenido de la Sección */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-5"> {/* Padding aplicado aquí */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                    name="repPrimerNombre" 
                    placeholder="Primer Nombre" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                    name="repSegundoNombre" 
                    placeholder="Segundo Nombre" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                    name="repApellido" 
                    placeholder="Apellido" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                    name="repSegundoApellido" 
                    placeholder="Segundo Apellido" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cédula de Identidad</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                    name="repCedula" 
                    placeholder="Cédula de Identidad" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                    name="repEdad" 
                    placeholder="Edad" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-900"
                    name="repCorreo" 
                    placeholder="Correo Electrónico" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Celular</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                    name="repTelefono" 
                    placeholder="Teléfono Celular" 
                  />
                </div>
                <div className="col-span-1 md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Trabajo</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                    name="repDireccionTrabajo" 
                    placeholder="Dirección de Trabajo" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sección: Programar */}
          <div className="mt-8 border border-gray-300 rounded-lg shadow-sm"> {/* Añadido mt-8 para separar */}
            <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Programar</h3>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5"> {/* Padding aplicado aquí */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel a cursar</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="nivel"
                >
                  <option value="">Nivel a cursar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asignación de Profesor</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="profesor"
                >
                  <option value="">Profesor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="sucursal"
                >
                  <option value="">Sucursal</option>
                </select>
              </div>
            </div>
          </div> {/* Fin de la Sección: Programar */}

          {/* Botones de acción */}
          <div className="flex justify-center space-x-4 pt-4">
            <button 
              type="button" 
              className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Cargar
            </button>
          </div>
        </div> {/* Fin Contenedor General de Secciones */}
      </form>
    </div>
  );
}

export default FormularioNuevoEstudiante;