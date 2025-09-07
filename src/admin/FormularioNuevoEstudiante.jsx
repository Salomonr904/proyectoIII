import React from 'react';

function FormularioNuevoEstudiante() {
  return (
    <div className="container">
    
      
      <section className="representante">
        <h3>Datos del Representante</h3>
        <input name="nombreRep" placeholder="Nombre y Apellido" />
        <input name="cedulaRep" placeholder="Cédula de Identidad" />
        <input name="telefonoRep" placeholder="Teléfono" />
      </section>

      <section className="estudiante">
        <h3>Datos del Estudiante</h3>
        <input name="nombreEst" placeholder="Nombre y Apellido" />
        <input name="cedulaEst" placeholder="Cédula de Identidad" />
        <input name="nacimiento" type="date" placeholder="Fecha de Nacimiento" />
        <input name="edad" placeholder="Edad" />
        <input name="telefonoEst" placeholder="Teléfono" />
        <input name="correo" placeholder="Correo Electrónico" />
        <input name="direccion" placeholder="Dirección" />
        <input name="usuario" placeholder="Usuario" />
        <input name="contrasena" type="password" placeholder="Contraseña" />
        <input name="nivel" placeholder="Nivel de Curso" />
        <input name="categoria" placeholder="Categoría" />
      </section>

      <button type="submit">Registrar</button>
    </div>
  );
}

export default FormularioNuevoEstudiante;