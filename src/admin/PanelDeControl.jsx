import React, { useState } from 'react';

function PanelDeControl({ onNavigate }) {
  const [submenuActivo, setSubmenuActivo] = useState(null); // ✅ ESTA LÍNEA ES CLAVE

  const toggleSubmenu = (nombre) => {
    setSubmenuActivo(submenuActivo === nombre ? null : nombre);
  };

  const seleccionarOpcion = (vista) => {
    onNavigate(vista);
    setSubmenuActivo(null);
  };

  return (
    <aside className="panel-control">
      <div>
        <img src="/img/institutolearning.png" alt="Logo Wenglish" />
      </div>
      <h3>Panel De Control</h3>

      <button onClick={() => toggleSubmenu('usuario')}>Nuevo Usuario</button>
      {submenuActivo === 'usuario' && (
        <ul>
          <li><button onClick={() => seleccionarOpcion('estudiante')}>Estudiante</button></li>
          <li><button onClick={() => seleccionarOpcion('profesor')}>Profesor</button></li>
          <li><button onClick={() => seleccionarOpcion('empleado')}>Empleado</button></li>
        </ul>
      )}

      <button onClick={() => toggleSubmenu('cargar')}>Cargar</button>
      {submenuActivo === 'cargar' && (
        <ul>
          <li><button onClick={() => seleccionarOpcion('cargar-nota')}>Notas</button></li>
          <li><button onClick={() => seleccionarOpcion('cargar-material')}>Material</button></li>
        </ul>
      )}

      <button onClick={() => seleccionarOpcion('consultar')}>Consultar</button>
      <button onClick={() => toggleSubmenu('crear')}>Crear</button>
      {submenuActivo === 'crear' && (
       <ul>
         <li><button onClick={() => seleccionarOpcion('nuevo-nivel')}>Nuevo Nivel</button></li>
         <li><button onClick={() => seleccionarOpcion('nuevo-curso')}>Nuevo Curso</button></li>
         <li><button onClick={() => seleccionarOpcion('nueva-sucursal')}>Nueva Sucursal</button></li>
         <li><button onClick={() => seleccionarOpcion('nueva-evaluacion')}>Nueva Evaluación</button></li>
         <li><button onClick={() => seleccionarOpcion('nuevo-pago')}>Nuevo Pago</button></li>
       </ul>
      )}

      <button onClick={() => toggleSubmenu('gestion')}>Gestionar</button>
     {submenuActivo === 'gestion' && (
        <ul>
         <li><button onClick={() => seleccionarOpcion('gestionar-usuarios')}>Usuarios</button></li>
         <li><button onClick={() => seleccionarOpcion('gestionar-cuotas')}>Cuotas</button></li>
        </ul>
      )}


      <button style={{ marginTop: 'auto' }}>Cerrar Sesión</button>
      <p>2025 Nnes Learning Center C.A</p>
    </aside>
  );
}

export default PanelDeControl;


