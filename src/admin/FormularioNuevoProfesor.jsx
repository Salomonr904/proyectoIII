// src/componentes/FormularioNuevoProfesor.jsx
import React from 'react';

function FormularioNuevoProfesor() {
  return (
    <div>
      <h3>Datos del Profesor</h3>
      <input type="text" placeholder="Nombre del Profesor" />
      <input type="text" placeholder="Especialidad" />
      <input type="text" placeholder="Teléfono" />
      <input type="text" placeholder="Correo Electrónico" />
      <button>v/</button>
      <button>X</button>
    </div>
  );
}


export default FormularioNuevoProfesor;
