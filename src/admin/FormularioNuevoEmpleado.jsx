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
    <form className="formulario-empleado" onSubmit={handleSubmit}>
      <h2>Datos del Empleado</h2>

      <section className="datos-empleado">
        <input
          name="cedula"
          placeholder="Cédula de Identidad"
          value={datos.cedula}
          onChange={handleChange}
        />
        <input
          name="primerNombre"
          placeholder="Primer Nombre"
          value={datos.primerNombre}
          onChange={handleChange}
        />
        <input
          name="segundoNombre"
          placeholder="Segundo Nombre"
          value={datos.segundoNombre}
          onChange={handleChange}
        />
        <input
          name="apellido"
          placeholder="Apellido"
          value={datos.apellido}
          onChange={handleChange}
        />
        <input
          name="segundoApellido"
          placeholder="Segundo Apellido"
          value={datos.segundoApellido}
          onChange={handleChange}
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          value={datos.telefono}
          onChange={handleChange}
        />
        <input
          name="telefonoCasa"
          placeholder="Teléfono de Casa"
          value={datos.telefonoCasa}
          onChange={handleChange}
        />
        <input
          name="telefonoEmergencia"
          placeholder="Teléfono de Emergencia"
          value={datos.telefonoEmergencia}
          onChange={handleChange}
        />
        <input
          name="correo"
          placeholder="Correo Electrónico"
          value={datos.correo}
          onChange={handleChange}
        />
        <input
          name="direccion"
          placeholder="Dirección"
          value={datos.direccion}
          onChange={handleChange}
        />
      </section>

      <div className="acciones-formulario">
        <button type="button" onClick={handleCancelar}>Cancelar</button>
        <button type="submit">Cargar</button>
      </div>
    </form>
  );
}

FormularioNuevoEmpleado.propTypes = {
  onContinuar: PropTypes.func.isRequired,
};

export default FormularioNuevoEmpleado;
