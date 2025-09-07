import React, { useState } from 'react';
import FormularioNuevoEstudiante from './FormularioNuevoEstudiante';
import FormularioNuevoProfesor from './FormularioNuevoProfesor';


function VistaUsuarios() {
  const [activo, setActivo] = useState(null);

  return (
    <div className="vista-usuarios">
      <h2>Registrar Usuario</h2>

      {/* Submenú desplegable */}
      <ul className="submenu-usuarios">
        <li><button onClick={() => setActivo('estudiante')}>Estudiante</button></li>
        <li><button onClick={() => setActivo('profesor')}>Profesor</button></li>
        <li><button onClick={() => setActivo('empleado')}>Empleado</button></li>
      </ul>

      {/* Renderizado condicional del formulario */}
      <div className="formulario-usuario">
        {activo === 'estudiante' && <FormularioNuevoEstudiante />}
        {activo === 'profesor' && <FormularioNuevoProfesor />}
        {activo === 'empleado' && <FormularioNuevoEmpleado />}
      </div>
    </div>
  );
}

export default VistaUsuarios;


