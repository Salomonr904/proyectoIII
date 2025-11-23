import React from 'react';

function DatosEstudiante({ estudiante }) {
  return (
    <div className="datos-estudiante">
      <h3>Datos del Estudiante</h3>
      <p>Nombre:</p>
      <p>Cédula:</p>
      <p>Sexo:</p>
      <p>Curso:</p>
      <p>Categoría:</p>
      <p>Profesor:</p>
    </div>
  );
}

export default DatosEstudiante;
