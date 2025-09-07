import React, { useState } from 'react';

function FormularioNuevoEstudiante({ onContinuar }) {
  const [edad, setEdad] = useState('');
  const [cedula, setCedula] = useState('');
  const esMenor = parseInt(edad) <= 18;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cedula.trim() === '') return alert('Por favor ingresa la cédula');
    onContinuar('registro-usuario', cedula); // ← cambia la vista interna
  };

  return (
    <form className="formulario-estudiante" onSubmit={handleSubmit}>
      <h2>Nuevo Estudiante</h2>

      <section className="datos-estudiante">
        <h3>Datos del Estudiante</h3>
        <input name="primerNombre" placeholder="Primer Nombre" />
        <input name="segundoNombre" placeholder="Segundo Nombre" />
        <input name="apellido" placeholder="Apellido" />
        <input name="segundoApellido" placeholder="Segundo Apellido" />
        <input
          name="cedula"
          placeholder="Cédula de Identidad"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
        />
        <label>Fecha de Nacimiento</label>
        <input name="fechaNacimiento" type="date" />
        <input
          name="edad"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
        />
        <select name="sexo">
          <option value="">Sexo</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
        </select>
        <input name="correo" placeholder="Correo Electrónico" />
        <input name="telefono" placeholder="Teléfono Celular" />
        <input name="telefonoEmergencia" placeholder="Teléfono de Emergencia" />
        <input name="cedulaRepresentante" placeholder="Cédula del Representante" />
        <input name="direccion" placeholder="Dirección" />
      </section>

      {esMenor && (
        <section className="datos-representante">
          <h3>Datos del Representante</h3>
          <input name="repPrimerNombre" placeholder="Primer Nombre" />
          <input name="repSegundoNombre" placeholder="Segundo Nombre" />
          <input name="repApellido" placeholder="Apellido" />
          <input name="repSegundoApellido" placeholder="Segundo Apellido" />
          <input name="repCedula" placeholder="Cédula de Identidad" />
          <input name="repEdad" placeholder="Edad" />
          <input name="repCorreo" placeholder="Correo Electrónico" />
          <input name="repTelefono" placeholder="Teléfono Celular" />
          <input name="repDireccionTrabajo" placeholder="Dirección de Trabajo" />
        </section>
      )}

      <section className="programar">
        <h3>Programar</h3>
        <select name="nivel">
          <option value="">Nivel a cursar</option>
        </select>
        <select name="profesor">
          <option value="">Asignar Profesor</option>
        </select>
        <select name="sucursal">
          <option value="">Sucursal</option>
        </select>
      </section>

      <div className="acciones-formulario">
        <button type="button">Cancelar</button>
        <button type="submit">Cargar</button>
      </div>
    </form>
  );
}

export default FormularioNuevoEstudiante;

