import React, { useState } from 'react';
import PropTypes from 'prop-types';

function FormularioNuevoEmpleado({ onContinuar }) {
  const [datos, setDatos] = useState({
    cedula: '',
    primerNombre: '',
    segundoNombre: '',
    apellido: '',
    segundoApellido: '',
    telefono: '',
    telefonoCasa: '',
    telefonoEmergencia: '',
    correo: '',
    direccion: '',
  });

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleCancelar = () => {
    setDatos({
      cedula: '',
      primerNombre: '',
      segundoNombre: '',
      apellido: '',
      segundoApellido: '',
      telefono: '',
      telefonoCasa: '',
      telefonoEmergencia: '',
      correo: '',
      direccion: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (datos.cedula.trim() === '') return alert('Por favor ingresa la cédula');
    onContinuar('registro-usuario', datos.cedula);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <form className="max-w-5xl mx-auto" onSubmit={handleSubmit}>
        {/* Encabezado */}
        <div className="bg-white text-gray-500 py-4 px-6 rounded-t-lg ">
          <h2 className="text-2xl font-bold">Nuevo Empleado</h2>
        </div>

        {/* Contenedor principal con borde y sombra */}
        <div className="bg-white rounded-b-lg p-6">
          {/* Sección de Datos del Empleado */}

          <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Datos del Empleado</h3>
          </div>

          <div className="mb-8 border border-gray-300 rounded-lg p-5 shadow-sm">     
            
            {/* Primera línea: Nombre, Segundo Nombre, Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="primerNombre"
                  placeholder="Primer nombre"
                  value={datos.primerNombre}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="segundoNombre"
                  placeholder="Segundo nombre"
                  value={datos.segundoNombre}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="apellido"
                  placeholder="Primer apellido"
                  value={datos.apellido}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Segunda línea: Segundo Apellido, Cédula, Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="segundoApellido"
                  placeholder="Segundo apellido"
                  value={datos.segundoApellido}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula de Identidad</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="cedula"
                  placeholder="Cédula de identidad"
                  value={datos.cedula}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="telefono"
                  placeholder="Teléfono"
                  value={datos.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Tercera línea: Teléfono Casa, Teléfono Emergencia, Correo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de Casa</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="telefonoCasa"
                  placeholder="Teléfono de casa"
                  value={datos.telefonoCasa}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de Emergencia</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="telefonoEmergencia"
                  placeholder="Teléfono de emergencia"
                  value={datos.telefonoEmergencia}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  name="correo"
                  placeholder="Correo electrónico"
                  value={datos.correo}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Cuarta línea: Dirección completa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Completa</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                name="direccion"
                placeholder="Dirección completa"
                value={datos.direccion}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-center space-x-4 pt-4">
            <button 
              type="button" 
              onClick={handleCancelar}
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
        </div>
      </form>
    </div>
  );
}

FormularioNuevoEmpleado.propTypes = {
  onContinuar: PropTypes.func.isRequired,
};

export default FormularioNuevoEmpleado;